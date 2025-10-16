import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../contexts/GameContext';

const GameScreen: React.FC = () => {
  const context = useContext(GameContext);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [context?.currentQuestionIndex]);

  if (!context) return null;

  const { questions, currentQuestionIndex, answerQuestion, nextQuestion, currentUser } = context;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Carregando pergunta...</div>;
  }

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    answerQuestion(currentQuestion.id, index);

    setTimeout(() => {
      nextQuestion();
    }, 2000); // Wait 2 seconds before moving to the next question
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-sky-700';
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return 'bg-emerald-600 animate-pulse';
    }
    if (index === selectedAnswer && index !== currentQuestion.correctAnswerIndex) {
      return 'bg-rose-600';
    }
    return 'bg-slate-800 opacity-60';
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fade-in text-center">
      <div className="mb-6">
        <p className="text-slate-400 text-lg">Pergunta {currentQuestionIndex + 1} de {questions.length}</p>
        <h2 className="text-3xl font-bold text-white mt-2">{currentQuestion.text}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            disabled={isAnswered}
            className={`p-6 rounded-lg text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed ${getButtonClass(index)}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;