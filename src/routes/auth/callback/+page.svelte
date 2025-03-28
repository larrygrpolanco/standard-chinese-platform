<!-- src/routes/auth/callback/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase/client';

  let error = null;
  let loading = true;

  onMount(async () => {
    try {
      console.log("OAuth callback: Starting");
      
      // Handle with timeout
      const authPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Auth callback timeout")), 10000)
      );
      
      const { data, error: authError } = await Promise.race([authPromise, timeoutPromise]);
      console.log("OAuth callback: getSession completed", !!data.session);
      
      if (authError) {
        console.error("OAuth callback error:", authError);
        error = authError.message;
        loading = false;
        return;
      }
      
      // Redirect to profile with error handling
      try {
        console.log("OAuth callback: redirecting to profile");
        await goto('/profile');
      } catch (redirectErr) {
        console.error("Redirect error:", redirectErr);
        error = "Failed to redirect after login. Please try going to the home page.";
        loading = false;
      }
    } catch (err) {
      console.error("OAuth callback exception:", err);
      error = err.message || "Unknown authentication error";
      loading = false;
    }
  });
</script>