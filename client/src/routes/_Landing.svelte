<script lang="ts">
  import { gameRoom } from 'stores';

  import { onMount } from 'svelte';

  import { push } from 'svelte-spa-router';

  let roomID = '';

  onMount(() => gameRoom.reset());
</script>

<h1>Cards Against Hoomanity</h1>

<main>
  <div class="card">
    <h3>Join Game</h3>
    <input type="text" placeholder="RoomID" bind:value={roomID} />
    <button disabled={roomID.length !== 16} on:click={() => push(`/lobby/${roomID}`)} class="">Join</button>
  </div>
  <div class="card">
    <h3>Create Game</h3>
    <button class="" on:click={() => push('/create')}>Create</button>
  </div>
</main>

<style lang="scss">
  main {
    margin-top: 10rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
  }
</style>
