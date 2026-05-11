import { useState, useEffect } from "react";
import { CitySearch, NominatimPlace } from "./components/CitySearch";
import { MapWidget } from "./components/MapWidget";
import { WeatherWidget } from "./components/WeatherWidget";
import { TripForm } from "./components/TripForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Map as MapIcon, Plus, Info, ExternalLink, ChevronLeft, Trash2 } from "lucide-react";
import { Trip } from "./types";
import { toast, Toaster } from "sonner";
import * as motion from "motion/react-client";

function App() {
  const [selectedPlace, setSelectedPlace] = useState<NominatimPlace | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [savedTrips, setSavedTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem("trips");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(savedTrips));
  }, [savedTrips]);

  const deleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedTrips(prev => prev.filter(t => t.id !== id));
    toast.success("Sayohat muvaffaqiyatli o'chirildi");
  };

  useEffect(() => {
    if (!selectedPlace) return;

    const lat = parseFloat(selectedPlace.lat);
    const lng = parseFloat(selectedPlace.lon);
    setLocation({ lat, lng });

    const fetchAttractions = async () => {
      try {
        // Find wikipedia articles near coordinate
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${lat}|${lng}&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.query && data.query.geosearch) {
           setAttractions(data.query.geosearch);
        }
      } catch (e) {
        console.error("Attractions xatosi:", e);
      }
    };

    fetchAttractions();
  }, [selectedPlace]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
             className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
             onClick={() => setSelectedPlace(null)}
          >
            <Plane className="h-6 w-6" />
            <span className="hidden sm:inline">Sayohat Rejalashtiruvchi</span>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end max-w-sm">
             <CitySearch onSelect={setSelectedPlace} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedPlace ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MapIcon className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Sayohatni boshlaymiz!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
               Yuqoridagi qidiruv panelidan bormoqchi bo'lgan shahringizni nomini kiriting va 
               xarita, ob-havo hamda diqqatga sazovor joylarni o'rganing.
            </p>

            {savedTrips.length > 0 && (
              <div className="mt-16 w-full max-w-5xl text-left">
                <h2 className="text-2xl font-bold mb-6">Mening Sayohatlarim</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedTrips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden hover:shadow-xl transition-all rounded-2xl border-transparent hover:border-primary/20 relative group">
                      <Button 
                         variant="destructive" 
                         size="icon" 
                         className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-8 h-8"
                         onClick={(e) => deleteTrip(trip.id || '', e)}
                      >
                         <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardContent className="p-0">
                        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b pr-12">
                          <h3 className="font-bold text-lg line-clamp-1">{trip.destination.name}</h3>
                        </div>
                        <div className="p-4 text-sm text-muted-foreground space-y-2">
                          <p className="font-medium text-foreground">Boshlanish: {new Date(trip.startDate).toLocaleDateString('uz-UZ')}</p>
                          <p className="font-medium text-foreground">Tugash: {new Date(trip.endDate).toLocaleDateString('uz-UZ')}</p>
                          {trip.notes && <p className="line-clamp-2 mt-3 pt-3 border-t border-muted text-xs bg-muted/30 p-2 rounded-md">{trip.notes}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <Button variant="ghost" onClick={() => setSelectedPlace(null)} className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Bosh sahifa
                  </Button>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                     <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        {selectedPlace.name || selectedPlace.display_name.split(',')[0]}
                     </h2>
                     <Button onClick={() => setIsFormOpen(true)} className="rounded-full shadow-sm hover:shadow-md transition-all">
                       <Plus className="mr-2 h-4 w-4" />
                       Sayohatni rejalashtirish
                     </Button>
                  </div>
                  
                  {location ? (
                    <MapWidget location={location} attractions={attractions} />
                  ) : (
                    <div className="w-full h-[400px] bg-muted animate-pulse rounded-2xl" />
                  )}
               </motion.div>

               {attractions.length > 0 && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Qiziqarli joylar (Wikipedia orqali)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {attractions.slice(0, 8).map((attr: any, i) => (
                        <a 
                          key={attr.pageid || i}
                          href={`https://en.wikipedia.org/?curid=${attr.pageid}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block group"
                        >
                          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full rounded-xl">
                            <CardContent className="p-4 flex justify-between items-center h-full">
                               <div className="flex flex-col gap-1 pr-2">
                                 <h4 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-colors">{attr.title}</h4>
                                 <span className="text-xs text-muted-foreground">{Math.round(attr.dist)} metr uzoqlikda</span>
                               </div>
                               <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                            </CardContent>
                          </Card>
                        </a>
                      ))}
                    </div>
                 </motion.div>
               )}
            </div>

            <div className="space-y-6">
              {location && (
                <WeatherWidget 
                   lat={location.lat} 
                   lon={location.lng} 
                   cityName={selectedPlace.name || selectedPlace.display_name.split(',')[0]} 
                />
              )}
            </div>
          </div>
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Sayohatni rejalashtirish</DialogTitle>
          </DialogHeader>
          {location && selectedPlace && (
             <TripForm 
               destinationName={selectedPlace.name || selectedPlace.display_name.split(',')[0]}
               destinationLat={location.lat}
               destinationLng={location.lng}
               onSave={(trip) => {
                 setSavedTrips(prev => [...prev, trip]);
                 setIsFormOpen(false);
                 toast.success("Sayohat muvaffaqiyatli saqlandi! 🎉");
               }}
             />
          )}
        </DialogContent>
      </Dialog>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
