<!-- src/lib/components/rwp/RwpHeader.svelte -->
<script>
  export let unitData;
</script>

<header class="unit-header">
  <div class="module-nav">
    <!-- Module badge -->
    <a
      href={`/modules/${unitData.module.id}`}
      class="module-badge"
      title="Go to Module {unitData.module.id}"
    >
      <span class="module-badge-text">{unitData.module.id}</span>
    </a>
    <div class="dropdown-wrapper">
      <h1 class="unit-title">Real World Practice: {unitData.title}</h1>
    </div>
  </div>

  <p class="module-title">
    Module:
    <span class="module-title-highlight">{unitData.module.title}</span>
  </p>

  <p class="unit-description">
    Personalized Chinese practice based on your context and this unit's content.
  </p>
  
  <div class="action-buttons">
    <a href={`/units/${unitData.id}`} class="back-button">
      Return to Unit
    </a>
  </div>
</header>

<style>
  .unit-header {
    margin-bottom: 1rem;
    border-bottom: 1px solid #a0998a;
    padding-bottom: 0.5rem;
  }

  .module-nav {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .module-badge {
    display: flex;
    height: 3rem;
    width: 3rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: #c17c74;
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
  }

  .module-badge:hover {
    transform: scale(1.05);
  }

  .module-badge-text {
    font-family: 'Arvo', serif;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .unit-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #33312e;
  }

  .module-title {
    font-size: 1rem;
    font-weight: 500;
    color: #a0998a;
    font-style: italic;
  }

  .module-title-highlight {
    color: #c17c74;
  }

  .unit-description {
    margin-top: 0.5rem;
    font-size: 1.125rem;
    color: #33312e;
  }

  .action-buttons {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 16px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    background-color: #e8e5d7;
    border: 1px solid #a0998a;
    color: #33312e;
  }

  .back-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(160, 153, 138, 0.2);
    background-color: #f4f1de;
  }
</style>