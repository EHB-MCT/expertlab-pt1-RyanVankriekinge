<template>
    <main>
        <div class="content profile" v-if="user">
            <h2>Profile</h2>
            <p>Username: {{ user.username }}</p>
            <p>E-mail: {{ user.email }}</p>
            <button class="button-small red" style="margin-top: 30px;" @click="logout">Log out</button>
            <h2>My quizzes</h2>
            <div v-if="quizzes && quizzes.length > 0">
                <p v-for="quiz in quizzes" :key="quiz._id">
                    {{ quiz.title }}
                </p>
            </div>
            <p v-else>You have no quizzes yet.</p>
        </div>
        <div v-else class="content">
            <p>Loading user information...</p>
        </div>
    </main>
</template>

<script>
    import { changePageWhenNotLoggedIn } from '@/utils/changePageWhenNotLoggedIn.js';
    export default {
        name: 'ProfilePage',
        data() {
            return {
                user: null, 
                errorMessage: '',
                quizzes: [],
            };
        },
        mounted() {
            changePageWhenNotLoggedIn(this.$router);
            this.loadUserInfo();
            this.fetchUserQuizzes();
        },
        methods: {
            async loadUserInfo() {
                try {
                    const response = await fetch('http://localhost:3000/check-login', {
                        method: 'GET',
                        credentials: 'include' 
                    });

                    const data = await response.json();

                    if (data.success) {
                        this.user = { username: data.username, email: data.email };
                    } else {
                        this.errorMessage = 'User is not authenticated';
                        console.error(this.errorMessage);
                    }
                } catch (error) {
                    this.errorMessage = 'An error occurred while fetching user info';
                    console.error(this.errorMessage, error);
                }
            },
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
            },
            async logout() {
                try {
                    const response = await fetch('http://localhost:3000/log-out', {
                        method: 'POST',
                        credentials: 'include' 
                    });

                    const data = await response.json();

                    if (data.success) {
                        this.user = null; 
                        this.$router.push('/login');
                    } else {
                        console.error('Log out failed:', data.message);
                    }
                } catch (error) {
                    console.error('An error occurred during log out:', error);
                }
            }
        }

    };
</script>
