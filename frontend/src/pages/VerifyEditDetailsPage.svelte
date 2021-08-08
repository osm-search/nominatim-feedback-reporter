<script>
  import { page, refresh_page } from '../lib/stores.js';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';
  import {
    formatOSMTypeId,
    geocodingProperties,
    getSetObjectBugData
  } from '../lib/helpers.js';
  import Header from '../components/Header.svelte';
  import MapModal from '../components/MapModal.svelte';

  let location_details;
  let current_geocodeing_details;
  let new_geocodeing_details;
  let api_request_params;
  let newLocation;
  let oldLocation;

  function loaddata(search_params) {
    api_request_params = {
      osm_ids:
        String(search_params.get('osmtype')).toUpperCase()
      + search_params.get('osmid'),
      format: 'geocodejson'
    };

    if (api_request_params.osm_ids) {
      update_html_title('Details for ' + api_request_params.osm_ids);

      fetch_from_api('lookup', api_request_params, function (data) {
        location_details = data && !data.error ? data : undefined;
        current_geocodeing_details = location_details.features[0].properties.geocoding;
        new_geocodeing_details = Object.assign(
          {},
          location_details.features[0].properties.geocoding
        );
        oldLocation = {
          lat: location_details.features[0].geometry.coordinates[1],
          lng: location_details.features[0].geometry.coordinates[0]
        };
        newLocation = Object.assign({}, oldLocation);
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

  function handleSubmit() {
    let newEntries = {};
    newEntries.correct_osm_object = formatOSMTypeId(
      current_geocodeing_details.osm_type,
      current_geocodeing_details.osm_id
    );
    let allGeocodingProperties = geocodingProperties();
    if (
      newLocation.lat !== oldLocation.lat
    || newLocation.lng !== oldLocation.lng
    ) {
      newEntries.lat = {
        expected: newLocation.lat,
        current: location_details.features[0].geometry.coordinates[1]
      };
      newEntries.lon = {
        expected: newLocation.lng,
        current: location_details.features[0].geometry.coordinates[0]
      };
    }

    allGeocodingProperties.forEach((property) => {
      if (
        (new_geocodeing_details[String(property)]
        || current_geocodeing_details[String(property)])
      && new_geocodeing_details[String(property)]
        !== current_geocodeing_details[String(property)]
      ) {
        console.log(property);
        newEntries[String(property)] = {
          current: current_geocodeing_details[String(property)],
          expected: new_geocodeing_details[String(property)]
        };
      }
    });

    getSetObjectBugData(newEntries);
    refresh_page('bugdescription');
  }
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Verify and Edit Location Details</h2>
  </div>
  <div class="container mt-5">
    {#if new_geocodeing_details}
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
            <tr>
              <td>Location</td>
              <td>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Latitude"
                    bind:value={newLocation.lat}
                  />
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Longitude"
                    bind:value={newLocation.lng}
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#MapModal">Open Map</button
                  >
                </div>
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
      <MapModal bind:newLocation />
      <div class="d-grid gap-2">
        <button
          type="button"
          class="btn btn-success btn-lg mt-3"
          on:click|preventDefault|stopPropagation={handleSubmit}
        >
          Verified and edited details
        </button>
      </div>
    {:else}
      <h3 class="text-center m-5">
        Sorry, we only allow some fields to be corrected and none of those can
        be found
      </h3>
    {/if}
  </div>
</div>
