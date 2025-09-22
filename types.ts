
export interface QuizParams {
  exam: string;
  subject: string;
  topic: string;
  numQuestions: number;
  difficulty: 'Easy' | 'Intermediate' | 'Hard';
}

export interface Question {
  question_id: string;
  question_text: string;
  options: { [key: string]: string };
  correct_option: string;
  hint: string;
  answer_explanation: string;
}

export interface Answer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}
