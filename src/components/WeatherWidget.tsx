import { useEffect, useState } from "react";
import { WeatherData, fetchWeatherAndForecast, getWeatherDescription } from "../services/weatherService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import * as motion from "motion/react-client";

interface WeatherWidgetProps {
  lat: number;
  lon: number;
  cityName: string;
}

export function WeatherWidget({ lat, lon, cityName }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchWeatherAndForecast(lat, lon);
        if (active) {
          setData(res);
          setError("");
        }
      } catch (err: any) {
        if (active) setError(err.message || "Xatolik yuz berdi");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [lat, lon]);

  if (loading) return (
    <Card className="w-full h-[300px] flex items-center justify-center animate-pulse rounded-2xl">
      <div className="text-muted-foreground flex items-center gap-2">
        <Cloud className="animate-bounce" /> Ob-havo yuklanmoqda...
      </div>
    </Card>
  );

  if (error || !data) return (
    <Card className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-destructive/10 rounded-2xl">
      <p className="text-destructive font-medium">{error}</p>
    </Card>
  );

  const currentWeather = getWeatherDescription(data.current.weather_code, data.current.is_day === 1);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="w-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none shadow-xl rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium tracking-wide flex justify-between items-center">
            {cityName} Ob-havosi
            <span className="text-4xl">{currentWeather.icon}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-5xl font-bold tracking-tighter">
                {Math.round(data.current.temperature_2m)}°C
              </div>
              <p className="text-blue-100 capitalize mt-1 text-lg">
                {currentWeather.desc}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span>Tuyuladi: {Math.round(data.current.apparent_temperature)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                <span>Namlik: {data.current.relative_humidity_2m}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                <span>Shamol: {data.current.wind_speed_10m} km/soat</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-400/30">
            <p className="text-sm font-medium text-blue-100 mb-3">Keyingi kunlar:</p>
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex w-max space-x-4">
                {data.daily.time.map((time, i) => {
                  const dailyWeather = getWeatherDescription(data.daily.weather_code[i]);
                  return (
                    <div key={i} className="flex flex-col items-center bg-white/10 rounded-xl p-3 min-w-[80px]">
                      <span className="text-xs font-medium">
                        {new Date(time).toLocaleDateString('uz-UZ', { weekday: 'short' })}
                      </span>
                      <span className="text-2xl my-2">{dailyWeather.icon}</span>
                      <span className="font-bold">{Math.round(data.daily.temperature_2m_max[i])}° <span className="text-blue-200 text-xs font-normal">/ {Math.round(data.daily.temperature_2m_min[i])}°</span></span>
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="bg-blue-900/20" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
