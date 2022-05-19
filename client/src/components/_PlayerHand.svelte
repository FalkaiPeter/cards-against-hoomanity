<script lang="ts">
  import { cards, clock, gameRoom, player } from 'stores';
  import remove from 'lodash/remove';
  import { eventManager } from 'managers';
  import { WhiteCard } from 'components';

  let picks: number[] = [];
  let isEnoughSelected: boolean = false;
  let isPlayerPicked: boolean = false;
  let isClockRunning: boolean = true;
  let isCzar: boolean = false;

  const handleCardSelect = (index: number) => () => {
    if (picks.includes(index)) picks = remove(picks, index);
    else if (picks.length === $cards.black[$gameRoom.black].pick) return;
    else picks = [...picks, index];
  };

  const handleCommit = () => eventManager.playerPick(picks);

  $: isEnoughSelected = picks.length === $cards.black[$gameRoom.black]?.pick || false;
  $: isPlayerPicked = !!$gameRoom.players[$player.uid]?.picks.length || false;
  $: isClockRunning = $clock > 0;
  $: isCzar = $player.uid === $gameRoom.czar;
  $: console.log(picks);
</script>

{#if $gameRoom.players[$player.uid]}
  <div class="container">
    {#if $gameRoom.czar === $player.uid}
      <span class="czar-overlay">You are the czar</span>
    {/if}
    <button class="commit" disabled={!isEnoughSelected || isPlayerPicked || !isClockRunning} on:click={handleCommit}>
      Commit Picks
    </button>
    {#each $gameRoom.players[$player.uid].cards as cardIndex}
      <WhiteCard
        selectedIndex={picks.findIndex((v) => v === cardIndex) + 1}
        disabled={isCzar || !isClockRunning}
        {cardIndex}
        hidden={false}
        on:click={handleCardSelect(cardIndex)}
      />
    {/each}
  </div>
{/if}

<style lang="scss">
  @import '../styles/_colors.scss';
  .container {
    grid-column: 2 / span 1;
    grid-row: 2 / span 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    position: relative;

    & > .commit {
      grid-column: 1 / span 5;
    }

    & > .czar-overlay {
      font-size: 5rem;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba($color: $neutral_800, $alpha: 0.5);
      display: grid;
      place-items: center;
      user-select: none;
      cursor: default;
      z-index: 100;
    }
  }
</style>
