<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import { onMount } from 'svelte';
	import { events, fetchEvents, addEvent, updateEvent, deleteEvent, type Event as EventData } from '$lib/stores/events';
	import { uploadImage } from '$lib/cloudinary';

	let isAddingEvent = false;
	let isEditingEvent = false;
	let selectedEvent: EventData | null = null;
	let imageFile: File | null = null;

	let eventForm: Omit<EventData, 'id'> = {
		title: '',
		description: '',
		date: '',
		time: '',
		venue: '',
		image: ''
	};

	onMount(() => {
		fetchEvents();
	});

	function resetForm() {
		eventForm = {
			title: '',
			description: '',
			date: '',
			time: '',
			venue: '',
			image: ''
		};
		imageFile = null;
	}

	function editEvent(event: EventData) {
		selectedEvent = event;
		eventForm = {
			title: event.title,
			description: event.description,
			date: event.date,
			time: event.time,
			venue: event.venue,
			image: event.image || ''
		};
		isEditingEvent = true;
	}

async function handleSubmit() {
    try {
        // Upload image if a new file is selected
        if (imageFile) {
            const imageUrl = await uploadImage(imageFile);
            if (!imageUrl) {
                throw new Error('Failed to upload image');
            }
            eventForm.image = imageUrl;
        }

        // Validate required fields
        if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.time || !eventForm.venue) {
            throw new Error('Please fill in all required fields');
        }

        // Update or create event based on editing state
        if (isEditingEvent && selectedEvent?.id) {
            await updateEvent(selectedEvent.id, eventForm);
        } else {
            await addEvent(eventForm);
        }

        // Reset form and state after successful submission
        resetForm();
        isAddingEvent = false;
        isEditingEvent = false;
    } catch (error) {
        console.error('Error submitting event:', error);
        alert(error instanceof Error ? error.message : 'An error occurred while submitting the event');
    }
}

	async function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this event?')) {
			try {
				await deleteEvent(id);
			} catch (error) {
				console.error('Error deleting event:', error);
			}
		}
	}

	function handleImageChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files[0]) {
			imageFile = files[0];
		}
	}
</script>

<AdminLayout>
	<div class="max-w-6xl mx-auto">
		<div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
			<h2 class="text-3xl font-bold text-blue-900">Event Management</h2>
			<button
				class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors focus:ring-2 focus:ring-blue-300"
				on:click={() => (isAddingEvent = true)}
			>
				Add New Event
			</button>
		</div>

		{#if isAddingEvent || isEditingEvent}
			<div class="bg-white p-8 rounded-lg shadow-lg mb-8">
				<h3 class="text-2xl font-semibold mb-6 text-blue-900">{isEditingEvent ? 'Edit Event' : 'Add New Event'}</h3>
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<div class="grid gap-6 md:grid-cols-2">
						<div>
							<label for="title" class="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
							<input
								type="text"
								id="title"
								bind:value={eventForm.title}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label for="venue" class="block text-sm font-medium text-gray-700 mb-2">Venue</label>
							<input
								type="text"
								id="venue"
								bind:value={eventForm.venue}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label for="date" class="block text-sm font-medium text-gray-700 mb-2">Date</label>
							<input
								type="date"
								id="date"
								bind:value={eventForm.date}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label for="time" class="block text-sm font-medium text-gray-700 mb-2">Time</label>
							<input
								type="time"
								id="time"
								bind:value={eventForm.time}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>
					</div>

					<!-- svelte-ignore element_invalid_self_closing_tag -->
					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
						<textarea
							id="description"
							bind:value={eventForm.description}
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							rows="4"
							required
						/>
					</div>

					<!-- svelte-ignore a11y_label_has_associated_control -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
						<input
							type="file"
							accept="image/*"
							on:change={handleImageChange}
							class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
					</div>

					<div class="flex justify-end space-x-4">
						<button
							type="button"
							on:click={() => {
								resetForm();
								isAddingEvent = false;
								isEditingEvent = false;
							}}
							class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
						>
							{isEditingEvent ? 'Update Event' : 'Create Event'}
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each $events as event}
				<div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
					{#if event.image}
						<img src={event.image} alt={event.title} class="w-full h-48 object-cover" />
					{/if}
					<div class="p-6">
						<h3 class="text-xl font-semibold mb-3 text-blue-900">{event.title}</h3>
						<p class="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
						<div class="text-sm text-gray-500 space-y-1 mb-4">
							<p class="flex items-center">
								<span class="material-icons-outlined mr-2 text-blue-500">calendar_today</span>
								{event.date}
							</p>
							<p class="flex items-center">
								<span class="material-icons-outlined mr-2 text-blue-500">schedule</span>
								{event.time}
							</p>
							<p class="flex items-center">
								<span class="material-icons-outlined mr-2 text-blue-500">location_on</span>
								{event.venue}
							</p>
						</div>
						<div class="flex justify-end space-x-3">
							<button
								on:click={() => editEvent(event)}
								class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
							>
								Edit
							</button>
							<button
								on:click={() => handleDelete(event.id!)}
								class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</AdminLayout>
