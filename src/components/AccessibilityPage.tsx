import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Accessibility, Dog, Waves, ShowerHead as Shower, Eye, Heart } from 'lucide-react';
import { MetaTags } from './MetaTags';
import { MainNavigation } from './MainNavigation';
import { Footer } from './Footer';

export const AccessibilityPage: React.FC = () => {
  return (
    <>
      <MetaTags 
        title="Accessibilitat a les Platges de Badalona"
        description="Informació sobre l'accessibilitat i serveis adaptats a les platges de Badalona. Serveis d'acompanyament al bany, platja per a gossos, passeres adaptades i més."
        url="https://platges.bdnmedia.cat/accessibilitat"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Navigation Header */}
        <MainNavigation />
        
        {/* Header */}
        <header className="relative h-64 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://www.amb.cat/documents/11656/486093/BDN_pescadors_2025.jpg" 
              alt="Accessibilitat a les platges"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-blue-600/20"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between text-white p-6">
            <div>
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-lg px-4 py-2 hover:bg-black/40 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Tornar</span>
              </Link>
            </div>

            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Accessibility className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">Accessibilitat</h1>
              </div>
              <p className="text-xl text-blue-100">Platges inclusives per a tothom</p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Servei d'acompanyament */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-100 rounded-full p-3">
                  <Accessibility className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🧑‍🦽 Servei d'acompanyament al bany</h2>
                  <p className="text-gray-600">Per a persones amb diversitat funcional</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Per primera vegada, aquest servei serà exclusiu i separat del de salvament i socorrisme. 
                  Hi haurà dos punts adaptats amb equipament complet per garantir l'accessibilitat.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Equipament disponible:</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Cadira amfíbia</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Lavabo-vestidor adaptat</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Zona d'ombra</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Passera fins a l'aigua</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link 
                    to="/platja/pescadors"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">📍 Platja dels Pescadors</h4>
                    <p className="text-sm text-gray-600">A l'altura del carrer de Mar</p>
                  </Link>
                  <Link 
                    to="/platja/pont_d_en_botifarreta"
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">📍 Platja del Pont d'en Botifarreta</h4>
                    <p className="text-sm text-gray-600">A l'altura del carrer Torrebadal</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Accessibilitat general */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-green-100 rounded-full p-3">
                  <Waves className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">♿ Accessibilitat a les platges</h2>
                  <p className="text-gray-600">Infraestructures adaptades per a tothom</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Línies de vida</h3>
                  <p className="text-gray-700 mb-3">Totes les platges tindran mínim una línia de vida (de 8 a 11 en total)</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Passeres fins al mar</h3>
                  <p className="text-gray-700 mb-4">4 platges amb passeres adaptades:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link to="/platja/la_marina" className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors">
                      <span className="text-green-800 font-medium">La Marina</span>
                    </Link>
                    <Link to="/platja/pont_del_petroli" className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors">
                      <span className="text-green-800 font-medium">Pont del Petroli</span>
                    </Link>
                    <Link to="/platja/pescadors" className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors">
                      <span className="text-green-800 font-medium">Pescadors</span>
                    </Link>
                    <Link to="/platja/pont_d_en_botifarreta" className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors">
                      <span className="text-green-800 font-medium">Pont d'en Botifarreta</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4">🆕 Novetats 2025:</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Baranes d'accés a l'aigua (prova pilot):</h4>
                      <ul className="space-y-1 text-green-700 ml-4">
                        <li>• Platja dels Pescadors</li>
                        <li>• Platja del Pont del Petroli</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Banderes inclusives per a persones amb daltonisme (mètode ADD):</h4>
                      <ul className="space-y-1 text-green-700 ml-4">
                        <li>• Platja dels Pescadors</li>
                        <li>• Platja del Pont d'en Botifarreta</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white text-center">
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Platges per a tothom</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                A Badalona treballem per fer les nostres platges accessibles i inclusives, 
                garantint que tothom pugui gaudir del nostre magnífic litoral.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <Waves className="w-5 h-5" />
                <span>Descobreix les nostres platges</span>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};