import React, { useContext, useMemo } from 'react';
import { GameContext } from '../contexts/GameContext';
import Button from '../components/Button';
import { CrownIcon } from '../components/Icons';

const ScoreboardScreen: React.FC = () => {
  const context = useContext(GameContext);

  if (!context) return null;

  const { players, scores, resetGame, returnToLobby, isHost } = context;

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  }, [players, scores]);

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'border-yellow-400 text-yellow-300';
    if (rank === 1) return 'border-slate-400 text-slate-300';
    if (rank === 2) return 'border-amber-600 text-amber-500';
    return 'border-slate-700 text-slate-400';
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fade-in text-center">
      <h1 className="text-4xl font-bold text-white mb-6">Placar Final</h1>

      <ul className="space-y-4 mb-8">
        {sortedPlayers.map((player, index) => (
          <li
            key={player.id}
            className={`flex items-center gap-4 bg-slate-800 p-4 rounded-lg border-l-4 transition-all duration-300 ${getRankColor(index)}`}
          >
            <span className={`text-2xl font-bold w-8 ${getRankColor(index)}`}>{index + 1}</span>
            <img src={player.avatar} alt={player.name} className="w-14 h-14 rounded-full bg-slate-700" />
            <span className="text-xl font-medium text-slate-200 flex-grow text-left">{player.name}</span>
            <span className="text-2xl font-bold text-sky-400">{scores[player.id] || 0} pts</span>
            {index === 0 && <CrownIcon className="w-8 h-8 text-yellow-400" />}
          </li>
        ))}
      </ul>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isHost && (
          <Button onClick={returnToLobby} variant="primary">
            Jogar Novamente
          </Button>
        )}
        <Button onClick={resetGame} variant="secondary">
          Sair para o Menu Principal
        </Button>
      </div>
    </div>
  );
};

export default ScoreboardScreen;