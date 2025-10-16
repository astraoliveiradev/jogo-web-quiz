import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import Button from './Button';

interface QuestionEditorProps {
  question: Question | null;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  useEffect(() => {
    if (question) {
      setText(question.text);
      setOptions(question.options);
      setCorrectAnswerIndex(question.correctAnswerIndex);
    } else {
      setText('');
      setOptions(['', '', '', '']);
      setCorrectAnswerIndex(0);
    }
  }, [question]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = () => {
    const newQuestion: Question = {
      id: question ? question.id : `q${Date.now()}`,
      text,
      options,
      correctAnswerIndex,
    };
    onSave(newQuestion);
  };

  const isFormValid = text.trim() !== '' && options.every(opt => opt.trim() !== '');

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="question-text" className="block text-sm font-medium text-slate-300 mb-1">
          Texto da Pergunta
        </label>
        <textarea
          id="question-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Opções (selecione a correta)</label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="radio"
                name="correct-answer"
                checked={correctAnswerIndex === index}
                onChange={() => setCorrectAnswerIndex(index)}
                className="h-5 w-5 text-sky-500 bg-slate-600 border-slate-500 focus:ring-sky-500"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Opção ${index + 1}`}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!isFormValid}>
          Salvar Pergunta
        </Button>
      </div>
    </div>
  );
};

export default QuestionEditor;