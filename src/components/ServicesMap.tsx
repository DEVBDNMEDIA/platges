import React, { useState } from 'react';
import { MapPin, Navigation, X, ExternalLink } from 'lucide-react';
import { PlatjaServei } from '../types/platges';

interface ServicesMapProps {
  serveis: PlatjaServei;
  platjaName: string;
}

interface ServicePoint {
  id: string;
  lat: number;
  lng: number;
  tipus: string;
  color: string;
}

export const ServicesMap: React.FC<ServicesMapProps> = ({ serveis, platjaName }) => {
  const [selectedService, setSelectedService] = useState<ServicePoint | null>(null);

  // Calculate center point from all coordinates
  const calculateCenter = () => {
    const allCoordinates: [number, number][] = [];
    
    serveis.serveis.forEach(servei => {
      allCoordinates.push(...servei.geolocalitzacio);
    });

    if (allCoordinates.length === 0) return { lat: 41.4501, lng: 2.2531 }; // Default to Badalona

    const avgLat = allCoordinates.reduce((sum, coord) => sum + coord[1], 0) / allCoordinates.length;
    const avgLng = allCoordinates.reduce((sum, coord) => sum + coord[0], 0) / allCoordinates.length;

    return { lat: avgLat, lng: avgLng };
  };

  // Create service points
  const createServicePoints = (): ServicePoint[] => {
    const points: ServicePoint[] = [];
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-gray-500'];
    
    serveis.serveis.forEach((servei, serviceIndex) => {
      const color = colors[serviceIndex % colors.length];
      
      servei.geolocalitzacio.forEach((coord, coordIndex) => {
        points.push({
          id: `${serviceIndex}-${coordIndex}`,
          lat: coord[1],
          lng: coord[0],
          tipus: servei.tipus === 'Xiringuito / mòdul bar' ? 'Guingueta / mòdul bar' : servei.tipus,
          color: color
        });
      });
    });

    return points;
  };

  const servicePoints = createServicePoints();
  const center = calculateCenter();

  const openInGoogleMaps = (point?: ServicePoint) => {
    if (point) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`, '_blank');
    } else {
      const firstCoord = serveis.serveis[0]?.geolocalitzacio[0];
      if (firstCoord) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${firstCoord[1]},${firstCoord[0]}`, '_blank');
      }
    }
  };

  const handleServiceClick = (point: ServicePoint) => {
    setSelectedService(point);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  // Create a simple static map URL with markers
  const createMapUrl = () => {
    const zoom = 16;
    const mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'; // Public Mapbox token
    
    // Use OpenStreetMap as fallback
    const bounds = {
      north: center.lat + 0.003,
      south: center.lat - 0.003,
      east: center.lng + 0.003,
      west: center.lng - 0.003
    };
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.west},${bounds.south},${bounds.east},${bounds.north}&layer=mapnik&marker=${center.lat},${center.lng}`;
  };

  return (
    <div className="space-y-4">
      {/* Simple Static Map */}
      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden border">
        <iframe
          src={createMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title={`Mapa de serveis - ${platjaName}`}
          className="absolute inset-0"
        />
        
        {/* Simple overlay with service count */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              {servicePoints.length} serveis disponibles
            </span>
          </div>
        </div>

        {/* External link button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => openInGoogleMaps()}
            className="bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-300 rounded-lg p-2 shadow-sm transition-colors"
            title="Obrir a Google Maps"
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Service Modal */}
      {selectedService && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeServiceModal}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedService.tipus}</h3>
              <button
                onClick={closeServiceModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${selectedService.color} rounded-full`} />
                <span className="text-sm text-gray-600">Ubicació del servei</span>
              </div>
              
              <button
                onClick={() => openInGoogleMaps(selectedService)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Com arribar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Serveis disponibles
        </h4>
        <div className="space-y-2">
          {serveis.serveis.map((servei, index) => {
            const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-gray-500'];
            const color = colors[index % colors.length];
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${color} rounded-full border border-white shadow-sm`} />
                  <div>
                    <span className="text-gray-900 font-medium">
                      {servei.tipus === 'Xiringuito / mòdul bar' ? 'Guingueta / mòdul bar' : servei.tipus}
                    </span>
                    <p className="text-sm text-gray-500">{servei.geolocalitzacio.length} ubicacions</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const firstCoord = servei.geolocalitzacio[0];
                    if (firstCoord) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${firstCoord[1]},${firstCoord[0]}`, '_blank');
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Veure
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map action button */}
      <div className="flex justify-center">
        <button
          onClick={() => openInGoogleMaps()}
          className="flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>Obrir a Google Maps</span>
        </button>
      </div>
    </div>
  );
};