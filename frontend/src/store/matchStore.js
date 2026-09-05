import { create } from 'zustand';

// Initial match state structure
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
    status: 'upcoming', // upcoming, live, completed
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
    showTarget: false,
    showTeams: true,
    showPlayerStats: true,
    showBallByBall: true,
  },
  recentBalls: [], // Array of ball events for display
  currentEvent: null, // For triggering animations (HIT_SIX, HIT_FOUR, FALL_OF_WICKET)
};

const useMatchStore = create((set, get) => ({
  match: JSON.parse(JSON.stringify(initialMatchState)),

  // Set entire match state (used by socket listener)
  setMatchState: (newState) => {
    set({ match: newState });
  },

  // Initialize match with custom data
  initializeMatch: (matchData) => {
    set({
      match: {
        ...initialMatchState,
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
          tossWonBy: matchData.tossWonBy || 'team1',
          optedTo: matchData.optedTo || 'Bat',
          matchTied: matchData.matchTied === 'Yes',
          overs: matchData.overs || 20,
          ballsPerOver: matchData.ballsPerOver || 6,
          matchType: matchData.matchType || 'T20',
        },
      },
    });
  },

  // Update score for the batting team
  updateScore: (runs, isExtra = false, extraType = null) => {
    const state = get();
    const { match } = state;
    const battingTeamKey = match.battingTeam;

    let newExtras = { ...match.extras };
    let runsToAdd = runs;

    if (isExtra && extraType) {
      switch (extraType) {
        case 'wide':
        case 'noBall':
          newExtras[extraType === 'wide' ? 'wides' : 'noBalls'] += 1;
          newExtras.total += 1;
          runsToAdd = runs; // Runs added on top of the extra
          break;
        case 'bye':
        case 'legBye':
          newExtras[extraType === 'bye' ? 'byes' : 'legByes'] += runs;
          newExtras.total += runs;
          runsToAdd = runs;
          break;
        default:
          break;
      }
    }

    set({
      match: {
        ...match,
        matchInfo: {
          ...match.matchInfo,
          [battingTeamKey]: {
            ...match.matchInfo[battingTeamKey],
            score: match.matchInfo[battingTeamKey].score + runsToAdd,
            ballsFaced: isExtra
              ? match.matchInfo[battingTeamKey].ballsFaced
              : match.matchInfo[battingTeamKey].ballsFaced + 1,
          },
        },
        currentOver: {
          ...match.currentOver,
          runs: match.currentOver.runs + runsToAdd,
          balls: isExtra
            ? match.currentOver.balls
            : [...match.currentOver.balls, runs],
        },
        extras: newExtras,
        recentBalls: [
          ...match.recentBalls,
          {
            runs: runsToAdd,
            isExtra,
            extraType,
            timestamp: Date.now(),
          },
        ].slice(-6), // Keep last 6 balls
      },
    });
  },

  // Add a run (convenience wrapper)
  addRun: (runs) => {
    get().updateScore(runs, false, null);
    // Trigger animation for boundaries
    if (runs === 4) {
      get().triggerEvent('HIT_FOUR');
    } else if (runs === 6) {
      get().triggerEvent('HIT_SIX');
    }
  },

  // Add an extra
  addExtra: (type) => {
    get().updateScore(0, true, type);
  },

  // Change current bowler
  changeBowler: (bowler) => {
    const state = get();
    const { match } = state;

    set({
      match: {
        ...match,
        currentBowler: {
          ...match.currentBowler,
          ...bowler,
        },
        currentOver: {
          ...match.currentOver,
          overNumber: match.currentOver.overNumber,
          balls: [],
          runs: 0,
          wickets: 0,
        },
      },
    });
  },

  // Toggle PRO overlay flags
  toggleProOverlay: (flagName) => {
    const state = get();
    const { match } = state;

    set({
      match: {
        ...match,
        proOverlay: {
          ...match.proOverlay,
          [flagName]: !match.proOverlay[flagName],
        },
      },
    });
  },

  // Set specific PRO overlay flag
  setProOverlayFlag: (flagName, value) => {
    const state = get();
    const { match } = state;

    set({
      match: {
        ...match,
        proOverlay: {
          ...match.proOverlay,
          [flagName]: value,
        },
      },
    });
  },

  // Add a wicket
  addWicket: (dismissalType = 'caught') => {
    const state = get();
    const { match } = state;
    const battingTeamKey = match.battingTeam;

    // Trigger wicket animation
    get().triggerEvent('FALL_OF_WICKET');

    set({
      match: {
        ...match,
        matchInfo: {
          ...match.matchInfo,
          [battingTeamKey]: {
            ...match.matchInfo[battingTeamKey],
            wickets: match.matchInfo[battingTeamKey].wickets + 1,
          },
        },
        currentOver: {
          ...match.currentOver,
          wickets: match.currentOver.wickets + 1,
        },
        currentBowler: {
          ...match.currentBowler,
          wicketsTaken: match.currentBowler.wicketsTaken + 1,
        },
      },
    });
  },

  // Switch strike between batsmen
  switchStrike: () => {
    const state = get();
    const { match } = state;

    set({
      match: {
        ...match,
        batsmen: match.batsmen.map((batsman) => ({
          ...batsman,
          isOnStrike: !batsman.isOnStrike,
        })),
      },
    });
  },

  // Trigger an event animation (SIX, FOUR, WICKET)
  triggerEvent: (eventType) => {
    set({
      match: {
        ...get().match,
        currentEvent: {
          type: eventType,
          timestamp: Date.now(),
        },
      },
    });

    // Clear the event after 3 seconds
    setTimeout(() => {
      set({
        match: {
          ...get().match,
          currentEvent: null,
        },
      });
    }, 3000);
  },

  // Clear current event
  clearEvent: () => {
    set({
      match: {
        ...get().match,
        currentEvent: null,
      },
    });
  },

  // Reset the entire match state
  resetMatch: () => {
    set({ match: JSON.parse(JSON.stringify(initialMatchState)) });
  },

  // Get current match state
  getMatchState: () => {
    return get().match;
  },
}));

// Destructured selectors for easier access in components
export const useMatchInfo = () => useMatchStore((state) => state.match.matchInfo);
export const useCurrentInnings = () => useMatchStore((state) => state.match.currentInnings);
export const useBattingTeam = () => useMatchStore((state) => state.match.battingTeam);
export const useBowlingTeam = () => useMatchStore((state) => state.match.bowlingTeam);
export const useCurrentOver = () => useMatchStore((state) => state.match.currentOver);
export const useBatsmen = () => useMatchStore((state) => state.match.batsmen);
export const useCurrentBowler = () => useMatchStore((state) => state.match.currentBowler);
export const useExtras = () => useMatchStore((state) => state.match.extras);
export const useProOverlay = () => useMatchStore((state) => state.match.proOverlay);
export const useRecentBalls = () => useMatchStore((state) => state.match.recentBalls);
export const useCurrentEvent = () => useMatchStore((state) => state.match.currentEvent);

export default useMatchStore;
export { initialMatchState };
