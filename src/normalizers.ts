export default class Normalizer {
    public normalizeZone(zoneAsInput: string): string {
        let zone: string;
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
    public normalizeAppliance(applianceAsInput: string): string {
        let appliance: string;
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

    public normalizeMode(modeAsInput: string): string {
        let mode: string;
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

    public getModeFromAppliance(appliance: string): string {
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

    public normalizeNumber(numberAsInput: string): string {
        let valueAsString: string;
        let parsedNumber = Number(numberAsInput);

        if (isNaN(parsedNumber)) {
            valueAsString = "0";
        }
        else {
            valueAsString = parsedNumber.toString();
        }

        return valueAsString;
    }

    public normalizeOnOff(onoffAsInput: string): string {

        let onOff: string;

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