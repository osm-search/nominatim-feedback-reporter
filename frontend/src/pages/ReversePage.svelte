<script>
  import { page, results_store } from '../lib/stores.js';
  import {
    fetch_from_api,
    update_html_title,
    fetch_from_overpass_api
  } from '../lib/api_utils.js';
  import { formatOSMTypeId } from '../lib/helpers.js';
  import Header from '../components/Header.svelte';
  import SearchSectionReverse from '../components/SearchSectionReverse.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  let api_request_params;
  let current_result;
  let position_marker; // what the user searched for

  $: view = $page.tab;

  function loaddata(search_params) {
    update_html_title();

    api_request_params = {
      lat: search_params.get('lat'),
      lon: search_params.get('lon'),
      zoom:
        search_params.get('zoom') > 1
          ? Number(search_params.get('zoom'))
          : Number(Nominatim_Config.Reverse_Default_Search_Zoom),
      polygon_geojson: 1,
      addressdetails: 1,
      format: 'geocodejson'
    };

    if (api_request_params.lat || api_request_params.lat) {
      fetch_from_api('reverse', api_request_params, async function (data) {
        if (data && !data.error) {
          let all_data = data.features ? data.features : data;
          let revese_osm_type_id = formatOSMTypeId(
            data.features
              ? data.features[0].properties.geocoding.osm_type
              : data.osm_type,
            data.features
              ? data.features[0].properties.geocoding.osm_id
              : data.osm_id
          );
          if (api_request_params.zoom > 13 && view !== 'reverse') {
            let osm_ids = [];
            position_marker = [api_request_params.lat, api_request_params.lon];
            await fetch_from_overpass_api(
              100,
              api_request_params.lat,
              api_request_params.lon,
              async function (overpass_data) {
                overpass_data.elements.forEach(function (el) {
                  osm_ids.push(formatOSMTypeId(el.type, el.id));
                });
              }
            );
            if (osm_ids.includes(revese_osm_type_id)) {
              all_data.pop();
              osm_ids = osm_ids.filter((item) => item !== revese_osm_type_id);
              osm_ids.unshift(revese_osm_type_id);
            }
            await fetch_from_api(
              'lookup',
              {
                format: 'geocodejson',
                osm_ids: osm_ids.join(),
                polygon_geojson: 1,
                addressdetails: 1
              },
              async function (lookup_data) {
                all_data = all_data.concat(
                  lookup_data.features ? lookup_data.features : lookup_data
                );
              }
            );
          }
          results_store.set(all_data);
        } else {
          results_store.set([]);
        }

        update_html_title(
          'Reverse result for '
          + api_request_params.lat
          + ','
          + api_request_params.lon
        );
        document.querySelector('input[name=lat]').focus();
      });
    } else {
      results_store.set(undefined);
    }
  }

  $: {
    let pageinfo = $page;
    if (pageinfo.tab.includes('reverse')) {
      loaddata(pageinfo.params);
    }
  }
</script>

<Header>
  <SearchSectionReverse {...api_request_params} />
</Header>

<div id="content">
  <div class="sidebar">
    <ResultsList bind:current_result reverse_search={true} />
  </div>
  <div id="map-wrapper">
    <Map {current_result} {position_marker} display_minimap={true} />
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
