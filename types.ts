
export enum Screen {
  Welcome = 'WELCOME',
  Lobby = 'LOBBY',
  Game = 'GAME',
  Scoreboard = 'SCOREBOARD',
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface GameState {
  screen: Screen;
  isHost: boolean;
  roomCode: string;
  players: Player[];
  currentUser: Player | null;
  questions: Question[];
  currentQuestionIndex: number;
  scores: { [playerId: string]: number };
  playerAnswers: { [playerId: string]: { [questionId: string]: number } };
}

export interface GameContextType extends GameState {
  createRoom: (user: Player) => void;
  joinRoom: (user: Player, roomCode: string) => void;
  setQuestions: (questions: Question[]) => void;
  startGame: () => void;
  answerQuestion: (questionId: string, answerIndex: number) => void;
  nextQuestion: () => void;
  resetGame: () => void;
  returnToLobby: () => void;
}
