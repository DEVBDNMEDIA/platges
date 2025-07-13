import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink, Cloud, Newspaper } from 'lucide-react';
import { platgesInfo } from '../data/platgesInfo';

export const MainNavigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [platgesMenuOpen, setPlatgesMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title - Both clickable */}
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <img 
              src="https://platges.bdnmedia.cat/icons/BDN%20MEDIA%20VERTICAL%20PLATGES.png" 
              alt="Platges de Badalona"
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Platges de Badalona</h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Inici
            </Link>
            
            {/* Beaches Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPlatgesMenuOpen(!platgesMenuOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <span>Platges</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${platgesMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border py-2 z-50 transition-all duration-200 origin-top ${
                platgesMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}>
                <div className="max-h-80 overflow-y-auto">
                  {platgesInfo.map((beach) => (
                    <Link
                      key={beach.apiName}
                      to={`/platja/${beach.apiName.split('.')[1]}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setPlatgesMenuOpen(false)}
                    >
                      {beach.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link 
              to="/accessibilitat"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Accessibilitat
            </Link>

            {/* External Links */}
            <a 
              href="https://meteo.bdnmedia.cat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <Cloud className="w-4 h-4" />
              <span>Meteo</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a 
              href="https://bdnmedia.cat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <Newspaper className="w-4 h-4" />
              <span>Notícies</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 z-50 relative"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Slide from right */}
        <div className={`md:hidden fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="pt-20 pb-6 px-6 h-full overflow-y-auto">
            <div className="space-y-4">
              <Link 
                to="/"
                className="block py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Inici
              </Link>
              
              <div className="py-3 border-b border-gray-100">
                <button
                  onClick={() => setPlatgesMenuOpen(!platgesMenuOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  <span>Platges</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${platgesMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  platgesMenuOpen ? 'max-h-96 mt-3' : 'max-h-0'
                }`}>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {platgesInfo.map((beach) => (
                      <Link
                        key={beach.apiName}
                        to={`/platja/${beach.apiName.split('.')[1]}`}
                        className="block py-2 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                        onClick={() => {
                          setMenuOpen(false);
                          setPlatgesMenuOpen(false);
                        }}
                      >
                        {beach.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link 
                to="/accessibilitat"
                className="block py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Accessibilitat
              </Link>

              {/* External Links Mobile */}
              <a 
                href="https://meteo.bdnmedia.cat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-3 text-gray-600 hover:text-blue-600 transition-colors font-medium border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                <Cloud className="w-4 h-4" />
                <span>Meteo</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a 
                href="https://bdnmedia.cat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-3 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <Newspaper className="w-4 h-4" />
                <span>Notícies</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {menuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};