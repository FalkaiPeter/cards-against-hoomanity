<script lang="ts">
  import { cards, gameRoom } from 'stores';
  import { eventManager } from 'managers';
  import { onMount } from 'svelte';
  import { BlackCard, Clock, GameBoard, LadderBoard, PlayerHand } from 'components';

  export let params;

  onMount(() => {
    eventManager.joinRoom(params.roomID);
    eventManager.listenGameRoom();
    eventManager.listenClock();
    eventManager.loadGameRoom(params.roomID);
  });
</script>

<main>
  <div class="side">
    <BlackCard cardIndex={$gameRoom.black} />
    <Clock />
    <LadderBoard />
  </div>

  <GameBoard />
  <PlayerHand />
</main>

<style lang="scss">
  main {
    box-sizing: border-box;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 300px auto;
    gap: 1rem;
    & > .side {
      grid-row: 1 / span 2;
      display: grid;
      gap: 1rem;
      grid-template-rows: min-content min-content auto;
    }
  }
</style>
