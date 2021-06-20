<script>
  import Header from '../components/Header.svelte';
</script>

<Header />
<div class="container-fluid">
  <div class="row mb-4 mt-4">
    <h2>Bug Description</h2>
  </div>
  <div class="container">
    <form>
      <div class="form-group">
        <textarea
          class="form-control"
          id="bugdescription"
          rows="15"
          placeholder="Enter the bug description"
        />
        <div class="float-end mt-3">
          <button type="submit" class="btn btn-success">Submit Bug Report </button>
        </div>
      </div>
    </form>
  </div>
</div>
