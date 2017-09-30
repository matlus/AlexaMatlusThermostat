"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqttClient = require("mqtt");
const currentSettings_1 = require("./currentSettings");
const zone_1 = require("./zone");
const normalizers_1 = require("./normalizers");
class ThermostatGateway {
    constructor() {
        this._topicRoot = "mythermostat/";
        this._thermostatCommandTopic = this._topicRoot + "cmd";
        this._thermostatInfoTopic = this._topicRoot + "inf";
        this._normalizer = new normalizers_1.default();
        this._mqttConnectionOptions = new MqttConnectionOptions(1883, "iot.eclipse.org");
    }
    setThermostat(zoneInput, modeInput, temperatureInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const zone = this._normalizer.normalizeZone(zoneInput);
            const mode = this._normalizer.normalizeMode(modeInput);
            const temperature = this._normalizer.normalizeNumber(temperatureInput);
            const speechOutput = `I've set the Thermostat to, ${zone}, ${mode}, and, ${temperature}`;
            const message = `cmd=set&Z=${zone}&M=${mode}&T=${temperature}`;
            yield this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
            return speechOutput;
        });
    }
    setThermostatMode(modeInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const mode = this._normalizer.normalizeMode(modeInput);
            const speechOutput = `I've set the Thermostat Mode to ${mode}`;
            const message = `cmd=set&Z=*&M=${mode}&T=*`;
            yield this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
            return speechOutput;
        });
    }
    setThermostatZone(zoneInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const zone = this._normalizer.normalizeZone(zoneInput);
            const speechOutput = `I've set the Thermostat Zone to ${zone}`;
            const message = `cmd=set&Z=${zone}&M=*&T=*`;
            yield this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
            return speechOutput;
        });
    }
    setThermostatTemperature(temperatureInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const temperature = this._normalizer.normalizeNumber(temperatureInput);
            const speechOutput = `I've set the Thermostat Temperature to ${temperature}`;
            const message = `cmd=set&Z=*&M=*&T=${temperature}`;
            yield this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
            return speechOutput;
        });
    }
    increaseThermostatTemperature(amountInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const amount = this._normalizer.normalizeNumber(amountInput);
            let speechOutput;
            if (amount === "0") {
                speechOutput = "I'm sorry, I did not get that";
                return speechOutput;
            }
            else {
                speechOutput = `I've Increased the Temperature by ${amount} degrees`;
            }
            const message = `cmd=set&Z=*&M=*&T=+${amount}`;
            yield this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
            return speechOutput;
        });
    }
    decreaseThermostatTemperature(amountInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const amount = this._normalizer.normalizeNumber(amountInput);
            let speechOutput;
            if (amount === "0") {
                speechOutput = "I'm sorry, I did not get that";
                return speechOutput;
            }
            else {
                speechOutput = `I've Decreased the Temperature by ${amount} degrees`;
            }
            const message = `cmd=set&Z=*&M=*&T=-${amount}`;
            yield this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
            return speechOutput;
        });
    }
    turnApplianceOnOrOff(applianceInput, onOffInput, temperatureInput, zoneInput) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Appliance Input: " + applianceInput);
            let onOff = this._normalizer.normalizeOnOff(onOffInput);
            let appliance = this._normalizer.normalizeAppliance(applianceInput);
            let temperature = this._normalizer.normalizeNumber(temperatureInput);
            let zone = (zoneInput) ? this._normalizer.normalizeZone(zoneInput) : "";
            let mode = this._normalizer.getModeFromAppliance(appliance);
            let speechOutput;
            let message;
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
            yield this.publishCommandToMqttBroker(this._mqttConnectionOptions, this._thermostatCommandTopic, message);
            return speechOutput;
        });
    }
    getThermostatStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            let message = yield this.receiveInformationEventMessage(this._mqttConnectionOptions, this._thermostatInfoTopic);
            let { currentSettings, zones } = this.parseInformationEventMessage(message);
            let speechOutput = currentSettings.toString() + ' ';
            for (let i = 0; i < zones.length; i++) {
                speechOutput += zones[i].toString() + ', ';
            }
            return speechOutput;
        });
    }
    getThermostatSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let message = yield this.receiveInformationEventMessage(this._mqttConnectionOptions, this._thermostatInfoTopic);
            let { currentSettings, zones } = this.parseInformationEventMessage(message);
            return currentSettings.toString();
        });
    }
    getTemperatureInZone(zoneInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let zone = this._normalizer.normalizeZone(zoneInput);
            let message = yield this.receiveInformationEventMessage(this._mqttConnectionOptions, this._thermostatInfoTopic);
            let { currentSettings, zones } = this.parseInformationEventMessage(message);
            for (let i = 0; i < zones.length; i++) {
                if (zones[i].name === zone) {
                    return zones[i].toString();
                }
            }
            return `I'm sorry, I don't recognize the zone, ${zone}`;
        });
    }
    publishCommandToMqttBroker(mqttConnectionOptions, commandTopic, message) {
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
                }
                catch (e) {
                    client.end();
                    console.log(e);
                    reject(e);
                }
            });
        });
    }
    receiveInformationEventMessage(mqttConnectionOptions, topic) {
        let client = mqttClient.connect(mqttConnectionOptions);
        return new Promise(function (resolve, reject) {
            console.time("mqtt connect time");
            client.on('connect', () => {
                client.subscribe(topic);
                console.timeEnd("mqtt connect time");
                console.time("mqtt message receive time");
                client.on('message', (topic, msg) => {
                    console.timeEnd("mqtt message receive time");
                    try {
                        client.end();
                        console.log(topic);
                        let message = msg.toString();
                        resolve(message);
                    }
                    catch (e) {
                        client.end();
                        console.log(e);
                        reject(e);
                    }
                });
            });
        });
    }
    parseInformationEventMessage(message) {
        let lines = message.split('|');
        let currentSettings = new currentSettings_1.default(lines[0]);
        let informationLines = lines.splice(1, lines.length - 1);
        let zones = new Array();
        let index = 0;
        informationLines.forEach(function (x) {
            zones[index] = new zone_1.default(x);
            index++;
        });
        return { currentSettings: currentSettings, zones: zones };
    }
}
exports.ThermostatGateway = ThermostatGateway;
class MqttConnectionOptions {
    constructor(port, host) {
        this._port = port;
        this._host = host;
    }
    get port() {
        return this._port;
    }
    set port(value) {
        this._port = value;
    }
    get host() {
        return this._host;
    }
    set host(value) {
        this._host = value;
    }
}
exports.MqttConnectionOptions = MqttConnectionOptions;
module.exports = {
    ThermostatGateway: ThermostatGateway,
    MqttConnectionOptions: MqttConnectionOptions
};
//# sourceMappingURL=thermostatGateway.js.map