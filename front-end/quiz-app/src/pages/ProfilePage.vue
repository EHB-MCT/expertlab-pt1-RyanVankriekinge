<template>
    <main>
        <div class="content profile" v-if="user">
            <h2>Profile</h2>
            <p>Username: {{ user.username }}</p>
            <p>E-mail: {{ user.email }}</p>
            <h2>My quizzes</h2>

        </div>
        <div v-else>
            <p>Loading user information...</p>
        </div>
    </main>
</template>

<script>
    export default {
        name: 'ProfilePage',
        data() {
            return {
                user: null, 
                errorMessage: '',
            };
        },
        async mounted() {
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
    };
</script>
