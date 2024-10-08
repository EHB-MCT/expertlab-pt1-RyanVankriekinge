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
    };
</script>