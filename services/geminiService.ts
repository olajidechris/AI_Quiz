
import { GoogleGenAI, Type } from "@google/genai";
import { QuizParams, Question } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question_id: { 
            type: Type.STRING,
            description: "A unique identifier for the question."
        },
        question_text: { 
            type: Type.STRING,
            description: "The text of the multiple-choice question."
        },
        options: {
            type: Type.STRING,
            description: "A JSON string of an object containing key-value pairs for the options. For example, '{\"A\": \"Option A Text\", \"B\": \"Option B Text\"}'.",
        },
        correct_option: {
            type: Type.STRING,
            description: "The key of the correct option from the 'options' object (e.g., 'A')."
        },
        hint: { 
            type: Type.STRING,
            description: "A helpful hint for the user if they are stuck."
        },
        answer_explanation: { 
            type: Type.STRING,
            description: "A detailed explanation for why the correct option is right."
        }
    },
    required: ["question_id", "question_text", "options", "correct_option", "hint", "answer_explanation"]
};

const quizSchema = {
    type: Type.ARRAY,
    items: questionSchema
};

export const generateQuiz = async (params: QuizParams): Promise<Question[]> => {
    const prompt = `
        Please generate a multiple-choice quiz based on the following parameters.
        Ensure the output is a valid JSON array of question objects that strictly adheres to the provided schema.

        Exam Type: ${params.exam}
        Subject: ${params.subject}
        Topic: ${params.topic}
        Number of Questions: ${params.numQuestions}
        Difficulty Level: ${params.difficulty}

        Each question object must contain a unique question_id, the question_text, an 'options' property which is a JSON string representing an object with at least three key-value pairs, the key of the correct_option, a hint, and a detailed answer_explanation.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: quizSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const rawQuestions: any[] = JSON.parse(jsonText);

        const generatedQuestions: Question[] = rawQuestions.map((q) => {
            let parsedOptions = {};
            try {
                if (typeof q.options === 'string') {
                    parsedOptions = JSON.parse(q.options);
                } else if (typeof q.options === 'object' && q.options !== null) {
                    // Handle cases where the model might ignore instructions and return an object
                    parsedOptions = q.options;
                }
            } catch (e) {
                console.error(`Failed to parse options for question ID ${q.question_id}:`, q.options, e);
            }
            return {
                ...q,
                options: parsedOptions,
            };
        });

        return generatedQuestions;

    } catch (error) {
        console.error("Error generating quiz from Gemini API:", error);
        throw new Error("Failed to generate quiz. The AI model might be unavailable or the request was malformed.");
    }
};
