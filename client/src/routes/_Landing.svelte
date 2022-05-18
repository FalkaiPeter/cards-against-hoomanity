<script lang="ts">
  import { push } from 'svelte-spa-router';

  let roomID = '';
</script>

<h1>Cards Against Hoomanity</h1>

<main>
  <div class="">
    <h3>Join Game</h3>
    <input type="text" bind:value={roomID} />
    <button disabled={roomID.length !== 16} on:click={() => push(`/lobby/${roomID}`)} class="">Join</button>
  </div>
  <div class="">
    <h3>Create Game</h3>
    <button class="" on:click={() => push('/create')}>Create</button>
  </div>
</main>
