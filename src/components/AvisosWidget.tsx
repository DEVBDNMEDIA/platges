import React, { useState, useEffect } from 'react';
import { Avis, AvisosResponse } from '../types/platges';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

interface AvisosWidgetProps {
  platjaApiName?: string; // Optional - if provided, shows warnings for specific beach
  showGlobal?: boolean; // If true, shows global warnings
}

export const AvisosWidget: React.FC<AvisosWidgetProps> = ({ platjaApiName, showGlobal = false }) => {
  const [avisos, setAvisos] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvisos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://platges.bdnmedia.cat/api.php?t=avisos');
      
      if (!response.ok) {
        throw new Error('Error al carregar els avisos');
      }
      
      const data: AvisosResponse = await response.json();
      setAvisos(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, []);

  const getRelevantAvisos = (): Avis[] => {
    if (!avisos.length) return [];

    return avisos.filter(avis => {
      // Global warnings (for main page)
      if (showGlobal) {
        return avis.platges_afectades.includes('totes');
      }
      
      // Specific beach warnings (for detail pages)
      if (platjaApiName) {
        return avis.platges_afectades.includes('totes') || 
               avis.platges_afectades.some(platja => platja.includes(platjaApiName));
      }
      
      return false;
    });
  };

  const getAvisIcon = (nivell: string) => {
    switch (nivell) {
      case 'perill':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'precaucio':
        return <AlertCircle className="w-6 h-6 text-orange-600" />;
      case 'informatiu':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  const getAvisColor = (nivell: string) => {
    switch (nivell) {
      case 'perill':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'precaucio':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'informatiu':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    // Crear la data i afegir 2 hores per UTC+2
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date.toLocaleString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const relevantAvisos = getRelevantAvisos();

  if (loading || error || !relevantAvisos.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {relevantAvisos.map((avis) => (
        <div
          key={avis.id}
          className={`rounded-xl border p-6 ${getAvisColor(avis.nivell)}`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getAvisIcon(avis.nivell)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">{avis.titol}</h3>
              <div className="prose prose-sm max-w-none">
                {avis.contingut.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-4 text-sm opacity-75">
                <p>Actualitzat: {formatDate(avis.date_updated)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};