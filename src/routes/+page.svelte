<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import { homePageContent, fetchHomePageContent } from '$lib/stores/homepage';
    import { onMount } from 'svelte';

    onMount(() => {
        fetchHomePageContent();
    });

    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            const sections = ['hero', 'about', 'vision', 'mission'];
            sections.forEach(section => {
                const element = document.querySelector(`[data-section="${section}"]`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const offset = Math.max(0, (rect.top - window.innerHeight * 0.3) * 0.4);
                    (element as HTMLElement).style.setProperty('--parallax-offset', `${offset}px`);
                }
            });
        });
    }
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
</svelte:head>

<Navigation />

<!-- svelte-ignore element_invalid_self_closing_tag -->
{#if $homePageContent?.heroImage}
    <div 
        class="relative h-[70vh] overflow-hidden"
    >
        <div 
            class="absolute inset-0 bg-cover bg-center"
            style="background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('{$homePageContent.heroImage}');
                   transform: translateY(var(--parallax-offset, 0));
                   will-change: transform;"
        >
        </div>
        <!-- Removed the backdrop-blur-sm div -->
        <div class="relative h-full flex flex-col items-center justify-center">
            <div class="glass-card p-12 max-w-4xl mx-4 rounded-3xl border border-white/20 relative z-10 hover:scale-[1.02] transition-transform duration-500">
                <h1 class="text-2xl md:text-5xl font-bold gradient-text animate-fade-in">Department of </h1>
                <h1 class="text-5xl md:text-8xl font-bold gradient-text mb-4 leading-tight animate-fade-in-delay">High Performance Computing</h1>
                <p class="text-xl md:text-2xl text-gray-700 animate-fade-in-delay">
                    Empowering future innovators through excellence in education, research, and technology.
                </p>
            </div>
            <div class="flex justify-center space-x-4 mt-8 relative z-10">
                <a 
                    href="/staff" 
                    class="glass-card p-3 rounded-3xl flex items-center space-x-2"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Our Faculty</span>
                </a>
                <a 
                    href="/events" 
                    class="glass-card p-3 rounded-3xl flex items-center space-x-2"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Events</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Content Sections -->
    <main class="container mx-auto px-2 md:px-4 py-6 md:py-16">
        <section class="grid gap-6 md:gap-16">
            <!-- About Us Section -->
            <div class="animate-section relative overflow-hidden group min-h-[60vh] md:min-h-[80vh]" data-section="about">
                <div 
                    class="absolute rounded-3xl inset-0 bg-cover bg-center rounded-3xl"
                    style="background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('{$homePageContent?.aboutUsImage}');
                           transform: translateY(var(--parallax-offset, 0));
                           will-change: transform;"
                />
                <div class="glass-panel p-4 md:p-12 relative h-full flex flex-col items-center justify-center bg-white/2">
                    <div class="text-center mb-4 md:mb-8 relative z-10">
                        <div class="w-16 h-16 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center p-3 md:p-6 mx-auto mb-3 md:mb-6">
                            <svg class="w-10 h-10 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 class="text-3xl md:text-5xl font-bold gradient-text-w">About Us</h2>
                    </div>
                    <p class="text-sm md:text-lg text-gray-100 leading-relaxed max-w-4xl mx-auto text-center px-2 md:px-4 overflow-auto whitespace-pre-wrap">
                        {$homePageContent?.aboutUs || 'Loading about us...'}
                    </p>
                </div>
            </div>

            <!-- Vision Section -->
            <div class="animate-section relative overflow-hidden group min-h-[60vh] md:min-h-[80vh]" data-section="vision">
                <div 
                    class="absolute rounded-3xl inset-0 bg-cover bg-center"
                    style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('{$homePageContent?.visionImage}');
                           transform: translateY(var(--parallax-offset, 0));
                           will-change: transform;"
                />
                <div class="p-4 md:p-12 relative h-full flex flex-col items-center justify-center bg-white/5">
                    <div class="text-center mb-4 md:mb-8 relative z-10">
                        <div class="w-16 h-16 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-3 md:p-6 mx-auto mb-3 md:mb-6">
                            <svg class="w-10 h-10 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h2 class="text-3xl md:text-5xl font-bold gradient-text-w">Vision</h2>
                    </div>
                    <p class="text-sm md:text-lg text-gray-100 leading-relaxed max-w-4xl mx-auto text-center px-2 md:px-4 overflow-auto whitespace-pre-wrap">
                        {$homePageContent?.vision || 'Loading vision...'}
                    </p>
                </div>
            </div>

            <!-- Mission Section -->
            <div class="animate-section relative overflow-hidden group min-h-[60vh] md:min-h-[80vh]" data-section="mission">
                <div 
                    class="absolute rounded-3xl inset-0 bg-cover bg-center"
                    style="background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('{$homePageContent?.missionImage}');
                           transform: translateY(var(--parallax-offset, 0));
                           will-change: transform;"
                />
                <div class="p-4 md:p-12 relative h-full flex flex-col items-center justify-center bg-white/5">
                    <div class="text-center mb-4 md:mb-8 relative z-10">
                        <div class="w-16 h-16 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-3 md:p-6 mx-auto mb-3 md:mb-6">
                            <svg class="w-10 h-10 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 class="text-3xl md:text-5xl font-bold gradient-text-w">Mission</h2>
                    </div>
                    <p class="text-sm md:text-lg text-gray-100 leading-relaxed max-w-4xl mx-auto text-center px-2 md:px-4 overflow-auto whitespace-pre-wrap">
                        {$homePageContent?.mission || 'Loading mission...'}
                    </p>
                </div>
            </div>
        </section>
    </main>
{/if}

<style>
    @media (max-width: 768px) {
        .glass-card {
            backdrop-filter: blur(8px);
        }

        .glass-panel {
            backdrop-filter: blur(8px);
            padding: 1rem;
        }

        :global(.typewriter-text) {
            font-size: 0.875rem;
            line-height: 1.4;
        }
    }

    .animate-section {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.8s ease-out forwards;
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
    }

    .animate-fade-in-delay {
        animation: fadeIn 0.8s ease-out 0.3s forwards;
        opacity: 0;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
