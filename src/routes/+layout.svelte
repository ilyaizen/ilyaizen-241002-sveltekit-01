<script>
	import '../app.css';
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import { onMount } from 'svelte';
	import { loading } from '$lib/stores/loading';
	import { writable } from 'svelte/store';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button';
	import { Moon, Sun, RotateCcw } from 'lucide-svelte';
	import '@fontsource-variable/grandstander';
	import { goto } from '$app/navigation';

	// Add dark mode store
	const darkMode = writable(false);

	// Add a store for the current language
	const lang = writable('en-us');

	$: isRTL = $lang === 'he';

	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			if ($page.data) {
				loading.set(false);
				// Update the lang store based on the current page's lang parameter
				lang.set($page.params.lang || 'en-us');
			}
		});

		// Initialize dark mode from localStorage
		const savedDarkMode = localStorage.getItem('darkMode');
		if (savedDarkMode) {
			darkMode.set(JSON.parse(savedDarkMode));
		}

		// Update body class and animate when dark mode changes
		const unsubscribeDarkMode = darkMode.subscribe(($darkMode) => {
			if ($darkMode) {
				document.body.classList.add('dark');
				animateThemeChange('#1a1a1a', '#ffffff');
			} else {
				document.body.classList.remove('dark');
				animateThemeChange('#ffffff', '#000000');
			}
			localStorage.setItem('darkMode', JSON.stringify($darkMode));
		});

		return () => {
			unsubscribe();
			unsubscribeDarkMode();
		};
	});

	function toggleDarkMode() {
		darkMode.update((value) => !value);
	}

	/**
	 * @param {string} bgColor
	 * @param {string} textColor
	 */
	function animateThemeChange(bgColor, textColor) {
		gsap.to(document.body, {
			backgroundColor: bgColor,
			color: textColor,
			duration: 0.5,
			ease: 'power4.out'
		});
	}

	function toggleLanguage() {
		const newLang = $lang === 'en-us' ? 'he' : 'en-us';
		const newPath = newLang === 'en-us' ? '/' : '/he/';
		goto(newPath + $page.url.pathname.split('/').slice(2).join('/'));
	}
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	{#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
	{/if}
	{#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<div dir={isRTL ? 'rtl' : 'ltr'}>
	{#if $loading}
		<div class="loading-screen">
			<div class="spinner"></div>
			<p>Loading...</p>
		</div>
	{:else}
		<div class="fixed top-4 right-4 flex gap-2 z-50">
			<Button variant="ghost" size="icon" on:click={toggleLanguage}>
				{$lang === 'en-us' ? 'עב' : 'En'}
				<span class="sr-only">Toggle language</span>
			</Button>
			<Button variant="ghost" size="icon" on:click={() => window.location.reload()}>
				<RotateCcw class="h-[1.2rem] w-[1.2rem]" />
				<span class="sr-only">Refresh page</span>
			</Button>
			<Button variant="ghost" size="icon" on:click={toggleDarkMode}>
				{#if $darkMode}
					<Sun class="h-[1.2rem] w-[1.2rem]" />
					<span class="sr-only">Light mode</span>
				{:else}
					<Moon class="h-[1.2rem] w-[1.2rem]" />
					<span class="sr-only">Dark mode</span>
				{/if}
			</Button>
		</div>
		<main style="font-family: 'Grandstander Variable', system-ui;">
			<slot />
		</main>
		<PrismicPreview {repositoryName} />
	{/if}
</div>

<style>
	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #f0f0f0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.spinner {
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	:global(body) {
		transition:
			background-color 0.5s,
			color 0.5s;
	}

	:global(body.dark) {
		background-color: #1a1a1a;
		color: #ffffff;
	}
</style>
