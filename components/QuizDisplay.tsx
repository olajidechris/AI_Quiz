
import React, { useState } from 'react';
import { Question, Answer } from '../types';
import QuestionCard from './QuestionCard';
import { TrophyIcon, RestartIcon } from './Icons';

interface QuizDisplayProps {
  questions: Question[];
  onReset: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ questions, onReset }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (selectedOption: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_option;
    
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.question_id,
      selectedOption,
      isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const score = answers.filter(a => a.isCorrect).length;
  const currentAnswer = answers.find(a => a.questionId === questions[currentQuestionIndex]?.question_id);

  if (quizFinished) {
    return (
      <div className="text-center animate-fade-in p-4">
        <TrophyIcon />
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mt-4 mb-2">Quiz Complete!</h2>
        <p className="text-xl text-slate-300 mb-6">
          Your final score is <span className="font-bold text-2xl text-white">{score}</span> out of <span className="font-bold text-2xl text-white">{questions.length}</span>.
        </p>
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 inline-flex items-center gap-2"
        >
          <RestartIcon />
          Take Another Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</div>
          <div className="text-sm font-bold bg-slate-700/50 px-3 py-1 rounded-full">Score: {score}</div>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full mb-6">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
      </div>
      <QuestionCard
        key={questions[currentQuestionIndex].question_id}
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        isAnswered={!!currentAnswer}
        userAnswer={currentAnswer?.selectedOption}
      />
      {currentAnswer && (
        <div className="mt-6 text-center">
          <button
            onClick={handleNextQuestion}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 animate-pulse-once"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizDisplay;
