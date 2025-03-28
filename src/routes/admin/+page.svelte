<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import { user, signIn } from '$lib/stores/auth';
	import { staffMembers, fetchStaffMembers } from '$lib/stores/staff';
	import { events, fetchEvents } from '$lib/stores/events';
	import { fetchHomePageContent } from '$lib/stores/homepage';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let loginError = '';

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		loginError = '';
		
		try {
			const result = await signIn(email, password);
			if (!result.success) {
				loginError = 'Invalid email or password';
			} else {
				await Promise.all([
					fetchStaffMembers(),
					fetchEvents(),
					fetchHomePageContent()
				]);
			}
		} catch (error) {
			loginError = 'An error occurred during login';
			console.error('Login error:', error);
		}
	}

	$: if ($user) {
		Promise.all([
			fetchStaffMembers(),
			fetchEvents(),
			fetchHomePageContent()
		]).catch(error => {
			console.error('Error fetching dashboard data:', error);
		});
	}

</script>


<main>
	{#if !$user}
		<div class="mx-auto max-w-md">
			<h1 class="mb-8 text-center text-3xl font-bold text-blue-900">Admin Login</h1>
			<form class="space-y-4" on:submit|preventDefault={handleLogin}>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						required
					/>
				</div>
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						required
					/>
				</div>
				{#if loginError}
					<p class="text-sm text-red-600">{loginError}</p>
				{/if}
				<button
					type="submit"
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Login
				</button>
			</form>
			<button
				on:click={() => goto('/')}
				class="mt-4 w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
			>
				Back to Home
			</button>
		</div>
	{:else}
	<AdminLayout>
		<div class="space-y-8">
			<h1 class="text-3xl font-bold text-blue-900">Dashboard</h1>

			<div class="grid gap-6 md:grid-cols-3">
				<div class="rounded-lg bg-white p-6 shadow-lg">
					<h3 class="text-lg font-semibold text-blue-900">Staff Members</h3>
					<p class="mt-2 text-3xl font-bold text-blue-600">{$staffMembers.length}</p>
					<a
						href="/admin/staffs"
						class="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
						>Manage Staff →</a
					>
				</div>

				<div class="rounded-lg bg-white p-6 shadow-lg">
					<h3 class="text-lg font-semibold text-blue-900">Events</h3>
					<p class="mt-2 text-3xl font-bold text-blue-600">{$events.length}</p>
					<a
						href="/admin/events"
						class="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
						>Manage Events →</a
					>
				</div>

				<div class="rounded-lg bg-white p-6 shadow-lg">
					<h3 class="text-lg font-semibold text-blue-900">Homepage</h3>
					<p class="mt-2 text-sm text-gray-600">Content Management</p>
					<a
						href="/admin/homepage"
						class="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
						>Edit Content →</a
					>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-semibold text-blue-900">Recent Staff Members</h2>
				<div class="space-y-4">
					{#each $staffMembers.slice(0, 3) as staff}
						<div class="flex items-center space-x-4 border-b pb-4 last:border-0">
							<img
								src={staff.photoUrl}
								alt={staff.name}
								class="h-12 w-12 rounded-full object-cover"
							/>
							<div>
								<h3 class="font-semibold text-gray-900">{staff.name}</h3>
								<p class="text-sm text-gray-600">{staff.role}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-semibold text-blue-900">Upcoming Events</h2>
				<div class="space-y-4">
					{#each $events.slice(0, 3) as event}
						<div class="flex items-center justify-between border-b pb-4 last:border-0">
							<div>
								<h3 class="font-semibold text-gray-900">{event.title}</h3>
								<p class="text-sm text-gray-600">{event.date} at {event.venue}</p>
							</div>
							<a
								href="/admin/events"
								class="text-sm text-blue-600 hover:text-blue-800"
								>View Details →</a
							>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-semibold text-blue-900">Quick Actions</h2>
				<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
					<a
						href="/admin/staffs"
						class="flex items-center justify-center rounded-md bg-blue-50 p-4 text-blue-700 hover:bg-blue-100"
					>
						Add New Staff
					</a>
					<a
						href="/admin/events"
						class="flex items-center justify-center rounded-md bg-blue-50 p-4 text-blue-700 hover:bg-blue-100"
					>
						Create Event
					</a>
					<a
						href="/admin/homepage"
						class="flex items-center justify-center rounded-md bg-blue-50 p-4 text-blue-700 hover:bg-blue-100"
					>
						Update Homepage
					</a>
				</div>
			</div>
		</div>
	</AdminLayout>
	{/if}
</main>
