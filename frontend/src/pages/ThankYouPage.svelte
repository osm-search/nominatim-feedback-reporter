<script>
  import Header from '../components/Header.svelte';
  import { onMount } from 'svelte';
  import { fetch_content_into_element } from '../lib/api_utils.js';

  onMount(() => {
    fetch_content_into_element(
      'theme/thank-you.html',
      document.getElementById('thank-you')
    );
  });
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Thank You for providing your valuable feedback</h2>
  </div>
</div>
<div id="thank-you" class="container" />

<style>
  #thank-you {
    max-width: 800px;
    padding: 4em;
  }
</style>
