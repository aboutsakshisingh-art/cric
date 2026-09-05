import React from 'react';
import { useMatchStore } from '../store/matchStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const ScoringController = () => {
  const { 
    addRun, 
    addExtra, 
    addWicket, 
    triggerEvent,
    battingTeam,
    currentOver 
  } = useMatchStore();

  const sendActionToBackend = async (action, payload) => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/match/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
      }
    } catch (error) {
      console.error('Failed to send action to backend:', error);
    }
  };

  const handleRun = (runs) => {
    // Update local state immediately for responsiveness
    addRun(runs);
    // Send to backend to broadcast to all clients
    sendActionToBackend('ADD_RUNS', { runs, isExtra: false });
  };

  const handleExtra = (type) => {
    addExtra(type);
    sendActionToBackend('ADD_RUNS', { runs: 0, isExtra: true, extraType: type });
  };

  const handleWicket = () => {
    if (window.confirm('Confirm Wicket?')) {
      addWicket();
      sendActionToBackend('ADD_WICKET', {});
    }
  };

  const handleAnimation = (type) => {
    triggerEvent(type);
    sendActionToBackend('TRIGGER_EVENT', { eventType: type });
  };

  const getBowlerName = () => {
    return currentOver?.bowler || 'Unknown';
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen font-sans">
      <header className="mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-yellow-400">Scoring Console</h1>
        <p className="text-sm text-gray-400">
          Batting: {battingTeam} | Bowler: {getBowlerName()}
        </p>
      </header>

      {/* Run Buttons Grid */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-300">Runs</h2>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2, 3].map((run) => (
            <button
              key={run}
              onClick={() => handleRun(run)}
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all h-20 rounded-xl text-3xl font-bold shadow-lg border-b-4 border-blue-800"
            >
              {run}
            </button>
          ))}
          <button
            onClick={() => handleRun(4)}
            className="bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all h-20 rounded-xl text-3xl font-bold shadow-lg border-b-4 border-purple-800 col-span-1"
          >
            4
          </button>
          <button
            onClick={() => handleRun(6)}
            className="bg-pink-600 hover:bg-pink-500 active:scale-95 transition-all h-20 rounded-xl text-3xl font-bold shadow-lg border-b-4 border-pink-800 col-span-2"
          >
            6
          </button>
        </div>
      </section>

      {/* Extras Grid */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-300">Extras</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleExtra('wide')}
            className="bg-orange-600 hover:bg-orange-500 active:scale-95 transition-all h-16 rounded-lg text-xl font-bold shadow border-b-4 border-orange-800"
          >
            Wide
          </button>
          <button
            onClick={() => handleExtra('noBall')}
            className="bg-orange-600 hover:bg-orange-500 active:scale-95 transition-all h-16 rounded-lg text-xl font-bold shadow border-b-4 border-orange-800"
          >
            No Ball
          </button>
          <button
            onClick={() => handleExtra('bye')}
            className="bg-teal-600 hover:bg-teal-500 active:scale-95 transition-all h-16 rounded-lg text-xl font-bold shadow border-b-4 border-teal-800"
          >
            Bye
          </button>
          <button
            onClick={() => handleExtra('legBye')}
            className="bg-teal-600 hover:bg-teal-500 active:scale-95 transition-all h-16 rounded-lg text-xl font-bold shadow border-b-4 border-teal-800"
          >
            Leg Bye
          </button>
        </div>
      </section>

      {/* Wicket Button */}
      <section className="mb-8">
        <button
          onClick={handleWicket}
          className="w-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all h-24 rounded-xl text-4xl font-black tracking-widest shadow-lg border-b-4 border-red-900 animate-pulse-slow"
        >
          WICKET
        </button>
      </section>

      {/* Animation Triggers */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-300">Force Animations</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleAnimation('HIT_SIX')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 h-14 rounded-lg font-bold text-sm shadow border-b-2 border-purple-900"
          >
            Trigger SIX
          </button>
          <button
            onClick={() => handleAnimation('HIT_FOUR')}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 h-14 rounded-lg font-bold text-sm shadow border-b-2 border-indigo-900"
          >
            Trigger FOUR
          </button>
          <button
            onClick={() => handleAnimation('FALL_OF_WICKET')}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 h-14 rounded-lg font-bold text-sm shadow border-b-2 border-red-900"
          >
            Trigger WKT
          </button>
        </div>
      </section>
      
      <div className="text-xs text-gray-500 mt-8 text-center">
        Actions are synced via WebSocket to OBS Overlay
      </div>
    </div>
  );
};

export default ScoringController;
