<!-- src/lib/components/rwp/ListeningTab.svelte -->
<script>
    // Props
    export let content = {}; // The content JSON
</script>

<div class="listening-tab">
    <div class="empty-state">
        <div class="tape-icon">
            <svg viewBox="0 0 24 24" class="cassette-icon">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" fill="none" stroke-width="1.5" />
                <circle cx="8" cy="12" r="2" stroke="currentColor" fill="none" stroke-width="1.5" />
                <circle cx="16" cy="12" r="2" stroke="currentColor" fill="none" stroke-width="1.5" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" />
            </svg>
        </div>
        <h3 class="empty-title">Listening Practice Coming Soon</h3>
        <p class="empty-message">
            We're working on adding audio for this story to help you practice your listening skills.
            Check back soon!
        </p>
    </div>
</div>

<style>
    .listening-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
    }
    
    .empty-state {
        text-align: center;
        max-width: 450px;
        margin: 2rem auto;
        padding: 1.5rem;
        background-color: var(--color-beige, #E8E5D7);
        border-radius: 8px;
        border: 1px dashed var(--color-warm-gray, #A0998A);
    }
    
    .tape-icon {
        margin: 0 auto 1rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: var(--color-cream-paper, #F4F1DE);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--color-warm-gray, #A0998A);
    }
    
    .cassette-icon {
        width: 32px;
        height: 32px;
        color: var(--color-terracotta, #C17C74);
    }
    
    .empty-title {
        font-family: 'Arvo', serif;
        font-size: 1.25rem;
        color: var(--color-charcoal, #33312E);
        margin-bottom: 0.75rem;
    }
    
    .empty-message {
        color: var(--color-warm-gray, #A0998A);
        font-size: 0.9rem;
        line-height: 1.5;
    }
</style>