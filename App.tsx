
import React, { useState, useCallback } from 'react';
import { QuizParams, Question } from './types';
import { generateQuiz } from './services/geminiService';
import QuizForm from './components/QuizForm';
import QuizDisplay from './components/QuizDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [quizParams, setQuizParams] = useState<QuizParams | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  const handleGenerateQuiz = useCallback(async (params: QuizParams) => {
    setIsLoading(true);
    setError(null);
    setQuizStarted(false);
    try {
      const generatedQuestions = await generateQuiz(params);
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setQuizParams(params);
        setQuizStarted(true);
      } else {
        setError('The AI failed to generate a quiz. Please try adjusting your topic or try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the quiz. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setQuizParams(null);
    setQuestions([]);
    setQuizStarted(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
             <LogoIcon />
             <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                AI Quiz Generator
             </h1>
          </div>
          <p className="text-slate-400 text-lg">Craft your perfect quiz on any topic, powered by Gemini.</p>
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-slate-900/50 p-6 sm:p-8 backdrop-blur-sm border border-slate-700">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="text-center">
              <p className="text-red-400 bg-red-900/50 p-4 rounded-lg mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!isLoading && !error && !quizStarted && (
            <QuizForm onGenerateQuiz={handleGenerateQuiz} />
          )}

          {!isLoading && !error && quizStarted && (
            <QuizDisplay questions={questions} onReset={handleReset} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
