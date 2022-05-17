<script lang="ts">
  import { Game, GameCreator, GameLobby, Landing, NotFound } from 'routes';
  import { cards } from 'stores';
  import Router from 'svelte-spa-router';

  const routes = {
    '/': Landing,
    '/lobby/:roomID': GameLobby,
    '/game/:roomID': Game,
    '/create': GameCreator,
    '*': NotFound,
  };
</script>

{#await cards.load()}
  loading...
{:then _}
  <Router {routes} />
{/await}
