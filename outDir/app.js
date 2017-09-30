"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqttClient = require("mqtt");
var MQTT = require("async-mqtt");
const https = require("https");
const currentSettings_1 = require("./currentSettings");
const zone_1 = require("./zone");
const thermostatGateway_1 = require("./thermostatGateway");
getThermostatStatusIntent();
getTemperatureInZoneIntent();
function setThermostatIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.setThermostat('master bedroom', 'off', '75.10')
        .then((speechOutput) => console.log(speechOutput))
        .catch((reason) => console.log(reason));
}
function setThermostatModeIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.setThermostatMode('off')
        .then((speechOutput) => console.log(speechOutput))
        .catch((reason) => console.log(reason));
}
function setThermostatZoneIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.setThermostatZone('family room')
        .then((speechOutput) => console.log(speechOutput))
        .catch((reason) => console.log(reason));
}
function increaseThermostatTemperatureIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.increaseThermostatTemperature("2")
        .then((speechOutput) => console.log(speechOutput))
        .catch((reason) => console.exception(reason.message, reason));
}
function decreaseThermostatTemperatureIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.decreaseThermostatTemperature("2")
        .then((speechOutput) => console.log(speechOutput))
        .catch((reason) => console.exception(reason.message, reason));
}
function getThermostatStatusIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.getThermostatStatus()
        .then((message) => console.log(message))
        .catch((reason) => console.log(reason));
}
function getTemperatureInZoneIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.getTemperatureInZone("master bedroom")
        .then((message) => console.log(message))
        .catch((reason) => console.log(reason));
}
function turnApplianceOnOrOffIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.turnApplianceOnOrOff("heater", "on", "", "")
        .then((message) => console.log(message))
        .catch((reason) => console.log(reason.message));
}
function turnApplianceOnOrOffExtendedIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.turnApplianceOnOrOff("air conditioner", "on", "67", "master bedroom")
        .then((message) => console.log(message))
        .catch((reason) => console.log(reason));
}
function getThermostatSettingsIntent() {
    let thermostatGateway = new thermostatGateway_1.ThermostatGateway();
    thermostatGateway.getThermostatSettings()
        .then((message) => console.log(message))
        .catch((reason) => console.log(reason));
}
function getMqttMessage() {
    let topicRoot = "matlus/thermostat/";
    let thermostatCommandTopic = topicRoot + "cmd";
    let thermostatInfoTopic = topicRoot + "inf";
    let mqttConnectionOptions = new thermostatGateway_1.MqttConnectionOptions(1883, "iot.eclipse.com");
    receiveInformationEventMessage(mqttConnectionOptions, thermostatInfoTopic, (message) => {
        let data = parseInformationEventMessage(message);
        let currentSettings = data.currentSettings;
        let zones = data.zones;
        PostCode(currentSettings);
    });
}
function receiveInformationEventMessage(mqttConnectionOptions, topic, callback) {
    let client = mqttClient.connect(mqttConnectionOptions);
    client.subscribe(topic);
    client.on('message', (topic, msg) => {
        console.log(`Topic:${topic} - MQTT Message Received`);
        let message = msg.toString();
        callback(message);
    });
}
function parseInformationEventMessage(message) {
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
function PostCode(currentSettings) {
    let post_data = JSON.stringify(currentSettings);
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
    var post_req = https.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
    post_req.write(post_data);
    post_req.end();
}
//# sourceMappingURL=app.js.map