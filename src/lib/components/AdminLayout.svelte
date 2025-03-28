<script lang="ts">
    import { signOut } from '$lib/stores/auth';
    import { goto } from '$app/navigation';

    async function handleSignOut() {
        const result = await signOut();
        if (result.success) {
            goto('/');
        }
    }
</script>

<div class="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <header class="glass-card fixed top-0 w-full z-50 px-4 py-3">
        <div class="container mx-auto flex items-center justify-between">
            <h2 class="text-xl font-bold gradient-text">Admin Panel</h2>
            <button
                on:click={handleSignOut}
                class="glass-button"
            >
                Logout
            </button>
        </div>
    </header>

    <main class="container mx-auto p-6 pt-24">
        <slot />
    </main>
</div>