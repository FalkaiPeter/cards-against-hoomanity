<script lang="ts">
  import { Game, GameCreator, GameLobby, Landing, NotFound } from 'routes';
  import { cards } from 'stores';
  import Router from 'svelte-spa-router';
  import './styles/index.scss';

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
