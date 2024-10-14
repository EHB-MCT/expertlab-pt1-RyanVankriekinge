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
        loadNextQuestion() {
            if (this.questions && this.questions.length > 0) {
                if (this.currentQuestionIndex < this.questions.length) {
                    this.quizStarted = true;
                    this.currentQuestion = this.questions[this.currentQuestionIndex];
                    this.currentQuestionIndex++;
                } else {
                    this.endQuiz();
                }
            } else {
                console.error('No questions available to load.');
            }
        },
    }
</script>