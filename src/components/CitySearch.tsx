import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface NominatimPlace {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name: string;
}

interface CitySearchProps {
  onSelect: (place: NominatimPlace) => void;
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<NominatimPlace[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query || query.length < 3) {
      setPredictions([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&featuretype=city&limit=5`);
        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error("Geocoding xatosi:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Qayerga sayohat qilmoqchisiz? (Shahar nomi)"
          className="pl-10 h-12 text-lg shadow-sm rounded-full border-primary/20 focus-visible:ring-primary/30"
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && predictions.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 shadow-xl border-muted rounded-2xl overflow-hidden">
          <ScrollArea className="h-max max-h-[300px]">
            <ul className="p-2">
              {predictions.map((p) => (
                <li 
                  key={p.place_id}
                  onClick={() => {
                    onSelect(p);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium truncate text-foreground">{p.name || p.display_name.split(',')[0]}</span>
                    <span className="text-xs text-muted-foreground truncate">{p.display_name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
