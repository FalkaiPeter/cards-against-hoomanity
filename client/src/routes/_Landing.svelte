<script lang="ts">
  import { eventManager } from 'managers';
  import { push } from 'svelte-spa-router';

  let roomID = '';

  const handleJoin = () => eventManager.joinRoom(roomID);
  const handleCreate = () => push('/create');
</script>

<h1>Cards Against Hoomanity</h1>

<main>
  <div class="">
    <h3>Join Game</h3>
    <input type="text" bind:value={roomID} />
    <button disabled={roomID.length !== 16} on:click={handleJoin} class="">Join</button>
  </div>
  <div class="">
    <h3>Create Game</h3>
    <button class="" on:click={handleCreate}>Create</button>
  </div>
</main>
