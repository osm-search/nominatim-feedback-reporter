<script>
  import { onMount } from 'svelte';
  import { update_html_title } from '../lib/api_utils.js';

  import Header from '../components/Header.svelte';
  import WelcomeBtn from '../components/WelcomeBtn.svelte';

  function loaddata() {
    update_html_title('Welcome');
    localStorage.clear('bug_data');
    localStorage.clear('params');
  }
  onMount(loaddata);
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Welcome to Nominatim Feedback Reporter</h2>
  </div>
  <div class="container">
    <WelcomeBtn text="Start Searching" redirect="search" />
  </div>
</div>
