<script lang="ts">
  import { cards } from 'stores';

  export let cardIndex: number;
  export let hidden: boolean;
  export let disabled: boolean;
  export let selectedIndex: number;
</script>

<button {disabled} on:click>
  {#if selectedIndex > 0}
    <span class="overlay">
      <span>{selectedIndex}</span>
    </span>
  {/if}
  <span class="text" {hidden}>{$cards.white[cardIndex]}</span>
</button>

<style lang="scss">
  @import '../styles/_colors.scss';
  button {
    aspect-ratio: 1;
    max-width: 200px;
    background-color: $light;
    text-transform: none;
    display: flex;
    text-align: left;
    position: relative;
    overflow: hidden;
    &:hover {
      box-shadow: inset 0 0 0 5px $primary;
      & > .overlay {
        box-shadow: inset 0 0 0 5px $primary;
      }
    }
    & > .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: grid;
      place-items: center;
      font-size: 10rem;
      font-weight: 600;
      z-index: 10;
      color: rgba($color: $neutral_800, $alpha: 0.3);

      background-color: rgba($color: $secondary, $alpha: 0.5);
    }
    & > .text {
      font-size: clamp(12px, 16px, 20px);
      z-index: 20;
    }
  }
</style>
