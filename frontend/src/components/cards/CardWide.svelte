<script lang="ts">
	import axios, { type AxiosProgressEvent } from 'axios';

	let {
		endpoint,
		data,
	}: {
		endpoint: string;
		data: {"head": string[], "sub-head": string[], "body": string[] }
	} = $props();

	$effect(() => {
		getPosts();
	});

	let list: Record<string, string>[] = $state([]);
	let page: number = $state(1);
	let search: string | null = $state(null);
	let totalPage: number = $state(0);
	let errorMsg: string | null = $state(null);

	const getPosts = async (): Promise<void> => {
		try {
			const response = await axios.get(endpoint, { params: { page, search } });

			list = response.data.data;
			totalPage = response.data.total_page;
		} catch (error) {
			errorMsg = error.response.data.error;
		}
	};

	const onSearchChange =  (): void => {
		page = 1;
	};
</script>

<div class="content-container">
	<div class="content-head-container">
		<input type="text" placeholder="Search..." bind:value={search} oninput={onSearchChange}>
	</div>
	<div class="content-body-container">
		{#if list.length}
			<p class="error">
				{errorMsg}
			</p>
		{/if}

		{#if list.length}
			{#each list as item (item.id)}
				<div class="content-card">
					<h3>
						{ data.head.map( h => item[h] ).join(" ") }
					</h3>
					<div class="details">
						{ data["sub-head"].map( h => h.toUpperCase() + ": " + item[h] ).join(" • ") }
					</div>
					<p>
						{@html data.body.map( h => item[h] ).join(" ") }
					</p>		
				</div>
			{/each}
		{:else}
			<div class="no-post vertical-center unselectable">
				<span>No Post to show.</span>
			</div>
		{/if}
	</div>
	{#if list.length}
		<div class="content-foot-container">
			Page
			<select bind:value={page}>
				{#each [...Array(totalPage).keys()] as page (page)}
					<option value="{ page + 1 }"> { page + 1 } </option>
				{/each}
			</select>

			of {totalPage} 
		</div>
	{/if}
</div>

<style>
	.content-container {
		margin-top: 50px;
		width: 90%;
		margin-left: auto;
		margin-right: auto;
		max-width: 900px;
	}

	.content-head-container {
		overflow: hidden;
	}

	.content-head-container input {
		width: 100%;
		padding: 20px;
		border: 0px;
		font-size: 14px;
	}

	.content-body-container {
		padding-top: 20px;
	}

	.content-foot-container {
		border-top: 1px solid var(--mid-gray);
		padding-top: 10px;
		padding-bottom: 30px;
	}

	.content-foot-container > select {
		border: 0px;
		font-size: 14px;
		background-color: #fff;
	}

	.content-card {
		background-color: #fff;
		margin-bottom: 20px;
		padding: 30px 25px 30px 25px;
		border-radius: 5px;
		-webkit-box-shadow: 0px 0px 25px -9px rgba(0,0,0,0.19);
		-moz-box-shadow: 0px 0px 25px -9px rgba(0,0,0,0.19);
		box-shadow: 0px 0px 25px -9px rgba(0,0,0,0.19);
	}

	.content-card > h3 {
		margin-top: 0px;
		margin-bottom: 5px;
		font-size: 20px;
		text-transform:uppercase;
	}

	.content-card > .details {
		margin-bottom: 18px;
		font-size: 14px;
		color: var(--dark-gray);
	}

	.content-card  > p {
		margin: 0px;
		font-size: 16px;
		line-height: 1.4;
	}

	.no-post {
		height: 300px;
		color: var(--dark-gray);
	}

	.error {
		color: var(--danger);
		text-align: center;
	}
</style>