<template>
    <main>
      <div class="content join-lobby">
        <h2>Lobby Code</h2>
        <form class="join-lobby-form">
            <input type="text" class="display-field" value="XXXX" readonly>
            <p style="margin-bottom: 30px; margin-top: 0px;">Share this room code with your friends!</p>
          <button class="button-small" type="submit">Start Quiz</button>
          <p>../10 players joined</p>
        </form>
      </div>
    </main>
</template>

<script>
    export default {
        name: 'HostLobbyPage',
    };
</script>