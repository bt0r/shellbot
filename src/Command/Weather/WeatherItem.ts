export interface WeatherItemInterface {
    humidity: string;
    temp: string;
    value: string | null;
    hour: string;
}

export class WeatherItem implements WeatherItemInterface {
    public hour: string;
    public humidity: string;
    public temp: string;
    public value: string | null = null;
}
