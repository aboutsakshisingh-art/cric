import React, { useState, useEffect } from 'react';
import CreateMatchModal from './components/CreateMatchModal';
import LiveOverlay from './components/LiveOverlay';
import useMatchStore from './store/matchStore';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './styles/overlay.css';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initializeMatch = useMatchStore((state) => state.initializeMatch);
  const match = useMatchStore((state) => state.match);
  const updateScore = useMatchStore((state) => state.updateScore);
  const changeBowler = useMatchStore((state) => state.changeBowler);
  const toggleProOverlay = useMatchStore((state) => state.toggleProOverlay);
  const { changeTheme, currentTheme, availableThemes } = useTheme();
  
  const handleCreateMatch = (data) => {
    console.log('Creating match with data:', data);
    initializeMatch(data);
  };

  const handleAddRuns = (runs) => {
    updateScore(runs, false, null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Live Overlay for OBS - Always rendered but conditionally visible */}
      <LiveOverlay />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Cricket Match Scorer
        </h1>

        {/* Theme Selector */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Theme:</label>
          <select
            value={currentTheme}
            onChange={(e) => changeTheme(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Match
          </button>
          
          <button
            onClick={() => handleAddRuns(4)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!match.matchInfo.team1.name}
          >
            Add 4 Runs
          </button>
          
          <button
            onClick={() => handleAddRuns(6)}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={!match.matchInfo.team1.name}
          >
            Add 6 Runs
          </button>
          
          <button
            onClick={() => toggleProOverlay('showScore')}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Toggle Score Overlay
          </button>
        </div>

        {/* Match Info Display */}
        {match.matchInfo.team1.name && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Match Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Match No.</p>
                <p className="font-medium">{match.matchInfo.matchNo || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Match Type</p>
                <p className="font-medium">{match.matchInfo.matchType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overs</p>
                <p className="font-medium">{match.matchInfo.overs}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Toss Won By</p>
                <p className="font-medium capitalize">{match.matchInfo.tossWonBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Opted To</p>
                <p className="font-medium">{match.matchInfo.optedTo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{match.matchInfo.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Score Display */}
        {match.matchInfo.team1.name && match.proOverlay.showScore && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Live Score
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team 1 Score */}
              <div className="border-r pr-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {match.matchInfo.team1.name || 'Team 1'}
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {match.matchInfo.team1.score}/{match.matchInfo.team1.wickets}
                </p>
                <p className="text-sm text-gray-500">
                  Overs: {Math.floor(match.matchInfo.team1.ballsFaced / 6)}.{match.matchInfo.team1.ballsFaced % 6}
                </p>
              </div>
              
              {/* Team 2 Score */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {match.matchInfo.team2.name || 'Team 2'}
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {match.matchInfo.team2.score}/{match.matchInfo.team2.wickets}
                </p>
                <p className="text-sm text-gray-500">
                  Overs: {Math.floor(match.matchInfo.team2.ballsFaced / 6)}.{match.matchInfo.team2.ballsFaced % 6}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Over Display */}
        {match.matchInfo.team1.name && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Current Over ({match.currentOver.overNumber})
            </h2>
            <div className="flex space-x-2 mb-4">
              {match.currentOver.balls.map((ball, index) => (
                <span
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                    ball === 4 ? 'bg-blue-500' : 
                    ball === 6 ? 'bg-purple-500' : 
                    ball === 0 ? 'bg-gray-400' : 'bg-green-500'
                  }`}
                >
                  {ball}
                </span>
              ))}
              {Array(6 - match.currentOver.balls.length).fill(null).map((_, index) => (
                <span
                  key={`empty-${index}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 font-bold"
                >
                  -
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Bowler</p>
                <p className="font-medium">{match.currentBowler.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Over Stats</p>
                <p className="font-medium">
                  {match.currentOver.runs} runs, {match.currentOver.wickets} wickets
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create Match Modal */}
        <CreateMatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateMatch}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="ipl25">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
