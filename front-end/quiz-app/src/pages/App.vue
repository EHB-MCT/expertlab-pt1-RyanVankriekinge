<template>
<div>
  <nav>
    <router-link to="/" class="nav-link">
      <img src="../assets/icons/Icon awesome-arrow-alt-circle-left.svg" alt="Back" class="icon" />
    </router-link>
    
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
  name: 'App'
};
</script>

<style>
  
</style>
