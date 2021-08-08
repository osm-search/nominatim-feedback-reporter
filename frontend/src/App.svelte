<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap/dist/js/bootstrap.bundle.js';

  import { page, refresh_page, help_text_store } from './lib/stores.js';
  import { helpText } from './lib/page_help_text';

  import Footer from './components/Footer.svelte';

  import SelectProblemPage from './pages/SelectProblemPage.svelte';
  import WrongResult from './pages/WrongResult.svelte';
  import WrongInfo from './pages/WrongInfo.svelte';
  import AboutPage from './pages/AboutPage.svelte';
  import SearchPage from './pages/SearchPage.svelte';
  import ReversePage from './pages/ReversePage.svelte';
  import BugDescriptionPage from './pages/BugDescriptionPage.svelte';
  import VerifyEditDetailsPage from './pages/VerifyEditDetailsPage.svelte';
  import ThankYouPage from './pages/ThankYouPage.svelte';
  import HomePage from './pages/HomePage.svelte';
  import DetailsPage from './pages/DetailsPage.svelte';
  import ReviewPage from './pages/ReviewPage.svelte';

  $: view = $page.tab;
  $: {
    help_text_store.set(helpText[String(view)]);
  }
  refresh_page();
</script>

<!-- deal with back-button and other user action -->
<!-- Handles routing of the website  -->
<svelte:window on:popstate={() => refresh_page()} />
{#if view === 'selecttype'}
  <SelectProblemPage />
{:else if view === 'search'}
  <SearchPage />
{:else if view === 'reverse'}
  <ReversePage />
{:else if view.includes('details')}
  <DetailsPage />
{:else if view === 'home'}
  <HomePage />
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
{:else if view === 'review'}
  <ReviewPage />
{:else if view === 'thankyou'}
  <ThankYouPage />
{:else if view === 'verifyedit'}
  <VerifyEditDetailsPage />
{/if}
<Footer />
