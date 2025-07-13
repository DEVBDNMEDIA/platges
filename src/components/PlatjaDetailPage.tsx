import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Platja, PlatjaInfo, ServeisResponse, PlatjaServei } from '../types/platges';
import { platgesInfo } from '../data/platgesInfo';
import { getIconUrl, getStatusBadgeColor } from '../utils/iconMapping';
import { MetaTags } from './MetaTags';
import { Lightbox } from './Lightbox';
import { ServicesMap } from './ServicesMap';
import { TransportLightbox } from './TransportLightbox';
import { transportData } from '../data/transportData';
import { Footer } from './Footer';
import { WeatherWidget } from './WeatherWidget';
import { MainNavigation } from './MainNavigation';
import { AvisosWidget } from './AvisosWidget';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Ruler, 
  Square, 
  Navigation,
  Award,
  Dog,
  AlertTriangle,
  Waves,
  RefreshCw,
  ArrowRight,
  Accessibility
} from 'lucide-react';

export const PlatjaDetailPage: React.FC = () => {
  const { platjaKey } = useParams<{ platjaKey: string }>();
  const [platja, setPlatja] = useState<Platja | null>(null);
  const [serveis, setServeis] = useState<PlatjaServei | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [banderaBlavaModalOpen, setBanderaBlavaModalOpen] = useState(false);
  const [platjaGossosModalOpen, setPlatjaGossosModalOpen] = useState(false);
  const [transportModalOpen, setTransportModalOpen] = useState(false);

  // Find platja info
  const platjaInfo = platgesInfo.find(p => p.apiName.split('.')[1] === platjaKey);

  // Helper function to normalize boolean values
  const normalizeBooleanValue = (value: boolean | string): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return false;
  };

  // Helper function to adjust date for format 2 (add 2 hours)
  const adjustDateForFormat = (dateString: string, isFormat2: boolean): string => {
    if (!isFormat2) return dateString;
    
    // Format 2: "2025-06-24 00:15:25" - add 2 hours
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date.toISOString();
  };

  const fetchPlatjaData = async () => {
    if (!platjaInfo) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch platja status
      const platjaResponse = await fetch(
        `https://platges.bdnmedia.cat/api.php?t=estat&q=${platjaInfo.apiName}`
      );

      if (platjaResponse.ok) {
        const platjaData = await platjaResponse.json();
        let rawPlatjaData = null;
        let isFormat2 = false;
        
        if (platjaData.items && Array.isArray(platjaData.items) && platjaData.items.length > 0) {
          rawPlatjaData = platjaData.items[0];
          isFormat2 = !rawPlatjaData.date_updated.includes('T') && !rawPlatjaData.date_updated.includes('Z');
        }

        if (rawPlatjaData) {
          // Adjust date if needed and normalize the data
          const adjustedData = {
            ...rawPlatjaData,
            date_updated: isFormat2 ? (() => {
              const date = new Date(rawPlatjaData.date_updated);
              date.setHours(date.getHours() + 2);
              return date.toISOString();
            })() : rawPlatjaData.date_updated
          };

          setPlatja({
            ...adjustedData,
            meduses: normalizeBooleanValue(adjustedData.meduses),
            disponible: normalizeBooleanValue(adjustedData.disponible)
          });
        }
      }

      // Fetch serveis - Skip for La Mora
      if (platjaKey === 'mora') {
        // For La Mora, use La Marina services as specified
        const serveisResponse = await fetch(
          'https://platges.bdnmedia.cat/api.php?t=serveis&q=badalona'
        );

        if (serveisResponse.ok) {
          const serveisData: ServeisResponse = await serveisResponse.json();
          const marinaServeis = serveisData.items.find(s => 
            s.platja_key === 'la_marina' || s.platja.toLowerCase().includes('marina')
          );
          setServeis(marinaServeis || null);
        }
      } else {
        const serveisResponse = await fetch(
          'https://platges.bdnmedia.cat/api.php?t=serveis&q=badalona'
        );

        if (serveisResponse.ok) {
          const serveisData: ServeisResponse = await serveisResponse.json();
          let platjaServeis = serveisData.items.find(s => 
            s.platja_key === platjaKey || s.platja.toLowerCase().includes(platjaInfo.name.toLowerCase())
          );

          // Special handling for Barca Maria - remove dutxes service
          if (platjaKey === 'barca_maria' && platjaServeis) {
            platjaServeis = {
              ...platjaServeis,
              serveis: platjaServeis.serveis.filter(s => s.tipus_key !== 'dutxa')
            };
          }

          setServeis(platjaServeis || null);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatjaData();
  }, [platjaKey]);

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

  const getBanderaOverlay = (bandera: string) => {
    // Consistent intensity for all beaches
    switch (bandera.toLowerCase()) {
      case 'verda':
        return 'bg-green-500/30 hover:bg-green-500/40';
      case 'groga':
        return 'bg-yellow-500/30 hover:bg-yellow-500/40';
      case 'vermella':
        return 'bg-red-500/30 hover:bg-red-500/40';
      default:
        return 'bg-gray-300/30 hover:bg-gray-300/40';
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    if (platjaInfo?.secondaryImages) {
      setLightboxIndex((prev) => (prev + 1) % platjaInfo.secondaryImages!.length);
    }
  };

  const previousImage = () => {
    if (platjaInfo?.secondaryImages) {
      setLightboxIndex((prev) => (prev - 1 + platjaInfo.secondaryImages!.length) % platjaInfo.secondaryImages!.length);
    }
  };

  // Get nearby beaches for call to action
  const getNearbyBeaches = () => {
    if (!platjaInfo) return [];
    
    const currentOrder = platjaInfo.order;
    const nearby = [];
    
    // Get previous beach
    const previous = platgesInfo.find(p => p.order === currentOrder - 1);
    if (previous) nearby.push({ ...previous, direction: 'previous' });
    
    // Get next beach
    const next = platgesInfo.find(p => p.order === currentOrder + 1);
    if (next) nearby.push({ ...next, direction: 'next' });
    
    return nearby;
  };

  const nearbyBeaches = getNearbyBeaches();

  // Get transport info for this beach
  const transportInfo = transportData.find(t => t.platjaKey === platjaKey);

  // Get Bandera Blava beaches for modal
  const banderaBlavaBeaches = [
    { name: "L'Estació", key: "l_estaci" },
    { name: "Coco", key: "coco" },
    { name: "Pont del Petroli", key: "pont_del_petroli" },
    { name: "Pescadors", key: "pescadors" },
    { name: "La Marina", key: "la_marina" }
  ];

  const handleBanderaBlavaClick = () => {
    setBanderaBlavaModalOpen(true);
  };

  const handlePlatjaGossosClick = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <Waves className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregant informació de la platja</h2>
          <p className="text-gray-600">Obtenint les dades més recents...</p>
        </div>
      </div>
    );
  }

  if (!platjaInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Platja no trobada</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Tornar a l'inici
          </Link>
        </div>
      </div>
    );
  }

  const isDisponible = platja ? normalizeBooleanValue(platja.disponible) : false;
  const hasMeduses = platja ? normalizeBooleanValue(platja.meduses) : false;
  const isTancada = platjaInfo.specialFeatures?.tancada || false;

  // Meta tags for this specific beach
  const metaTitle = `${platjaInfo.name} - Platges de Badalona`;
  const metaDescription = `Consulta l'estat actual de la platja ${platjaInfo.name} a Badalona. ${platjaInfo.description}`;
  const metaUrl = `https://platges.bdnmedia.cat/platja/${platjaKey}`;

  return (
    <>
      <MetaTags 
        title={metaTitle}
        description={metaDescription}
        image={platjaInfo.image}
        url={metaUrl}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Navigation Header */}
        <MainNavigation />

        {/* Header with background image */}
        <header className="relative h-96 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={platjaInfo.image} 
              alt={platjaInfo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            {/* Bandera color overlay with gradient for Bandera Blava */}
            {platja && !isTancada && (
              <div className={`absolute inset-0 ${getBanderaOverlay(platja.bandera)} transition-all duration-300`}></div>
            )}
            {isTancada && (
              <div className="absolute inset-0 bg-red-600/30 transition-all duration-300"></div>
            )}
          </div>

          {/* Header content */}
          <div className="relative z-10 h-full flex flex-col justify-between text-white p-6">
            {/* Back button */}
            <div>
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-lg px-4 py-2 hover:bg-black/40 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Tornar</span>
              </Link>
            </div>

            {/* Title and features */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">{platjaInfo.name}</h1>
                <div className="flex items-center space-x-2">
                  {(platjaInfo.apiName.includes('pescadors') || platjaInfo.apiName.includes('pont_d_en_botifarreta')) && (
                    <Link
                      to="/accessibilitat"
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-2 hover:bg-white/30 transition-colors" 
                      title="Servei d'accessibilitat"
                    >
                      <Accessibility className="w-6 h-6 text-white" />
                    </Link>
                  )}
                  {platjaInfo.specialFeatures?.banderaBlava && (
                    <button
                      onClick={handleBanderaBlavaClick}
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-2 hover:bg-white/30 transition-colors" 
                      title="Bandera Blava"
                    >
                      <img 
                        src="https://platges.bdnmedia.cat/icons/bandera-blava.png" 
                        alt="Bandera Blava"
                        className="w-8 h-8 object-contain"
                      />
                    </button>
                  )}
                  {platjaInfo.specialFeatures?.platjaGossos && (
                    <button
                      onClick={handlePlatjaGossosClick}
                      className="bg-amber-600 rounded-full p-2 hover:bg-amber-700 transition-colors" 
                      title="Zona per a gossos"
                    >
                      <Dog className="w-6 h-6 text-white" />
                    </button>
                  )}
                  {isTancada && (
                    <div className="bg-red-600 rounded-full p-2" title="Platja tancada">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {platja && (
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(platja.bandera)} bg-opacity-90`}>
                    Bandera {platja.bandera.charAt(0).toUpperCase() + platja.bandera.slice(1).toLowerCase()}
                  </span>
                  {(!isDisponible || isTancada) && (
                    <span className="bg-red-500 text-white text-sm font-medium px-3 py-2 rounded-full">
                      {isTancada ? 'Tancada' : 'No disponible'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Main info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Beach-specific warnings */}
              <AvisosWidget platjaApiName={platjaKey} />
              
              {/* Status cards */}
              {platja && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Estat actual</h2>
                    <button
                      onClick={fetchPlatjaData}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      <span>Actualitzar</span>
                    </button>
                  </div>

                  {/* Status grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={getIconUrl('bandera', platja.bandera)} 
                        alt={`Bandera ${platja.bandera}`}
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600 mb-1">Bandera</p>
                      <p className="font-semibold text-gray-900 capitalize">{platja.bandera.toLowerCase()}</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={getIconUrl('estat', platja.estat_aigua)} 
                        alt={`Estat ${platja.estat_aigua}`}
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600 mb-1">Estat del mar</p>
                      <p className="font-semibold text-gray-900 capitalize">{platja.estat_aigua.toLowerCase()}</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={getIconUrl('aspecte', platja.aspecte_aigua)} 
                        alt={`Aspecte ${platja.aspecte_aigua}`}
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600 mb-1">Qualitat aigua</p>
                      <p className="font-semibold text-gray-900 capitalize">{platja.aspecte_aigua.toLowerCase()}</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={getIconUrl('meduses', hasMeduses)} 
                        alt={`Meduses ${hasMeduses ? 'sí' : 'no'}`}
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600 mb-1">Meduses</p>
                      <p className="font-semibold text-gray-900">{hasMeduses ? 'Sí' : 'No'}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Última actualització: {formatDate(platja.date_updated)}</span>
                  </div>
                </div>
              )}

              {/* Weather Widget */}
              <WeatherWidget platjaName={platjaInfo.name} />

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Descripció</h2>
                <p className="text-gray-600 leading-relaxed">{platjaInfo.description}</p>
                
                {isTancada && platjaInfo.specialFeatures?.tancadaReason && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-red-800 mb-2">Motiu del tancament</h3>
                        <p className="text-red-700 text-sm leading-relaxed">{platjaInfo.specialFeatures.tancadaReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bandera Blava explanation */}
                {platjaInfo.specialFeatures?.banderaBlava && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <img 
                        src="https://platges.bdnmedia.cat/icons/bandera-blava.png" 
                        alt="Bandera Blava"
                        className="w-6 h-6 object-contain mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Bandera Blava</h3>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          Aquesta platja té el distintiu de Bandera Blava, que reconeix la qualitat ambiental i els bons serveis. 
                          És atorgada per l'ADEAC-FEE i garanteix que la platja compleix criteris exigents de qualitat de l'aigua, 
                          seguretat, serveis disponibles, informació i educació ambiental.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Platja Gossos explanation */}
                {platjaInfo.specialFeatures?.platjaGossos && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Dog className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-800 mb-2">Platja per a gossos</h3>
                        <p className="text-amber-700 text-sm leading-relaxed">
                          La platja per a gossos de Badalona estarà en funcionament durant tota la temporada de bany i s'ubicarà, 
                          com l'any passat, a la platja dels Patins de Vela, en el tram situat darrere de la Piscina Municipal – Mireia Belmonte. 
                          Té una superfície aproximada de 900 metres quadrats, està delimitada amb tanques i com a novetat, 
                          aquest any s'ha instal·lat una font d'aigua per a gossos, donant resposta a les peticions ciutadanes rebudes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Services Map */}
              {serveis && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Mapa de serveis</h2>
                  <ServicesMap serveis={serveis} platjaName={platjaInfo.name} />
                </div>
              )}

              {/* Secondary images */}
              {platjaInfo.secondaryImages && platjaInfo.secondaryImages.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Galeria d'imatges</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {platjaInfo.secondaryImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(index)}
                      >
                        <img 
                          src={image} 
                          alt={`${platjaInfo.name} - Imatge ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Beaches Call to Action */}
              {nearbyBeaches.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Platges properes</h2>
                  <div className="space-y-4">
                    {nearbyBeaches.map((beach) => (
                      <Link
                        key={beach.apiName}
                        to={`/platja/${beach.apiName.split('.')[1]}`}
                        className="group block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className={`flex items-center space-x-4 ${beach.direction === 'previous' ? 'flex-row' : 'flex-row-reverse'}`}>
                          {beach.direction === 'previous' ? (
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                          )}
                          <img 
                            src={beach.image} 
                            alt={beach.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className={`flex-1 ${beach.direction === 'next' ? 'text-right' : ''}`}>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {beach.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {beach.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Sidebar */}
            <div className="space-y-6">
              {/* Quick actions */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Accions ràpides</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.open(platjaInfo.googleMapsUrl, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Ubicació al mapa</span>
                  </button>
                  {transportInfo && (
                    <button
                      onClick={() => setTransportModalOpen(true)}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Navigation className="w-5 h-5" />
                      <span>Com arribar</span>
                    </button>
                  )}
                  </button>
                </div>
              </div>

              {/* Beach measurements */}
              {(platjaInfo.length > 0 || platjaInfo.surface > 0) && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Mesures</h3>
                  <div className="space-y-4">
                    {platjaInfo.length > 0 && (
                      <div className="flex items-center space-x-3">
                        <Ruler className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Longitud</p>
                          <p className="font-semibold text-gray-900">{platjaInfo.length} metres</p>
                        </div>
                      </div>
                    )}
                    {platjaInfo.surface > 0 && (
                      <div className="flex items-center space-x-3">
                        <Square className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Superfície</p>
                          <p className="font-semibold text-gray-900">{formatSurface(platjaInfo.surface)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special features */}
              {(platjaInfo.specialFeatures?.banderaBlava || platjaInfo.specialFeatures?.platjaGossos || isTancada) && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Característiques especials</h3>
                  <div className="space-y-3">
                    {(platjaInfo.apiName.includes('pescadors') || platjaInfo.apiName.includes('pont_d_en_botifarreta')) && (
                      <Link 
                        to="/accessibilitat"
                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <Accessibility className="w-5 h-5 text-blue-600" />
                        <span>Servei d'accessibilitat</span>
                      </Link>
                    )}
                    {platjaInfo.specialFeatures?.banderaBlava && (
                      <div className="flex items-center space-x-3">
                        <img 
                          src="https://platges.bdnmedia.cat/icons/bandera-blava.png" 
                          alt="Bandera Blava"
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-gray-700">Bandera Blava</span>
                      </div>
                    )}
                    {platjaInfo.specialFeatures?.platjaGossos && (
                      <div className="flex items-center space-x-3">
                        <Dog className="w-5 h-5 text-amber-600" />
                        <span className="text-gray-700">Zona per a gossos</span>
                      </div>
                    )}
                    {isTancada && (
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700">Platja tancada</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Services */}
              {serveis && serveis.serveis.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Serveis disponibles</h3>
                  <div className="space-y-2">
                    {serveis.serveis.map((servei, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          {servei.tipus === 'Xiringuito / mòdul bar' ? 'Guingueta / mòdul bar' : servei.tipus}
                        </span>
                        <span className="text-gray-500">({servei.geolocalitzacio.length})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Lightbox */}
        {platjaInfo.secondaryImages && (
          <Lightbox
            images={platjaInfo.secondaryImages}
            currentIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrevious={previousImage}
            platjaName={platjaInfo.name}
          />
        )}

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
      </div>

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