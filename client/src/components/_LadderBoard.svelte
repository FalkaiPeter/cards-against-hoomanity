<script lang="ts">
  import { gameRoom } from 'stores';
  import values from 'lodash/values';
</script>

<div class="card">
  <h3>Players</h3>
  <ul>
    {#each values($gameRoom.players) as individual}
      <li>
        <span>{individual.name} <span class="czar">{individual.id === $gameRoom.czar ? '(czar)' : ''}</span></span>
        <span>{individual.points}p</span>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .czar {
    flex-grow: 1;
    opacity: 0.5;
  }
  li {
    display: grid;
    grid-template-columns: auto max-content;
    padding-inline: 0;
    word-break: break-all;
  }
</style>
