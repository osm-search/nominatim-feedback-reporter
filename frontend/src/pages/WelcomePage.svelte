<script>
  import { onMount } from 'svelte';
  import { update_html_title } from '../lib/api_utils.js';

  import Header from '../components/Header.svelte';
  import WelcomeBtn from '../components/WelcomeBtn.svelte';

  function loaddata() {
    update_html_title('Welcome');
    localStorage.clear('bug_data')
  }
  onMount(loaddata);
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Select the kind of problem</h2>
  </div>
  <div class="container">
    <WelcomeBtn
      text="Result not found / Result found but expected result missing"
      feedbackType="WR"
    />
    <WelcomeBtn text="Result found but of wrong order" feedbackType="WO" />
    <WelcomeBtn text="Wrong information of Result" feedbackType="WI" />
    <WelcomeBtn text="Any other feedback" feedbackType="SF" />
  </div>
</div>
