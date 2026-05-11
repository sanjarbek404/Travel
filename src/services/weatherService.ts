export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export const fetchWeatherAndForecast = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Ob-havo ma\'lumotlarini olishda xatolik yuz berdi');
  }
  return response.json();
};

export const getWeatherDescription = (code: number, isDay: boolean = true) => {
  const weatherCodes: Record<number, { desc: string; icon: string }> = {
    0: { desc: 'Ochiq havo', icon: isDay ? '☀️' : '🌙' },
    1: { desc: 'Asosan ochiq', icon: isDay ? '🌤️' : '☁️' },
    2: { desc: 'Qisman bulutli', icon: '⛅' },
    3: { desc: 'Bulutli', icon: '☁️' },
    45: { desc: 'Tumanli', icon: '🌫️' },
    48: { desc: 'Qalin tuman', icon: '🌫️' },
    51: { desc: 'Yengil shabnam', icon: '🌧️' },
    53: { desc: 'O\'rtacha shabnam', icon: '🌧️' },
    55: { desc: 'Qalin shabnam', icon: '🌧️' },
    61: { desc: 'Yengil yomg\'ir', icon: '🌧️' },
    63: { desc: 'O\'rtacha yomg\'ir', icon: '🌧️' },
    65: { desc: 'Kuchli yomg\'ir', icon: '🌧️' },
    71: { desc: 'Yengil qor', icon: '🌨️' },
    73: { desc: 'O\'rtacha qor', icon: '🌨️' },
    75: { desc: 'Kuchli qor', icon: '❄️' },
    80: { desc: 'Yengil jala', icon: '🌦️' },
    81: { desc: 'O\'rtacha jala', icon: '🌧️' },
    82: { desc: 'Kuchli jala', icon: '⛈️' },
    95: { desc: 'Momaqaldiroq', icon: '⛈️' },
    96: { desc: 'Do\'l aralash momaqaldiroq', icon: '⛈️' },
    99: { desc: 'Kuchli do\'l', icon: '⛈️' },
  };
  return weatherCodes[code] || { desc: 'Noma\'lum', icon: '🌍' };
};
