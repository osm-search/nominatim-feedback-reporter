<script>
  import Header from "../components/Header.svelte";
  import { getSetBugData } from "../lib/helpers.js";
  import { refresh_page,error_store } from "../lib/stores.js";

  export let feedbackDescription;

  function handleClick() {
    if (feedbackDescription) {
      getSetBugData("final_bug_description", feedbackDescription);
      refresh_page("thankyou");
    } else {
      error_store.set(`You need to add a feedback description`);
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
