<template>
    <main>
        <div class="content join-lobby">
            <h2>Lobby Code</h2>
            <form class="join-lobby-form" @submit.prevent="startQuiz">
                <input type="text" class="display-field" :value="lobbyCode" readonly>
                <p style="margin-bottom: 30px; margin-top: 0px;">Share this room code with your friends!</p>
                <button class="button-small red" type="button">Leave lobby</button>
                <button v-if="isHost" class="button-small green" type="button">Start Quiz</button>
                <p>{{ players }}/10 players joined</p>
            </form>
        </div>
    </main>
</template>

<script>
    export default {
        name: 'LobbyPage',
        props: {
            lobbyCode: {
                type: String,
                required: true
            },
            players: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                userId: '',
                hostId: '',
                isHost: false,
            };
        },
        async mounted() {
            await this.checkIfUserIsHost();
        },
        methods: {
            async checkIfUserIsHost() {
                try {
                    const response = await fetch(`http://localhost:3000/lobby/${this.lobbyCode}`, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch lobby data');
                    }
                    const lobbyData = await response.json();
                    this.hostId = lobbyData.hostId; 
                    const userResponse = await fetch('http://localhost:3000/check-login', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const userData = await userResponse.json();
                    if (userData.success) {
                        this.userId = userData.userId;
                        console.log('Current user ID:', this.userId);
                    } else {
                        console.error('User is not authenticated');
                    }
                    this.isHost = this.hostId === this.userId; 
                    console.log('Is host:', this.isHost, 'Host ID:', this.hostId, 'User ID:', this.userId);
                } catch (error) {
                    console.error('Error fetching lobby data:', error);
                }
            },
            startQuiz(){
                //
            },
            leaveLobby(){
                //
            }
        }
    };
</script>