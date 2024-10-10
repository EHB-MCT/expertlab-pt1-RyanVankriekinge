<template>
    <main>
        <div class="content join-lobby">
            <h2>Lobby Code</h2>
            <form class="join-lobby-form" @submit.prevent="startQuiz">
                <input type="text" class="display-field" :value="lobbyCode" readonly>
                <p style="margin-bottom: 30px; margin-top: 0px;">Share this room code with your friends!</p>
                <button class="button-small" type="submit">Start Quiz</button>
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
        methods: {
            startQuiz(){

            }
        }
    };
</script>