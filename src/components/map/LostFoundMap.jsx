import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Calendar, Gift, ArrowRight } from 'lucide-react';

// Custom DivIcons for crisp SVG rendering without broken images
function createCustomMarkerIcon(type, isSelected = false) {
  const isLost = type === 'lost';
  const bgColor = isLost ? '#f43f5e' : '#10b981';
  const ringColor = isLost ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.25)';
  const iconSvg = isLost
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`;

  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${ringColor}; animation: pulse 2s infinite;"></div>
      <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: ${bgColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2.5px solid white;">
        ${iconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-marker',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// Controller component to smoothly reposition map when target changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LostFoundMap({
  items = [],
  selectedItem = null,
  center = { lat: 41.311081, lng: 69.279737 },
  zoom = 12,
  height = '500px',
  onMarkerClick = null,
}) {
  const navigate = useNavigate();
  const { t, language } = useApp();

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={center} zoom={zoom} />

        {items.map((item) => {
          if (!item.coordinates || !item.coordinates.lat || !item.coordinates.lng) {
            return null;
          }

          const isSelected = selectedItem && selectedItem.id === item.id;
          const icon = createCustomMarkerIcon(item.type, isSelected);

          return (
            <Marker
              key={item.id}
              position={[item.coordinates.lat, item.coordinates.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) onMarkerClick(item);
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="w-56 p-1 text-slate-800">
                  <div className="relative aspect-16/10 rounded-lg overflow-hidden mb-2 bg-slate-100">
                    <img
                      src={item.image}
                      alt={language === 'uz' && item.titleUz ? item.titleUz : item.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white ${
                        item.type === 'lost' ? 'bg-rose-500' : 'bg-emerald-600'
                      }`}
                    >
                      {item.type === 'lost' ? t('common.lost') : t('common.found')}
                    </span>
                    {item.reward && (
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white">
                        {item.reward}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1 mb-1">
                    {language === 'uz' && item.titleUz ? item.titleUz : language === 'ru' && item.titleRu ? item.titleRu : item.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 space-y-1 mb-2">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.locationAddress || item.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/item/${item.id}`)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>{t('common.viewDetails')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
