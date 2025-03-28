<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import { onMount } from 'svelte';
	import { homePageContent, fetchHomePageContent, updateHomePageContent, type HomePageContent } from '$lib/stores/homepage';
	import { uploadImage } from '$lib/cloudinary';

	let isEditing = false;
	let heroImageFile: File | null = null;
	let missionImageFile: File | null = null;
	let visionImageFile: File | null = null;
    let aboutUsImageFile: File | null = null;

	let contentForm: HomePageContent = {
		mission: '',
		vision: '',
		aboutUs: '',
		heroImage: '',
		missionImage: '',
		visionImage: ''
	};

	onMount(() => {
		fetchHomePageContent();
	});

	$: {
		if ($homePageContent) {
			contentForm = { ...$homePageContent };
		}
	}

	async function handleSubmit() {
		try {
			if (heroImageFile) {
				contentForm.heroImage = await uploadImage(heroImageFile);
			}
			if (missionImageFile) {
				contentForm.missionImage = await uploadImage(missionImageFile);
			}
			if (visionImageFile) {
				contentForm.visionImage = await uploadImage(visionImageFile);
			}
            if (aboutUsImageFile) {
                contentForm.aboutUsImage = await uploadImage(aboutUsImageFile);
            }

			await updateHomePageContent(contentForm);
			isEditing = false;
			heroImageFile = null;
			missionImageFile = null;
			visionImageFile = null;
		} catch (error) {
			console.error('Error updating homepage content:', error);
		}
	}

	function handleImageChange(event: Event, type: 'hero' | 'mission' | 'vision' | 'aboutUs') {
		const files = (event.target as HTMLInputElement).files;
		if (files && files[0]) {
			switch (type) {
				case 'hero':
					heroImageFile = files[0];
					break;
				case 'mission':
					missionImageFile = files[0];
					break;
				case 'vision':
					visionImageFile = files[0];
					break;
                case 'aboutUs':
                    aboutUsImageFile = files[0];
                    break;
			}
		}
	}
</script>

<!-- Add this to the form -->
<div>
    <label for="aboutUsImage" class="block text-sm font-medium text-gray-700">About Us Background Image</label>
    <input
        type="file"
        id="aboutUsImage"
        accept="image/*"
        on:change={(e) => handleImageChange(e, 'aboutUs')}
        class="mt-1 block w-full"
    />
    {#if contentForm.aboutUsImage}
        <img
            src={contentForm.aboutUsImage}
            alt="About Us Background"
            class="mt-2 w-full max-h-48 object-cover rounded"
        />
    {/if}
</div>

<AdminLayout>
	<div class="max-w-4xl mx-auto">
		<div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
			<h2 class="text-3xl font-bold text-blue-900">Homepage Content Management</h2>
			{#if !isEditing}
				<button
					class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors focus:ring-2 focus:ring-blue-300"
					on:click={() => (isEditing = true)}
				>
					Edit Content
				</button>
			{/if}
		</div>

		{#if isEditing}
			<div class="bg-white p-8 rounded-lg shadow-lg mb-8">
				<h3 class="text-2xl font-semibold mb-6 text-blue-900">Edit Homepage Content</h3>
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<div>
						<label for="mission" class="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
						<textarea
							id="mission"
							bind:value={contentForm.mission}
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							rows="4"
							required
						></textarea>
					</div>

					<div>
						<label for="vision" class="block text-sm font-medium text-gray-700 mb-2">Vision Statement</label>
						<textarea
							id="vision"
							bind:value={contentForm.vision}
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							rows="4"
							required
						></textarea>
					</div>

					<div>
						<label for="aboutUs" class="block text-sm font-medium text-gray-700 mb-2">About Us</label>
						<textarea
							id="aboutUs"
							bind:value={contentForm.aboutUs}
							class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							rows="6"
							required
						></textarea>
					</div>
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<!-- svelte-ignore a11y_img_redundant_alt -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
						<input
							type="file"
							accept="image/*"
							on:change={(e) => handleImageChange(e, 'hero')}
							class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
						{#if contentForm.heroImage}
							<div class="mt-4">
								<p class="text-sm text-gray-500 mb-2">Current Image:</p>
								<img
									src={contentForm.heroImage}
									alt="Hero Image"
									class="mt-2 w-full max-h-48 object-cover rounded-lg"
								/>
							</div>
						{/if}
					</div>

					<div>
						<label for="aboutUsImage" class="block text-sm font-medium text-gray-700">About Us Background Image</label>
						<input
							type="file"
							id="aboutUsImage"
							accept="image/*"
							on:change={(e) => handleImageChange(e, 'aboutUs')}
							class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
						{#if contentForm.aboutUsImage}
							<img
								src={contentForm.aboutUsImage}
								alt="About Us Background"
								class="mt-2 w-full max-h-48 object-cover rounded"
							/>
						{/if}
					</div>

					<div>
						<label for="missionImage" class="block text-sm font-medium text-gray-700">Mission Background Image</label>
						<input
							type="file"
							id="missionImage"
							accept="image/*"
							on:change={(e) => handleImageChange(e, 'mission')}
							class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
						{#if contentForm.missionImage}
							<img
								src={contentForm.missionImage}
								alt="Mission Background"
								class="mt-2 w-full max-h-48 object-cover rounded"
							/>
						{/if}
					</div>

					<div>
						<label for="visionImage" class="block text-sm font-medium text-gray-700">Vision Background Image</label>
						<input
							type="file"
							id="visionImage"
							accept="image/*"
							on:change={(e) => handleImageChange(e, 'vision')}
							class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
						{#if contentForm.visionImage}
							<img
								src={contentForm.visionImage}
								alt="Vision Background"
								class="mt-2 w-full max-h-48 object-cover rounded"
							/>
						{/if}
					</div>

					<div class="flex justify-end space-x-4">
						<button
							type="button"
							on:click={() => {
								contentForm = { ...$homePageContent };
								isEditing = false;
								heroImageFile = null;
							}}
							class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		{:else}
			<div class="space-y-8">
				<div class="bg-white p-8 rounded-lg shadow-lg">
					<h3 class="text-xl font-semibold mb-4 text-blue-900">Mission Statement</h3>
					<p class="text-gray-700 whitespace-pre-line">{$homePageContent?.mission || 'No mission statement set.'}</p>
				</div>

				<div class="bg-white p-8 rounded-lg shadow-lg">
					<h3 class="text-xl font-semibold mb-4 text-blue-900">Vision Statement</h3>
					<p class="text-gray-700 whitespace-pre-line">{$homePageContent?.vision || 'No vision statement set.'}</p>
				</div>

				<div class="bg-white p-8 rounded-lg shadow-lg">
					<h3 class="text-xl font-semibold mb-4 text-blue-900">About Us</h3>
					<p class="text-gray-700 whitespace-pre-line">{$homePageContent?.aboutUs || 'No about us content set.'}</p>
				</div>

				<!-- svelte-ignore a11y_img_redundant_alt -->
				{#if $homePageContent?.heroImage}
					<div class="bg-white p-8 rounded-lg shadow-lg">
						<h3 class="text-xl font-semibold mb-4 text-blue-900">Hero Image</h3>
						<img
							src={$homePageContent.heroImage}
							alt="Hero Image"
							class="w-full max-h-64 object-cover rounded-lg"
						/>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</AdminLayout>