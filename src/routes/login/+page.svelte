<!-- src/routes/login/+page.svelte -->
<script>
    import Auth from '$lib/components/Auth.svelte';
    import { onMount } from 'svelte';
    import { authStore } from '$lib/stores/authStore';
    import { goto } from '$app/navigation';

    // Check if user is already logged in
    onMount(() => {
        const unsubscribe = authStore.subscribe(user => {
            if (user) {
                goto('/'); // Redirect to home if already logged in
            }
        });

        return unsubscribe;
    });
</script>

<svelte:head>
    <title>Sign In | Taped Chinese</title>
    <meta name="description" content="Sign in to your Taped Chinese account to track progress and access personalized features." />
</svelte:head>

<div class="login-page">
    <div class="login-container">
        <div class="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your Chinese learning journey</p>
        </div>
        
        <Auth />
    </div>
</div>

<style>
    .login-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 4rem);
        padding: 2rem 1rem;
        background-image: 
            radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
    }

    .login-container {
        width: 100%;
        max-width: 32rem;
    }

    .login-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .login-header h1 {
        font-family: 'Arvo', serif;
        font-size: 2rem;
        font-weight: bold;
        color: #33312e;
        margin-bottom: 0.5rem;
    }

    .login-header p {
        font-family: 'Work Sans', sans-serif;
        color: #70594a;
    }

    @media (max-width: 640px) {
        .login-page {
            padding: 1rem;
        }
        
        .login-header h1 {
            font-size: 1.75rem;
        }
    }
</style>