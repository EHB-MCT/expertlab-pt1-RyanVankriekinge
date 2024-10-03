<template>
    <main>
      <div class="content join-lobby">
        <h2>Enter Lobby Code</h2>
        <form class="join-lobby-form">
          <input type="text" class="lobby-input input-field" placeholder="Enter lobby code" required/>
          <button class="button-small" type="submit">Join</button>
        </form>
      </div>
    </main>
</template>

<script>
    export default {
        name: 'JoinLobbyPage',
    };
</script>