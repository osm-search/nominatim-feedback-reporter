<script>
  import { onMount } from 'svelte';
  import { update_html_title } from '../lib/api_utils.js';
  import { refresh_page } from '../lib/stores.js';
  import { getSetBugData } from '../lib/helpers.js';

  import Header from '../components/Header.svelte';
  import WelcomeBtn from '../components/WelcomeBtn.svelte';

  let searchByIdText;

  function loaddata() {
    update_html_title('Welcome');
  }

  function handleClick() {
    let val = searchByIdText;
    let type_and_id_match = val.match(/^\s*([NWR])(\d+)\s*$/i)
    || val.match(/\/(relation|way|node)\/(\d+)\s*$/);

    var params = new URLSearchParams();
    if (type_and_id_match) {
      params.set('osmtype', type_and_id_match[1].charAt(0).toUpperCase());
      params.set('osmid', type_and_id_match[2]);
    } else if (val.match(/^\d+$/)) {
      params.set('place_id', val);
    } else {
      alert('invalid input');
      return;
    }
    getSetBugData('correct_osm_object', params.get('osmtype') + params.get('osmid'));
    refresh_page('verifyedit', params);
  }
  onMount(loaddata);
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Select your searching method for wrong information</h2>
  </div>
  <div class="container">
    <WelcomeBtn text="Using search query" redirect="wronginfosearch" />
    <WelcomeBtn
      text="Using reverse search method"
      redirect="wronginforeverse"
    />
    <div class="row mb-3">
      <div class="col-sm-12 d-flex justify-content-center">
        <div class="btn btn-secondary py-4 w-25">
          <form
            on:submit|preventDefault={handleClick}
            class="form-inline"
            action="details.html"
          >
            <div class="row g-1">
              <div class="col-auto">
                <input
                  bind:value={searchByIdText}
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
