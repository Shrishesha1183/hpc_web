<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import { onMount } from 'svelte';
	// import { staffMembers, fetchStaffMembers, addStaffMember, updateStaffMember, deleteStaffMember, type StaffMember } from '$lib/stores/staff';
    import { staffMembers, fetchStaffMembers, addStaffMember, updateStaffMember, deleteStaffMember, type StaffMember, STAFF_PRIORITIES } from '$lib/stores/staff';
	import { uploadImage } from '$lib/cloudinary';

	let isAddingStaff = false;
	let isEditingStaff = false;
	let selectedStaff: StaffMember | null = null;
	let photoFile: File | null = null;

	let staffForm = {
		name: '',
		role: '',
		photoUrl: '',
		email: '',
		phone: '',
        priority: 0,
		department: '',
		qualifications: [''],
		specialization: '',
		bio: '',
		achievements: [{ title: '', description: '', date: '' }]
	};

	onMount(() => {
		fetchStaffMembers();
	});

	function resetForm() {
		staffForm = {
			name: '',
			role: '',
			photoUrl: '',
			email: '',
			phone: '',
            priority: 0,
			department: '',
			qualifications: [''],
			specialization: '',
			bio: '',
			achievements: [{ title: '', description: '', date: '' }]
		};
		photoFile = null;
	}

	function editStaff(staff: StaffMember) {
		selectedStaff = staff;
		staffForm = {
			name: staff.name,
			role: staff.role,
			photoUrl: staff.photoUrl,
			email: staff.email,
			phone: staff.phone || '',
            priority: staff.priority,
			department: staff.department,
			qualifications: [...staff.qualifications],
			specialization: staff.specialization || '',
			bio: staff.bio || '',
			achievements: staff.achievements ? [...staff.achievements] : [{ title: '', description: '', date: '' }]
		};
		isEditingStaff = true;
	}

	function addQualification() {
		staffForm.qualifications = [...staffForm.qualifications, ''];
	}

	function removeQualification(index: number) {
		staffForm.qualifications = staffForm.qualifications.filter((_, i) => i !== index);
	}

	function addAchievement() {
		staffForm.achievements = [...staffForm.achievements, { title: '', description: '', date: '' }];
	}

	function removeAchievement(index: number) {
		staffForm.achievements = staffForm.achievements.filter((_, i) => i !== index);
	}

	async function handleSubmit() {
		try {
            // Set priority based on role
            const priority = STAFF_PRIORITIES[staffForm.role as keyof typeof STAFF_PRIORITIES] || 999;
            staffForm.priority = priority;
            
			if (photoFile) {
				const photoUrl = await uploadImage(photoFile);
				if (!photoUrl) {
					throw new Error('Failed to upload photo');
				}
				staffForm.photoUrl = photoUrl;
			}

			if (!staffForm.name || !staffForm.role || !staffForm.email || !staffForm.department) {
				throw new Error('Please fill in all required fields');
			}

			if (isEditingStaff && selectedStaff?.id) {
				await updateStaffMember(selectedStaff.id, staffForm);
			} else {
				await addStaffMember(staffForm);
			}

			resetForm();
			isAddingStaff = false;
			isEditingStaff = false;
		} catch (error) {
			console.error('Error submitting staff:', error);
			alert(error instanceof Error ? error.message : 'An error occurred while submitting the staff');
		}
	}

	async function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this staff member?')) {
			try {
				await deleteStaffMember(id);
			} catch (error) {
				console.error('Error deleting staff:', error);
			}
		}
	}

	function handlePhotoChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files[0]) {
			photoFile = files[0];
		}
	}
</script>

<AdminLayout>
	<div class="max-w-6xl mx-auto">
		<div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
			<h2 class="text-3xl font-bold text-blue-900">Staff Management</h2>
			<button
				class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors focus:ring-2 focus:ring-blue-300"
				on:click={() => (isAddingStaff = true)}
			>
				Add New Staff
			</button>
		</div>

		{#if isAddingStaff || isEditingStaff}
			<div class="bg-white p-8 rounded-lg shadow-lg mb-8">
				<h3 class="text-2xl font-semibold mb-6 text-blue-900">{isEditingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<div class="grid gap-6 md:grid-cols-2">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
							<input
								type="text"
								id="name"
								bind:value={staffForm.name}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>

                        <div>
                            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                id="role"
                                bind:value={staffForm.role}
                                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="HOD">HOD</option>
                                <option value="Professor">Professor</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Assistant Professor">Assistant Professor</option>
                                <option value="Guest Faculty">Guest Faculty</option>
                            </select>
                        </div>

						<div>
							<label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
							<input
								type="email"
								id="email"
								bind:value={staffForm.email}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
							<input
								type="tel"
								id="phone"
								bind:value={staffForm.phone}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="department" class="block text-sm font-medium text-gray-700 mb-2">Department</label>
							<input
								type="text"
								id="department"
								bind:value={staffForm.department}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label for="specialization" class="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
							<input
								type="text"
								id="specialization"
								bind:value={staffForm.specialization}
								class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label for="bio" class="block text-sm font-medium text-gray-700 mb-2">Biography</label>
						<textarea
							id="bio"
							bind:value={staffForm.bio}
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							rows="4"
						></textarea>
					</div>

                    <!-- svelte-ignore a11y_label_has_associated_control -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
						<input
							type="file"
							accept="image/*"
							on:change={handlePhotoChange}
							class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
					</div>
                    <!-- svelte-ignore a11y_label_has_associated_control -->
					<div>
						<div class="flex justify-between items-center mb-2">
							<label class="block text-sm font-medium text-gray-700">Qualifications</label>
							<button
								type="button"
								on:click={addQualification}
								class="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full"
							>
								+ Add
							</button>
						</div>
						{#each staffForm.qualifications as qualification, index}
							<div class="flex items-center mb-2">
								<input
									type="text"
									bind:value={staffForm.qualifications[index]}
									class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="e.g., Ph.D. in Computer Science"
								/>
								{#if index > 0 || staffForm.qualifications.length > 1}
									<button
										type="button"
										on:click={() => removeQualification(index)}
										class="ml-2 text-red-500 hover:text-red-700"
									>
										✕
									</button>
								{/if}
							</div>
						{/each}
					</div>

                    <!-- svelte-ignore a11y_label_has_associated_control -->
					<div>
						<div class="flex justify-between items-center mb-2">
							<label class="block text-sm font-medium text-gray-700">Achievements</label>
							<button
								type="button"
								on:click={addAchievement}
								class="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full"
							>
								+ Add
							</button>
						</div>
						{#each staffForm.achievements as achievement, index}
							<div class="p-4 bg-gray-50 rounded-lg mb-3">
								<div class="flex justify-between items-center mb-2">
									<h4 class="text-sm font-medium text-gray-700">Achievement #{index + 1}</h4>
									{#if index > 0 || staffForm.achievements.length > 1}
										<button
											type="button"
											on:click={() => removeAchievement(index)}
											class="text-red-500 hover:text-red-700"
										>
											✕
										</button>
									{/if}
								</div>
								<div class="grid gap-3">
									<input
										type="text"
										bind:value={staffForm.achievements[index].title}
										class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="Achievement Title"
									/>
									<input
										type="text"
										bind:value={staffForm.achievements[index].description}
										class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="Description"
									/>
									<input
										type="date"
										bind:value={staffForm.achievements[index].date}
										class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
							</div>
						{/each}
					</div>

					<div class="flex justify-end space-x-4">
						<button
							type="button"
							on:click={() => {
								resetForm();
								isAddingStaff = false;
								isEditingStaff = false;
							}}
							class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
						>
							{isEditingStaff ? 'Update Staff' : 'Add Staff'}
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each $staffMembers as staff}
				<div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
					<div class="p-6">
						<div class="flex items-center space-x-4 mb-4">
							<div class="w-16 h-16 flex-shrink-0">
								<img 
									src={staff.photoUrl} 
									alt={staff.name} 
									class="w-full h-full rounded-full object-cover"
								/>
							</div>
							<div>
								<h3 class="text-xl font-semibold text-blue-900">{staff.name}</h3>
								<p class="text-gray-600">{staff.role}</p>
							</div>
						</div>
						<div class="text-sm text-gray-500 space-y-1 mb-4">
							<p class="flex items-center">
								<span class="material-icons-outlined mr-2 text-blue-500">email</span>
								{staff.email}
							</p>
							{#if staff.phone}
								<p class="flex items-center">
									<span class="material-icons-outlined mr-2 text-blue-500">phone</span>
									{staff.phone}
								</p>
							{/if}
							<p class="flex items-center">
								<span class="material-icons-outlined mr-2 text-blue-500">business</span>
								{staff.department}
							</p>
						</div>
						<div class="flex justify-end space-x-3">
							<button
								on:click={() => editStaff(staff)}
								class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
							>
								Edit
							</button>
							<button
								on:click={() => handleDelete(staff.id!)}
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