<script lang="ts">
  import { eventManager } from 'managers';
  import { cards } from 'stores';
  import filter from 'lodash/filter';

  let packs: number[] = [];

  const handleClick = (index: number) => () => {
    if (packs.includes(index)) packs = filter(packs, (v) => index !== v);
    else packs = [...packs, index];
  };

  const handleCreate = () => eventManager.createRoom(packs);
</script>

<h1>Game Room Creator</h1>

<main>
  <ul class="card">
    <h3>Packs</h3>
    {#each $cards.packs as pack, index}
      <li on:click={handleClick(index)}>
        <input type="checkbox" checked={packs.includes(index)} />
        {pack.name}
      </li>
    {/each}
  </ul>
  <button disabled={packs.length === 0} on:click={handleCreate}>Create</button>
</main>

<style lang="scss">
  li {
    cursor: pointer;
  }
  button {
    margin: 1rem 0;
    width: 100%;
  }
</style>
