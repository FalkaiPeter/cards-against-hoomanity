<script lang="ts">
  import { eventManager } from 'managers';
  import { cards, gameRoom, player } from 'stores';
  import { onMount } from 'svelte';
  import values from 'lodash/values';
  import { replace } from 'svelte-spa-router';

  export let params;

  const handleJoin = () => eventManager.joinRoom(params.roomID);

  onMount(() => {
    eventManager.listenGameStart();
    eventManager.listenGameRoom();
    eventManager.loadGameRoom(params.roomID);
  });

  $: {
    if ($gameRoom && $gameRoom.state === 'running' && $player.uid in $gameRoom.players) replace(`/game/${params.id}`);
  }
</script>

{#if $gameRoom?.state === 'running'}
  <div>
    <h3>Game is already running!</h3>
    <button on:click={() => replace('/')}>Got it :(</button>
  </div>
{/if}

{#if !($player.uid in $gameRoom?.players)}
  <div>
    <h3>Set your name</h3>
    <input type="text" bind:value={$player.name} />
    <button disabled={!$player.name.length} on:click={handleJoin}>join</button>
  </div>
{/if}

<h1>Lobby</h1>
<h2>GameRoomID: {$gameRoom.id}</h2>
{#if $gameRoom.owner === $player.uid}
  <button on:click={() => eventManager.gameStart()}>Start</button>
{/if}
<main>
  <div class="">
    <h3>Packs</h3>
    <ul>
      {#each $gameRoom.packs as pack}
        <li>{$cards.packs[pack].name}</li>
      {/each}
    </ul>
  </div>
  <div class="">
    <h3>Players</h3>
    <ul>
      {#each values($gameRoom.players) as player}
        <li>{player.name}</li>
      {/each}
    </ul>
  </div>
</main>
