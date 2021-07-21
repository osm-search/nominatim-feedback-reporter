<script>
  import { getSetBugData } from '../lib/helpers.js';
  import { refresh_page } from '../lib/stores.js';

  export let text;
  export let feedbackType;
  export let redirect;

  function handleClick() {
    let bugData;
    if (feedbackType) {
      bugData = getSetBugData('feedback_type', feedbackType);
    }
    if (redirect) {
      let jsonParams = JSON.parse(localStorage.getItem('params'));
      let url_params = new URLSearchParams(jsonParams);
      if (jsonParams && redirect !== 'bugdescription') {
        let query_type = bugData.query_type;
        if (!query_type && redirect === 'wronginfo') {
          redirect = 'verifyedit';
        } else if (query_type.includes('reverse')) {
          redirect += 'reverse';
        } else if (query_type.includes('search')) {
          redirect += 'search';
        }
        refresh_page(redirect, url_params);
      } else {
        refresh_page(redirect);
      }
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
