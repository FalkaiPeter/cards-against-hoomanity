<script lang="ts">
  export let open;
</script>

{#if open}
  <span class="backdrop">
    <div class="card">
      <slot />
    </div>
  </span>
{/if}

<style lang="scss">
  $neutral_900: #0f0f18;
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: grid;
    place-items: center;
    background-color: $neutral_900;
    z-index: 100;
  }
</style>
