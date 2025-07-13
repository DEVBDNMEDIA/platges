import React from 'react';
import { RefreshCw, ArrowUpDown, Search, Brain } from 'lucide-react';

interface ControlsProps {
  loading: boolean;
  sortOrder: 'sud-nord' | 'nord-sud';
  searchTerm: string;
  lastUpdated: Date | null;
  onRefresh: () => void;
  onSortChange: (order: 'sud-nord' | 'nord-sud') => void;
  onSearchChange: (term: string) => void;
  onOpenBeachFinder: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  loading, 
  sortOrder, 
  searchTerm,
  lastUpdated,
  onRefresh, 
  onSortChange,
  onSearchChange
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Update Controls - Now first */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm order-2 sm:order-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualitzar</span>
          </button>
          
          <div className="text-sm text-gray-600 order-1 sm:order-2">
            {lastUpdated && (
              <span>Última actualització: {lastUpdated.toLocaleString('ca-ES')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Search and Sort Controls - Now second */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full lg:w-auto">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Cercar platja..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-48"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-4">
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Ordenar:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => onSortChange('sud-nord')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      sortOrder === 'sud-nord'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sud → Nord
                  </button>
                  <button
                    onClick={() => onSortChange('nord-sud')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      sortOrder === 'nord-sud'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Nord → Sud
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};