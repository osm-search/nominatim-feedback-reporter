<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap/dist/js/bootstrap.bundle.js';

  import {
    page,
    refresh_page,
    help_text_store,
    updates_store
  } from './lib/stores.js';
  import { helpText } from './lib/page_help_text';

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
  $: {
    help_text_store.set(helpText[String(view)]);
  }
  refresh_page();

  // eslint-disable-next-line max-len
  updates_store.set('This project is in active development and unfinished. Only India data is currently imported. Data gets saved but will be deleted later. <a href="https://github.com/darkshredder/nominatim-feedback-reporter">Link to Source Code</a>.');
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
