<script>
  import { refresh_page, results_store } from '../lib/stores.js';
  import {
    formatLabel,
    getSetObjectBugData,
    formatOSMTypeId,
    getBugData
  } from '../lib/helpers.js';
  import { page } from '../lib/stores.js';

  import Welcome from './Welcome.svelte';
  import MapIcon from './MapIcon.svelte';

  export let reverse_search = false;
  export let current_result = null;

  $: params = $page.params;
  $: view = $page.tab;

  let searchByIdText;
  let aSearchResults;
  let iHighlightNum;
  let sMoreURL;

  results_store.subscribe((data) => {
    if (!data) {
      return;
    }
    aSearchResults = data;
    iHighlightNum = 0;
    current_result = aSearchResults[0];

    let search_params = new URLSearchParams(window.location.search);

    let aResults = data;

    var aExcludePlaceIds = [];
    if (search_params.has('exclude_place_ids')) {
      aExcludePlaceIds = search_params.get('exclude_place_ids').split(',');
    }
    for (var i = 0; i < aResults.length; i += 1) {
      aExcludePlaceIds.push(aResults[i].place_id);
    }
    var parsed_url = new URLSearchParams(window.location.search);
    parsed_url.set('exclude_place_ids', aExcludePlaceIds.join(','));
    sMoreURL = '?' + parsed_url.toString();
  });

  function handleClick(e) {
    let result_el = e.target;
    if (!result_el.className.match('result')) {
      result_el = result_el.parentElement;
    }
    let pos = Number(result_el.dataset.position);

    current_result = aSearchResults[pos];
    iHighlightNum = pos;
  }

  function handleSearchByIdClick() {
    current_result = null;
    iHighlightNum = -1;
  }

  function handleSubmit() {
    console.log('Proceed With selected option CLICKED');
    let url_params = new URLSearchParams();

    if (view.includes('info')) {
      url_params.set(
        'osmtype',
        aSearchResults[iHighlightNum].osm_type[0].toUpperCase()
      );
      url_params.set('osmid', aSearchResults[iHighlightNum].osm_id);

      refresh_page('verifyedit', url_params);
    } else if (view.includes('result')) {
      if (view.includes('reverse')) {
        let newEntries = {
          query_type: 'reverse_search',
          lat: params.get('lat'),
          lon: params.get('lon'),
          zoom: params.get('zoom')
        };

        if (iHighlightNum >= 0) {
          newEntries.correct_osm_object = formatOSMTypeId(
            current_result.osm_type,
            current_result.osm_id
          );
        } else {
          let val = searchByIdText;
          let type_and_id_match = val.match(/^\s*([NWR])(\d+)\s*$/i)
          || val.match(/\/(relation|way|node)\/(\d+)\s*$/);
          if (type_and_id_match) {
            newEntries.correct_osm_object = type_and_id_match[1].charAt(0).toUpperCase()
            + type_and_id_match[2];
          } else {
            alert('invalid input');
          }
        }

        if (getBugData().correct_osm_object === -1) {
          delete newEntries.query_type;
        }
  
        getSetObjectBugData(newEntries);

        refresh_page('bugdescription');
      } else if (view.includes('search')) {
        let newEntries;

        if (params.get('q') != null) {
          newEntries = {
            query_type: 'simple_search',
            query: params.get('q')
          };
          newEntries.extra_params = Object.fromEntries(params);
          delete newEntries.extra_params.q;
        } else {
          newEntries = {
            query_type: 'structured_search',
            structured_query: Object.fromEntries(params)
          };
        }

        if (iHighlightNum >= 0) {
          newEntries.correct_osm_object = formatOSMTypeId(
            current_result.osm_type,
            current_result.osm_id
          );
          getSetObjectBugData(newEntries);

          refresh_page('bugdescription');
        } else {
          newEntries.correct_osm_object = -1;
          getSetObjectBugData(newEntries);

          refresh_page('wrongresultreverse');
        }
      }
    }
  }
</script>

{#if aSearchResults && aSearchResults.length > 0}
  <div id="searchresults">
    {#each aSearchResults as aResult, iResNum}
      <div
        class="result"
        class:highlight={iResNum === iHighlightNum}
        data-position={iResNum}
        on:click|stopPropagation={handleClick}
      >
        <div style="float:right">
          <MapIcon aPlace={aResult} />
        </div>
        <span class="name">{aResult.display_name}</span>
        <span class="type">{formatLabel(aResult)}</span>
        <p class="coords">{aResult.lat},{aResult.lon}</p>
      </div>
    {/each}
    {#if view === 'wrongresultsearch'}
      <div
        class="noneofabove"
        on:click|stopPropagation={handleSearchByIdClick}
        class:highlight={iHighlightNum === -1}
      >
        <button class="btn btn-outline-secondary btn-sm">None of above</button>
      </div>
    {/if}
    {#if view === 'wrongresultreverse'}
      <div
        class="btn-secondary py-4 result"
        class:highlight={iHighlightNum === -1}
        on:click|stopPropagation={handleSearchByIdClick}
      >
        <div class="row g-1 justify-content-center">
          <div class="col-auto">
            <input
              bind:value={searchByIdText}
              type="edit"
              class="form-control form-control-sm me-1"
              pattern="^[NWRnwr]?[0-9]+$|.*openstreetmap.*"
              placeholder="Search by Id or Nominatim URL"
            />
          </div>
        </div>
      </div>
    {/if}

    {#if sMoreURL && !reverse_search}
      <div class="more">
        <a class="btn btn-primary" href={sMoreURL}> Search for more results </a>
      </div>
    {/if}
  </div>
  <div class="d-flex justify-content-center mt-5">
    <button
      class="btn btn-primary"
      on:click|preventDefault|stopPropagation={handleSubmit}
      >Proceed With selected option</button
    >
  </div>
{:else if aSearchResults}
  {#if reverse_search}
    <div id="intro" class="sidebar">
      Search for coordinates or click anywhere on the map.
    </div>
  {:else}
    <div class="noresults">No search results found</div>
  {/if}
{:else}
  <Welcome />
{/if}

<style>
  .result {
    font-size: 0.8em;
    margin: 5px;
    margin-top: 0px;
    padding: 4px 8px;
    border-radius: 2px;
    background: #f0f7ff;
    border: 2px solid #d7e7ff;
    cursor: pointer;
    min-height: 5em;
  }
  #searchresults {
    max-height: 60vh;
    overflow-y: auto;
  }

  .result.highlight {
    background-color: #d9e7f7;
    border-color: #9db9e4;
  }
  .result.highlight :global(a) {
    margin: 10px auto;
    display: block;
    max-width: 10em;
    padding: 1px;
    background-color: white;
  }
  .result .type {
    color: gray;
    font-size: 0.8em;
  }
  .result :global(a) {
    display: none;
  }

  .result .coords {
    display: none;
  }

  .noresults {
    text-align: center;
    padding: 1em;
  }

  .more {
    text-align: center;
    margin-top: 1em;
  }

  .result.highlight :global(a):hover {
    color: #111;
  }
  .noneofabove {
    font-size: 0.8em;
    margin: 5px;
    margin-top: 0px;
    padding: 4px 8px;
    border-radius: 2px;
    background: #f0f7ff;
    border: 2px solid #d7e7ff;
    cursor: pointer;
    min-height: 5em;
  }
  .noneofabove button {
    margin: 10px auto;
    display: block;
    max-width: 10em;
    padding: 1px;
    background-color: white;
  }
  .noneofabove.highlight {
    background-color: #d9e7f7;
    border-color: #9db9e4;
  }
  .noneofabove button:hover {
    color: rgb(73, 71, 71);
  }
</style>
