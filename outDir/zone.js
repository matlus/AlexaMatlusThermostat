"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Zone {
    constructor(delimitedString) {
        let data = delimitedString.split('&');
        this._name = data[0].split('=')[1];
        this._temperature = parseFloat(data[1].split('=')[1]);
        this._humidity = parseFloat(data[2].split('=')[1]);
    }
    get name() {
        return this._name;
    }
    get temperature() {
        return this._temperature;
    }
    get humidity() {
        return this._humidity;
    }
    toString() {
        return `It is ${this.temperature} degrees in the ${this.name}, and the humidity is ${this._humidity} %`;
    }
}
exports.default = Zone;
//# sourceMappingURL=zone.js.map