<script lang="ts">
  import { cards } from 'stores';

  export let cardIndex;
</script>

<div>
  {$cards.black[cardIndex]?.text || ''}
</div>

<style lang="scss">
  @import '../styles/_colors.scss';
  div {
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid rgba($color: $light, $alpha: 0.3);
    border-radius: 4px;
    background-color: $neutral_800;
    padding: 1rem;
    box-sizing: border-box;
  }
</style>
