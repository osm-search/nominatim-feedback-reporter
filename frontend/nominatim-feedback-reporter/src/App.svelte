<script>
	import 'bootstrap/dist/css/bootstrap.css';
	import 'bootstrap/dist/js/bootstrap.bundle.js';

	import { page, refresh_page } from './lib/stores.js';

	import Footer from './components/Footer.svelte';

	import WelcomePage from './pages/WelcomePage.svelte';
	import WrongResult from './pages/WrongResult.svelte';
	import WrongInfo from './pages/WrongInfo.svelte';
	import AboutPage from './pages/AboutPage.svelte';
	import SearchPage from './pages/SearchPage.svelte';

	$: view = $page.tab;

	refresh_page();
</script>
  
  <!-- deal with back-button and other user action -->
  <svelte:window on:popstate={() => refresh_page()} />
  
  {#if view === 'welcome'}
  <WelcomePage />
  {:else if view === 'about'}
  <AboutPage />
  {:else if view === 'wrongresult'}
  <WrongResult />
  {:else if view === 'wronginfo'}
  <WrongInfo />
  {:else if view === 'wronginfosearch'}
  <SearchPage />
  {/if}
  <Footer/>
  