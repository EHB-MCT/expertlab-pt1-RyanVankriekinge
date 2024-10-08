<template>
    <main>
      <div class="content create-account">
        <h2>Create account</h2>
        <form @submit.prevent="join" class="create-account-form">
          <input
            v-model="username"
            type="text"
            class="input-field"
            placeholder="Username"
            required
          />

          <input
            v-model="email"
            type="email"
            class="input-field"
            placeholder="Email"
            required
          />

          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="Password"
            required
          />

          <input
            v-model="confirmPassword"
            type="password"
            class="input-field"
            placeholder="Confirm Password"
            required
          />

          <button class="button-small" type="submit">Confirm</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </main>
</template>

<script>
    export default {
        name: 'CreateAccountPage',
        data() {
            return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: ''
            };
        },
        methods: {
            async join() {
                if (this.password !== this.confirmPassword) {
                    this.errorMessage = 'Passwords do not match';
                    return;
                }

                try {
                    const response = await fetch('http://localhost:3000/addUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        confirmPassword: this.confirmPassword
                    })
                    });

                    const result = await response.json();

                    if (response.ok) {
                    alert('Account successfully created');
                    this.errorMessage = '';
                    this.$router.push('/profile');
                    } else {
                    this.errorMessage = result.error || 'An error occurred';
                    }
                } catch (error) {
                    this.errorMessage = 'An error occurred while connecting to the server';
                }
            }
        }
    };
</script>