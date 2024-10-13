<template>
    <main>
        <div class="content join-lobby">
            <h2>Lobby Code</h2>
            <form class="join-lobby-form" @submit.prevent="startQuiz">
                <input type="text" class="display-field" :value="lobbyCode" readonly>
                <p style="margin-bottom: 30px; margin-top: 0px;">Share this room code with your friends!</p>
                <button class="button-small red" type="button" @click="leaveLobby">Leave lobby</button>
                <button v-if="isHost" class="button-small green" type="button" @click="startQuiz">Start Quiz</button>
                <p>{{ playerCount }}/10 players joined</p>
            </form>
        </div>
    </main>
</template>

<script>
    import { socket } from "@/utils/socket";

    export default {
        name: 'LobbyPage',
        props: {
            lobbyCode: {
                type: String,
                required: true,
            }
        },
        data() {
            return {
                userId: '',
                hostId: '',
                isHost: false,
                playerCount: 0,
            };
        },
        async mounted() {
            await this.checkIfUserIsHost();
            socket.on('player-joined', (data) => {
                this.playerCount = data.playerCount;
            });
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
                    this.playerCount = lobbyData.players.length;

                    const userResponse = await fetch('http://localhost:3000/check-login', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const userData = await userResponse.json();
                    if (userData.success) {
                        this.userId = userData.userId;
                    }

                    this.isHost = this.hostId === this.userId;
                } catch (error) {
                    console.error('Error fetching lobby or user data:', error);
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