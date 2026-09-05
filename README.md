# Cricket Match Scoring Application

A full-stack cricket match scoring application with real-time updates using React, Zustand, Socket.io, and Express.

## Project Structure

```
/workspace
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   └── CreateMatchModal.jsx    # Match creation modal component
│   │   ├── store/
│   │   │   └── matchStore.js           # Zustand state management
│   │   ├── App.jsx                     # Main application component
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Tailwind CSS imports
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── backend/
│   ├── server.js                       # Express + Socket.io server
│   └── package.json
└── package.json                        # Root package.json for concurrent runs
```

## Features

### Frontend (React + Tailwind CSS)
- **Create Match Modal**: Responsive form with validation using React Hook Form
  - Team 1 & Team 2 names
  - Overs (1-50)
  - Match number
  - Toss winner (radio buttons)
  - Opted to Bat/Bowl (radio buttons)
  - Match Tied Yes/No (radio buttons)
  - Balls per over dropdown (4, 5, 6, 8)
  - Match type dropdown (T20, ODI, Test, Friendly)
  - Add and Cancel buttons

- **State Management (Zustand)**
  - Highly nested cricket match state
  - Functions to update score
  - Change current bowler
  - Toggle PRO overlay flags (showScore, showRunRate, etc.)
  - Add wickets, switch strike, reset match

### Backend (Node.js + Express + Socket.io)
- **REST API Endpoints**
  - `GET /health` - Health check
  - `GET /api/match/state` - Get current match state
  - `POST /api/match/action` - Process match actions

- **WebSocket Events**
  - `matchStateUpdate` - Broadcasts updated state to all clients
  - `matchAction` - Client sends actions to server
  - `actionSuccess` - Server confirms successful action
  - `actionError` - Server reports action errors

- **Supported Actions**
  - `ADD_RUNS` - Validate runs (0-6), update score
  - `CHANGE_BOWLER` - Update current bowler
  - `TOGGLE_PRO_OVERLAY` - Toggle overlay flags
  - `ADD_WICKET` - Record a wicket
  - `SWITCH_STRIKE` - Swap batsmen positions
  - `RESET_MATCH` - Reset to initial state
  - `INITIALIZE_MATCH` - Set up new match

## Installation

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd backend && npm install
cd ../frontend && npm install
```

## Running the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately
npm run dev:backend   # Backend on port 3001
npm run dev:frontend  # Frontend on port 3000
```

## Usage Example

### Frontend - Creating a Match
```javascript
import CreateMatchModal from './components/CreateMatchModal';
import useMatchStore from './store/matchStore';

function App() {
  const initializeMatch = useMatchStore((state) => state.initializeMatch);
  
  const handleCreateMatch = (data) => {
    initializeMatch(data);
  };
  
  return (
    <CreateMatchModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleCreateMatch}
    />
  );
}
```

### Backend - Sending Actions via WebSocket
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Add runs
socket.emit('matchAction', {
  action: 'ADD_RUNS',
  payload: { runs: 4, isExtra: false }
});

// Listen for updates
socket.on('matchStateUpdate', (state) => {
  console.log('Updated state:', state);
});
```

### Backend - Sending Actions via REST API
```javascript
fetch('http://localhost:3001/api/match/action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'ADD_RUNS',
    payload: { runs: 6, isExtra: false }
  })
});
```

## API Documentation

### POST /api/match/action

Request body:
```json
{
  "action": "ADD_RUNS",
  "payload": {
    "runs": 4,
    "isExtra": false,
    "extraType": null
  }
}
```

Response (success):
```json
{
  "success": true,
  "state": { /* full match state */ }
}
```

Response (error):
```json
{
  "error": "Runs must be between 0 and 6 for regular balls"
}
```

## Technologies Used

- **Frontend**: React 18, Vite, Tailwind CSS, React Hook Form, Zustand, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **State Management**: Zustand (frontend), In-memory (backend)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
