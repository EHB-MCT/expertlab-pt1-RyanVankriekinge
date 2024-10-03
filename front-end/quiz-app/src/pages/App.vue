<template>
<div class="app">
  <nav>
    <a class="nav-link" @click.prevent="goBack">
      <img src="../assets/icons/Icon awesome-arrow-alt-circle-left.svg" alt="Back" class="icon" />
    </a>
    
    <router-link to="/" class="logo">
      <h1>FlashQuiz</h1>
    </router-link>

    <router-link to="/profile" class="nav-link">
      <img src="../assets/icons/Icon awesome-user-circle.svg" alt="Profile" class="icon" />
    </router-link>
  </nav>
    <RouterView></RouterView>
</div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  };
</script>