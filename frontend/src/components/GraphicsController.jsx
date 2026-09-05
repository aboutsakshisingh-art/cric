import React from 'react';
import { useMatchStore } from '../store/matchStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const GraphicsController = () => {
  const { proOverlay, toggleProOverlay } = useMatchStore();

  // List of all PRO flags we want to control
  const overlayFlags = [
    { key: 'showScore', label: 'Show Score' },
    { key: 'showTarget', label: 'Show Target' },
    { key: 'showPartnership', label: 'Show Partnership' },
    { key: 'showTeams', label: 'Show Teams' },
    { key: 'showPlayerStats', label: 'Player Stats' },
    { key: 'showBowlerStats', label: 'Bowler Stats' },
    { key: 'showRunRate', label: 'Run Rate' },
    { key: 'showBallByBall', label: 'Ball by Ball' },
  ];

  const sendToggleToBackend = async (flagKey, newValue) => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/match/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'TOGGLE_PRO_OVERLAY', 
          payload: { flagName: flagKey, value: newValue } 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
      }
    } catch (error) {
      console.error('Failed to send toggle to backend:', error);
    }
  };

  const handleToggle = (flagKey) => {
    const newValue = !proOverlay[flagKey];
    toggleProOverlay(flagKey);
    sendToggleToBackend(flagKey, newValue);
  };

  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen font-sans">
      <header className="mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-green-400">PRO Graphics Controller</h1>
        <p className="text-sm text-gray-400">
          Toggle overlays instantly on the OBS broadcast
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {overlayFlags.map((flag) => {
          const isActive = proOverlay[flag.key] === true;
          
          return (
            <button
              key={flag.key}
              onClick={() => handleToggle(flag.key)}
              className={`
                relative h-24 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg border-b-4
                ${isActive 
                  ? 'bg-green-500 border-green-700 text-white scale-105' 
                  : 'bg-gray-600 border-gray-800 text-gray-400 hover:bg-gray-500'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="mb-1">{flag.label}</span>
                <span className="text-xs opacity-75">
                  {isActive ? 'ACTIVE' : 'HIDDEN'}
                </span>
                {isActive && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-ping" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Current State</h3>
        <pre className="text-xs text-green-300 overflow-auto max-h-40">
          {JSON.stringify(proOverlay, null, 2)}
        </pre>
      </div>
      
      <div className="text-xs text-gray-500 mt-6 text-center">
        Changes are broadcast via WebSocket immediately
      </div>
    </div>
  );
};

export default GraphicsController;
