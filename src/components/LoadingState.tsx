import React from 'react';
import { Waves } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <Waves className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-pulse" />
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregant platges de Badalona</h2>
        <p className="text-gray-600">Obtenint l'estat actual de les nostres platges...</p>
      </div>
    </div>
  );
};