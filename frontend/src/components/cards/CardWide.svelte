<script lang="ts">
	import axios, { type AxiosProgressEvent, type AxiosResponse } from 'axios';

	let {
		endpoint,
		data
	}: {
		endpoint: string;
		data: { head: string[]; 'sub-head': string[]; body: string[] };
	} = $props();

	$effect(() => {
		getPosts();
	});

	let list: Record<string, string>[] = $state([]);
	let page: number = $state(1);
	let search: string | null = $state(null);
	let totalPage: number = $state(0);
	let errorMsg: string | null = $state(null);

	const getPosts: () => Promise<void> = async (): Promise<void> => {
		try {
			const response: AxiosResponse<any, any> = await axios.get(endpoint, { params: { page, search } });
			list = response.data.data;
			totalPage = response.data.total_page;
		} catch (error: any) {
			errorMsg = error.response.data.error;
		}
	};

	const onSearchChange: () => void = (): void => {
		page = 1;
	};
</script>

<div class="content-container">
	<div class="content-head-container">
		<input type="text" placeholder="Search..." bind:value={search} oninput={onSearchChange} />
	</div>
	<div class="content-body-container">
		{#if errorMsg}
			<p class="content-error">
				{errorMsg}
			</p>
		{/if}

		{#if list.length}
			{#each list as item (item.id)}
				<div class="content-card">
					<h3>
						{data.head.map((h) => item[h]).join(' ')}
					</h3>
					<div class="details">
						{data['sub-head'].map((h) => h.toUpperCase() + ': ' + item[h]).join(' • ')}
					</div>
					<p>
						{@html data.body.map((h) => item[h]).join(' ')}
					</p>
				</div>
			{/each}
		{:else}
			<div class="content-no-post vertical-center unselectable">
				<span>No Post to show.</span>
			</div>
		{/if}
	</div>
	{#if list.length}
		<div class="content-foot-container">
			Page
			<select bind:value={page}>
				{#each [...Array(totalPage).keys()] as page (page)}
					<option value={page + 1}> {page + 1} </option>
				{/each}
			</select>

			of {totalPage}
		</div>
	{/if}
</div>
