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
  import ReversePage from './pages/ReversePage.svelte';
  import BugDescriptionPage from './pages/BugDescriptionPage.svelte';
  import VerifyEditDetailsPage from './pages/VerifyEditDetailsPage.svelte';

  import ThankYouPage from './pages/ThankYouPage.svelte';

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
{:else if view === 'wrongordersearch'}
  <SearchPage />
{:else if view === 'wronginfosearch'}
  <SearchPage />
{:else if view === 'wronginforeverse'}
  <ReversePage />
{:else if view === 'wrongresultsearch'}
  <SearchPage />
{:else if view === 'wrongresultreverse'}
  <ReversePage />
{:else if view === 'bugdescription'}
  <BugDescriptionPage />
{:else if view === 'thankyou'}
  <ThankYouPage />
{:else if view === 'verifyedit'}
  <VerifyEditDetailsPage />
{/if}
<Footer />
