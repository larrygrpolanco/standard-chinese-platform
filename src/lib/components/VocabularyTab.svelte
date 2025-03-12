<script>
    import ChineseText from './ChineseText.svelte';
    import FlashcardDeck from './FlashcardDeck.svelte';
    import FontToggle from './FontToggle.svelte';
    import { fly } from 'svelte/transition';
    
    /** @type {Array<{ chinese_simplified: string, chinese_traditional: string, pinyin: string, english: string }>} */
    export let vocabulary = [];
    
    let showAsFlashcards = false;
</script>

<div class="vocabulary-display">
    <!-- Main controls -->
    <div class="controls-wrapper mb-4 flex items-center justify-between flex-wrap gap-2">
        <!-- Mode toggle -->
        <div class="mode-toggle flex gap-2">
            <button 
                class="tape-tab {!showAsFlashcards ? 'active' : ''}"
                on:click={() => showAsFlashcards = false}
            >
                <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
            </button>
            
            <button 
                class="tape-tab {showAsFlashcards ? 'active' : ''}"
                on:click={() => showAsFlashcards = true}
            >
                <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M12 8v8M8 12h8" />
                </svg>
                Flashcard
            </button>
        </div>
        
    </div>

    <!-- Content based on selected mode -->
    {#if showAsFlashcards}
        <div transition:fly={{ y: 20, duration: 300 }}>
            <FlashcardDeck {vocabulary} />
        </div>
    {:else}
        <div transition:fly={{ y: 20, duration: 300 }}>
            <!-- Vocabulary table -->
            {#if vocabulary.length > 0}
                <div class="table-wrapper">
                    <table class="vocabulary-table">
                        <thead>
                            <tr>
                                <th class="simplified-column">Simplified</th>
                                <th class="traditional-column">Traditional</th>
                                <th class="pinyin-column">Pinyin</th>
                                <th class="english-column">English</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each vocabulary as word}
                                <tr>
                                    <td class="chinese-cell">
                                        <span class="chinese-text" lang="zh">{word.chinese_simplified}</span>
                                    </td>
                                    <td class="chinese-cell">
                                        <span class="chinese-text" lang="zh">{word.chinese_traditional}</span>
                                    </td>
                                    <td class="pinyin-cell">
                                        {word.pinyin}
                                    </td>
                                    <td class="english-cell">
                                        {word.english}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <div class="empty-vocabulary">
                    <p>No vocabulary available for this unit.</p>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    /* Keeping original styles, no changes needed here */
    .vocabulary-display {
        width: 100%;
    }
    
    /* Tape tab styling (from CassetteTapeSelector) */
    .tape-tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-charcoal);
        background-color: var(--color-cream-paper);
        border: 1px solid var(--color-warm-gray);
        border-radius: 6px;
        transition: all 0.1s ease;
        transform: translateZ(0);
    }
    
    /* Button shadow and 3D effect */
    .tape-tab::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        border-radius: 6px;
        box-shadow:
            0 5px 0 0 var(--color-button-shadow),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 6px 4px rgba(0, 0, 0, 0.15);
        transition: all 0.1s ease;
        z-index: -1;
    }
    
    .tape-tab:hover:not(.active) {
        background-color: rgba(221, 185, 103, 0.2);
        transform: translateY(-1px);
    }
    
    .tape-tab:hover:not(.active)::before {
        box-shadow:
            0 6px 0 0 var(--color-button-shadow),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 7px 4px rgba(0, 0, 0, 0.15);
    }
    
    /* Pressed state */
    .tape-tab.active {
        background-color: var(--color-gold);
        color: var(--color-charcoal);
        transform: translateY(5px);
    }
    
    .tape-tab.active::before {
        box-shadow:
            0 0 0 0 var(--color-button-shadow),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .tape-tab:active {
        transform: translateY(5px);
    }
    
    .tape-tab:active::before {
        box-shadow:
            0 0 0 0 var(--color-button-shadow),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    /* Table styles - kept from original VocabularyTab.svelte */
    .table-wrapper {
        overflow-x: auto;
        border-radius: 8px;
        border: 1px solid var(--color-warm-gray, #a0998a);
        background-color: var(--color-cream-paper, #f4f1de);
        background-image: url('/textures/subtle-paper.png');
        background-repeat: repeat;
    }

    .vocabulary-table {
        width: 100%;
        border-collapse: collapse;
        font-family: 'Work Sans', sans-serif;
    }

    .vocabulary-table th {
        padding: 12px 16px;
        text-align: left;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--color-charcoal, #33312e);
        border-bottom: 2px solid var(--color-avocado, #7d8c5c);
        background-color: rgba(125, 140, 92, 0.1);
        font-weight: 600;
    }

    .vocabulary-table td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--color-warm-gray, #a0998a);
    }

    .vocabulary-table tr:last-child td {
        border-bottom: none;
    }

    .vocabulary-table tr:hover {
        background-color: rgba(193, 124, 116, 0.05);
    }

    /* Column width ratio */
    .simplified-column {
        width: 22.22%;
    }

    .traditional-column {
        width: 22.22%;
    }

    .pinyin-column {
        width: 22.22%;
    }

    .english-column {
        width: 33.33%;
    }

    .chinese-cell {
        font-size: 1em;
    }

    .chinese-text {
        font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
        color: var(--color-charcoal, #33312e);
    }

    .pinyin-cell {
        color: var(--color-warm-gray, #a0998a);
        font-style: italic;
    }

    .english-cell {
        color: var(--color-charcoal, #33312e);
    }

    .empty-vocabulary {
        padding: 40px 24px;
        text-align: center;
        background-color: var(--color-cream-paper, #f4f1de);
        border: 1px dashed var(--color-warm-gray, #a0998a);
        border-radius: 8px;
        color: var(--color-warm-gray, #a0998a);
        font-style: italic;
    }
</style>