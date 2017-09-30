export default class CurrentSettings {
    private readonly _mode: string;
    private readonly _zone: string;
    private readonly _setTemperature: number;
    private readonly _applianceOn: boolean;

    constructor(delimitedString: string) {
        let data = delimitedString.split("&");
        this._mode = data[0].split("=")[1];
        this._zone = data[1].split("=")[1];
        this._setTemperature = parseFloat(data[2].split("=")[1]);
        this._applianceOn = (data[3].split("=")[1] === "true");
    }

    public get mode(): string {
        return this._mode;
    }

    public get zone(): string {
        return this._zone;
    }

    public get setTemperature(): number {
        return this._setTemperature;
    }

    public get applianceState(): string {
        return (this._applianceOn) ? "On" : "Off";
    }

    public get appliance(): string {
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

    public toString(): string {
        return `The Current Zone is ${this.zone}, the Temperature is set to ${this.setTemperature}, the Mode is ${this.mode}, and the ${this.appliance} is ${(this.applianceState)}.`;
    }
}