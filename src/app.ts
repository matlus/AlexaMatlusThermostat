"use strict";
import mqttClient = require('mqtt');
var MQTT = require("async-mqtt");
import https = require('https');
import querystring = require('querystring')
import CurrentSettings from "./currentSettings";
import Zone from "./zone";
import Normalizer from './normalizers';
import { MqttConnectionOptions, ThermostatGateway } from './thermostatGateway';

//setThermostatIntent();
//setThermostatModeIntent();
//setThermostatZoneIntent();
//increaseThermostatTemperatureIntent();
//decreaseThermostatTemperatureIntent();
getThermostatStatusIntent();
getTemperatureInZoneIntent();
//turnApplianceOnOrOffIntent();
//turnApplianceOnOrOffExtendedIntent();
//getMqttMessage();
//sendNotification();
//getThermostatSettingsIntent();

function setThermostatIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.setThermostat('master bedroom', 'off', '75.10')
        .then((speechOutput: string): void => console.log(speechOutput))
        .catch((reason: string): void => console.log(reason));
}

function setThermostatModeIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.setThermostatMode('off')
        .then((speechOutput: string): void => console.log(speechOutput))
        .catch((reason: string): void => console.log(reason));
}

function setThermostatZoneIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.setThermostatZone('family room')
        .then((speechOutput: string): void => console.log(speechOutput))
        .catch((reason: string): void => console.log(reason));
}

function increaseThermostatTemperatureIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.increaseThermostatTemperature("2")
        .then((speechOutput: string): void => console.log(speechOutput))
        .catch((reason: Error): void => console.exception(reason.message, reason));
}

function decreaseThermostatTemperatureIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.decreaseThermostatTemperature("2")
        .then((speechOutput: string): void => console.log(speechOutput))
        .catch((reason: Error): void => console.exception(reason.message, reason));
}

function getThermostatStatusIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.getThermostatStatus()
        .then((message: string): void => console.log(message))
        .catch((reason: string): void => console.log(reason));
}

function getTemperatureInZoneIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.getTemperatureInZone("master bedroom")
        .then((message: string): void => console.log(message))
        .catch((reason: string): void => console.log(reason));
}

function turnApplianceOnOrOffIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.turnApplianceOnOrOff("heater", "on", "", "")
        .then((message: string): void => console.log(message))
        .catch((reason: Error): void => console.log(reason.message));
}

function turnApplianceOnOrOffExtendedIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.turnApplianceOnOrOff("air conditioner", "on", "67", "master bedroom")
        .then((message: string): void => console.log(message))
        .catch((reason: string): void => console.log(reason));
}

function getThermostatSettingsIntent() {
    let thermostatGateway = new ThermostatGateway();
    thermostatGateway.getThermostatSettings()
        .then((message: string): void => console.log(message))
        .catch((reason: string): void => console.log(reason));
}


function getMqttMessage() {
    let topicRoot = "matlus/thermostat/";
    let thermostatCommandTopic = topicRoot + "cmd";
    let thermostatInfoTopic = topicRoot + "inf";
    let mqttConnectionOptions = new MqttConnectionOptions(1883, "iot.eclipse.com");

    receiveInformationEventMessage(mqttConnectionOptions, thermostatInfoTopic, (message: string) => {
        let data = parseInformationEventMessage(message);
        let currentSettings: CurrentSettings = data.currentSettings;
        let zones: Array<Zone> = data.zones;

        PostCode(currentSettings);
        //sendNotification(currentSettings);
    });
}

function receiveInformationEventMessage(mqttConnectionOptions: MqttConnectionOptions, topic: string, callback: (message: string) => void): void {

    let client = mqttClient.connect(mqttConnectionOptions);
    client.subscribe(topic);

    client.on('message', (topic: string, msg: Uint8Array) => {
        console.log(`Topic:${topic} - MQTT Message Received`);
        let message = msg.toString();
        callback(message);
    });
}

function parseInformationEventMessage(message: string): { currentSettings: CurrentSettings, zones: Array<Zone> } {

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

function PostCode(currentSettings: CurrentSettings) {
    let post_data = JSON.stringify(currentSettings);
    //let postBody = querystring.stringify(post_data);
    // An object of options to indicate where to post to
    var post_options = {
        host: 'matlustestfunc.azurewebsites.net',
        port: 443,
        path: '/api/HttpTriggerJS1',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    var post_req = https.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
}

////function sendNotification(currentSettings: CurrentSettings) {
    ////let notificationHubService = azure.createNotificationHubService('matlusiot', 'Endpoint=sb://thermostat.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=vpjZU7ovoHQKsFuqJxGQJoJf19cyumhtRrnGx94I8RM=');
    ////let payload = `<?xml version="1.0" encoding="utf-8"?><toast><visual>
    ////                <binding template="ToastImageAndText04">
    ////                <image id="1" src= "https://matlustestfuncstorage.blob.core.windows.net/images/LightDimmer_200.JPG" alt= "Matlus IoT Thermostat" />
    ////                <text id="1">Matlus IoT Thermostat</text>
    ////                <text id="2">${currentSettings.toString()}</text>
    ////                <text id="3"></text>
    ////                </binding></visual></toast>`;

    ////notificationHubService.wns.send(null, payload, 'wns/toast', function (error) {
    ////    if (!error) {
    ////        // notification sent
    ////    }
    ////});
////}