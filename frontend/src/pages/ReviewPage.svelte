<script>
  import { onMount } from 'svelte';

  import Header from '../components/Header.svelte';
  import { getBugData, geocodingProperties } from '../lib/helpers.js';
  import { refresh_page, error_store } from '../lib/stores.js';

  let bugData = null;
  let query_type = null;
  let feedback_type = null;

  function loaddata() {
    bugData = getBugData();
    query_type = bugData.query_type;
    feedback_type = bugData.feedback_type;
  }
  onMount(loaddata);

  async function handleSubmit() {
    let finalBugData = getBugData();
    let url = Nominatim_Config.Nominatim_Feedback_Reporter_API_Endpoint + 'bug';
    try {
      const config = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalBugData)
      };
      await fetch(url, config);
      refresh_page('thankyou');
    } catch (error) {
      error_store.set('Cannot send data to backend');
    }
  }
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Review your feedback</h2>
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
        {#if bugData}
          {#each Object.entries(bugData) as [key, value]}
            {#if typeof bugData[String(key)] === 'string' && key !== 'final_bug_description'}
              <tr>
                {#if key === 'lat' || key === 'lon'}
                  <td>Query {key}</td>
                {:else}
                  <td
                    >{key.replaceAll('_', ' ').charAt(0).toUpperCase()
                      + key.replaceAll('_', ' ').slice(1)}</td
                  >
                {/if}
                <td>
                  <input
                    type="text"
                    class="form-control"
                    readonly={true}
                    value={bugData[String(key)]
                      .replaceAll('_', ' ')
                      .charAt(0)
                      .toUpperCase()
                      + bugData[String(key)].replaceAll('_', ' ').slice(1)}
                  />
                </td>
              </tr>
            {:else if typeof bugData[String(key)] === 'object' && geocodingProperties().includes(key)}
              <tr
                ><td>Current {key}</td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    readonly={true}
                    value={bugData[String(key)].current}
                  />
                </td></tr
              >
              <tr
                ><td>Expected {key}</td><td>
                  <input
                    type="text"
                    class="form-control"
                    readonly={true}
                    value={bugData[String(key)].expected}
                  />
                </td></tr
              >
              <!-- eslint-disable-next-line svelte3/max-attributes-per-line -->
            {:else if typeof bugData[String(key)] === 'object' && key === 'structured_query'}
              {#each Object.entries(bugData[String(key)]) as [newKey, newValue]}
                {#if geocodingProperties().includes(newKey) || newKey === 'postalcode'}
                  <tr
                    ><td>Query {newKey}</td>
                    <td>
                      <input
                        type="text"
                        class="form-control"
                        readonly={true}
                        value={bugData[String(key)][String(newKey)]}
                      />
                    </td></tr
                  >
                {/if}
              {/each}
              <tr />
            {/if}
          {/each}
          {#if bugData.final_bug_description}
            <tr
              ><td>Bug description</td><td
                ><textarea
                  value={bugData.final_bug_description}
                  class="form-control"
                  id="feedbackdescription"
                  readonly={true}
                /></td
              ></tr
            >
          {/if}
        {/if}
      </tbody>
    </table>
    <div class="d-grid gap-2">
      <button
        type="button"
        class="btn btn-success btn-lg mt-3"
        on:click|preventDefault|stopPropagation={handleSubmit}
      >
        Submit Feedback Report
      </button>
    </div>
  </div>
</div>
