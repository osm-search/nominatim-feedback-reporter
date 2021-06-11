<script>
  import { onMount } from 'svelte';
  import { update_html_title } from '../lib/api_utils.js';

  import Header from '../components/Header.svelte';
  import WelcomeBtn from '../components/WelcomeBtn.svelte';

  // let aStatusData = {};
  // let configuration = Nominatim_Config;

  function loaddata() {
    // fetch_from_api('status', { format: 'json' }, function (data) {
    //   aStatusData = data;
    // });
    update_html_title('Welcome');
  }
  onMount(loaddata);
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Select your searching method for wrong information</h2>
  </div>
  <div class="container">
    <WelcomeBtn text="Using search query" />
    <WelcomeBtn text="Using reverse search method" />
    <div class="row mb-3">
      <div class="col-sm-12 d-flex justify-content-center">
        <div class="btn btn-secondary py-4 w-25">
          <form
            on:submit|preventDefault={'handleFormSubmit'}
            class="form-inline"
            action="details.html"
          >
            <div class="row g-1">
              <div class="col-auto">
                <input
                  type="edit"
                  class="form-control form-control-sm me-1"
                  pattern="^[NWRnwr]?[0-9]+$|.*openstreetmap.*"
                  placeholder="Search by Id or Nominatim URL"
                />
              </div>
              <div class="col-auto">
                <button type="submit" class="btn btn-primary btn-sm"
                  >Next</button
                >
              </div>
            </div>
          </form>
          <small class="">
            OSM type+id (<em>N123</em>, <em>n123</em>, <em>W123</em>,
            <em>w123</em>, <em>R123</em>, <em>r123</em>), Place id (<em>1234</em
            >) or URL (<em>https://openstreetmap.org/way/123</em>)
          </small>
        </div>
      </div>
    </div>
  </div>
</div>
