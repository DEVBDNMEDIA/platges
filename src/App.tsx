import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PlatgesResponse, Platja } from './types/platges';
import { platgesInfo } from './data/platgesInfo';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { PlatjaCard } from './components/PlatjaCard';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { Footer } from './components/Footer';
import { PlatjaDetailPage } from './components/PlatjaDetailPage';
import { MetaTags } from './components/MetaTags';
import { MainNavigation } from './components/MainNavigation';
import { AccessibilityPage } from './components/AccessibilityPage';
import { AvisosWidget } from './components/AvisosWidget';
import { BeachFinderAI } from './components/BeachFinderAI';

function HomePage() {
  const [platges, setPlatges] = useState<Platja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<'sud-nord' | 'nord-sud'>('nord-sud');
  const [searchTerm, setSearchTerm] = useState('');
  const [beachFinderOpen, setBeachFinderOpen] = useState(false);

  // Helper function to normalize boolean values from API
  const normalizeBooleanValue = (value: boolean | string): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return false;
  };

  // Helper function to normalize platja data
  const normalizePlatjaData = (rawData: any): Platja => {
    return {
      ...rawData,
      meduses: normalizeBooleanValue(rawData.meduses),
      disponible: normalizeBooleanValue(rawData.disponible)
    };
  };

  // Helper function to adjust date for format 2 (add 2 hours)
  const adjustDateForFormat = (dateString: string, needsAdjustment: boolean): string => {
    if (!needsAdjustment) return dateString;
    
    // Format without timezone: "2025-07-12 01:52:35" - add 2 hours
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date.toISOString();
  };

  // Helper function to detect if date needs adjustment (no timezone info)
  const needsDateAdjustment = (dateString: string): boolean => {
    // If date doesn't contain 'T' or 'Z', it's format 2 and needs adjustment
    return !dateString.includes('T') && !dateString.includes('Z');
  };

  const fetchPlatges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch each beach individually
      const promises = platgesInfo.map(async (platjaInfo) => {
        try {
          const response = await fetch(
            `https://platges.bdnmedia.cat/api.php?t=estat&q=${platjaInfo.apiName}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          
          if (!response.ok) {
            console.warn(`Error fetching ${platjaInfo.name}: ${response.status}`);
            return null;
          }
          
          const data = await response.json();
          
          // Handle both API response formats
          let rawPlatjaData = null;
          let isFormat2 = false;
          
          if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            // Format 1: {"num":1,"count":1,"start":1,"offset":500,"isCursor":false,"items":[{...}]} with ISO date
            rawPlatjaData = data.items[0];
            isFormat2 = needsDateAdjustment(rawPlatjaData.date_updated);
          } else {
            console.warn(`No data found for ${platjaInfo.name}`);
            return null;
          }

          // Adjust date if needed and normalize the data
          const adjustedData = {
            ...rawPlatjaData,
            date_updated: adjustDateForFormat(rawPlatjaData.date_updated, isFormat2)
          };

          return normalizePlatjaData(adjustedData);
        } catch (err) {
          console.warn(`Error fetching ${platjaInfo.name}:`, err);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validPlatges = results.filter((platja): platja is Platja => platja !== null);
      
      setPlatges(validPlatges);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
      console.error('Error fetching platges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatges();
  }, []);

  const getSortedAndFilteredPlatgesInfo = () => {
    let filtered = platgesInfo;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(platjaInfo =>
        platjaInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort - CORRECTED: sud-nord should show from south to north (order ascending)
    // nord-sud should show from north to south (order descending)
    const sorted = [...filtered].sort((a, b) => {
      return sortOrder === 'sud-nord' ? a.order - b.order : b.order - a.order;
    });
    
    return sorted;
  };

  const getPlatjaData = (apiName: string) => {
    return platges.find(p => p.platja === apiName) || null;
  };

  if (loading && platges.length === 0) {
    return <LoadingState />;
  }

  return (
    <>
      <MetaTags />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Navigation Header */}
        <MainNavigation />
        
        <Header 
          lastUpdated={lastUpdated} 
          platges={platges} 
          onOpenBeachFinder={() => setBeachFinderOpen(true)}
        />
        
        {/* Gradient Transition */}
        <div className="h-16 bg-gradient-to-b from-black/20 via-black/10 to-transparent"></div>
        
        <div id="platges-section" className="container mx-auto px-4 py-12">
          {/* Global Warnings */}
          <div className="mb-8">
            <AvisosWidget showGlobal={true} />
          </div>
          
          <Controls
            loading={loading}
            sortOrder={sortOrder}
            searchTerm={searchTerm}
            lastUpdated={lastUpdated}
            onRefresh={fetchPlatges}
            onSortChange={setSortOrder}
            onSearchChange={setSearchTerm}
          />

          {error && (
            <ErrorState error={error} onRetry={fetchPlatges} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getSortedAndFilteredPlatgesInfo().map((platjaInfo) => {
              const platjaData = getPlatjaData(platjaInfo.apiName);
              return (
                <PlatjaCard
                  key={platjaInfo.apiName}
                  platja={platjaData}
                  platjaInfo={platjaInfo}
                />
              );
            })}
          </div>

          {getSortedAndFilteredPlatgesInfo().length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No s'han trobat platges que coincideixin amb "{searchTerm}"</p>
            </div>
          )}
        </div>

        <Footer />

        {/* Beach Finder AI */}
        <BeachFinderAI
          isOpen={beachFinderOpen}
          onClose={() => setBeachFinderOpen(false)}
        />
      </div>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/platja/:platjaKey" element={<PlatjaDetailPage />} />
          <Route path="/accessibilitat" element={<AccessibilityPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;