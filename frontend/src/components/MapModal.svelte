<script>
  // import Map from '../components/CoordinateMap.svelte';
  // let position_marker;
</script>

<!-- Button trigger modal -->
<div class="d-grid gap-2">
  <button
    type="button"
    class="btn btn-primary btn-lg mt-3"
    data-bs-toggle="modal"
    data-bs-target="#MapModal"
  >
    Update Location
  </button>
</div>

<!-- Modal -->
<div
  class="modal fade"
  id="MapModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
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
          <!-- <Map {position_marker} display_minimap={true} /> -->
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        <button type="button" class="btn btn-primary">Update Location</button>
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
