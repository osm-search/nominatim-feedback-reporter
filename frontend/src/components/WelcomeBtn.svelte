<script>
  import { getSetBugData } from "../lib/helpers.js";
  import { refresh_page } from "../lib/stores.js";

  export let text;
  export let feedbackType;
  function handleClick() {
    if (feedbackType) {
      getSetBugData("feedback_type", feedbackType);
      switch (feedbackType) {
        case "WR":
          refresh_page("wrongresult");
          break;
        case "WO":
          refresh_page("wronginfosearch");
          break;
        case "WI":
          refresh_page("wronginfo");
          break;
        case "SF":
          refresh_page("bugdescription");
          break;
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
