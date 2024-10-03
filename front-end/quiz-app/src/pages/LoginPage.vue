<template>
    <main>
      <div class="content login">
        <h2>Log in</h2>
        <form @submit.prevent="login" class="login-form">

          <input
            v-model="username"
            type="text"
            class="input-field"
            placeholder="Username"
            required
          />

          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="Password"
            required
          />

          <button class="button-small" type="submit">Log In</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </main>
  </template>
  
  <script>
  export default {
    name: 'LoginPage',
    data() {
      return {
        username: '', 
        password: '', 
        errorMessage: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
            }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            alert('Logged in successfully!'); 
          } else {
            this.errorMessage = result.message; 
          }
        } catch (error) {
          console.error('Error during login:', error);
          this.errorMessage = 'An error occurred. Please try again.'; 
        }
      },
    },
  };
  </script>