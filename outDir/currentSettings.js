"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CurrentSettings {
    constructor(delimitedString) {
        let data = delimitedString.split("&");
        this._mode = data[0].split("=")[1];
        this._zone = data[1].split("=")[1];
        this._setTemperature = parseFloat(data[2].split("=")[1]);
        this._applianceOn = (data[3].split("=")[1] === "true");
    }
    get mode() {
        return this._mode;
    }
    get zone() {
        return this._zone;
    }
    get setTemperature() {
        return this._setTemperature;
    }
    get applianceState() {
        return (this._applianceOn) ? "On" : "Off";
    }
    get appliance() {
        switch (this._mode) {
            case "Off":
                return "Heating and Air Conditioning";
            case "Cool":
                return "Air Conditioner";
            case "Heat":
                return "Heater";
            case "Fan":
                return "Fan";
            default:
                throw new Error(`Unrecognized Mode: ${this._mode}. Valid values for Mode are, Off, Cool, Heat and Fan`);
        }
    }
    toString() {
        return `The Current Zone is ${this.zone}, the Temperature is set to ${this.setTemperature}, the Mode is ${this.mode}, and the ${this.appliance} is ${(this.applianceState)}.`;
    }
}
exports.default = CurrentSettings;
//# sourceMappingURL=currentSettings.js.map