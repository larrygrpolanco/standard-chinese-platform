<!-- src/routes/rwp/[unit_id]/+page.svelte -->
<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition'; // Added proper import for transitions
    import {
        getUnitBasicInfo,
        getUserPreferences,
        saveUserPreferences,
        getRwpContent
    } from '$lib/supabase/client.js';
    import { generateRwpExercise } from '$lib/rwp/rwpGenerator.js';
    import { exerciseTypes } from '$lib/rwp/exerciseTypes.js';
    import Loader from '$lib/components/UI/Loader.svelte';
    import ModuleQuestions from '$lib/components/ModuleQuestions.svelte';
    import { authStore } from '$lib/stores/authStore';
    import FontToggle from '$lib/components/UI/FontToggle.svelte';
    import Toast from '$lib/components/UI/Toast.svelte';

    // RWP components
    import RwpHeader from '$lib/components/rwp/RwpHeader.svelte';
    import ExerciseGenerator from '$lib/components/rwp/ExerciseGenerator.svelte';
    import ReadingExercise from '$lib/components/rwp/ReadingExercise.svelte';
    import { getComponentForExerciseType } from '$lib/rwp/exerciseTypes.js';

    // State variables
    let loading = true;
    let generating = false;
    let unitData = null;
    let userPreferences = null;
    let rwpContent = null;
    let exerciseType = 'reading_comprehension';
    let specificFocus = '';
    let showAnswers = false;
    let error = null;
    let user;
    let debug = true;

    // Collapsible panel states
    let contextPanelOpen = false;
    let generatorPanelOpen = false;

    // Toast state
    let toastVisible = false;
    let toastMessage = '';

    // Get unit ID from URL parameter
    const unitId = parseInt($page.params.unit_id);

    // Subscribe to auth store
    authStore.subscribe((value) => {
        user = value;
    });

    onMount(async () => {
        loading = true;

        try {
            // Load unit data
            unitData = await getUnitBasicInfo(unitId);

            if (!unitData) {
                error = 'Unit not found';
                return;
            }

            if (user) {
                // Load user preferences
                userPreferences = await getUserPreferences();

                // Initialize empty preferences if needed
                if (!userPreferences) {
                    userPreferences = {
                        personal_context: {},
                        module_responses: {}
                    };
                }

                // Load existing RWP content
                const rwpData = await getRwpContent(unitId);
                if (rwpData) {
                    console.log('RWP data from database:', rwpData);

                    // Set content and ensure exercise_type exists
                    rwpContent = rwpData.content;

                    if (!rwpContent.exercise_type) {
                        console.log('Exercise type missing, setting default');
                        rwpContent.exercise_type = 'reading_comprehension';
                    }

                    console.log('Final rwpContent:', rwpContent);
                }
            }
        } catch (err) {
            console.error('Error loading data:', err);
            error = err.message || 'Failed to load data';
        } finally {
            loading = false;
        }
    });

    // Show toast notification
    function showToast(message) {
        toastMessage = message;
        toastVisible = true;

        // Hide toast after 3 seconds
        setTimeout(() => {
            toastVisible = false;
        }, 3000);
    }

    // Save module responses
    async function saveModuleResponses(event) {
        try {
            const updatedResponses = event.detail;

            // Update preferences in database
            await saveUserPreferences({
                ...userPreferences,
                module_responses: updatedResponses
            });

            // Update local state
            userPreferences.module_responses = updatedResponses;

            // Show toast message
            showToast('Your responses have been saved!');
        } catch (err) {
            console.error('Error saving responses:', err);
            showToast('Failed to save your responses');
        }
    }

    // Generate a new exercise
    async function generateExercise() {
        if (!user) {
            window.location.href = `/login?redirect=/rwp/${unitId}`;
            return;
        }

        generating = true;
        showAnswers = false;
        error = null;

        try {
            // Generate content and ensure it has the exercise_type
            rwpContent = await generateRwpExercise(unitId, exerciseType, specificFocus, debug);

            // Add an additional check here to make sure exercise_type exists
            if (!rwpContent.exercise_type) {
                console.log('Exercise type missing after generation, setting to:', exerciseType);
                rwpContent.exercise_type = exerciseType;
            }

            showToast('New exercise generated successfully!');
        } catch (err) {
            console.error('Error generating exercise:', err);
            error = err.message || 'Failed to generate exercise';
            showToast('Failed to generate exercise');
        } finally {
            generating = false;
        }
    }

    // Toggle answer visibility
    function toggleAnswers() {
        showAnswers = !showAnswers;
    }

    // Toggle panel visibility
    function togglePanel(panel) {
        if (panel === 'context') {
            contextPanelOpen = !contextPanelOpen;
        } else if (panel === 'generator') {
            generatorPanelOpen = !generatorPanelOpen;
        }
    }

    // Determine which component to use based on exercise type
    $: ExerciseComponent = rwpContent ? exerciseTypes[rwpContent.exercise_type]?.component : null;
</script>

<svelte:head>
    <title>{unitData ? `RWP: ${unitData.title}` : 'Real World Practice'} | Taped Chinese</title>
</svelte:head>

<div class="page-wrapper">
    {#if loading}
        <div class="centered-loader">
            <Loader />
        </div>
    {:else if error}
        <div class="vintage-error">
            <div class="error-icon">!</div>
            <h1 class="error-title">{error}</h1>
            <p class="error-message">We couldn't load this practice exercise. Please try again later.</p>
            <a href="/units/{unitId}" class="vintage-button">
                <span class="button-text">Return to Unit {unitId}</span>
            </a>
        </div>
    {:else}
        <div class="page-container">
            <!-- Header with navigation -->
            <header class="page-header">
                <a href="/units/{unitId}" class="back-button">
                    <svg viewBox="0 0 24 24" class="back-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span>Back to Unit {unitId}</span>
                </a>
                
                <div class="unit-info">
                    <div class="unit-badge">Unit {unitId}</div>
                    <h1 class="unit-title">{unitData.title}</h1>
                </div>
            </header>

            <!-- Content area -->
            <div class="content-area">
                <!-- Main content grid -->
                <div class="practice-layout">
                    <!-- Left side: Controls and customization -->
                    <div class="sidebar">
                        <div class="sidebar-section">
                            <div class="section-header">
                                <h2 class="section-title">Personalize Your Practice</h2>
                            </div>
                            
                            {#if user}
                                <!-- Exercise generator -->
                                <div class="vintage-panel">
                                    <button class="panel-toggle" on:click={() => togglePanel('generator')}>
                                        <h3 class="panel-title">Generate New Exercise</h3>
                                        <div class="toggle-icon {generatorPanelOpen ? 'open' : ''}">
                                            <div class="toggle-line"></div>
                                            <div class="toggle-line"></div>
                                        </div>
                                    </button>
                                    
                                    {#if generatorPanelOpen}
                                        <div class="panel-content" transition:slide={{ duration: 300 }}>
                                            <p class="helper-text">Choose the type of practice that would be most helpful for you right now.</p>
                                            
                                            <ExerciseGenerator
                                                {generating}
                                                bind:exerciseType
                                                bind:specificFocus
                                                bind:debug
                                                hasExistingContent={!!rwpContent}
                                                on:generate={generateExercise}
                                            />
                                            
                                            <button 
                                                class="generate-button {generating ? 'generating' : ''}" 
                                                on:click={generateExercise}
                                                disabled={generating}
                                            >
                                                <div class="button-content">
                                                    {#if generating}
                                                        <div class="tape-spinner"></div>
                                                        <span>Creating your practice...</span>
                                                    {:else}
                                                        <svg class="button-icon" viewBox="0 0 24 24">
                                                            <path d="M19 12H5M12 19V5" stroke="currentColor" stroke-width="2" />
                                                        </svg>
                                                        <span>Generate New Exercise</span>
                                                    {/if}
                                                </div>
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                                
                                <!-- Learning context panel -->
                                <div class="vintage-panel">
                                    <button class="panel-toggle" on:click={() => togglePanel('context')}>
                                        <h3 class="panel-title">Your Learning Context</h3>
                                        <div class="toggle-icon {contextPanelOpen ? 'open' : ''}">
                                            <div class="toggle-line"></div>
                                            <div class="toggle-line"></div>
                                        </div>
                                    </button>
                                    
                                    {#if contextPanelOpen}
                                        <div class="panel-content" transition:slide={{ duration: 300 }}>
                                            <p class="helper-text">Tell us about your interests and goals to make exercises more relevant to your life.</p>
                                            
                                            {#if userPreferences}
                                                <ModuleQuestions
                                                    moduleId={unitData.module.id}
                                                    moduleResponses={userPreferences.module_responses}
                                                    on:save={saveModuleResponses}
                                                />
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <!-- Sign-in prompt -->
                                <div class="vintage-panel">
                                    <div class="panel-content signup-prompt">
                                        <div class="tape-icon">
                                            <svg viewBox="0 0 24 24" class="cassette-icon">
                                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                                <circle cx="8" cy="12" r="2" />
                                                <circle cx="16" cy="12" r="2" />
                                                <path d="M8 12h8" />
                                            </svg>
                                        </div>
                                        <h3 class="prompt-title">Create Your Personal Language Practice</h3>
                                        <p class="prompt-text">Sign in to save your preferences and generate exercises tailored to your learning style and interests.</p>
                                        <a href="/login?redirect=/rwp/{unitId}" class="vintage-button full-width">
                                            <span class="button-text">Sign In or Create Account</span>
                                        </a>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Right side: Exercise display -->
                    <div class="main-content">
                        <div class="content-header">
                            <h2 class="content-title">Real World Practice</h2>
                            <p class="content-description">Apply what you've learned in this unit to realistic scenarios and personalized content.</p>
                        </div>
                        
                        {#if rwpContent}
                            <div class="exercise-wrapper">
                                <div class="exercise-controls">
                                    <h3 class="exercise-title">{rwpContent.meta?.title || 'Practice Exercise'}</h3>
                                    <button on:click={toggleAnswers} class="answer-toggle {showAnswers ? 'active' : ''}">
                                        {showAnswers ? 'Hide Answers' : 'Show Answers'}
                                    </button>
                                </div>
                                
                                <!-- Dynamic exercise component -->
                                {#if ExerciseComponent}
                                    <div class="exercise-container">
                                        <svelte:component this={ExerciseComponent} content={rwpContent} {showAnswers} />
                                    </div>
                                {:else}
                                    <div class="vintage-error small">
                                        <div class="error-icon small">!</div>
                                        <p class="error-message">Unsupported exercise type: {rwpContent.exercise_type}</p>
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <!-- Empty state -->
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <svg viewBox="0 0 24 24" class="cassette-large">
                                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" fill="none" stroke-width="1.5" />
                                        <circle cx="8" cy="12" r="3" stroke="currentColor" fill="none" stroke-width="1.5" />
                                        <circle cx="16" cy="12" r="3" stroke="currentColor" fill="none" stroke-width="1.5" />
                                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" />
                                        <line x1="5" y1="7" x2="19" y2="7" stroke="currentColor" stroke-width="1.5" />
                                    </svg>
                                </div>
                                <h3 class="empty-state-title">Ready to Practice?</h3>
                                <p class="empty-state-text">Generate a personalized exercise based on what you've learned in this unit. Your practice will be tailored to your interests and learning goals.</p>
                                <button 
                                    class="generate-button large {generating ? 'generating' : ''}" 
                                    on:click={generateExercise}
                                    disabled={generating}
                                >
                                    <div class="button-content">
                                        {#if generating}
                                            <div class="tape-spinner"></div>
                                            <span>Creating your practice...</span>
                                        {:else}
                                            <svg class="button-icon" viewBox="0 0 24 24">
                                                <path d="M19 12H5M12 19V5" stroke="currentColor" stroke-width="2" />
                                            </svg>
                                            <span>Create Your First Practice</span>
                                        {/if}
                                    </div>
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Toast component -->
<Toast message={toastMessage} show={toastVisible} />

<style>
    /* ===== BASE LAYOUT ===== */
    .page-wrapper {
        width: 100%;
        min-height: 100vh;
        background-color: var(--color-cream-paper, #F4F1DE);
        background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    }

    .page-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 1.5rem;
    }

    .centered-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 50vh;
    }

    /* ===== HEADER STYLING ===== */
    .page-header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .back-button {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border-radius: 20px;
        color: var(--color-navy, #34667F);
        font-size: 0.875rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
        width: fit-content;
    }

    .back-button:hover {
        color: var(--color-terracotta, #C17C74);
        transform: translateX(-2px);
    }

    .back-icon {
        width: 20px;
        height: 20px;
        margin-right: 0.375rem;
    }

    .unit-info {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
    }

    .unit-badge {
        display: inline-block;
        background-color: var(--color-terracotta, #C17C74);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: 0.875rem;
        font-weight: 600;
        width: fit-content;
    }

    .unit-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.75rem;
        color: var(--color-charcoal, #33312E);
        margin: 0;
    }

    /* ===== CONTENT AREA ===== */
    .content-area {
        margin-top: 1rem;
    }

    /* Main grid layout */
    .practice-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    @media (min-width: 1024px) {
        .practice-layout {
            grid-template-columns: 320px 1fr;
        }
    }

    /* ===== SIDEBAR STYLES ===== */
    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .sidebar-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .section-header {
        margin-bottom: 0.5rem;
    }

    .section-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.35rem;
        color: var(--color-charcoal, #33312E);
        margin: 0;
    }

    /* Vintage panel styling */
    .vintage-panel {
        background-color: var(--color-beige, #E8E5D7);
        background-image: linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
        border: 1px solid var(--color-warm-gray, #A0998A);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .panel-toggle {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 0.875rem 1.25rem;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        transition: background-color 0.2s;
    }

    .panel-toggle:hover {
        background-color: rgba(160, 152, 138, 0.1);
    }

    .panel-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-charcoal, #33312E);
        margin: 0;
    }

    .toggle-icon {
        display: flex;
        flex-direction: column;
        gap: 3px;
        width: 16px;
        height: 16px;
        padding: 2px;
        transition: transform 0.3s;
    }

    .toggle-icon.open {
        transform: rotate(45deg);
    }

    .toggle-line {
        width: 100%;
        height: 2px;
        background-color: var(--color-warm-gray, #A0998A);
        transition: transform 0.3s;
    }

    .toggle-icon .toggle-line:first-child {
        transform-origin: center;
    }

    .toggle-icon .toggle-line:last-child {
        transform: rotate(90deg) translateX(-2px);
        transform-origin: center;
    }

    .panel-content {
        padding: 1rem 1.25rem 1.5rem;
        border-top: 1px solid rgba(160, 152, 138, 0.3);
    }

    .helper-text {
        color: var(--color-warm-gray, #A0998A);
        font-size: 0.875rem;
        margin-top: 0;
        margin-bottom: 1rem;
        line-height: 1.5;
    }

    /* Sign-up prompt styling */
    .signup-prompt {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
    }

    .tape-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        background-color: var(--color-gold, #DDB967);
        border-radius: 50%;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cassette-icon {
        width: 32px;
        height: 32px;
        color: var(--color-charcoal, #33312E);
        stroke-width: 1.5;
    }

    .prompt-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.125rem;
        color: var(--color-charcoal, #33312E);
        margin-top: 0;
        margin-bottom: 0.75rem;
    }

    .prompt-text {
        color: var(--color-warm-gray, #A0998A);
        font-size: 0.875rem;
        margin-bottom: 1.25rem;
        line-height: 1.5;
    }

    /* Generate button styling */
    .generate-button {
        position: relative;
        display: inline-flex;
        justify-content: center;
        padding: 0.75rem 1.25rem;
        background-color: var(--color-navy, #34667F);
        color: white;
        border: none;
        border-radius: 24px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid #295267;
        width: 100%;
        overflow: hidden;
    }

    .generate-button.large {
        padding: 1rem 1.5rem;
        font-size: 1rem;
    }

    .generate-button:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #2d5870;
    }

    .generate-button:not(:disabled):active {
        transform: translateY(1px);
        box-shadow: none;
    }

    .generate-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .button-icon {
        width: 18px;
        height: 18px;
    }

    /* Tape spinner animation */
    .tape-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* ===== MAIN CONTENT STYLES ===== */
    .main-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .content-header {
        margin-bottom: 1rem;
    }

    .content-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.75rem;
        color: var(--color-charcoal, #33312E);
        margin: 0 0 0.5rem 0;
    }

    .content-description {
        color: var(--color-warm-gray, #A0998A);
        font-size: 1rem;
        line-height: 1.5;
        margin: 0;
    }

    /* Exercise wrapper */
    .exercise-wrapper {
        background-color: white;
        border: 1px solid var(--color-warm-gray, #A0998A);
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        overflow: hidden;
    }

    .exercise-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background-color: var(--color-beige, #E8E5D7);
        border-bottom: 1px solid var(--color-warm-gray, #A0998A);
    }

    .exercise-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.25rem;
        color: var(--color-charcoal, #33312E);
        margin: 0;
    }

    .answer-toggle {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: var(--color-cream-paper, #F4F1DE);
        border: 1px solid var(--color-warm-gray, #A0998A);
        border-radius: 24px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .answer-toggle:hover {
        background-color: rgba(221, 185, 103, 0.2);
    }

    .answer-toggle.active {
        background-color: var(--color-gold, #DDB967);
        color: var(--color-charcoal, #33312E);
    }

    .exercise-container {
        padding: 0;
        background-color: var(--color-cream-paper, #F4F1DE);
    }

    /* Empty state styling */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background-color: white;
        border: 1px solid var(--color-warm-gray, #A0998A);
        border-radius: 8px;
        padding: 3rem 2rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    .empty-state-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 80px;
        background-color: var(--color-beige, #E8E5D7);
        border-radius: 50%;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cassette-large {
        width: 48px;
        height: 48px;
        color: var(--color-warm-gray, #A0998A);
    }

    .empty-state-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.5rem;
        color: var(--color-charcoal, #33312E);
        margin-top: 0;
        margin-bottom: 0.75rem;
    }

    .empty-state-text {
        color: var(--color-warm-gray, #A0998A);
        font-size: 1rem;
        line-height: 1.6;
        max-width: 500px;
        margin-bottom: 1.5rem;
    }

    /* ===== ERROR STYLING ===== */
    .vintage-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 4rem 2rem;
        background-color: white;
        border: 1px solid var(--color-terracotta, #C17C74);
        border-radius: 8px;
        max-width: 600px;
        margin: 4rem auto;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    .vintage-error.small {
        padding: 1.5rem;
        margin: 0;
        flex-direction: row;
        text-align: left;
        gap: 1rem;
    }

    .error-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        background-color: var(--color-terracotta, #C17C74);
        color: white;
        font-size: 2rem;
        font-weight: bold;
        border-radius: 50%;
        margin-bottom: 1.5rem;
    }

    .error-icon.small {
        width: 32px;
        height: 32px;
        font-size: 1.25rem;
        margin-bottom: 0;
    }

    .error-title {
        font-family: 'Arvo', 'DM Serif Display', serif;
        font-size: 1.5rem;
        color: var(--color-terracotta, #C17C74);
        margin-top: 0;
        margin-bottom: 0.75rem;
    }

    .error-message {
        color: var(--color-charcoal, #33312E);
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    /* ===== UTILITY STYLES ===== */
    .vintage-button {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: var(--color-cream-paper, #F4F1DE);
        color: var(--color-charcoal, #33312E);
        border: 1px solid var(--color-warm-gray, #A0998A);
        border-radius: 24px;
        padding: 0.75rem 1.25rem;
        font-weight: 600;
        font-size: 0.875rem;
        text-decoration: none;
        transition: all 0.2s;
        transform: translateY(0);
    }

    .vintage-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 24px;
        box-shadow: 0 3px 0 0 var(--color-button-shadow, #826D5B);
        z-index: -1;
        transition: all 0.1s ease;
    }

    .vintage-button:hover {
        transform: translateY(-1px);
    }

    .vintage-button:hover::before {
        box-shadow: 0 4px 0 0 var(--color-button-shadow, #826D5B);
    }

    .vintage-button:active {
        transform: translateY(3px);
    }

    .vintage-button:active::before {
        box-shadow: 0 0 0 0 var(--color-button-shadow, #826D5B);
    }

    .full-width {
        width: 100%;
    }

    /* ===== RESPONSIVE ADJUSTMENTS ===== */
    @media (max-width: 768px) {
        .page-container {
            padding: 1rem;
        }

        .exercise-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
        }

        .answer-toggle {
            align-self: flex-end;
        }
    }

    @media (max-width: 640px) {
        .content-title {
            font-size: 1.5rem;
        }

        .exercise-title {
            font-size: 1.125rem;
        }
    }
</style>