import React, { useState } from 'react';
import { Platja, PlatjaInfo } from '../types/platges';
import { getIconUrl, getStatusBadgeColor } from '../utils/iconMapping';
import { TransportLightbox } from './TransportLightbox';
import { transportData } from '../data/transportData';
import { MapPin, Clock, Ruler, Square, Navigation, Award, Dog, AlertTriangle, ExternalLink, X, Accessibility } from 'lucide-react';

interface PlatjaCardProps {
  platja: Platja | null;
  platjaInfo: PlatjaInfo;
}

export const PlatjaCard: React.FC<PlatjaCardProps> = ({ platja, platjaInfo }) => {
  const [banderaBlavaModalOpen, setBanderaBlavaModalOpen] = useState(false);
  const [platjaGossosModalOpen, setPlatjaGossosModalOpen] = useState(false);
  const [transportModalOpen, setTransportModalOpen] = useState(false);

  // Helper function to normalize boolean values
  const normalizeBooleanValue = (value: boolean | string): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return false;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSurface = (surface: number) => {
    if (surface >= 10000) {
      return `${(surface / 10000).toFixed(1)} ha`;
    }
    return `${surface.toLocaleString('ca-ES')} m²`;
  };

  const getBanderaColor = (bandera: string) => {
    switch (bandera.toLowerCase()) {
      case 'verda':
        return 'border-green-500 shadow-green-100';
      case 'groga':
        return 'border-yellow-500 shadow-yellow-100';
      case 'vermella':
        return 'border-red-500 shadow-red-100';
      default:
        return 'border-gray-300 shadow-gray-100';
    }
  };

  const getBanderaOverlay = (bandera: string) => {
    // Consistent intensity for all beaches
    switch (bandera.toLowerCase()) {
      case 'verda':
        return 'bg-green-500/30 group-hover:bg-green-500/40';
      case 'groga':
        return 'bg-yellow-500/30 group-hover:bg-yellow-500/40';
      case 'vermella':
        return 'bg-red-500/30 group-hover:bg-red-500/40';
      default:
        return 'bg-gray-300/30 group-hover:bg-gray-300/40';
    }
  };

  // Normalize boolean values for display
  const isDisponible = platja ? normalizeBooleanValue(platja.disponible) : false;
  const hasMeduses = platja ? normalizeBooleanValue(platja.meduses) : false;

  // Check if platja is closed (La Mora)
  const isTancada = platjaInfo.specialFeatures?.tancada || false;

  const handleCardClick = () => {
    // Open detailed page in new tab
    const detailUrl = `/platja/${platjaInfo.apiName.split('.')[1]}`;
    window.open(detailUrl, '_blank');
  };

  const handleDirectionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTransportModalOpen(true);
  };

  const handleBanderaBlavaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBanderaBlavaModalOpen(true);
  };

  const handlePlatjaGossosClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlatjaGossosModalOpen(true);
  };

  const closeBanderaBlavaModal = () => {
    setBanderaBlavaModalOpen(false);
  };

  const closePlatjaGossosModal = () => {
    setPlatjaGossosModalOpen(false);
  };

  const closeTransportModal = () => {
    setTransportModalOpen(false);
  };

  // Get Bandera Blava beaches for modal
  const banderaBlavaBeaches = [
    { name: "L'Estació", key: "l_estaci" },
    { name: "Coco", key: "coco" },
    { name: "Pont del Petroli", key: "pont_del_petroli" },
    { name: "Pescadors", key: "pescadors" },
    { name: "La Marina", key: "la_marina" }
  ];

  // Get transport info for this beach
  const transportInfo = transportData.find(t => t.platjaKey === platjaInfo.apiName.split('.')[1]);
  return (
    <>
      <div 
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
          isTancada 
            ? 'border-red-600 border-l-[6px] opacity-75' 
            : platja 
              ? getBanderaColor(platja.bandera) + ' border-l-[6px]' 
              : 'border-gray-300 border-l-[6px]'
        }`}
        onClick={handleCardClick}
        style={{
          borderTopLeftRadius: '1.25rem',
          borderBottomLeftRadius: '1.25rem'
        }}
      >
        {/* Image Header */}
        <div className="relative h-32 overflow-hidden rounded-t-2xl">
          <img 
            src={platjaInfo.image} 
            alt={platjaInfo.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Always visible overlay with bandera color, intensified on hover */}
          {platja && !isTancada && (
            <div className={`absolute inset-0 ${getBanderaOverlay(platja.bandera)} transition-all duration-300`}></div>
          )}
          
          {/* Closed overlay for La Mora */}
          {isTancada && (
            <div className="absolute inset-0 bg-red-600/30 group-hover:bg-red-600/40 transition-all duration-300"></div>
          )}
          
          <div className="absolute bottom-2 left-4 right-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{platjaInfo.name}</h3>
              <div className="flex items-center space-x-1">
                {/* Special Features Icons */}
                {platjaInfo.specialFeatures?.banderaBlava && (
                  <button
                    onClick={handleBanderaBlavaClick}
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-1 hover:bg-white/30 transition-colors" 
                    title="Bandera Blava"
                  >
                    <img 
                      src="https://platges.bdnmedia.cat/icons/bandera-blava.png" 
                      alt="Bandera Blava"
                      className="w-5 h-5 object-contain"
                    />
                  </button>
                )}
                {(platjaInfo.apiName.includes('pescadors') || platjaInfo.apiName.includes('pont_d_en_botifarreta')) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('/accessibilitat', '_blank');
                    }}
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-1 hover:bg-white/30 transition-colors" 
                    title="Servei d'accessibilitat"
                  >
                    <Accessibility className="w-4 h-4 text-white" />
                  </button>
                )}
                {platjaInfo.specialFeatures?.platjaGossos && (
                  <button
                    onClick={handlePlatjaGossosClick}
                    className="bg-amber-600 rounded-full p-1 hover:bg-amber-700 transition-colors" 
                    title="Zona per a gossos"
                  >
                    <Dog className="w-4 h-4 text-white" />
                  </button>
                )}
                {isTancada && (
                  <div className="bg-red-600 rounded-full p-1" title="Platja tancada">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Closed Notice for La Mora */}
          {isTancada && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-semibold text-sm">Platja tancada</p>
                  <p className="text-red-600 text-xs">Contaminació per metalls pesants</p>
                </div>
              </div>
            </div>
          )}

          {platja && !isTancada ? (
            <>
              {/* Main Status Icons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {/* Bandera */}
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <img 
                    src={getIconUrl('bandera', platja.bandera)} 
                    alt={`Bandera ${platja.bandera}`}
                    className="w-6 h-6 mx-auto mb-1"
                  />
                  <p className="text-xs text-gray-600">Bandera</p>
                </div>

                {/* Estat del mar */}
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <img 
                    src={getIconUrl('estat', platja.estat_aigua)} 
                    alt={`Estat ${platja.estat_aigua}`}
                    className="w-6 h-6 mx-auto mb-1"
                  />
                  <p className="text-xs text-gray-600">Mar</p>
                </div>

                {/* Aspecte aigua */}
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <img 
                    src={getIconUrl('aspecte', platja.aspecte_aigua)} 
                    alt={`Aspecte ${platja.aspecte_aigua}`}
                    className="w-6 h-6 mx-auto mb-1"
                  />
                  <p className="text-xs text-gray-600">Aigua</p>
                </div>

                {/* Meduses */}
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <img 
                    src={getIconUrl('meduses', hasMeduses)} 
                    alt={`Meduses ${hasMeduses ? 'sí' : 'no'}`}
                    className="w-6 h-6 mx-auto mb-1"
                  />
                  <p className="text-xs text-gray-600">Meduses</p>
                </div>
              </div>

              {/* Status Values */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
                <div className="text-center">
                  <p className="font-medium text-gray-900 capitalize">
                    {platja.bandera.toLowerCase()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 capitalize">
                    {platja.estat_aigua.toLowerCase()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 capitalize">
                    {platja.aspecte_aigua.toLowerCase()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{hasMeduses ? 'Sí' : 'No'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <span>Veure detalls</span>
                </button>
              </div>

              {/* Directions Button */}
              <div className="mb-4">
                <button
                  onClick={handleDirectionsClick}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Com arribar</span>
                </button>
              </div>

              {/* Last Updated */}
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>Actualitzat: {formatDate(platja.date_updated)}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-sm">Informació no disponible</p>
              <p className="text-gray-400 text-xs mt-1">Les dades d'aquesta platja no estan disponibles actualment</p>
              
              {/* View Details Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="mt-4 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mx-auto"
              >
                <span>Veure detalls</span>
              </button>

              {/* Directions button even when no data */}
              <button
                onClick={handleDirectionsClick}
                className="mt-2 flex items-center justify-center space-x-2 py-2 px-4 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium mx-auto"
              >
                <Navigation className="w-4 h-4" />
                <span>Com arribar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bandera Blava Modal */}
      {banderaBlavaModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeBanderaBlavaModal}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://platges.bdnmedia.cat/icons/bandera-blava.png" 
                  alt="Bandera Blava"
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-xl font-bold text-gray-900">Bandera Blava</h3>
              </div>
              <button
                onClick={closeBanderaBlavaModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                La Bandera Blava és un distintiu internacional que reconeix la qualitat ambiental i els bons serveis de les platges. És atorgada per l'ADEAC-FEE i garanteix que la platja compleix criteris exigents de qualitat de l'aigua, seguretat, serveis disponibles, informació i educació ambiental.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                A Badalona, aquest reconeixement s'ha concedit enguany a les platges de:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {banderaBlavaBeaches.map((beach) => (
                  <button
                    key={beach.key}
                    onClick={() => {
                      closeBanderaBlavaModal();
                      window.open(`/platja/${beach.key}`, '_blank');
                    }}
                    className="text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-700 font-medium"
                  >
                    {beach.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platja Gossos Modal */}
      {platjaGossosModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closePlatjaGossosModal}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Dog className="w-8 h-8 text-amber-600" />
                <h3 className="text-xl font-bold text-gray-900">Platja per a gossos</h3>
              </div>
              <button
                onClick={closePlatjaGossosModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                La platja per a gossos de Badalona estarà en funcionament durant tota la temporada de bany i s'ubicarà, com l'any passat, a la platja dels Patins de Vela, en el tram situat darrere de la Piscina Municipal – Mireia Belmonte.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Té una superfície aproximada de 900 metres quadrats, està delimitada amb tanques i com a novetat, aquest any s'ha instal·lat una font d'aigua per a gossos, donant resposta a les peticions ciutadanes rebudes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transport Modal */}
      {transportModalOpen && transportInfo && (
        <TransportLightbox
          isOpen={transportModalOpen}
          onClose={closeTransportModal}
          transportInfo={transportInfo}
        />
      )}
    </>
  );
};