<script>
  import { page } from '../lib/stores.js';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';
  import { geocodingProperties } from '../lib/helpers.js';
  import Header from '../components/Header.svelte';
  import MapModal from '../components/MapModal.svelte';

  let location_details;
  let current_geocodeing_details;
  let new_geocodeing_details;
  let api_request_params;
  let api_request_finished = false;

  function loaddata(search_params) {
    api_request_params = {
      osm_ids:
        String(search_params.get('osmtype')).toUpperCase()
      + search_params.get('osmid'),
      format: 'geocodejson'
    };
    api_request_finished = false;

    if (api_request_params.osm_ids) {
      update_html_title('Details for ' + api_request_params.osm_ids);

      fetch_from_api('lookup', api_request_params, function (data) {
        api_request_finished = true;
        console.log(data);
        location_details = data && !data.error ? data : undefined;
        current_geocodeing_details = location_details.features[0].properties.geocoding;
        new_geocodeing_details = location_details.features[0].properties.geocoding;
      });
    } else {
      location_details = undefined;
      current_geocodeing_details = undefined;
    }
  }

  $: {
    let pageinfo = $page;
    if (pageinfo.tab === 'verifyedit') {
      loaddata(pageinfo.params);
    }
  }
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Verify and Edit Location Details</h2>
  </div>
  <div class="container mt-5">
    <table class="table table-striped ">
      <thead>
        <tr>
          <th scope="col">Field</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {#if new_geocodeing_details}
          {#each Object.entries(new_geocodeing_details) as [key, value]}
            {#if geocodingProperties().includes(key)}
              <tr>
                <td>{key}</td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter {key}"
                    bind:value={new_geocodeing_details[String(key)]}
                  />
                </td>
              </tr>
            {/if}
          {/each}
        {/if}
      </tbody>
    </table>
    <MapModal />
    <div class="float-end mt-4">
      <button type="submit" class="btn btn-success"
        >Verified and edited details</button
      >
    </div>
  </div>
</div>
