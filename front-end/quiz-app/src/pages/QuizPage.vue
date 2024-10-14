<template>
    <main class="content">
        <h2>{{ quizTitle }}</h2>
        <p v-if="!quizStarted">Starting quiz, get ready for question 1...</p>
        <div v-else>
            <h3>{{ currentQuestion.title }}</h3>
            <div v-for="(answer, index) in currentQuestion.answers" :key="index">
                <button class="button-small" @click="submitAnswer(answer)">{{ answer.text }}</button>
            </div>
        </div>
    </main>
</template>

<script>
import { socket } from "@/utils/socket";

export default {
    name: 'QuizPage',
    data() {
        return {
            quizTitle: 'Loading quiz...', 
            quizStarted: false,
            currentQuestion: {},
            questions: [],
            currentQuestionIndex: 0
        };
    },
    mounted() {
        socket.on('quiz-starting', (quizData) => {
            this.quizTitle = quizData.title;
            this.questions = quizData.questions; 
            this.showGetReadyScreen();
        });

        socket.on('next-question', (question) => {
            this.quizStarted = true; 
            this.currentQuestion = question; 
        });
    },
    methods: {
        showGetReadyScreen() {
            setTimeout(() => {
                this.loadNextQuestion();
            }, 3000);
        },
    }
</script>