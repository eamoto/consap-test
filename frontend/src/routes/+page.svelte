<script lang="ts">
	import UploaderWide from '../components/uploaders/UploaderWide.svelte';
	import CardWide from '../components/cards/CardWide.svelte';

	let isUploaded: boolean = $state(false);
	let postEndpoint: string = import.meta.env.VITE_API_URL + 'posts/';
	let uploadEndpoint: string = import.meta.env.VITE_API_URL + 'posts/upload/';
	let uploadFiles: string[] = ['.csv'];

	function handleUploadStatus(status: boolean): void {
		isUploaded = status;
	}

	function reset(): void {
		isUploaded = false;
	}
</script>

{#if isUploaded}
	<CardWide endpoint={postEndpoint} data={{
		"head": ["name"],
		"sub-head":  [ "email", "id", "postId" ],
		"body": ["body"]
	}}/>
	<div class="reset grow-on-hover unselectable" onclick="{reset}">
		&#x21bb;
	</div>
{:else}
	<UploaderWide {handleUploadStatus} endpoint={uploadEndpoint} files={uploadFiles} />
{/if}

<style>
	.reset {
		position: fixed;
		right: 30px;
		bottom: 30px;
		background-color: var(--main);
		width: 50px;
		height: 50px;
		cursor: 50%;
		border-radius: 50%;
		cursor: pointer;
		font-family: Lucida Sans Unicode;
		font-size: 35px;
		text-align: center;
		color: #fff;
	}
</style>
