export default class Zone {
    private readonly _name: string;
    private readonly _temperature: number;
    private readonly _humidity: number;

    public constructor(delimitedString: string) {
        let data = delimitedString.split('&');
        this._name = data[0].split('=')[1];
        this._temperature = parseFloat(data[1].split('=')[1]);
        this._humidity = parseFloat(data[2].split('=')[1]);        
    }

    public get name(): string {
        return this._name;
    }

    public get temperature(): number {
        return this._temperature;
    }

    public get humidity(): number {
        return this._humidity;
    }

    public toString(): string {
        return `It is ${this.temperature} degrees in the ${this.name}, and the humidity is ${this._humidity} %`;
    }
}