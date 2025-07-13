import React from 'react';
import { X, Bus, Train, Navigation, Car, Clock, MapPin } from 'lucide-react';
import { TransportInfo } from '../data/transportData';

interface TransportLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  transportInfo: TransportInfo;
}

export const TransportLightbox: React.FC<TransportLightboxProps> = ({
  isOpen,
  onClose,
  transportInfo
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Navigation className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Com arribar a {transportInfo.platjaName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Occupation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportInfo.status && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Estat</h3>
                <p className="text-red-700">{transportInfo.status}</p>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Ocupació</h3>
              <p className="text-blue-700">{transportInfo.occupation}</p>
            </div>
            {transportInfo.beachType && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Tipus</h3>
                <p className="text-green-700">{transportInfo.beachType}</p>
              </div>
            )}
          </div>

          {/* Public Transport */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Bus className="w-5 h-5 mr-2 text-blue-600" />
              Transport públic
            </h3>
            
            <div className="space-y-4">
              {/* Bus */}
              {transportInfo.publicTransport.bus && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Bus className="w-4 h-4 mr-2 text-orange-600" />
                    Autobús
                  </h4>
                  <div className="space-y-2">
                    {transportInfo.publicTransport.bus.direct && (
                      <div>
                        <span className="text-sm font-medium text-green-700">Directe:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transportInfo.publicTransport.bus.direct.map((line) => (
                            <span key={line} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {transportInfo.publicTransport.bus.walking5min && (
                      <div>
                        <span className="text-sm font-medium text-blue-700">+5 min caminant:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transportInfo.publicTransport.bus.walking5min.map((line) => (
                            <span key={line} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {transportInfo.publicTransport.bus.walking8min && (
                      <div>
                        <span className="text-sm font-medium text-yellow-700">+8 min caminant:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transportInfo.publicTransport.bus.walking8min.map((line) => (
                            <span key={line} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {transportInfo.publicTransport.bus.walking10min && (
                      <div>
                        <span className="text-sm font-medium text-orange-700">+10 min caminant:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transportInfo.publicTransport.bus.walking10min.map((line) => (
                            <span key={line} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metro */}
              {transportInfo.publicTransport.metro && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="w-4 h-4 mr-2 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    Metro
                  </h4>
                  <div className="space-y-2">
                    {transportInfo.publicTransport.metro.map((metro, index) => (
                      <div key={index} className="flex items-center justify-between bg-red-50 rounded-lg p-3">
                        <div>
                          <span className="font-medium text-red-800">{metro.line}</span>
                          <span className="text-gray-600 ml-2">({metro.station})</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {metro.walkingTime} caminant
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Train */}
              {transportInfo.publicTransport.train && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Train className="w-4 h-4 mr-2 text-purple-600" />
                    Rodalies
                  </h4>
                  <div className="space-y-2">
                    {transportInfo.publicTransport.train.map((train, index) => (
                      <div key={index} className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-800">Estació {train.station}</span>
                          {train.walkingTime && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              {train.walkingTime} caminant
                            </div>
                          )}
                        </div>
                        {train.notes && (
                          <p className="text-sm text-purple-600 mt-1">{train.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tram */}
              {transportInfo.publicTransport.tram && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="w-4 h-4 mr-2 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    Tram
                  </h4>
                  <div className="space-y-2">
                    {transportInfo.publicTransport.tram.map((tram, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-800">Estació {tram.station}</span>
                          {tram.walkingTime && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              {tram.walkingTime} caminant
                            </div>
                          )}
                        </div>
                        {tram.notes && (
                          <p className="text-sm text-green-600 mt-1">{tram.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Private Transport */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-blue-600" />
              Transport privat
            </h3>
            
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Aparcament
              </h4>
              <p className="text-gray-700 leading-relaxed">{transportInfo.privateTransport.parking}</p>
              {transportInfo.privateTransport.notes && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">{transportInfo.privateTransport.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};