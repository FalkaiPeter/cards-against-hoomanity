<script lang="ts">
  import { eventManager } from 'managers';
  import { cards, gameRoom, player } from 'stores';
  import { onDestroy, onMount } from 'svelte';
  import values from 'lodash/values';
  import { replace } from 'svelte-spa-router';
  import { Dialog } from 'components';

  export let params;

  const handleJoin = () => eventManager.joinRoom(params.roomID);

  $: {
    if ($gameRoom && $gameRoom.state === 'running' && $player.uid in $gameRoom.players) replace(`/game/${params.id}`);
  }

  onMount(() => {
    gameRoom.reset();
    eventManager.listenGameStart();
    eventManager.listenGameRoom();
    eventManager.loadGameRoom(params.roomID);
  });

  onDestroy(() => eventManager.offGameRoom());
</script>

<Dialog open={$gameRoom?.state === 'running'}>
  <h3>Game is already running!</h3>
  <button on:click={() => replace('/')}>Got it :(</button>
</Dialog>

<Dialog open={!($player.uid in $gameRoom?.players)}>
  <h3>Set your name</h3>
  <input type="text" bind:value={$player.name} />
  <button disabled={!$player.name.length} on:click={handleJoin}>join</button>
</Dialog>

<h1>Lobby</h1>
<h2>GameRoomID: {$gameRoom.id}</h2>

<main>
  <div class="card">
    <h3>Packs</h3>
    <ul>
      {#each $gameRoom.packs as pack}
        <li>{$cards.packs[pack].name}</li>
      {/each}
    </ul>
  </div>
  <div class="card">
    <h3>Players</h3>
    <ul>
      {#each values($gameRoom.players) as player}
        <li>{player.name}</li>
      {/each}
    </ul>
  </div>
</main>

{#if $gameRoom.owner === $player.uid}
  <button class="start-btn" on:click={() => eventManager.gameStart()}>Start</button>
{/if}

<style lang="scss">
  main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .start-btn {
    margin-top: 2rem;
    width: 60%;
  }
</style>
