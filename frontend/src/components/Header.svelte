<script>
  import PageLink from './PageLink.svelte';
  import Section from './Section.svelte';
  import ReverseLink from './ReverseLink.svelte';
  import Loader from './Loader.svelte';
  import { map_store, page, loader_count_store } from '../lib/stores.js';

  $: view = $page.tab;
  $: page_title = Nominatim_Config.Page_Title;

  let map_lat;
  let map_lon;


  map_store.subscribe((map) => {
    if (!map) return;
    map.on('move', function () {
      map_lat = map.getCenter().lat;
      map_lon = map.getCenter().lng;
    });
  });

  loader_count_store.subscribe(value => {

    var loading_el = document.getElementById('loading');
    if (!loading_el) return; // might not be on page yet

    if (value > 0) {
      loading_el.style.display = 'block';
    } else {
      loading_el.style.display = 'none';
    }
});
</script>

<Section section_type="update" />
<header class="container-fluid">
  <nav class="navbar navbar-expand-sm navbar-light">
    <div class="container-fluid">
      <!-- Brand -->
      <div class="navbar-brand">
        <PageLink page="home">
          <img alt="logo" id="theme-logo" src="theme/logo.png" />
          <h1>{page_title}</h1>
        </PageLink>
      </div>
      <!-- Toggler (hamburger button) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      {#if view === 'search' || view === 'reverse' || view === 'details'}
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <!-- Left-aligned links -->
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <PageLink
                page="search"
                extra_classes="nav-link {view === 'search' ? 'active' : ''}"
                >Search</PageLink
              >
            </li>
            <li class="nav-item">
              <ReverseLink
                lat={map_lat}
                lon={map_lon}
                extra_classes="nav-link {view === 'reverse' ? 'active' : ''}"
                >Reverse</ReverseLink
              >
            </li>
            <li class="nav-item">
              <PageLink
                page="details"
                extra_classes="nav-link {view === 'details' ? 'active' : ''}"
                >Search By ID</PageLink
              >
            </li>
          </ul>
        </div>
      {/if}
      <!-- Right aligned links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <PageLink
            page="about"
            extra_classes="nav-link {view === 'about' ? 'active' : ''}"
            >About & Help</PageLink
          >
        </li>
      </ul>
    </div>
  </nav>
</header>
<section class="page-title-section">
  <h2>{view}</h2>
</section>
<section class="search-section">
  <slot />
</section>
<!-- Toast for loader -->
<Loader />
<!-- Toast for showing error -->
<Section section_type="error" />
<!-- Toast for help texts -->
<Section section_type="help" />

<style>
  .navbar-brand :global(a:hover) {
    text-decoration: none;
  }

  .navbar-brand h1 {
    display: inline;
    font-size: 1.2em;
    color: #333;
  }

  .navbar-brand img {
    display: inline-block;
    margin-right: 5px;
    margin-top: -5px;
  }

  .nav-item {
    white-space: nowrap;
  }

  .page-title-section {
    display: none;
    text-align: center;
    padding: 1em;
  }
  @media (max-width: 600px) {
    .page-title-section {
      display: block;
    }
  }

  .search-section {
    padding: 1em 30px;
    background-color: #f5f5f5;
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
  }
</style>
