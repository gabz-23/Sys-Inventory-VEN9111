export const SECURITY_QUESTIONS = [
    { id: 1, question: '¿Cuál es el nombre de tu mascota favorita?' },
    { id: 2, question: '¿En qué ciudad naciste?' },
    { id: 3, question: '¿Cuál es el nombre de tu mejor amigo de la infancia?' },
    { id: 4, question: '¿Cuál es el nombre de tu película favorita?' },
    { id: 5, question: '¿Cuál es el nombre de tu primer profesor?' },
    { id: 6, question: '¿Cuál es el nombre de tu comida favorita?' },
    { id: 7, question: '¿En qué calle creciste?' },
    { id: 8, question: '¿Cuál es el nombre de tu primer trabajo?' },
    { id: 9, question: '¿Cuál es el nombre de tu deporte favorito?' },
    { id: 10, question: '¿Cuál es el nombre de tu libro favorito?' },
];

export const getQuestionById = (id) => {
    return SECURITY_QUESTIONS.find((q) => q.id === id);
};
