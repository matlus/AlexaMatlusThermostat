import mqttClient = require('mqtt');
import CurrentSettings from "./currentSettings";
import Zone from "./zone";
import Normalizer from './normalizers';

export class ThermostatGateway {
    private readonly _topicRoot = "mythermostat/";
    private readonly _thermostatCommandTopic = this._topicRoot + "cmd";
    private readonly _thermostatInfoTopic = this._topicRoot + "inf";

    private readonly _normalizer: Normalizer;
    private readonly _mqttConnectionOptions: MqttConnectionOptions;

    public constructor() {
        this._normalizer = new Normalizer();
        this._mqttConnectionOptions = new MqttConnectionOptions(1883, "iot.eclipse.org");
    }

    public async setThermostat(zoneInput: string, modeInput: string, temperatureInput: string): Promise<string> {
        const zone = this._normalizer.normalizeZone(zoneInput);
        const mode = this._normalizer.normalizeMode(modeInput);
        const temperature = this._normalizer.normalizeNumber(temperatureInput);

        const speechOutput = `I've set the Thermostat to, ${zone}, ${mode}, and, ${temperature}`;

        const message = `cmd=set&Z=${zone}&M=${mode}&T=${temperature}`;
        await this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
        return speechOutput;
    }

    public async setThermostatMode(modeInput: string): Promise<string> {
        const mode = this._normalizer.normalizeMode(modeInput);

        const speechOutput = `I've set the Thermostat Mode to ${mode}`;

        const message = `cmd=set&Z=*&M=${mode}&T=*`;
        await this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
        return speechOutput;
    }

    public async setThermostatZone(zoneInput: string): Promise<string> {
        const zone = this._normalizer.normalizeZone(zoneInput);

        const speechOutput = `I've set the Thermostat Zone to ${zone}`;
        const message = `cmd=set&Z=${zone}&M=*&T=*`;
        await this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
        return speechOutput;
    }

    public async setThermostatTemperature(temperatureInput: string): Promise<string> {
        const temperature = this._normalizer.normalizeNumber(temperatureInput);
        const speechOutput = `I've set the Thermostat Temperature to ${temperature}`;
        const message = `cmd=set&Z=*&M=*&T=${temperature}`;
        await this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
        return speechOutput;
    }

    public async increaseThermostatTemperature(amountInput: string): Promise<string> {
        const amount = this._normalizer.normalizeNumber(amountInput);
        let speechOutput: string;

        if (amount === "0") {
            speechOutput = "I'm sorry, I did not get that";
            return speechOutput;
        }
        else {
            speechOutput = `I've Increased the Temperature by ${amount} degrees`;
        }

        const message = `cmd=set&Z=*&M=*&T=+${amount}`;
        await this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
        return speechOutput;
    }

    public async decreaseThermostatTemperature(amountInput: string): Promise<string> {
        const amount = this._normalizer.normalizeNumber(amountInput);

        let speechOutput: string;

        if (amount === "0") {
            speechOutput = "I'm sorry, I did not get that";
            return speechOutput;
        }
        else {
            speechOutput = `I've Decreased the Temperature by ${amount} degrees`;
        }

        const message = `cmd=set&Z=*&M=*&T=-${amount}`;
        await this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
        return speechOutput;
    }

    public async turnApplianceOnOrOff(applianceInput: string, onOffInput: string, temperatureInput: string, zoneInput: string): Promise<string> {
        console.log("Appliance Input: " + applianceInput);
        let onOff: string = this._normalizer.normalizeOnOff(onOffInput);
        let appliance: string = this._normalizer.normalizeAppliance(applianceInput);
        let temperature: string = this._normalizer.normalizeNumber(temperatureInput);
        let zone: string = (zoneInput) ? this._normalizer.normalizeZone(zoneInput) : "";

        let mode: string = this._normalizer.getModeFromAppliance(appliance);

        let speechOutput: string;
        let message: string;

        if (onOff == "Off") {
            mode = "Off";
            zone = "*";
            temperature = "*";
            speechOutput = `I've set the Mode to ${onOff}`;
        }
        else {
            if (temperature === "0" && (!zone || zone.length == 0)) {
                zone = "*";
                temperature = "*";
                speechOutput = `I've turned on the ${appliance}`;
            }
            else {
                speechOutput = `I've turned on the ${appliance} at ${temperature} in the ${zone}`;
            }
        }

        message = `cmd=set&Z=${zone}&M=${mode}&T=${temperature}`;

        await this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
        return speechOutput;
    }

    public async getThermostatStatus(): Promise<string> {
        let message = await this.receiveInformationEventMessage(this._mqttConnectionOptions, this._thermostatInfoTopic)
        let { currentSettings, zones } = this.parseInformationEventMessage(message);

        let speechOutput = currentSettings.toString() + ' ';

        for (let i = 0; i < zones.length; i++) {
            speechOutput += zones[i].toString() + ', ';
        }

        return speechOutput;
    }

    public async getThermostatSettings(): Promise<string> {
        let message = await this.receiveInformationEventMessage(this._mqttConnectionOptions, this._thermostatInfoTopic);
        let { currentSettings, zones } = this.parseInformationEventMessage(message);
        return currentSettings.toString();
    }

    public async getTemperatureInZone(zoneInput: string): Promise<string> {
        let zone = this._normalizer.normalizeZone(zoneInput);

        let message = await this.receiveInformationEventMessage(this._mqttConnectionOptions, this._thermostatInfoTopic);
        let { currentSettings, zones } = this.parseInformationEventMessage(message);

        for (let i = 0; i < zones.length; i++) {
            if (zones[i].name === zone) {
                return zones[i].toString();
            }
        }

        return `I'm sorry, I don't recognize the zone, ${zone}`;
    }

    private publishCommandToMqttBroker(mqttConnectionOptions: MqttConnectionOptions, commandTopic: string, message: string): Promise<number> {
        let client = mqttClient.connect(mqttConnectionOptions);

        return new Promise(function (resolve, reject) {
            console.time("mqtt connect time");
            client.on('connect', () => {
                try {
                    console.timeEnd("mqtt connect time");
                    console.time("mqtt publish time");
                    client.publish(commandTopic, message, { qos: 0 }, () => {
                        console.timeEnd("mqtt publish time");
                        client.end();                        
                        resolve(0);
                    });
                } catch (e) {
                    client.end();
                    console.log(e);
                    reject(e);
                }
            });
        });
    }

    private receiveInformationEventMessage(mqttConnectionOptions: MqttConnectionOptions, topic: string): Promise<string> {
        let client = mqttClient.connect(mqttConnectionOptions);
        return new Promise(function (resolve, reject) {
            console.time("mqtt connect time");
            client.on('connect', () => {
                client.subscribe(topic);
                console.timeEnd("mqtt connect time");
                console.time("mqtt message receive time");
                client.on('message', (topic: string, msg: Uint8Array) => {
                    console.timeEnd("mqtt message receive time");
                    try {
                        client.end();
                        console.log(topic);
                        let message = msg.toString();
                        resolve(message);
                    } catch (e) {
                        client.end();
                        console.log(e);
                        reject(e);
                    }
                });
            });
        });
    }

    private parseInformationEventMessage(message: string): { currentSettings: CurrentSettings, zones: Array<Zone> } {
        let lines = message.split('|');
        // The first line represents the "Current Settings"
        let currentSettings = new CurrentSettings(lines[0]);

        let informationLines = lines.splice(1, lines.length - 1);
        let zones = new Array<Zone>();
        let index = 0;
        informationLines.forEach(function (x) {
            zones[index] = new Zone(x);
            index++;
        });

        return { currentSettings: currentSettings, zones: zones };
    }
}

export class MqttConnectionOptions {
    private _port: number;
    private _host: string;

    constructor(port: number, host: string) {
        this._port = port;
        this._host = host;
    }

    public get port(): number {
        return this._port;
    }

    public set port(value: number) {
        this._port = value;
    }

    public get host(): string {
        return this._host;
    }

    public set host(value: string) {
        this._host = value;
    }
}

module.exports = {
    ThermostatGateway: ThermostatGateway,
    MqttConnectionOptions: MqttConnectionOptions
}