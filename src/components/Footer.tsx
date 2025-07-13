import React from 'react';
import { ExternalLink, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre les Platges de Badalona</h3>
            <p className="text-gray-300 leading-relaxed">
              Posar-se unes ulleres i capbussar-se és una manera diferent de gaudir del litoral de Badalona: 
              ben a prop de la platja, a molt poca fondària, ja es pot observar una gran diversitat d'organismes marins.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enllaços d'interès</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.amb.cat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Àrea Metropolitana de Barcelona
                </a>
              </li>
              <li>
                <a 
                  href="https://www.badalona.cat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ajuntament de Badalona
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Informació</h3>
            <div className="flex items-start space-x-2 text-gray-300">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm leading-relaxed">
                  Les dades es proporcionen per l'Àrea Metropolitana de Barcelona i s'actualitzen periòdicament. 
                  Els estats es mostren només per platges disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Platges de Badalona. Dades proporcionades per l'AMB.</p>
        </div>
      </div>
    </footer>
  );
};