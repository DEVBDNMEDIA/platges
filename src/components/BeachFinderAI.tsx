import React, { useState } from 'react';
import { X, Brain, MapPin, ArrowRight, RotateCcw } from 'lucide-react';
import { platgesInfo } from '../data/platgesInfo';
import { transportData } from '../data/transportData';

interface BeachFinderAIProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string }[];
}

interface UserAnswers {
  [key: string]: string;
}

interface BeachRecommendation {
  beach: typeof platgesInfo[0];
  score: number;
  reasons: string[];
}

export const BeachFinderAI: React.FC<BeachFinderAIProps> = ({ isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<BeachRecommendation[]>([]);

  const questions: Question[] = [
    {
      id: 'transport',
      text: '🚌 Com prefereixes arribar a la platja?',
      options: [
        { value: 'public', label: 'Transport públic (bus, metro, tren)' },
        { value: 'car', label: 'Cotxe propi' },
        { value: 'walking', label: 'Caminant des del centre' },
        { value: 'any', label: 'M\'és igual' }
      ]
    },
    {
      id: 'crowd',
      text: '👥 Quin nivell d\'ocupació prefereixes?',
      options: [
        { value: 'quiet', label: 'Tranquil·la, poca gent' },
        { value: 'moderate', label: 'Moderada' },
        { value: 'busy', label: 'Animada, amb ambient' },
        { value: 'any', label: 'M\'és igual' }
      ]
    },
    {
      id: 'services',
      text: '🏖️ Què valores més en una platja?',
      options: [
        { value: 'services', label: 'Molts serveis (guinguetes, dutxes, etc.)' },
        { value: 'nature', label: 'Entorn natural' },
        { value: 'accessibility', label: 'Accessibilitat' },
        { value: 'sports', label: 'Activitats esportives' }
      ]
    },
    {
      id: 'special',
      text: '⭐ Alguna característica especial?',
      options: [
        { value: 'dogs', label: 'Zona per a gossos' },
        { value: 'blue_flag', label: 'Bandera Blava (qualitat ambiental)' },
        { value: 'fishing', label: 'Ambient pesquer' },
        { value: 'none', label: 'Cap en particular' }
      ]
    },
    {
      id: 'parking',
      text: '🚗 Si vas amb cotxe, l\'aparcament és important?',
      options: [
        { value: 'easy', label: 'Sí, necessito aparcament fàcil' },
        { value: 'moderate', label: 'No em molesta buscar una mica' },
        { value: 'difficult', label: 'No em molesta caminar molt' },
        { value: 'no_car', label: 'No vaig amb cotxe' }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate recommendations
      const recs = calculateRecommendations(newAnswers);
      setRecommendations(recs);
      setShowResults(true);
    }
  };

  const calculateRecommendations = (userAnswers: UserAnswers): BeachRecommendation[] => {
    const scores: BeachRecommendation[] = platgesInfo.map(beach => {
      let score = 0;
      const reasons: string[] = [];
      const transportInfo = transportData.find(t => t.platjaKey === beach.apiName.split('.')[1]);

      // Skip closed beaches
      if (beach.specialFeatures?.tancada) {
        return { beach, score: -100, reasons: ['Platja tancada'] };
      }

      // Transport scoring
      if (userAnswers.transport === 'public') {
        if (transportInfo?.publicTransport.bus?.direct?.length) {
          score += 20;
          reasons.push('Bon accés amb transport públic');
        }
        if (transportInfo?.publicTransport.metro?.length) {
          score += 15;
          reasons.push('Accessible amb metro');
        }
      } else if (userAnswers.transport === 'car') {
        if (transportInfo?.privateTransport.parking.includes('Concorregut') || 
            transportInfo?.privateTransport.parking.includes('Mitjà')) {
          score += 15;
          reasons.push('Aparcament disponible');
        }
      } else if (userAnswers.transport === 'walking') {
        if (['pescadors', 'l_estaci', 'patins_de_vela'].includes(beach.apiName.split('.')[1])) {
          score += 25;
          reasons.push('Prop del centre de Badalona');
        }
      }

      // Crowd level scoring
      if (userAnswers.crowd === 'quiet') {
        if (transportInfo?.occupation.includes('Baixa') || transportInfo?.occupation.includes('Normal - Baixa')) {
          score += 25;
          reasons.push('Platja tranquil·la');
        }
      } else if (userAnswers.crowd === 'moderate') {
        if (transportInfo?.occupation.includes('Normal')) {
          score += 20;
          reasons.push('Ocupació moderada');
        }
      } else if (userAnswers.crowd === 'busy') {
        if (transportInfo?.occupation.includes('Elevada')) {
          score += 20;
          reasons.push('Platja animada');
        }
      }

      // Services scoring
      if (userAnswers.services === 'accessibility') {
        if (beach.specialFeatures?.accessibilitat?.acompanyament || 
            beach.specialFeatures?.accessibilitat?.passera) {
          score += 30;
          reasons.push('Serveis d\'accessibilitat');
        }
      } else if (userAnswers.services === 'nature') {
        if (transportInfo?.beachType === 'Naturalista') {
          score += 25;
          reasons.push('Entorn naturalista');
        }
      } else if (userAnswers.services === 'sports') {
        if (['patins_de_vela', 'pont_d_en_botifarreta'].includes(beach.apiName.split('.')[1])) {
          score += 20;
          reasons.push('Activitats esportives');
        }
      }

      // Special features scoring
      if (userAnswers.special === 'dogs' && beach.specialFeatures?.platjaGossos) {
        score += 40;
        reasons.push('Zona per a gossos');
      } else if (userAnswers.special === 'blue_flag' && beach.specialFeatures?.banderaBlava) {
        score += 30;
        reasons.push('Bandera Blava');
      } else if (userAnswers.special === 'fishing' && beach.apiName.includes('pescadors')) {
        score += 35;
        reasons.push('Ambient pesquer autèntic');
      }

      // Parking scoring
      if (userAnswers.parking === 'easy') {
        if (transportInfo?.privateTransport.parking.includes('Concorregut') || 
            transportInfo?.privateTransport.parking.includes('Mitjà')) {
          score += 15;
          reasons.push('Aparcament accessible');
        } else if (transportInfo?.privateTransport.parking.includes('No hi ha') || 
                   transportInfo?.privateTransport.parking.includes('Molt limitat')) {
          score -= 20;
        }
      }

      return { beach, score, reasons };
    });

    // Sort by score and return top 3
    return scores
      .filter(s => s.score > -50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Cercador Intel·ligent de Platges</h2>
                <p className="text-blue-100">Troba la platja perfecta per a tu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResults ? (
            /* Questions */
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question counter */}
              <div className="text-center text-sm text-gray-500">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </div>

              {/* Current question */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {questions[currentQuestionIndex].text}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                      <span className="text-gray-900 font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Back button */}
              {currentQuestionIndex > 0 && (
                <div className="text-center">
                  <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Pregunta anterior
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🎯 Les teves platges recomanades
                </h3>
                <p className="text-gray-600">Basades en les teves preferències</p>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div 
                    key={rec.beach.apiName}
                    className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
                      index === 0 
                        ? 'border-gold-400 bg-gradient-to-r from-yellow-50 to-orange-50' 
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {index === 0 && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            1
                          </div>
                        )}
                        {index === 1 && (
                          <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            2
                          </div>
                        )}
                        {index === 2 && (
                          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            3
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{rec.beach.name}</h4>
                          <div className="flex items-center space-x-2">
                            {rec.beach.specialFeatures?.banderaBlava && (
                              <img 
                                src="https://platges.bdnmedia.cat/icons/bandera-blava.png" 
                                alt="Bandera Blava"
                                className="w-5 h-5"
                              />
                            )}
                            {rec.beach.specialFeatures?.platjaGossos && (
                              <span className="text-amber-600">🐕</span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {rec.beach.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {rec.reasons.map((reason, reasonIndex) => (
                            <span 
                              key={reasonIndex}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => {
                            onClose();
                            window.open(`/platja/${rec.beach.apiName.split('.')[1]}`, '_blank');
                          }}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Veure detalls</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={resetQuiz}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tornar a començar</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Explorar totes les platges</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};