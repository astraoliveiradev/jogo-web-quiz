import React, { useContext, useState } from 'react';
import { GameContext } from '../contexts/GameContext';
import { Question } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import QuestionEditor from '../components/QuestionEditor';
import { PencilIcon, TrashIcon, CrownIcon } from '../components/Icons';

const LobbyScreen: React.FC = () => {
  const context = useContext(GameContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  if (!context) return null;

  const { roomCode, players, isHost, questions, setQuestions, startGame, currentUser } = context;

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSaveQuestion = (question: Question) => {
    const index = questions.findIndex(q => q.id === question.id);
    if (index > -1) {
      const newQuestions = [...questions];
      newQuestions[index] = question;
      setQuestions(newQuestions);
    } else {
      setQuestions([...questions, question]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-center text-white">Lobby</h1>
        <div className="text-center mt-2">
            <span className="text-slate-400">Código da Sala: </span>
            <span className="font-mono text-lg bg-slate-700 text-sky-300 px-3 py-1 rounded-md">{roomCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Players List */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 text-white">Jogadores ({players.length})</h2>
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {players.map((player, index) => (
              <li key={player.id} className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg">
                <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full bg-slate-700" />
                <span className="text-lg font-medium text-slate-200">{player.name}</span>
                {index === 0 && <CrownIcon className="w-6 h-6 text-yellow-400 ml-auto" title="Anfitrião" />}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Questions List (Host only) */}
        {isHost && (
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">Perguntas ({questions.length})</h2>
              <Button onClick={handleAddQuestion}>Adicionar Pergunta</Button>
            </div>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {questions.map(q => (
                <li key={q.id} className="flex items-center gap-2 bg-slate-800 p-3 rounded-lg">
                  <p className="flex-grow truncate text-slate-300">{q.text}</p>
                  <button onClick={() => handleEditQuestion(q)} className="p-2 text-slate-400 hover:text-sky-400 transition-colors"><PencilIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><TrashIcon className="w-5 h-5"/></button>
                </li>
              ))}
              {questions.length === 0 && <p className="text-slate-400 text-center py-8">Adicione algumas perguntas para começar o jogo!</p>}
            </ul>
          </div>
        )}
      </div>

      {isHost ? (
        <div className="text-center pt-4">
          <Button onClick={startGame} disabled={questions.length === 0} className="w-full max-w-sm text-xl">
            Iniciar Jogo
          </Button>
        </div>
      ) : (
        <p className="text-center text-xl text-slate-300 pt-4 animate-pulse">Aguardando o anfitrião iniciar o jogo...</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingQuestion ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}>
        <QuestionEditor question={editingQuestion} onSave={handleSaveQuestion} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default LobbyScreen;