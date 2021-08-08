<script>
  import { onMount } from 'svelte';
  import { update_html_title } from '../lib/api_utils.js';

  import Header from '../components/Header.svelte';
  import WelcomeBtn from '../components/WelcomeBtn.svelte';

  function loaddata() {
  
    update_html_title('selecttype');
  }
  onMount(loaddata);
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Select your searching method for wrong result</h2>
  </div>
  <div class="container">
    <WelcomeBtn text="Using search query" redirect="wrongresultsearch" />
    <WelcomeBtn text="Using reverse search method" redirect="wrongresultreverse" />
  </div>
</div>
