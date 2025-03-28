<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import { staffMembers, fetchStaffMembers, STAFF_PRIORITIES } from '$lib/stores/staff';
	import { onMount } from 'svelte';

	let selectedStaff: typeof $staffMembers[number] | null = null;
	let activeTab = 'details';

	$: sortedStaffMembers = [...$staffMembers].sort((a, b) => {
		if (a.isHOD) return -1;
		if (b.isHOD) return 1;
		return (a.priority || 999) - (b.priority || 999);
	});

	$: groupedStaff = sortedStaffMembers.reduce((groups, staff) => {
		const role = staff.role;
		if (!groups[role]) {
			groups[role] = [];
		}
		groups[role].push(staff);
		return groups;
	}, {} as Record<string, typeof $staffMembers>);
	$: prioritizedRoles = Object.entries(groupedStaff)
		.sort(([roleA], [roleB]) => {
			const priorityA = STAFF_PRIORITIES[roleA as keyof typeof STAFF_PRIORITIES] || 999;
			const priorityB = STAFF_PRIORITIES[roleB as keyof typeof STAFF_PRIORITIES] || 999;
			return priorityA - priorityB;
		})
		.map(([role]) => role);

	$: staffByPriority = sortedStaffMembers.reduce((acc, staff) => {
		if (!staff.isHOD) {
			const priority = staff.priority || 999;
			if (!acc[priority]) {
				acc[priority] = [];
			}
			acc[priority].push(staff);
		}
		return acc;
	}, {} as Record<number, typeof $staffMembers>);

	$: priorityNumbers = Object.keys(staffByPriority)
		.map(Number)
		.sort((a, b) => a - b);

	onMount(() => {
		fetchStaffMembers();
	});

	function openStaffModal(staff: typeof $staffMembers[number]) {
		selectedStaff = staff;
		activeTab = 'details';
	}

	function closeModal() {
		selectedStaff = null;
	}
</script>

<Navigation />

<main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold gradient-text text-center mb-12">Our Faculties</h1>
    
    <!-- HOD Section -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
    {#if groupedStaff['HOD']}
        <div class="flex flex-col items-center mb-16">
            <h2 class="text-2xl font-semibold gradient-text text-center mb-8">Head of Department</h2>
            <div class="w-full max-w-7xl flex justify-center">
                {#each groupedStaff['HOD'] as staff}
                    <div
                        class="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg transition-transform hover:scale-105 w-[320px]"
                        on:click={() => openStaffModal(staff)}
                    >
                        <div class="relative h-[360px]">
                            <img
                                src={staff.photoUrl}
                                alt={staff.name}
                                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="text-xl font-semibold gradient-text">{staff.name}</h3>
                            <p class="text-gray-600 mt-2">{staff.role}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Other Staff Members -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="flex flex-col items-center space-y-16">
		<h2 class="text-2xl font-semibold gradient-text text-center mb-8">Professors</h2>
        {#each priorityNumbers as priority}
            <section class="w-full">
                <div class="flex justify-center">
                    <div class="w-full max-w-7xl">
                        <div class="flex flex-wrap justify-center gap-8">
                            {#each staffByPriority[priority] as staff}
								{#if (staff.priority ?? 999) < 999}
                                <div
                                    class="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg transition-transform hover:scale-105 w-[280px]"
                                    on:click={() => openStaffModal(staff)}
                                >
                                    <div class="relative h-[320px]">
                                        <img
                                            src={staff.photoUrl}
                                            alt={staff.name}
                                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div class="p-6 text-center">
                                        <h3 class="text-xl font-semibold gradient-text">{staff.name}</h3>
                                        <p class="text-gray-600 mt-2">{staff.role}</p>
                                    </div>
                                </div>
								{/if}
                            {/each}
                        </div>
                    </div>
                </div>
            </section>
        {/each}
    </div>
</main>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if selectedStaff}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        on:click={closeModal}
    >
        <div
            class="glass-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto"
            on:click|stopPropagation
        >
            <button
                class="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-2 text-gray-700 shadow-md hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
                on:click={closeModal}
            >
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div class="mb-6 flex items-center space-x-6 pr-8">
                <div class="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                        src={selectedStaff.photoUrl}
                        alt={selectedStaff.name}
                        class="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <h2 class="text-3xl font-bold gradient-text">{selectedStaff.name}</h2>
                    <p class="text-xl text-gray-600 mt-1">{selectedStaff.role}</p>
                </div>
            </div>

            <div class="mb-6 flex space-x-4 border-b">
                <button
                    class="px-4 py-2 {activeTab === 'details'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'} transition-colors"
                    on:click={() => (activeTab = 'details')}>Details</button
                >
                <button
                    class="px-4 py-2 {activeTab === 'achievements'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'} transition-colors"
                    on:click={() => (activeTab = 'achievements')}>Achievements</button
                >
            </div>

            {#if activeTab === 'details'}
                <div class="space-y-6">
                    <div class="glass-panel">
                        <h3 class="text-lg font-semibold gradient-text mb-3">Contact Information</h3>
                        <p class="text-gray-600">Email: {selectedStaff.email}</p>
                        {#if selectedStaff.phone}
                            <p class="text-gray-600">Phone: {selectedStaff.phone}</p>
                        {/if}
                    </div>

                    <div class="glass-panel">
                        <h3 class="text-lg font-semibold gradient-text mb-3">Department</h3>
                        <p class="text-gray-600">{selectedStaff.department}</p>
                    </div>

                    <div class="glass-panel">
                        <h3 class="text-lg font-semibold gradient-text mb-3">Qualifications</h3>
                        <ul class="list-inside list-disc text-gray-600 space-y-1">
                            {#each selectedStaff.qualifications as qualification}
                                <li>{qualification}</li>
                            {/each}
                        </ul>
                    </div>

                    {#if selectedStaff.specialization}
                        <div class="glass-panel">
                            <h3 class="text-lg font-semibold gradient-text mb-3">Specialization</h3>
                            <p class="text-gray-600">{selectedStaff.specialization}</p>
                        </div>
                    {/if}

                    <div class="glass-panel">
                        <h3 class="text-lg font-semibold gradient-text mb-3">Biography</h3>
                        <p class="text-gray-600 whitespace-pre-line">{selectedStaff.bio}</p>
                    </div>
                </div>
            {:else}
                <div class="space-y-4">
                    {#each selectedStaff.achievements as achievement}
                        <div class="glass-panel">
                            <h3 class="text-lg font-semibold gradient-text mb-2">{achievement.title}</h3>
                            <p class="text-gray-600 mb-2">{achievement.description}</p>
                            <p class="text-sm text-gray-500">{achievement.date}</p>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
{/if}
