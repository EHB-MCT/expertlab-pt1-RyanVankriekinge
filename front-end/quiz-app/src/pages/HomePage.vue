<template>
    <main>
      <div class="content home">
        <h2>Play a quiz</h2>
        <button class="button-big" @click="goToHostLobby">Host lobby</button>
        <button class="button-big" @click="goToJoinLobby">Join lobby</button>
    </div>
  </main>
</template>
<script>
  export default {
    name: 'HomePage',
    methods: {
      goToHostLobby() {
        this.$router.push('/host-lobby'); 
      },
      goToJoinLobby() {
        this.$router.push('/join-lobby');
      }
    }
  };
</script>