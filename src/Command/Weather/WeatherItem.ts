interface WeatherItemInterface {
    humidity: string;
    temp: string;
    value: string | null;
}

class WeatherItem implements WeatherItemInterface {
    public hour: string;
    public humidity: string;
    public temp: string;
    public value: string | null = null;
}
