<template>
    <main>
        <div class="content create-lobby">
            <h2>Choose quiz</h2>
            <form @submit.prevent="submitChooseQuizForm" class="choose-quiz">
                <select v-model="selectedQuiz" class="quiz-dropdown input-field">
                    <option disabled value="">Select a quiz</option>
                    <option v-for="quiz in quizzes" :key="quiz._id" :value="quiz._id">
                        {{ quiz.title }}
                    </option>
                </select>
                <button class="button-small" type="submit">Continue</button>
            </form>
        </div>
    </main>
</template>

<script>
    export default {
        name: 'CreateLobbyPage',
        data() {
            return {
                selectedQuiz: '', 
                quizzes: [], 
                errorMessage: '' 
            };
        },
        mounted() {
            this.fetchUserQuizzes(); 
        },
        methods: {
            async fetchUserQuizzes() {
                try {
                    const response = await fetch('http://localhost:3000/user-quizzes', {
                        method: 'GET',
                        credentials: 'include' 
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log('Fetched quizzes:', data); 
                    if (data.quizzes && Array.isArray(data.quizzes)) {
                        this.quizzes = data.quizzes; 
                    } else {
                        this.errorMessage = 'Failed to fetch quizzes';
                        console.error(this.errorMessage);
                    }
                } catch (error) {
                    this.errorMessage = 'An error occurred while fetching quizzes';
                    console.error(this.errorMessage, error);
                }
            }
        }
    };
</script>