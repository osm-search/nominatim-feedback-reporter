<script>
  import Header from '../components/Header.svelte';
  import { getSetBugData, getBugData } from '../lib/helpers.js';
  import { refresh_page, error_store } from '../lib/stores.js';
  import { setExtraBugData } from '../lib/api_utils';

  export let feedbackDescription;

  async function handleClick() {
    if (feedbackDescription || getBugData().feedback_type !== 'SF') {
      await setExtraBugData();
      getSetBugData('final_bug_description', feedbackDescription);
      let bugData = getBugData();
      let url = Nominatim_Config.Nominatim_Feedback_Reporter_API_Endpoint + 'bug';
      try {
        const config = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bugData)
        };
        await fetch(url, config);
        refresh_page('thankyou');
      } catch (error) {
        error_store.set('Cannot send data to backend');
      }
    } else {
      error_store.set('You need to add a feedback description');
    }
  }
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Feedback Description</h2>
  </div>
  <div class="container">
    <form on:submit|preventDefault={handleClick}>
      <div class="form-group">
        <textarea
          bind:value={feedbackDescription}
          class="form-control"
          id="feedbackdescription"
          rows="15"
          placeholder="Enter additional details"
        />
        <div class="float-end mt-3">
          <button type="submit" class="btn btn-success">
            Submit Feedback Report
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
