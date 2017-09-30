"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Normalizer {
    normalizeZone(zoneAsInput) {
        let zone;
        switch (zoneAsInput) {
            case "family room":
            case "familyroom":
                zone = "Family Room";
                break;
            case "master bedroom":
            case "masterbedroom":
                zone = "Master Bedroom";
                break;
            case "study":
                zone = "Study";
                break;
            case "bedroom two":
            case "bedroom 2":
                zone = "Bedroom 2";
                break;
            case "bedroom three":
            case "bedroom 3":
                zone = "Bedroom 3";
                break;
            case "bedroom four":
            case "bedroom 4":
                zone = "Bedroom 4";
                break;
            case "living room":
            case "livingroom":
                zone = "Living Room";
                break;
            default:
                throw new Error(`Unrecognized Zone: ${zoneAsInput}. Valid values are: Master Bedroom, Living Room, Family Room, Study, Bedroom 2, Bedroom 3, Bedroom 4`);
        }
        return zone;
    }
    normalizeAppliance(applianceAsInput) {
        let appliance;
        switch (applianceAsInput) {
            case "ac":
            case "AC":
            case "a c":
            case "A C":
            case "air conditioner":
            case "air conditioning":
                appliance = "Air Conditioner";
                break;
            case "heat":
            case "heater":
            case "heating":
                appliance = "Heater";
                break;
            case "fan":
                appliance = "Fan";
                break;
            default:
                throw new Error(`Unrecognized Appliance: ${applianceAsInput}. Valid values are: AC, Air Conditioner, Heat, Heater and Fan`);
        }
        return appliance;
    }
    normalizeMode(modeAsInput) {
        let mode;
        switch (modeAsInput) {
            case "off":
            case "Off":
            default:
                mode = "Off";
                break;
            case "cool":
            case "Cool":
                mode = "Cool";
                break;
            case "heat":
            case "Heat":
                mode = "Heat";
                break;
            case "fan":
            case "Fan":
                mode = "Fan";
                break;
        }
        return mode;
    }
    getModeFromAppliance(appliance) {
        switch (appliance) {
            case "Air Conditioner":
                return "Cool";
            case "Heater":
                return "Heat";
            case "Fan":
                return "Fan";
            default:
                return "Off";
        }
    }
    normalizeNumber(numberAsInput) {
        let valueAsString;
        let parsedNumber = Number(numberAsInput);
        if (isNaN(parsedNumber)) {
            valueAsString = "0";
        }
        else {
            valueAsString = parsedNumber.toString();
        }
        return valueAsString;
    }
    normalizeOnOff(onoffAsInput) {
        let onOff;
        switch (onoffAsInput) {
            case "off":
            case "Off":
            default:
                onOff = "Off";
                break;
            case "on":
            case "On":
                onOff = "On";
                break;
        }
        return onOff;
    }
}
exports.default = Normalizer;
//# sourceMappingURL=normalizers.js.map