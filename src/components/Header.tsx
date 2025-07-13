import React from 'react';
import { Waves, ChevronDown, Clock } from 'lucide-react';
import { Platja } from '../types/platges';

interface HeaderProps {
  lastUpdated: Date | null;
  platges: Platja[];
}

export const Header: React.FC<HeaderProps> = ({ platges }) => {
  const scrollToPlatges = () => {
    const platgesSection = document.getElementById('platges-section');
    if (platgesSection) {
      platgesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper function to normalize boolean values for filtering
  const isDisponible = (platja: Platja): boolean => {
    if (typeof platja.disponible === 'boolean') return platja.disponible;
    if (typeof platja.disponible === 'string') {
      return platja.disponible.toLowerCase() === 'true';
    }
    return false;
  };

  const getBanderaCount = (bandera: string) => {
    return platges.filter(p => isDisponible(p) && p.bandera.toLowerCase() === bandera.toLowerCase()).length;
  };

  const isLifeguardServiceActive = () => {
    const now = new Date();
    const hour = now.getHours();
    // Service active from 10:00 to 19:00 (10 AM to 7 PM)
    return hour >= 10 && hour < 19;
  };

  const totalPlatges = 10;
  const verdesCount = getBanderaCount('verda');
  const groguesCount = getBanderaCount('groga');
  const vermellesCount = getBanderaCount('vermella');
  const desconegudesCount = totalPlatges - (verdesCount + groguesCount + vermellesCount);

  const banderaStats = [
    { name: 'Verda', color: 'bg-green-500', count: verdesCount },
    { name: 'Groga', color: 'bg-yellow-500', count: groguesCount },
    { name: 'Vermella', color: 'bg-red-500', count: vermellesCount },
    { name: 'Desconegut', color: 'bg-gray-300', count: desconegudesCount }
  ];

  return (
    <header className="relative h-[75vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://platges.bdnmedia.cat/fotos/portada.webp" 
          alt="Platges de Badalona"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title - Much larger and responsive */}
          <div className="flex items-center justify-center mb-4">
            <Waves className="w-8 h-8 sm:w-12 md:w-16 lg:w-20 mr-3 sm:mr-4 md:mr-6" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold whitespace-nowrap">
              Platges de Badalona
            </h1>
          </div>

          {/* Subtitle - Smaller */}
          <p className="text-xs sm:text-sm md:text-base text-blue-100 mb-8">
            El litoral de Badalona s'estén al llarg de gairebé 5 quilòmetres, dels quals 3,7 són de platges
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToPlatges}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-8 sm:mb-12"
          >
            <span className="flex items-center">
              Consulta les platges
              <ChevronDown className="ml-2 w-4 h-4 group-hover:animate-bounce" />
            </span>
          </button>

          {/* Status Title */}
          <h3 className="text-base sm:text-lg font-semibold mb-4">Estat actual de les platges</h3>

          {/* Conditional Content: Lifeguard Service Notice OR Bandera Counter */}
          {!isLifeguardServiceActive() ? (
            /* Lifeguard Service Notice */
            <div className="bg-orange-500/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-orange-400/30">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                <div className="text-center">
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1">
                    El servei de socorrisme a les platges ha finalitzat
                  </p>
                  <p className="text-xs sm:text-sm text-orange-100">
                    Horari: 10h - 19h
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Bandera Counter */
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {banderaStats.map((stat) => (
                  <div key={stat.name} className="text-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${stat.color} rounded-full mx-auto mb-1 sm:mb-2`}></div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">{stat.count}</div>
                    <div className="text-xs sm:text-sm text-blue-100">{stat.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile to avoid overlap */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <ChevronDown className="w-8 h-8 text-white/70" />
      </div>
    </header>
  );
};