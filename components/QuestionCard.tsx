
import React, { useState } from 'react';
import { Question } from '../types';
import { HintIcon, CorrectIcon, IncorrectIcon, ExplanationIcon } from './Icons';

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedOption: string) => void;
  isAnswered: boolean;
  userAnswer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, isAnswered, userAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleOptionClick = (optionKey: string) => {
    if (isAnswered) return;
    setSelectedOption(optionKey);
  };
  
  const handleSubmit = () => {
    if(selectedOption) {
        onAnswer(selectedOption);
    }
  };

  const getOptionClass = (optionKey: string) => {
    if (!isAnswered) {
      return selectedOption === optionKey
        ? 'bg-blue-600 border-blue-400 ring-2 ring-blue-400'
        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700';
    }
    
    if (optionKey === question.correct_option) {
      return 'bg-green-700/60 border-green-500';
    }
    
    if (optionKey === userAnswer) {
      return 'bg-red-700/60 border-red-500';
    }
    
    return 'bg-slate-700/50 border-slate-600 opacity-60';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-200">{question.question_text}</h2>
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex-shrink-0 ml-4 p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors"
          title="Show Hint"
        >
          <HintIcon />
        </button>
      </div>

      {showHint && (
        <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg animate-fade-in-sm">
          <p className="text-slate-300 italic">{question.hint}</p>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleOptionClick(key)}
            disabled={isAnswered}
            className={`w-full text-left p-4 border rounded-lg transition-all duration-300 flex items-center justify-between ${getOptionClass(key)} ${!isAnswered ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <span className="font-medium">{key}. {value}</span>
            {isAnswered && key === question.correct_option && <CorrectIcon />}
            {isAnswered && key === userAnswer && key !== question.correct_option && <IncorrectIcon />}
          </button>
        ))}
      </div>
      
      {!isAnswered && (
         <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed hover:bg-slate-500"
        >
            Check Answer
        </button>
      )}

      {isAnswered && (
        <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg animate-fade-in space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
                <ExplanationIcon />
                <h3 className="text-slate-200">Explanation</h3>
            </div>
          <p className="text-slate-300">{question.answer_explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
