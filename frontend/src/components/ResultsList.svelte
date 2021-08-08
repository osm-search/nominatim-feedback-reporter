<script>
  import { refresh_page, results_store } from '../lib/stores.js';
  import { onDestroy } from 'svelte';
  import {
    formatLabel,
    getSetObjectBugData,
    formatOSMTypeId,
    getBugData
  } from '../lib/helpers.js';
  import { page } from '../lib/stores.js';

  import Welcome from './Welcome.svelte';

  export let reverse_search = false;
  export let current_result = null;

  $: params = $page.params;
  $: view = $page.tab;

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
      aExcludePlaceIds.push(
        aResults[i].properties
          ? aResults[i].properties.geocoding.place_id
          : aResults[i].place_id
      );
    }
    var parsed_url = new URLSearchParams(window.location.search);
    parsed_url.set('exclude_place_ids', aExcludePlaceIds.join(','));
    sMoreURL = '?' + parsed_url.toString();
  });
// Sets the current result to the clicked result.
  function handleClick(e) {
    let result_el = e.target;
    if (!result_el.className.match('result')) {
      result_el = result_el.parentElement;
    }
    let pos = Number(result_el.dataset.position);

    current_result = aSearchResults[pos];
    iHighlightNum = pos;
  }

// Handles click on none of above button.
  function handleSearchByIdClick() {
    current_result = null;
    iHighlightNum = -1;
  }

  // Handles seacrchById click.
  function handleNoneOfAbove() {
    current_result = null;
    iHighlightNum = -1;
    handleSubmit();
  }

  // Handles submit.
  function handleWantToReportFeedback() {
    let newEntries = {};

    if (view === 'search') {
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
    } else if (view === 'reverse') {
      newEntries = {
        query_type: 'reverse_search',
        lat: params.get('lat'),
        lon: params.get('lon'),
        zoom: params.get('zoom')
      };
    }
    getSetObjectBugData(newEntries);
    let search_params = new URLSearchParams(window.location.search);

    localStorage.setItem(
      'params',
      JSON.stringify(Object.fromEntries(search_params))
    );
    refresh_page('selecttype');
  }

  // Handles final click and page redirection on selecting result.
  function handleSubmit() {
    console.log('Proceed With selected option CLICKED');
    let url_params = new URLSearchParams();
    getSetObjectBugData({ selected_osm_data: aSearchResults[iHighlightNum] });

    if (view.includes('info')) {
      url_params.set(
        'osmtype',
        aSearchResults[iHighlightNum].properties
          ? aSearchResults[
            iHighlightNum
          ].properties.geocoding.osm_type[0].toUpperCase()
          : aSearchResults[iHighlightNum].osm_type[0].toUpperCase()
      );
      url_params.set(
        'osmid',
        aSearchResults[iHighlightNum].properties
          ? aSearchResults[iHighlightNum].properties.geocoding.osm_id
          : aSearchResults[iHighlightNum].osm_id
      );

      refresh_page('verifyedit', url_params);
    } else if (view.includes('result') || view.includes('wrongordersearch')) {
      if (view.includes('reverse')) {
        let newEntries = {};

        if (iHighlightNum >= 0) {
          newEntries.correct_osm_object = formatOSMTypeId(
            current_result.properties
              ? current_result.properties.geocoding.osm_type
              : current_result.osm_type,
            current_result.properties
              ? current_result.properties.geocoding.osm_id
              : current_result.osm_id
          );
        }

        if (getBugData().correct_osm_object === -1) {
          delete newEntries.query_type;
        }

        if (iHighlightNum < 0) {
          getSetObjectBugData(newEntries);

          refresh_page('wrongresultdetails');
        } else {
          getSetObjectBugData(newEntries);

          refresh_page('bugdescription');
        }
      } else if (view.includes('search') || view.includes('wrongresultdetails')) {
        let newEntries = {};

        if (iHighlightNum >= 0) {
          newEntries.correct_osm_object = formatOSMTypeId(
            current_result.properties
              ? current_result.properties.geocoding.osm_type
              : current_result.osm_type,
            current_result.properties
              ? current_result.properties.geocoding.osm_id
              : current_result.osm_id
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

  onDestroy(() => {
    results_store.set(undefined);
  });
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

        <span class="name"
          >{aResult.properties.geocoding
            ? aResult.properties.geocoding.label
            : aResult.display_name}</span
        >
        <span class="type"
          >{formatLabel(
            aResult.properties.geocoding
              ? aResult.properties.geocoding
              : aResult
          )}</span
        >
        <p class="coords">{aResult.lat},{aResult.lon}</p>
        {#if view !== 'search' && view !== 'reverse' && view !== 'details'}
          <span class="selected">Selected</span>
          <button
            class="btn btn-outline-secondary btn-sm"
            on:click|preventDefault|stopPropagation={handleSubmit}
          >
            Select this result</button
          >
        {/if}
      </div>
    {/each}
    {#if view === 'wrongresultsearch'}
      <div
        class="noneofabove"
        on:click|stopPropagation={handleSearchByIdClick}
        class:highlight={iHighlightNum === -1}
      >
        <button
          class="btn btn-outline-secondary btn-sm"
          on:click|preventDefault|stopPropagation={handleNoneOfAbove}
          >None of above</button
        >
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

            <button
              class="btn btn-outline-secondary btn-sm searchbyid"
              on:click|preventDefault|stopPropagation={handleNoneOfAbove}
              >Use searchById</button
            >
          </div>
        </div>
      </div>
    {/if}

    {#if sMoreURL && !reverse_search && view !== 'details' && view === 'wrongordersearch'}
      <div class="more">
        <a class="btn btn-primary" href={sMoreURL}> Search for more results </a>
      </div>
    {/if}
  </div>

  {#if view !== 'search' && view !== 'reverse' && view !== 'details'}
    <!-- <div class="d-flex justify-content-center mt-5">
      <button
        class="btn btn-primary"
        on:click|preventDefault|stopPropagation={handleSubmit}
        >Proceed With selected option</button
      >
    </div> -->
  {:else}
    <div class="d-flex justify-content-center mt-5">
      <button
        class="btn btn-orange"
        on:click|preventDefault|stopPropagation={handleWantToReportFeedback}
        >Want to report a feedback for the result?</button
      >
    </div>
  {/if}
{:else if aSearchResults}
  {#if reverse_search}
    <div id="intro" class="sidebar">
      Search for coordinates or click anywhere on the map.
    </div>
    {#if view === 'reverse'}
      <div class="d-flex justify-content-center mt-5">
        <button
          class="btn btn-orange"
          on:click|preventDefault|stopPropagation={handleWantToReportFeedback}
          >Want to report a feedback for the result?</button
        >
      </div>
    {/if}
  {:else if view === 'wrongresultsearch'}
    <div
      class="noneofabove"
      on:click|stopPropagation={handleSearchByIdClick}
      class:highlight={iHighlightNum === -1}
    >
      <button
        class="btn btn-outline-secondary btn-sm"
        on:click|preventDefault|stopPropagation={handleNoneOfAbove}
        >None of above</button
      >
    </div>

  {:else}
    <div class="noresults">No search results found</div>
    {#if view === 'details' || view === 'search'}
      <div class="d-flex justify-content-center mt-5">
        <button
          class="btn btn-orange"
          on:click|preventDefault|stopPropagation={handleWantToReportFeedback}
          >Want to report a feedback for the result?</button
        >
      </div>
    {/if}
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

  .result span.selected {
    display: none;
  }
  .result.highlight span.selected {
    display: block;
    float: right;
    color: rgb(250, 148, 14);
    font-weight: 900;
  }

  .result .coords {
    display: none;
  }

  .result button {
    display: none;
  }

  .result button.searchbyid {
    display: block;
  }

  .result.highlight button {
    margin: 10px auto;
    display: block;
    max-width: 10em;
    padding: 1px;
    background-color: white;
  }
  .result.highlight button:hover {
    color: #111;
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
  .btn-orange {
    background-color: rgb(253, 160, 15);
  }
  .btn-orange:hover {
    background-color: rgb(250, 148, 14);
  }
</style>
