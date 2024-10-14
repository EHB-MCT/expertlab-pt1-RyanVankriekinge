<template>
    <main>
        <div class="content profile" v-if="user">
            <h2>Profile</h2>
            <p>Username: {{ user.username }}</p>
            <p>E-mail: {{ user.email }}</p>
            <button class="button-small red" style="margin-top: 30px;" @click="logout">Log out</button>
            <h2>My quizzes</h2>
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
            };
        },
        mounted() {
            changePageWhenNotLoggedIn(this.$router);
            this.loadUserInfo();
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
