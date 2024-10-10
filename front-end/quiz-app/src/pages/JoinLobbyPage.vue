<template>
  <main>
      <div class="content join-lobby">
        <h2>Enter Lobby Code</h2>
        <form @submit.prevent="submitJoinLobbyForm" class="join-lobby-form">
          <input v-model="lobbyCode" type="text" class="lobby-input input-field" placeholder="Enter lobby code" required/>
          <button class="button-small" type="submit">Join</button>
        </form>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
  </main>
</template>

<script>
    export default {
        name: 'JoinLobbyPage',
        data() {
        return {
            lobbyCode: '', 
            errorMessage: '',
        };
    },
    };
</script>