
import React, { useState } from 'react';
import { QuizParams } from '../types';
import { GenerateIcon } from './Icons';

interface QuizFormProps {
  onGenerateQuiz: (params: QuizParams) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onGenerateQuiz }) => {
  const [params, setParams] = useState<QuizParams>({
    exam: 'WAEC',
    subject: 'Physics',
    topic: 'Waves',
    numQuestions: 5,
    difficulty: 'Intermediate',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name === 'numQuestions' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateQuiz(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="exam" className="block text-sm font-medium text-slate-300 mb-2">Exam Type</label>
          <input type="text" name="exam" id="exam" value={params.exam} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., WAEC, SAT" />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
          <input type="text" name="subject" id="subject" value={params.subject} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Physics" required />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">Topic</label>
        <input type="text" name="topic" id="topic" value={params.topic} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Waves" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-300 mb-2">Number of Questions ({params.numQuestions})</label>
          <input type="range" name="numQuestions" id="numQuestions" min="1" max="10" value={params.numQuestions} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
          <select name="difficulty" id="difficulty" value={params.difficulty} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option>Easy</option>
            <option>Intermediate</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
           <GenerateIcon />
           Generate Quiz
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
