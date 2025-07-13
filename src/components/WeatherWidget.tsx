import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Waves, Thermometer, Sun, ChevronDown, RefreshCw, ExternalLink } from 'lucide-react';

interface WeatherData {
  estadoCielo: {
    descripcion1: string;
    descripcion2: string;
  };
  viento: {
    descripcion1: string;
    descripcion2: string;
  };
  oleaje: {
    descripcion1: string;
    descripcion2: string;
  };
  tmaxima: {
    valor1: number;
  };
  stermica: {
    descripcion1: string;
  };
  tagua: {
    valor1: number;
  };
  uvMax: {
    valor1: number;
  };
  fecha: number;
}

interface WeatherWidgetProps {
  platjaName: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ platjaName }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Translation mappings from Spanish to Catalan
  const translateWeatherTerm = (term: string): string => {
    const translations: { [key: string]: string } = {
      // Estado del cielo
      'despejado': 'serè',
      'poco nuboso': 'poc ennuvolat',
      'nuboso': 'ennuvolat',
      'muy nuboso': 'molt ennuvolat',
      'cubierto': 'cobert',
      'muy nuboso con lluvia': 'molt ennuvolat amb pluja',
      'chubascos': 'xàfecs',
      'lluvia': 'pluja',
      'tormenta': 'tempesta',
      'niebla': 'boira',
      
      // Viento
      'calma': 'calma',
      'flojo': 'fluix',
      'moderado': 'moderat',
      'fuerte': 'fort',
      'muy fuerte': 'molt fort',
      
      // Oleaje
      'débil': 'feble',
      'moderado': 'moderat',
      'fuerte': 'fort',
      'muy fuerte': 'molt fort',
      
      // Sensación térmica
      'frío': 'fred',
      'fresco': 'fresc',
      'agradable': 'agradable',
      'calor agradable': 'calor agradable',
      'calor moderado': 'calor moderat',
      'calor': 'calor',
      'calor intenso': 'calor intens',
      'muy caluroso': 'molt calorós'
    };
    
    return translations[term.toLowerCase()] || term;
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://meteo.bdnmedia.cat/aemet.php?endpoint=prediccion/especifica/playa/0801502');
      
      if (!response.ok) {
        throw new Error('Error al carregar les dades meteorològiques');
      }
      
      const data = await response.json();
      
      if (data && data[0] && data[0].prediccion && data[0].prediccion.dia) {
        // Get today's date in YYYYMMDD format
        const today = new Date();
        const todayFormatted = parseInt(
          today.getFullYear().toString() + 
          (today.getMonth() + 1).toString().padStart(2, '0') + 
          today.getDate().toString().padStart(2, '0')
        );
        
        // Find today's weather data
        const todayWeather = data[0].prediccion.dia.find((day: any) => day.fecha === todayFormatted);
        
        if (todayWeather) {
          setWeatherData(todayWeather);
        } else {
          // If today's data is not available, use the first available day
          setWeatherData(data[0].prediccion.dia[0]);
        }
      } else {
        throw new Error('Format de dades incorrecte');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && !weatherData) {
      fetchWeatherData();
    }
  }, [isExpanded]);

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('despejado') || lowerCondition.includes('serè')) {
      return <Sun className="w-5 h-5 text-yellow-500" />;
    } else if (lowerCondition.includes('nuboso') || lowerCondition.includes('ennuvolat')) {
      return <Cloud className="w-5 h-5 text-gray-500" />;
    } else if (lowerCondition.includes('lluvia') || lowerCondition.includes('pluja') || lowerCondition.includes('chubascos') || lowerCondition.includes('xàfecs')) {
      return <Cloud className="w-5 h-5 text-blue-500" />;
    }
    return <Cloud className="w-5 h-5 text-gray-500" />;
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Baix', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: 'Moderat', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: 'Alt', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: 'Molt alt', color: 'text-red-600' };
    return { level: 'Extrem', color: 'text-purple-600' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Cloud className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Meteo</h2>
        </div>
        <div className="flex items-center space-x-2">
          {loading && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="px-6 pb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchWeatherData}
                className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Tornar a intentar
              </button>
            </div>
          )}

          {weatherData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Estat del cel */}
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  {getWeatherIcon(weatherData.estadoCielo.descripcion1)}
                  <p className="text-xs text-gray-600 mt-1">Cel</p>
                  <p className="font-semibold text-gray-900 text-sm capitalize">
                    {translateWeatherTerm(weatherData.estadoCielo.descripcion1)}
                  </p>
                </div>

                {/* Vent */}
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Wind className="w-5 h-5 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-600 mt-1">Vent</p>
                  <p className="font-semibold text-gray-900 text-sm capitalize">
                    {translateWeatherTerm(weatherData.viento.descripcion1)}
                  </p>
                </div>

                {/* Onatge */}
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Waves className="w-5 h-5 text-blue-500 mx-auto" />
                  <p className="text-xs text-gray-600 mt-1">Onatge</p>
                  <p className="font-semibold text-gray-900 text-sm capitalize">
                    {translateWeatherTerm(weatherData.oleaje.descripcion1)}
                  </p>
                </div>

                {/* Temperatura màxima */}
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Thermometer className="w-5 h-5 text-red-500 mx-auto" />
                  <p className="text-xs text-gray-600 mt-1">Temp. màx.</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {weatherData.tmaxima.valor1}°C
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sensació tèrmica */}
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Sensació tèrmica</p>
                  <p className="font-semibold text-blue-900 capitalize">
                    {translateWeatherTerm(weatherData.stermica.descripcion1)}
                  </p>
                </div>

                {/* Temperatura de l'aigua */}
                <div className="text-center p-3 bg-cyan-50 rounded-lg">
                  <p className="text-sm text-cyan-600 font-medium">Temp. aigua</p>
                  <p className="font-semibold text-cyan-900">
                    {weatherData.tagua.valor1}°C
                  </p>
                </div>

                {/* Índex UV */}
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Índex UV</p>
                  <p className={`font-semibold ${getUVLevel(weatherData.uvMax.valor1).color}`}>
                    {weatherData.uvMax.valor1} - {getUVLevel(weatherData.uvMax.valor1).level}
                  </p>
                </div>
              </div>

              {/* Botó per anar a meteo.bdnmedia.cat */}
              <div className="text-center pt-4 border-t border-gray-200">
                <a
                  href="https://meteo.bdnmedia.cat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Més detalls meteorològics</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Dades proporcionades per AEMET
                </p>
              </div>
            </div>
          )}

          {loading && !weatherData && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Carregant dades meteorològiques...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};