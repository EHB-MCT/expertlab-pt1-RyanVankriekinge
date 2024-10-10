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
  import { socket } from "@/utils/socket";
  export default {
    name: 'JoinLobbyPage',
    data() {
      return {
          lobbyCode: '', 
          errorMessage: '',
      };
    },
    methods: {
      async submitJoinLobbyForm() {
        if (this.lobbyCode) {
          try {
            const response = await fetch('http://localhost:3000/check-login', {
              method: 'GET',
              credentials: 'include'
            });
            const userData = await response.json();
            
            if (userData.success) {
              const userId = userData.userId; 
              socket.emit('join-lobby', {
                lobbyCode: this.lobbyCode,
                userId: userId
              });
            } else {
              this.errorMessage = 'User is not authenticated';
            }
          } catch (error) {
            this.errorMessage = 'An error occurred while authenticating user';
            console.error(this.errorMessage, error);
          }
        } else {
            this.errorMessage = 'Lobby not found.';
        }
      }
    },
    mounted() {
      socket.on('lobby-joined', (data) => {
        console.log('Joined lobby:', data);
        const playerCount = data.players.length;
        this.$router.push({
          name: 'lobby',  
          params: {
            lobbyCode: data.lobbyCode,
            players: playerCount
          }
        });
      });
      socket.on('lobby-error', (error) => {
        this.errorMessage = error.message;
      });
    },
  };
</script>