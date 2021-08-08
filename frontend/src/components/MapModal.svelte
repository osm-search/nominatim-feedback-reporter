<script>
  import Map from '../components/Map.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { map_store } from '../lib/stores.js';
  import * as L from 'leaflet';

  export let newLocation;

  let position_marker;
  let MapModal;
  let last_click_latlng;
  let marker;
  let unsubscribe;

  onMount(() => {
    MapModal.addEventListener('shown.bs.modal', function () {
      map_store.subscribe((map) => {
        if (!map) return;
        map.invalidateSize();
      });
    });
  });

  unsubscribe = map_store.subscribe((map) => {
    if (!map) return;
    map.on('click', function (e) {
      last_click_latlng = e.latlng;
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(last_click_latlng);
      marker.addTo(map);
    });
  });
  
  
  onDestroy(unsubscribe);

  function handleUpdateLocation() {
    newLocation = last_click_latlng;
  }
</script>

<div
  class="modal fade"
  id="MapModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
  bind:this={MapModal}
>
  <div class="modal-dialog mw-100 w-75">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">
          Select your map location
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div class="modal-body">
        <div id="map-wrapper">
          <Map {position_marker} />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        <button
          type="button"
          class="btn btn-primary"
          data-bs-dismiss="modal"
          on:click={handleUpdateLocation}>Update Location</button
        >
      </div>
    </div>
  </div>
</div>

<style>
  #map-wrapper {
    position: relative;
    height: calc(100vh - 250pt);
    min-height: 300px;
    width: 100%;
    padding-right: 20px;
    display: block;
    float: left;
  }

  @media (max-width: 768px) {
    #map-wrapper {
      width: 100%;
      height: 300px;
      padding-left: 20px;
    }
  }
</style>
