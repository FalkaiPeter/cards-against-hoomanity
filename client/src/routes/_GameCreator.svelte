<script lang="ts">
  import { eventManager } from 'managers';
  import { cards } from 'stores';
  import remove from 'lodash/remove';

  let packs: number[] = [];

  const handleClick = (index: number) => () => {
    if (packs.includes(index)) packs = remove(packs, index);
    else packs = [...packs, index];
  };

  const handleCreate = () => eventManager.createRoom(packs);
</script>

<h1>Game Room Creator</h1>

<main>
  <ul>
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
