<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import { events, fetchEvents, type Event } from '$lib/stores/events';
	import { onMount } from 'svelte';

	onMount(() => {
		fetchEvents();
	});

	$: upcomingEvents = $events.filter((event) => {
		const eventDate = new Date(event.date);
		const today = new Date();
		return eventDate >= today;
	});

	$: pastEvents = $events.filter((event) => {
		const eventDate = new Date(event.date);
		const today = new Date();
		return eventDate < today;
	});
</script>

<Navigation />

<main class="container mx-auto px-4 py-8">
    <section class="mb-12">
        <h2 class="text-2xl font-bold gradient-text mb-8">Upcoming Events</h2>
        {#if upcomingEvents.length > 0}
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {#each upcomingEvents as event}
                    <div class="glass-panel group cursor-pointer transition-all duration-300 hover:scale-105">
                        {#if event.image}
                            <div class="relative h-48 w-full mb-6 overflow-hidden rounded-lg">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                        {/if}
                        <h3 class="text-xl font-semibold gradient-text mb-3">{event.title}</h3>
                        <div class="flex items-center text-gray-600 mb-3">
                            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString()}
                            <span class="mx-2">•</span>
                            {event.time}
                        </div>
                        <div class="flex items-center text-gray-600 mb-4">
                            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.venue}
                        </div>
                        <p class="text-gray-600">{event.description}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="glass-panel text-center py-16 animate-fade-in">
                <div class="mb-6">
                    <svg class="w-24 h-24 mx-auto text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-semibold gradient-text mb-3">Stay Tuned!</h3>
                <p class="text-gray-600 text-lg">
                    We're cooking up some exciting events for you. 
                    <br />Check back soon for updates!
                </p>
            </div>
        {/if}
    </section>

    <section>
        <h2 class="text-2xl font-bold gradient-text mb-8">Past Events</h2>
        {#if pastEvents.length > 0}
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {#each pastEvents as event}
                    <div class="glass-panel group opacity-90">
                        {#if event.image}
                            <div class="relative h-48 w-full mb-6 overflow-hidden rounded-lg">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    class="absolute inset-0 h-full w-full object-cover grayscale"
                                    loading="lazy"
                                />
                            </div>
                        {/if}
                        <h3 class="text-xl font-semibold gradient-text mb-3">{event.title}</h3>
                        <div class="flex items-center text-gray-500 mb-3">
                            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString()}
                            <span class="mx-2">•</span>
                            {event.time}
                        </div>
                        <div class="flex items-center text-gray-500 mb-4">
                            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.venue}
                        </div>
                        <p class="text-gray-500">{event.description}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="glass-panel text-center py-16 animate-fade-in">
                <div class="mb-6">
                    <svg class="w-24 h-24 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-semibold gradient-text mb-3">History in the Making</h3>
                <p class="text-gray-600 text-lg">
                    Our journey is just beginning. 
                    <br />Be part of our upcoming events and help us create history!
                </p>
            </div>
        {/if}
    </section>
</main>