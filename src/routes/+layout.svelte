<script lang="ts">
    import '../app.css';
</script>

<div class="flex flex-col min-h-screen">
    <main class="flex-grow">
        <slot />
    </main>

    <footer class="glass-card mt-auto py-4 text-center">
        <div class="container mx-auto px-4">
            <p class="text-gray-600 text-sm">
                © {new Date().getFullYear()} Department of High Performance Computing, SIMATS. All rights reserved.
            </p>
        </div>
    </footer>
</div>
