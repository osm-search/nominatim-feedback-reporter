<script>
  import { getSetBugData } from '../lib/helpers.js';
  import { refresh_page } from '../lib/stores.js';

  export let text;
  export let feedbackType;
  export let redirect;

  function handleClick() {
    if (feedbackType) {
      getSetBugData('feedback_type', feedbackType);
    }
    if (redirect) {
      refresh_page(redirect);
    }
  }
</script>

<div class="row mb-3">
  <div class="col-sm-12 d-flex justify-content-center">
    <button
      on:click|stopPropagation={handleClick}
      type="button"
      class="welcome-btn btn btn-secondary py-4 w-25"
    >
      {text}
    </button>
  </div>
</div>
