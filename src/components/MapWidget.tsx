import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Info } from "lucide-react";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const attractionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export function MapWidget({ 
  location, 
  attractions = []
}: { 
  location: { lat: number; lng: number };
  attractions?: any[];
}) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl border">
      <MapContainer 
        center={location} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
        className="z-10"
      >
        <ChangeView center={location} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={location} icon={defaultIcon}>
          <Popup>Tanlangan shahar</Popup>
        </Marker>

        {attractions?.map((place, i) => (
          <Marker 
            key={place.pageid || i} 
            position={{ lat: place.lat, lng: place.lon }}
            icon={attractionIcon}
          >
            <Popup>
               <div className="flex flex-col">
                 <strong className="font-semibold">{place.title}</strong>
                 <a 
                   href={`https://en.wikipedia.org/?curid=${place.pageid}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="text-primary text-xs mt-1 hover:underline"
                 >
                   Ma'lumot
                 </a>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
