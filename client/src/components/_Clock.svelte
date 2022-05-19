<script lang="ts">
  import { clock } from 'stores';
</script>

<div class="card">
  <h3>{$clock > 0 ? `${$clock}s` : 'Stopped'}</h3>
</div>

<style lang="scss">
  div {
    text-align: center;
    display: flex;
  }
</style>
