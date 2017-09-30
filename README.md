# Alexa-MatlusIoTThermostat
This is a [Visual Studio Code](https://code.visualstudio.com/) project for the Alexa Skill related to the [Alexa Controlled Matlus IoT Multizone Thermostat](https://github.com/matlus/MultizoneThermostat).
The app.ts file has been configued as the start up file for local debugging. However, on AWS, the index.ts file is the entry point.

The other TypeScript classes:
* thermostatGateway.ts
* currentSettings.ts
* zone.ts
* normalizers.ts

are all part of the actual code that will run as part of the Alexa Skill on AWS.

### thermostatGateway.ts
This is the primary class, the "entry point" of the system. Essentially the data received from Alexa is extracted in the index.ts file and assembled into variable. This data is then passed as arguments to the various methods that match the intended Alexa skill. The public methods of this class are the API of the system.

#### Alexa Demystified - Explaining the Flow with an IoT Thermostat
[![YoueTube Video -Alexa Demystified - Explaining the Flow with an IoT Thermostat](http://img.youtube.com/vi/rwVX2BN2n0I/0.jpg)](http://www.youtube.com/watch?v=rwVX2BN2n0I)

#### IoT Multi-Zone Thermostat - Alexa Skill Demonstration
[![YoueTube Video -IoT Multi-Zone Thermostat - Alexa Skill Demonstration](http://img.youtube.com/vi/ITUisKjxcCc/0.jpg)](http://www.youtube.com/watch?v=ITUisKjxcCc)


