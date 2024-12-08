<script lang="ts">
	import axios, { type AxiosProgressEvent } from 'axios';
	import LoaderWide from './../loaders/LoaderWide.svelte';

	let {
		handleUploadStatus,
		endpoint,
		files
	}: {
		handleUploadStatus: (status: boolean) => void
		endpoint: string,
		files: string[],
	} = $props();

	let inputFile: HTMLInputElement;
	let uploadProgress: string | null = $state(null);
	let uploading: boolean = $state(false);
	let errorMsg: string | null = $state(null);

	const selectFile = () => {
		inputFile.click();
	};

	const assignFile = (e: Event) => {
		let files: FileList | null = (e.target as HTMLInputElement).files;
		if (files && files.length) {
			uploadFile(files[0])
		}		
	};

	const uploadFile = async (file: File | null): Promise<void> => {
		if (!file) {
			errorMsg = "Please select a file to upload".
			return;
		}

		uploading = true;
		const formData: FormData = new FormData();
		formData.append('csvfile', file);

		try {
			const response = await axios.post(endpoint, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: (progressEvent: AxiosProgressEvent) => {
					const loaded: number = progressEvent.loaded || 0;
					const total: number | null = progressEvent.total || null;
					if(total) {
						uploadProgress = Math.round((loaded * 100) / total) + "%";
					}
				}
			});

			handleUploadStatus(true);
		} catch (error) {
			uploading = false;
			errorMsg = error.response.data.error;
		}
	};
</script>

<input type="file" bind:this={inputFile} accept="{files.join(",")}" onchange={assignFile} />

{#if uploading}
	<div class="uploader-loader vertical-center">
		<LoaderWide label={uploadProgress}/>
	</div>
{:else}
	<div class="uploader-container vertical-center unselectable">
		<div class="vertical-center" onclick="{selectFile}">
			<div class="uploader-inner-container">
				Click to upload CSV File
				<p class="error-message"> { errorMsg } </p>
			</div>
		</div>
	</div>
{/if}

<style>
.uploader-container {
	width: 100%;
	height: 100%;
	cursor: pointer;
	overflow: hidden;
}

.uploader-container > div {
	border: 3px dashed var(--mid-gray);
	color: var( --dark-gray);
	border-radius: 50px;
	width: 70%;
	height: 70%;
}

.uploader-inner-container {
	width: 100%;
	text-align: center;
}

.uploader-inner-container .error-message {
	text-align: center;
	color: var( --danger);
}

.uploader-loader {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

input {
	display: none;
}
</style>