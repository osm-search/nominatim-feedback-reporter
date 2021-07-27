<script>
  import { onMount } from 'svelte';
  import { update_html_title } from '../lib/api_utils.js';
  import { getBugData } from '../lib/helpers';

  import Header from '../components/Header.svelte';
  import WelcomeBtn from '../components/WelcomeBtn.svelte';

  let query_type = null;

  function loaddata() {
    update_html_title('selecttype');
    let bugData = getBugData();
    query_type = bugData.query_type;
    // localStorage.clear('bug_data');
  }
  onMount(loaddata);
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Select the kind of problem</h2>
  </div>
  <div class="container">
    {#if query_type && (query_type.includes('search') || query_type.includes('reverse'))}
      <WelcomeBtn
        text="Result not found / Result found but expected result missing"
        feedbackType="WR"
        redirect="wrongresult"
      />
    {/if}
    {#if query_type && query_type.includes('search') && !query_type.includes('reverse')}
      <WelcomeBtn
        text="Result found but of wrong order"
        feedbackType="WO"
        redirect="wrongorder"
      />
    {/if}
    <WelcomeBtn
      text="Wrong information of Result"
      feedbackType="WI"
      redirect="wronginfo"
    />
    <WelcomeBtn
      text="Any other feedback"
      feedbackType="SF"
      redirect="bugdescription"
    />
  </div>
</div>
