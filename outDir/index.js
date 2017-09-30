"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const thermostatGateway_1 = require("./thermostatGateway");
var APP_ID = 'amzn1.ask.skill.a8e02564-bff1-4400-b189-49ef32b1bad5';
const cardTitle = 'Thermostat';
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
var handlers = {
    'LaunchRequest': function () {
        var speechOutput = "You can ask me to set various Thermostat settings. You can say....ask Thermostat to set to Hall, Cool, Seventy. Or, ask Thermostat to Increase Temperature to Seventy";
        this.emit(":tell", speechOutput);
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = "You can ask me to set various Thermostat settings. You can say....ask Thermostat to set to Hall, Cool, Seventy. Or, ask Thermostat to Increase Temperature to Seventy";
        this.emit(":tell", speechOutput);
    },
    'AMAZON.CancelIntent': function () {
    },
    'AMAZON.StopIntent': function () {
    },
    "SetThermostatIntent": function () {
        let zoneAsInput = this.event.request.intent.slots.zone.value;
        let modeAsInput = this.event.request.intent.slots.mode.value;
        let temperatureAsInput = this.event.request.intent.slots.temperature.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.setThermostat(zoneAsInput, modeAsInput, temperatureAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Settings have been changed'))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatIntent', reason));
    },
    "SetThermostatModeIntent": function () {
        let modeAsInput = this.event.request.intent.slots.mode.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.setThermostatMode(modeAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Mode has been changed'))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatModeIntent', reason));
    },
    "SetThermostatZoneIntent": function () {
        let zoneAsInput = this.event.request.intent.slots.zone.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.setThermostatZone(zoneAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Zone has been changed'))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatZoneIntent', `The Zone received was ${zoneAsInput}. The error Message was: ${reason.message}`));
    },
    "SetThermostatTemperatureIntent": function () {
        let temperatureAsInput = this.event.request.intent.slots.temperature.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.setThermostatTemperature(temperatureAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Temperature has been changed'))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatTemperatureIntent', reason));
    },
    "IncreaseThermostatTemperatureIntent": function () {
        let amountAsInput = this.event.request.intent.slots.amount.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.increaseThermostatTemperature(amountAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, `Thermostat Temperature was increased`))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - IncreaseThermostatTemperatureIntent', reason));
    },
    "DecreaseThermostatTemperatureIntent": function () {
        let amountAsInput = this.event.request.intent.slots.amount.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.decreaseThermostatTemperature(amountAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, `Thermostat Temperature was decreased`))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - DecreaseThermostatTemperatureIntent', reason));
    },
    "TurnApplianceOnOrOffIntent": function () {
        let applianceAsInput = this.event.request.intent.slots.appliance.value;
        let onoffAsInput = this.event.request.intent.slots.onoff.value;
        let temperatureAsInput = this.event.request.intent.slots.temperature.value;
        let zoneAsInput = this.event.request.intent.slots.zone.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.turnApplianceOnOrOff(applianceAsInput, onoffAsInput, temperatureAsInput, zoneAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, `The Appliance was turned on or off`))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - TurnApplianceOnOrOffIntent', `Received the following - appliance: ${applianceAsInput}, OnOff: ${onoffAsInput}, temperature: ${temperatureAsInput}, zone: ${zoneAsInput}`));
    },
    "GetThermostatStatusIntent": function () {
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.getThermostatStatus()
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Status was Retrieved'))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - GetThermostatStatusIntent', reason));
    },
    "GetThermostatSettingsIntent": function () {
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.getThermostatSettings()
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Settings were Retrieved'))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - GetThermostatSettingsIntent', reason));
    },
    "GetTemperatureInZoneIntent": function () {
        let zoneAsInput = this.event.request.intent.slots.zone.value;
        let thermostat = new thermostatGateway_1.ThermostatGateway();
        thermostat.getTemperatureInZone(zoneAsInput)
            .then((speechOutput) => this.emit(':tellWithCard', speechOutput, cardTitle, 'Zone Temperature was Retrieved'))
            .catch((reason) => this.emit(':tellWithCard', reason.message, 'Error - GetTemperatureInZoneIntent', reason));
    },
};
//# sourceMappingURL=index.js.map