import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
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
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState({ lat: 41.4501, lng: 2.2531 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, centerLat: 0, centerLng: 0 });
  const [mapKey, setMapKey] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setCenter(calculateCenter());
  }, [serveis]);

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

  // Convert lat/lng to pixel coordinates based on zoom and center
  const latLngToPixel = (lat: number, lng: number) => {
    if (!mapContainerRef.current) return { x: 0, y: 0 };
    
    const mapWidth = mapContainerRef.current.offsetWidth;
    const mapHeight = mapContainerRef.current.offsetHeight;
    
    // Millor conversió de coordenades
    const scale = Math.pow(2, zoom - 1);
    
    // Calcular offset en píxels des del centre
    const lngDiff = lng - center.lng;
    const latDiff = lat - center.lat;
    
    // Conversió més precisa a píxels
    const pixelsPerDegreeLng = scale * mapWidth / 360;
    const pixelsPerDegreeLat = scale * mapHeight / 180;
    
    const x = mapWidth / 2 + (lngDiff * pixelsPerDegreeLng);
    const y = mapHeight / 2 - (latDiff * pixelsPerDegreeLat);
    
    return { x, y };
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 19));
    setMapKey(prev => prev + 1);
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 10));
    setMapKey(prev => prev + 1);
  };

  const handleReset = () => {
    setCenter(calculateCenter());
    setZoom(16);
    setMapKey(prev => prev + 1);
  };

  // Improved drag handling with better mobile support
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      centerLat: center.lat,
      centerLng: center.lng
    });
    
    if (mapContainerRef.current) {
      mapContainerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !mapContainerRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const mapWidth = mapContainerRef.current.offsetWidth;
    const mapHeight = mapContainerRef.current.offsetHeight;
    
    // Conversió millorada amb millor escalat
    const scale = Math.pow(2, zoom - 1);
    const pixelsPerDegreeLng = scale * mapWidth / 360;
    const pixelsPerDegreeLat = scale * mapHeight / 180;
    
    const lngDelta = -deltaX / pixelsPerDegreeLng;
    const latDelta = deltaY / pixelsPerDegreeLat;
    
    setCenter({
      lat: dragStart.centerLat + latDelta,
      lng: dragStart.centerLng + lngDelta
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setMapKey(prev => prev + 1);
    }
    setIsDragging(false);
    
    if (mapContainerRef.current) {
      mapContainerRef.current.releasePointerCapture(e.pointerId);
    }
  };

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

  // Calculate map bounds for the current zoom and center
  const getMapBounds = () => {
    if (!mapContainerRef.current) return {
      north: center.lat + 0.01,
      south: center.lat - 0.01,
      east: center.lng + 0.01,
      west: center.lng - 0.01
    };
    
    const mapWidth = mapContainerRef.current.offsetWidth;
    const mapHeight = mapContainerRef.current.offsetHeight;
    const scale = Math.pow(2, zoom - 1);
    
    // Calcular el rang basat en les dimensions reals del mapa
    const lngRange = 360 / (scale * mapWidth / mapWidth);
    const latRange = 180 / (scale * mapHeight / mapHeight);
    
    return {
      north: center.lat + latRange / 8,
      south: center.lat - latRange / 8,
      east: center.lng + lngRange / 8,
      west: center.lng - lngRange / 8
    };
  };

  const mapBounds = getMapBounds();
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.west},${mapBounds.south},${mapBounds.east},${mapBounds.north}&layer=mapnik`;

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className={`relative h-64 bg-gray-100 rounded-lg overflow-hidden border touch-none select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ userSelect: 'none', touchAction: 'none' }}
      >
        {/* Background Map */}
        <iframe
          key={mapKey}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0, pointerEvents: 'none' }}
          allowFullScreen
          loading="lazy"
          title={`Mapa de serveis - ${platjaName}`}
          className="absolute inset-0"
        />
        
        {/* Service Points Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {servicePoints.map((point) => {
            const pixelPos = latLngToPixel(point.lat, point.lng);
            
            // Only show points within visible area
            if (pixelPos.x < -10 || pixelPos.x > (mapContainerRef.current?.offsetWidth || 0) + 10 ||
                pixelPos.y < -10 || pixelPos.y > (mapContainerRef.current?.offsetHeight || 0) + 10) {
              return null;
            }

            return (
              <button
                key={point.id}
                className={`absolute w-4 h-4 ${point.color} rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer z-20 pointer-events-auto`}
                style={{
                  left: `${pixelPos.x}px`,
                  top: `${pixelPos.y}px`,
                }}
                onClick={() => handleServiceClick(point)}
                onPointerDown={(e) => e.stopPropagation()}
                title={point.tipus}
              />
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 z-30">
          <button
            onClick={handleZoomIn}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-1 shadow-sm transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleZoomOut}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-1 shadow-sm transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleReset}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-1 shadow-sm transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Drag indicator */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <Move className="w-3 h-3" />
          <span>Arrossega per moure</span>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Zoom: {zoom}
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

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Llegenda del mapa
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {serveis.serveis.map((servei, index) => {
            const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-gray-500'];
            const color = colors[index % colors.length];
            
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${color} rounded-full border border-white shadow-sm`} />
                <span className="text-gray-700">{servei.tipus === 'Xiringuito / mòdul bar' ? 'Guingueta / mòdul bar' : servei.tipus}</span>
                <span className="text-gray-500">({servei.geolocalitzacio.length})</span>
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