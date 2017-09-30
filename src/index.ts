"use strict";
import Alexa = require('alexa-sdk');
import { ThermostatGateway } from './thermostatGateway';


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

        let thermostat = new ThermostatGateway();
        thermostat.setThermostat(zoneAsInput, modeAsInput, temperatureAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Settings have been changed'))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatIntent', reason));
    },
    "SetThermostatModeIntent": function () {
        let modeAsInput = this.event.request.intent.slots.mode.value;

        let thermostat = new ThermostatGateway();
        thermostat.setThermostatMode(modeAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Mode has been changed'))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatModeIntent', reason));
    },
    "SetThermostatZoneIntent": function () {
        let zoneAsInput = this.event.request.intent.slots.zone.value;

        let thermostat = new ThermostatGateway();
        thermostat.setThermostatZone(zoneAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Zone has been changed'))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatZoneIntent', `The Zone received was ${zoneAsInput}. The error Message was: ${reason.message}`));
    },
    "SetThermostatTemperatureIntent": function () {
        let temperatureAsInput = this.event.request.intent.slots.temperature.value;

        let thermostat = new ThermostatGateway();
        thermostat.setThermostatTemperature(temperatureAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Temperature has been changed'))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - SetThermostatTemperatureIntent', reason));
    },
    "IncreaseThermostatTemperatureIntent": function () {
        let amountAsInput = this.event.request.intent.slots.amount.value;

        let thermostat = new ThermostatGateway();
        thermostat.increaseThermostatTemperature(amountAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, `Thermostat Temperature was increased`))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - IncreaseThermostatTemperatureIntent', reason));
    },
    "DecreaseThermostatTemperatureIntent": function () {
        let amountAsInput = this.event.request.intent.slots.amount.value;

        let thermostat = new ThermostatGateway();
        thermostat.decreaseThermostatTemperature(amountAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, `Thermostat Temperature was decreased`))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - DecreaseThermostatTemperatureIntent', reason));
    },
    "TurnApplianceOnOrOffIntent": function () {
        let applianceAsInput = this.event.request.intent.slots.appliance.value;
        let onoffAsInput = this.event.request.intent.slots.onoff.value;
        let temperatureAsInput: string = this.event.request.intent.slots.temperature.value;
        let zoneAsInput: string = this.event.request.intent.slots.zone.value;


        let thermostat = new ThermostatGateway();
        thermostat.turnApplianceOnOrOff(applianceAsInput, onoffAsInput, temperatureAsInput, zoneAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, `The Appliance was turned on or off`))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - TurnApplianceOnOrOffIntent', `Received the following - appliance: ${applianceAsInput}, OnOff: ${onoffAsInput}, temperature: ${temperatureAsInput}, zone: ${zoneAsInput}`));
    },
    "GetThermostatStatusIntent": function () {
        let thermostat = new ThermostatGateway();
        thermostat.getThermostatStatus()
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Status was Retrieved'))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - GetThermostatStatusIntent', reason));
    },

    "GetThermostatSettingsIntent": function () {
        let thermostat = new ThermostatGateway();
        thermostat.getThermostatSettings()
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, 'Thermostat Settings were Retrieved'))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - GetThermostatSettingsIntent', reason));
    },

    "GetTemperatureInZoneIntent": function () {
        let zoneAsInput = this.event.request.intent.slots.zone.value;
        let thermostat = new ThermostatGateway();
        thermostat.getTemperatureInZone(zoneAsInput)
            .then((speechOutput: string): void => this.emit(':tellWithCard', speechOutput, cardTitle, 'Zone Temperature was Retrieved'))
            .catch((reason: Error): void => this.emit(':tellWithCard', reason.message, 'Error - GetTemperatureInZoneIntent', reason));
    },
};