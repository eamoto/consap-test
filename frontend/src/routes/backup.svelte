<script lang="ts">
	import axios, { type AxiosProgressEvent } from 'axios';
    import Header from '../components/Header.svelte';

	let file: File | null = null;
	let uploadProgress = 0;
	let rows: Record<string, string>[] = [];

	const uploadFile = async (): Promise<void> => {
		if (!file) {
			alert('Please select a file');
			return;
		}

		const formData = new FormData();
		formData.append('csvfile', file);

		try {
			const response = await axios.post('http://localhost:3001/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: (progressEvent: AxiosProgressEvent) => {
					const loaded = progressEvent.loaded || 0;
					const total = progressEvent.total || 1;
					const percentage = Math.round((loaded * 100) / total);
					uploadProgress = percentage;
				}
			});

			rows = response.data.rows;
		} catch (error) {
			console.error('Upload failed:', error);
		}
	};

	const assignFile = (e: Event) => {
		let files: FileList | null = (e.target as HTMLInputElement).files;

		if (files && files.length) {
			file = files[0];
		}
	};
</script>

<Header name={"EDDIE"}/>
<h1>Upload CSV</h1>

<input type="file" accept=".csv" on:change={assignFile} />
<button on:click={uploadFile}>Upload</button>

<div class="progress-bar">
	<div class="progress-bar-inner" style="width: {uploadProgress}%"></div>
</div>
<p>{uploadProgress}%</p>

<h2>CSV Data</h2>
<ul>
	{#each rows as row}
		<li>{JSON.stringify(row)}</li>
	{/each}
</ul>

<style>
	.progress-bar {
		width: 100%;
		background: #f3f3f3;
		border: 1px solid #ccc;
		border-radius: 4px;
		overflow: hidden;
	}
	.progress-bar-inner {
		height: 20px;
		background: #76c7c0;
		width: 0;
		transition: width 0.2s;
	}
</style>
