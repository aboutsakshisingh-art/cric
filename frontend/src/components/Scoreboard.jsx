import { useMatchStore } from '../store/matchStore';

const Scoreboard = () => {
  const { match, currentBowler, batsmen, currentOver } = useMatchStore();
  const { matchInfo, battingTeam, bowlingTeam } = match;

  const { team1, team2, team1Short, team2Short, team1Score, team1Wickets, team1Overs, team2Score, team2Wickets, team2Overs } = matchInfo;

  // Determine which team is currently batting
  const isTeam1Batting = battingTeam === 'team1';
  const currentTeamName = isTeam1Batting ? team1Short : team2Short;
  const currentScore = isTeam1Batting ? team1Score : team2Score;
  const currentWickets = isTeam1Batting ? team1Wickets : team2Wickets;
  const currentOversDisplay = isTeam1Batting ? team1Overs : team2Overs;

  // Find striker and non-striker
  const striker = batsmen.find((b) => b.isOnStrike);
  const nonStriker = batsmen.find((b) => !b.isOnStrike);

  return (
    <div className="scoreboard-container">
      {/* Main Score Bar */}
      <div className="scorebar-main">
        <div className="scorebar-team-info">
          <span className="team-short-name">{currentTeamName}</span>
          <span className="score-display">
            <span className="runs">{currentScore}</span>
            <span className="wickets">/{currentWickets}</span>
          </span>
          <span className="overs-display">({currentOversDisplay})</span>
        </div>

        <div className="scorebar-separator"></div>

        {/* Batsmen Stats */}
        <div className="batsmen-stats">
          {striker && (
            <div className="batsman-row striker-row">
              <span className="batsman-name">
                {striker.name}
                <span className="striker-indicator">*</span>
              </span>
              <span className="batsman-runs">{striker.runs}</span>
              <span className="batsman-balls">({striker.ballsFaced})</span>
            </div>
          )}
          {nonStriker && (
            <div className="batsman-row non-striker-row">
              <span className="batsman-name">{nonStriker.name}</span>
              <span className="batsman-runs">{nonStriker.runs}</span>
              <span className="batsman-balls">({nonStriker.ballsFaced})</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Over Info Bar */}
      <div className="over-info-bar">
        <div className="over-info-left">
          <span className="over-label">Current Over:</span>
          <span className="over-balls">
            {currentOver.balls.map((ball, index) => (
              <span key={index} className={`ball-dot ball-${ball}`}>
                {ball}
              </span>
            ))}
          </span>
        </div>

        {currentBowler && currentBowler.name && (
          <div className="bowler-info">
            <span className="bowler-name">{currentBowler.name}</span>
            <span className="bowler-fig">
              {currentBowler.wicketsTaken}/{currentBowler.runsConceded} ({currentBowler.oversBowled})
            </span>
          </div>
        )}
      </div>

      {/* Team Names Banner */}
      <div className="teams-banner">
        <div className="team-banner team1-banner">
          <span className="team-full-name">{team1}</span>
          {!isTeam1Batting && (
            <span className="innings-score">
              {team1Score}/{team1Wickets} ({team1Overs})
            </span>
          )}
        </div>
        <div className="vs-divider">VS</div>
        <div className="team-banner team2-banner">
          <span className="team-full-name">{team2}</span>
          {isTeam1Batting && (
            <span className="innings-score">
              {team2Score}/{team2Wickets} ({team2Overs})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
