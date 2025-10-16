import { Question } from './types';

export const AVATAR_SEEDS = [
    "Gizmo", "Garfield", "Precious", "Missy", "Coco", "Mimi", "Tigger", "Midnight", "Smokey", "Boots", "Luna", "Oreo"
];

export const DEFAULT_QUESTIONS: Question[] = [
    {
        id: 'q1',
        text: 'Qual é a capital da França?',
        options: ['Berlim', 'Madrid', 'Paris', 'Roma'],
        correctAnswerIndex: 2,
    },
    {
        id: 'q2',
        text: 'Qual planeta é conhecido como o Planeta Vermelho?',
        options: ['Terra', 'Marte', 'Júpiter', 'Vênus'],
        correctAnswerIndex: 1,
    },
    {
        id: 'q3',
        text: 'Qual é o maior mamífero do mundo?',
        options: ['Elefante', 'Baleia Azul', 'Tubarão Branco', 'Girafa'],
        correctAnswerIndex: 1,
    },
    {
        id: 'q4',
        text: 'Quem escreveu a peça "Romeu e Julieta"?',
        options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'],
        correctAnswerIndex: 1,
    },
];