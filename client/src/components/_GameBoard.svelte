<script lang="ts">
  import { cards, clock, gameRoom, player } from 'stores';
  import values from 'lodash/values';
  import { eventManager } from 'managers';
  import WhiteCard from './_WhiteCard.svelte';

  let isClockRunning: boolean = true;
  let isCzar: boolean = false;

  const handlePick = (uid: string) => () => eventManager.czarPick(uid);

  $: isClockRunning = $clock >= 0;
  $: isCzar = $player.uid === $gameRoom.czar;
</script>

<div class="container">
  {#each values($gameRoom.players) as { id, picks }}
    {#each picks as cardIndex}
      <WhiteCard selectedIndex={-1} disabled={!isCzar} {cardIndex} hidden={!isClockRunning} on:click={handlePick(id)} />
    {/each}
  {/each}
</div>

<style lang="scss">
  .container {
    height: 100%;
    grid-column: 2 / span 1;
  }
</style>
