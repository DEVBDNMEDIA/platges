import React, { useState, useEffect } from 'react';
import { PlatgesResponse, Platja } from '../types/platges';
import { PlatjaCard } from './PlatjaCard';
import { formatMunicipi } from '../utils/iconMapping';
import { RefreshCw, AlertCircle, Waves, Filter } from 'lucide-react';

export const PlatgesWidget: React.FC = () => {
  const [platges, setPlatges] = useState<Platja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMunicipi, setSelectedMunicipi] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPlatges = async (municipi: string = 'Badalona') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://platges.bdnmedia.cat/api.php?t=estat&q=${municipi}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: PlatgesResponse = await response.json();
      setPlatges(data.items || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
      console.error('Error fetching platges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatges(selectedMunicipi || 'Badalona');
  }, [selectedMunicipi]);

  const municipis = ['Badalona', 'Barcelona', 'Castelldefels', 'Gavà', 'El Prat de Llobregat', 'Montgat', 'Sant Adrià de Besòs', 'Viladecans'];

  const handleRefresh = () => {
    fetchPlatges(selectedMunicipi || 'Badalona');
  };

  const filteredPlatges = platges.filter(platja => platja.disponible);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700 font-medium">Carregant informació de platges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Waves className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Platges AMB</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estat actual de les platges de l'Àrea Metropolitana de Barcelona
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Última actualització: {lastUpdated.toLocaleString('ca-ES')}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedMunicipi}
              onChange={(e) => setSelectedMunicipi(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              {municipis.map(municipi => (
                <option key={municipi} value={municipi}>
                  {formatMunicipi(municipi)}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualitzar</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Error al carregar les dades</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Platges Grid */}
        {filteredPlatges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlatges.map((platja) => (
              <PlatjaCard key={platja._id} platja={platja} />
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12">
            <Waves className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No hi ha platges disponibles
            </h3>
            <p className="text-gray-500">
              Prova seleccionant un altre municipi o actualitzant les dades.
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Dades proporcionades per l'Àrea Metropolitana de Barcelona</p>
          <p className="mt-1">Els estats es mostren només per platges disponibles</p>
        </div>
      </div>
    </div>
  );
};