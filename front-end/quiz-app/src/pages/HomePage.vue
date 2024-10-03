<template>
    <main>
      <div class="content home">
        <h2>Play a quiz</h2>
        <button class="button-big" @click="goToCreateLobby">Host lobby</button>
        <button class="button-big" @click="goToJoinLobby">Join lobby</button>
    </div>
  </main>
</template>
<script>
  export default {
    name: 'HomePage',
    methods: {
      goToCreateLobby() {
        this.$router.push('/create-lobby'); 
      },
      goToJoinLobby() {
        this.$router.push('/join-lobby');
      }
    }
  };
</script>