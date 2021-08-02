<script>
  import { page, results_store } from '../lib/stores.js';
  import { formatOSMTypeId } from '../lib/helpers';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';

  import Header from '../components/Header.svelte';
  import SearchSectionDetails from '../components/SearchSectionDetails.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  let aPlace;
  let api_request_params;
  let api_request_finished = false;
  let current_result;

  function loaddata(search_params) {
    update_html_title();

    api_request_params = {
      osmtype: search_params.get('osmtype'),
      osmid: search_params.get('osmid'),
      polygon_geojson: 1,
      format: 'geocodejson',
      addressdetails: 1,
      osm_ids: formatOSMTypeId(
        search_params.get('osmtype'),
        search_params.get('osmid')
      )
    };
    if (api_request_params.osmtype && api_request_params.osmid) {
      update_html_title(
        'Details for ' + api_request_params.osmtype + api_request_params.osmid
      );

      fetch_from_api(
        'lookup',
        {
          osm_ids: search_params.get('osmtype') + search_params.get('osmid'),
          polygon_geojson: 1,
          format: 'geocodejson',
          addressdetails: 1
        },
        function (data) {
          results_store.set(data.features ? data.features : data);
          window.scrollTo(0, 0);
          api_request_finished = true;
          aPlace = data && !data.error ? data : undefined;
        }
      );
    } else {
      aPlace = undefined;
      results_store.set(undefined);
    }
  }

  $: {
    let pageinfo = $page;
    if (pageinfo.tab.includes('details')) {
      loaddata(pageinfo.params);
    }
  }
</script>

<Header>
  <SearchSectionDetails {api_request_params} />
</Header>

<div id="content">
  <div class="sidebar">
    <ResultsList bind:current_result reverse_search={false} />
  </div>
  <div id="map-wrapper">
    <Map {current_result} display_minimap={true} />
  </div>
</div>

<style>
  .sidebar {
    width: 25%;
    min-width: 200px;
    padding: 15px;
    padding-top: 0;
    display: block;
    float: left;
  }

  #map-wrapper {
    position: relative;
    height: calc(100vh - 250pt);
    min-height: 300px;
    width: 75%;
    padding-right: 20px;
    display: block;
    float: left;
  }

  @media (max-width: 768px) {
    #content {
      top: 0;
      position: relative;
    }
    .sidebar {
      width: 100%;
    }
    #map-wrapper {
      width: 100%;
      height: 300px;
      padding-left: 20px;
    }
  }
</style>
