<script lang="ts">
	import { page } from '$app/stores';
	import { user, signOut } from '$lib/stores/auth';
	
	// Add mobile menu state
	let isMenuOpen = false;
	
	// Toggle mobile menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	// Close menu when navigating
	function closeMenu() {
		isMenuOpen = false;
	}
	
	const routes = [
		{ path: '/', label: 'Home' },
		{ path: '/staff', label: 'Staff' },
		{ path: '/events', label: 'Events' },
	];
</script>

<header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 shadow-sm">
	<div class="container mx-auto px-4">
		<div class="flex justify-between items-center py-2">
			<a href="/" class="flex items-center space-x-3">
				<img 
					src="/images/simats.png" 
					alt="HPC Logo" 
					class="h-12 w-auto object-contain"
				/>
				<!-- <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					High Performance Computing
				</span> -->
			</a>
			
			<!-- Mobile menu button -->
			<button 
				class="md:hidden p-2 rounded-full hover:bg-white/10 transition-all duration-300"
				on:click={toggleMenu}
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if isMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					{/if}
				</svg>
			</button>
			
			<!-- Desktop navigation -->
			<nav class="hidden md:flex space-x-8">
				{#each routes as route}
					<a
						href={route.path}
						class="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full {$page.url.pathname === route.path ? 'text-blue-600 after:w-full' : ''}"
					>
						{route.label}
					</a>
				{/each}
				
				{#if $user}
					<button 
						on:click={signOut} 
						class="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
					>
						Sign Out
					</button>
				{/if}
			</nav>
		</div>
		
		<!-- Mobile navigation -->
		{#if isMenuOpen}
			<nav class="md:hidden py-4 border-t border-gray-100">
				<ul class="space-y-3">
					{#each routes as route}
						<li>
							<a
								href={route.path}
								class="block py-2 px-4 rounded-lg hover:bg-white/50 transition-all duration-300 {$page.url.pathname === route.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}"
								on:click={closeMenu}
							>
								{route.label}
							</a>
						</li>
					{/each}
					
					{#if $user}
						<li>
							<button 
								on:click={() => { signOut(); closeMenu(); }}
								class="w-full text-left py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
							>
								Sign Out
							</button>
						</li>
					{/if}
				</ul>
			</nav>
		{/if}
	</div>
</header>

<!-- Spacer to prevent content from hiding under fixed header -->
<div class="h-16"></div>