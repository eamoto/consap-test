<script lang="ts">
	let {
		label
	}: {
		label?: string | null;
	} = $props();
</script>

<div class="loader-container vertical-center unselectable">
	<div>
		<div class="loader-animation"></div>
		<div class="loader-label">{label}</div>
	</div>
</div>
