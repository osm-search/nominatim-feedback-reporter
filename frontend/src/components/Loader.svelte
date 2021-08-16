<script>
  import { last_api_request_url_store } from '../lib/stores.js';

  let last_api_request_url;

  // Storing the last API request URL
  last_api_request_url_store.subscribe((url) => {
    last_api_request_url = url;
  });

</script>

<div id="last-updated" class="container-fluid py-3 px-4">
  <div id="loading" class="py-2 px-4">
    <div
      class="spinner-border spinner-border-sm text-primary me-1"
      role="status"
    />
    Loading data from API ...
  </div>
</div>

<style>
  #last-updated {
    position: relative;
    font-size: 0.8rem;
    font-style: italic;
    background-color: #f5f5f5;
  }
  #loading {
    display: none;
    position: absolute;
    padding: 0.5em 1em;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #eee;
    z-index: 100;
  }
</style>
