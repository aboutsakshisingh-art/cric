const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // In production, specify your frontend URL
    methods: ['GET', 'POST'],
  },
});

// In-memory match state (initial structure)
const initialMatchState = {
  matchInfo: {
    matchNo: '',
    matchType: 'T20',
    overs: 20,
    ballsPerOver: 6,
    team1: {
      name: '',
      score: 0,
      wickets: 0,
      oversFaced: 0,
      ballsFaced: 0,
    },
    team2: {
      name: '',
      score: 0,
      wickets: 0,
      oversFaced: 0,
      ballsFaced: 0,
    },
    tossWonBy: 'team1',
    optedTo: 'Bat',
    matchTied: false,
    status: 'upcoming',
  },
  currentInnings: 1,
  battingTeam: 'team1',
  bowlingTeam: 'team2',
  currentOver: {
    overNumber: 1,
    balls: [],
    runs: 0,
    wickets: 0,
  },
  batsmen: [
    {
      id: 1,
      name: '',
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      isOnStrike: true,
      isOut: false,
      dismissalType: null,
    },
    {
      id: 2,
      name: '',
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      isOnStrike: false,
      isOut: false,
      dismissalType: null,
    },
  ],
  currentBowler: {
    id: 1,
    name: '',
    oversBowled: 0,
    ballsBowled: 0,
    runsConceded: 0,
    wicketsTaken: 0,
    maidens: 0,
  },
  bowlers: [],
  extras: {
    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0,
    total: 0,
  },
  proOverlay: {
    showScore: true,
    showRunRate: true,
    showRequiredRate: false,
    showPartnership: true,
    showBowlerStats: true,
    showBatsmanStats: true,
  },
  recentBalls: [],
};

// Current match state
let matchState = JSON.parse(JSON.stringify(initialMatchState));

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get current match state endpoint
app.get('/api/match/state', (req, res) => {
  res.json(matchState);
});

// Endpoint to receive and validate actions
app.post('/api/match/action', (req, res) => {
  const { action, payload } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  try {
    const result = processAction(action, payload);
    
    if (result.success) {
      // Broadcast updated state to all connected clients
      io.emit('matchStateUpdate', matchState);
      res.json({ success: true, state: matchState });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error processing action:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process different action types
function processAction(action, payload) {
  switch (action) {
    case 'ADD_RUNS': {
      const { runs, isExtra, extraType } = payload;
      
      // Validate runs (must be between 0-6 for regular balls)
      if (!isExtra && (runs < 0 || runs > 6)) {
        return { 
          success: false, 
          error: 'Runs must be between 0 and 6 for regular balls' 
        };
      }

      // For extras, validate appropriately
      if (isExtra && extraType === 'noBall' && (runs < 0 || runs > 6)) {
        return { 
          success: false, 
          error: 'Runs off no-ball must be between 0 and 6' 
        };
      }

      updateScore(runs, isExtra, extraType);
      return { success: true };
    }

    case 'CHANGE_BOWLER': {
      const { bowler } = payload;
      
      if (!bowler || !bowler.id) {
        return { success: false, error: 'Valid bowler data is required' };
      }

      matchState.currentBowler = {
        ...matchState.currentBowler,
        ...bowler,
      };
      
      // Reset current over
      matchState.currentOver = {
        overNumber: matchState.currentOver.overNumber,
        balls: [],
        runs: 0,
        wickets: 0,
      };

      return { success: true };
    }

    case 'TOGGLE_PRO_OVERLAY': {
      const { flagName, value } = payload;
      
      if (!flagName || !(flagName in matchState.proOverlay)) {
        return { success: false, error: 'Invalid overlay flag name' };
      }

      matchState.proOverlay[flagName] = value !== undefined ? value : !matchState.proOverlay[flagName];
      return { success: true };
    }

    case 'ADD_WICKET': {
      const battingTeamKey = matchState.battingTeam;
      
      matchState.matchInfo[battingTeamKey].wickets += 1;
      matchState.currentOver.wickets += 1;
      matchState.currentBowler.wicketsTaken += 1;
      
      return { success: true };
    }

    case 'SWITCH_STRIKE': {
      matchState.batsmen = matchState.batsmen.map((batsman) => ({
        ...batsman,
        isOnStrike: !batsman.isOnStrike,
      }));
      return { success: true };
    }

    case 'RESET_MATCH': {
      matchState = JSON.parse(JSON.stringify(initialMatchState));
      return { success: true };
    }

    case 'INITIALIZE_MATCH': {
      const { matchData } = payload;
      
      if (!matchData) {
        return { success: false, error: 'Match data is required' };
      }

      matchState = {
        ...JSON.parse(JSON.stringify(initialMatchState)),
        matchInfo: {
          ...initialMatchState.matchInfo,
          ...matchData,
          team1: {
            ...initialMatchState.matchInfo.team1,
            name: matchData.team1Name || '',
          },
          team2: {
            ...initialMatchState.matchInfo.team2,
            name: matchData.team2Name || '',
          },
        },
      };
      
      return { success: true };
    }

    default:
      return { success: false, error: `Unknown action: ${action}` };
  }
}

// Helper function to update score
function updateScore(runs, isExtra = false, extraType = null) {
  const battingTeamKey = matchState.battingTeam;

  if (isExtra && extraType) {
    switch (extraType) {
      case 'wide':
        matchState.extras.wides += 1;
        matchState.extras.total += 1;
        break;
      case 'noBall':
        matchState.extras.noBalls += 1;
        matchState.extras.total += 1;
        break;
      case 'bye':
        matchState.extras.byes += runs;
        matchState.extras.total += runs;
        break;
      case 'legBye':
        matchState.extras.legByes += runs;
        matchState.extras.total += runs;
        break;
      default:
        break;
    }
  } else {
    // Update balls faced only for regular deliveries
    matchState.matchInfo[battingTeamKey].ballsFaced += 1;
    matchState.currentOver.balls.push(runs);
  }

  // Update score
  matchState.matchInfo[battingTeamKey].score += runs;
  matchState.currentOver.runs += runs;

  // Update recent balls (keep last 6)
  matchState.recentBalls.push({
    runs,
    isExtra,
    extraType,
    timestamp: Date.now(),
  });
  
  if (matchState.recentBalls.length > 6) {
    matchState.recentBalls.shift();
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current state immediately on connection
  socket.emit('matchStateUpdate', matchState);

  // Listen for actions from clients
  socket.on('matchAction', (data) => {
    const { action, payload } = data;
    
    try {
      const result = processAction(action, payload);
      
      if (result.success) {
        // Broadcast updated state to all clients including sender
        io.emit('matchStateUpdate', matchState);
        socket.emit('actionSuccess', { action, state: matchState });
      } else {
        socket.emit('actionError', { action, error: result.error });
      }
    } catch (error) {
      console.error('Error processing socket action:', error);
      socket.emit('actionError', { action, error: 'Internal server error' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});

module.exports = { app, server, io };
