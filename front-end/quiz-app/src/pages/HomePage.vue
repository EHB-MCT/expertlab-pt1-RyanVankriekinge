<template>
    <main>
      <div class="content home">
        <h2>Play a quiz</h2>
        <button class="button-big" @click="goToCreateLobby">Host lobby</button>
        <button class="button-big" @click="goToJoinLobby">Join lobby</button>
        <button class="create-quiz-button" @click="goToCreateQuiz">Create quiz</button>
    </div>
  </main>
</template>
<script>
import { changePageWhenNotLoggedIn } from '@/utils/changePageWhenNotLoggedIn.js';
  export default {
    name: 'HomePage',
    methods: {
      goToCreateLobby() {
        this.$router.push('/create-lobby'); 
      },
      goToJoinLobby() {
        this.$router.push('/join-lobby');
      },
      goToCreateQuiz() {
        this.$router.push('/create-quiz');
      }
    },
    mounted(){
      changePageWhenNotLoggedIn(this.$router);
    }
  };
</script>