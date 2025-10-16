import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GameState, Player, Question, Screen } from './types';
import { GameContext } from './contexts/GameContext';
import WelcomeScreen from './screens/WelcomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';
import ScoreboardScreen from './screens/ScoreboardScreen';
import { DEFAULT_QUESTIONS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    screen: Screen.Welcome,
    isHost: false,
    roomCode: '',
    players: [],
    currentUser: null,
    questions: [],
    currentQuestionIndex: 0,
    scores: {},
    playerAnswers: {},
  });

  // Centralized state updater that syncs with sessionStorage
  const updateGameState = useCallback((updater: (prev: GameState) => GameState) => {
    setGameState(prev => {
        const newState = updater(prev);
        if (newState.roomCode) {
            try {
                sessionStorage.setItem(newState.roomCode, JSON.stringify(newState));
                // Use a generic key to notify other tabs, passing the roomCode in the value
                sessionStorage.setItem('quizmaster_update', `${newState.roomCode}:${Date.now()}`);
            } catch (error) {
                console.error("Failed to save state to sessionStorage:", error);
            }
        }
        return newState;
    });
  }, []);

  // Effect to sync state from sessionStorage for multi-tab experience
  useEffect(() => {
    const syncState = () => {
        if (!gameState.roomCode) return;
        const roomData = sessionStorage.getItem(gameState.roomCode);
        if (roomData) {
            try {
                const latestState: GameState = JSON.parse(roomData);
                // Update shared state while preserving local user identity
                setGameState(prevState => ({
                    ...prevState,
                    players: latestState.players,
                    screen: latestState.screen,
                    questions: latestState.questions,
                    currentQuestionIndex: latestState.currentQuestionIndex,
                    scores: latestState.scores,
                    playerAnswers: latestState.playerAnswers,
                }));
            } catch (e) {
                console.error("Error syncing state from sessionStorage", e);
            }
        }
    };

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'quizmaster_update' && gameState.roomCode) {
            const updatedRoomCode = event.newValue?.split(':')[0];
            if (updatedRoomCode === gameState.roomCode) {
                syncState();
            }
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [gameState.roomCode]);


  const createRoom = useCallback((user: Player) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    updateGameState(() => ({
      screen: Screen.Lobby,
      isHost: true,
      currentUser: user,
      players: [user],
      roomCode,
      questions: DEFAULT_QUESTIONS,
      currentQuestionIndex: 0,
      scores: { [user.id]: 0 },
      playerAnswers: {},
    }));
  }, [updateGameState]);

  const joinRoom = useCallback((user: Player, roomCode: string) => {
    const roomData = sessionStorage.getItem(roomCode);
    if (!roomData) {
      alert(`Sala "${roomCode}" não encontrada. Esta demonstração funciona apenas para salas criadas em outra aba no mesmo navegador.`);
      return;
    }
    
    try {
        const existingState: GameState = JSON.parse(roomData);
        if (existingState.screen !== Screen.Lobby) {
            alert("Não é possível entrar em um jogo que já está em andamento.");
            return;
        }
        if (existingState.players.some(p => p.name.toLowerCase() === user.name.toLowerCase())) {
            alert(`O jogador "${user.name}" já está na sala. Por favor, escolha um nome diferente.`);
            return;
        }

        const newPlayers = [...existingState.players, user];
        const newScores = { ...existingState.scores, [user.id]: 0 };

        updateGameState(() => ({
            ...existingState,
            currentUser: user,
            players: newPlayers,
            scores: newScores,
            isHost: false,
        }));

    } catch (error) {
        alert("Ocorreu um erro ao entrar na sala.");
        console.error(error);
    }
  }, [updateGameState]);

  const setQuestions = useCallback((questions: Question[]) => {
    updateGameState(prev => ({ ...prev, questions }));
  }, [updateGameState]);

  const startGame = useCallback(() => {
    updateGameState(prev => ({
      ...prev,
      screen: Screen.Game,
      currentQuestionIndex: 0,
      playerAnswers: {},
      scores: prev.players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {})
    }));
  }, [updateGameState]);

  const answerQuestion = useCallback((questionId: string, answerIndex: number) => {
    updateGameState(prev => {
      if (!prev.currentUser) return prev;

      const newPlayerAnswers = {
        ...prev.playerAnswers,
        [prev.currentUser.id]: {
          ...(prev.playerAnswers[prev.currentUser.id] || {}),
          [questionId]: answerIndex,
        },
      };

      const question = prev.questions.find(q => q.id === questionId);
      const isCorrect = question && question.correctAnswerIndex === answerIndex;
      const newScores = { ...prev.scores };
      if (isCorrect) {
        newScores[prev.currentUser.id] = (newScores[prev.currentUser.id] || 0) + 10;
      }

      return { ...prev, playerAnswers: newPlayerAnswers, scores: newScores };
    });
  }, [updateGameState]);

  const nextQuestion = useCallback(() => {
    // Only the host should trigger the state change that gets synced
    if (gameState.isHost) {
      updateGameState(prev => {
        if (prev.currentQuestionIndex < prev.questions.length - 1) {
          return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
        } else {
          return { ...prev, screen: Screen.Scoreboard };
        }
      });
    }
  }, [updateGameState, gameState.isHost]);

  const resetGame = useCallback(() => {
    updateGameState(prev => {
        if (prev.roomCode) {
            sessionStorage.removeItem(prev.roomCode);
        }
        return {
          screen: Screen.Welcome, isHost: false, roomCode: '', players: [],
          currentUser: null, questions: [], currentQuestionIndex: 0, scores: {}, playerAnswers: {},
        };
    });
  }, [updateGameState]);
  
  const returnToLobby = useCallback(() => {
    updateGameState(prev => ({
      ...prev,
      screen: Screen.Lobby,
      currentQuestionIndex: 0,
      scores: {},
      playerAnswers: {},
    }));
  }, [updateGameState]);

  const contextValue = useMemo(() => ({
    ...gameState, createRoom, joinRoom, setQuestions, startGame,
    answerQuestion, nextQuestion, resetGame, returnToLobby,
  }), [gameState, createRoom, joinRoom, setQuestions, startGame, answerQuestion, nextQuestion, resetGame, returnToLobby]);

  const renderScreen = () => {
    switch (gameState.screen) {
      case Screen.Welcome:
        return <WelcomeScreen />;
      case Screen.Lobby:
        return <LobbyScreen />;
      case Screen.Game:
        return <GameScreen />;
      case Screen.Scoreboard:
        return <ScoreboardScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <GameContext.Provider value={contextValue}>
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-indigo-900">
        {renderScreen()}
      </main>
    </GameContext.Provider>
  );
};

export default App;