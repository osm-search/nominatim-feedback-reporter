<script>
  import {
    error_store,
    updates_store,
    help_text_store,
    page
  } from '../lib/stores.js';

  export let section_type;

  let error_message;
  let update_message;
  let help_message;

  $: view = $page.tab;

  error_store.subscribe((text) => {
    error_message = text;
  });

  updates_store.subscribe((text) => {
    update_message = text;
  });

  help_text_store.subscribe((text) => {
    help_message = text;
  });

  function dismiss_message() {
    error_store.set(null);
  }
</script>

{#if section_type === 'error' && error_message && !view.includes('verifyedit')}
  <div id="error" class="container-fluid alert-danger py-3 px-4">
    {error_message}
    <button
      type="button"
      class="btn-close"
      aria-label="dismiss"
      on:click={dismiss_message}
    />
  </div>
{:else if section_type === 'help' && help_message}
  <div
    id="help"
    class="container-fluid py-3 px-4 mb-3"
    style="background-color: #fda00f"
  >
    {help_message}
  </div>
{:else if section_type === 'update' && update_message}
  <div id="update" class="container-fluid alert-warning py-3 px-4 text-center">
    {@html update_message}
  </div>
{/if}
