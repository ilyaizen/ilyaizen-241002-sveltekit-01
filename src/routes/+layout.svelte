<script>
	import '../app.css';
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import { onMount, afterUpdate } from 'svelte';
	import { loading } from '$lib/stores/loading';
	import { writable } from 'svelte/store';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button';
	import { Moon, Sun, RotateCcw } from 'lucide-svelte';
	import '@fontsource-variable/grandstander';
	import { goto } from '$app/navigation';
	import '$lib/styles/hebrew-font.css';

	// Add dark mode store
	const darkMode = writable(false);

	// Add a store for the current language
	const lang = writable('en-us');

	$: isRTL = $lang === 'he';

	let resourcesLoaded = false;
	/**
	 * @type {gsap.TweenTarget}
	 */
	let loadingElement;

	function waitForResources() {
		return new Promise((resolve) => {
			if (document.readyState === 'complete') {
				// @ts-ignore
				resolve();
			} else {
				window.addEventListener('load', resolve);
			}
		});
	}

	function waitForFonts() {
		return document.fonts.ready;
	}

	function waitForImages() {
		const images = Array.from(document.images);
		const imagePromises = images.map((img) => {
			if (img.complete) {
				return Promise.resolve();
			} else {
				return new Promise((resolve) => {
					img.onload = img.onerror = resolve;
				});
			}
		});
		return Promise.all(imagePromises);
	}

	// @ts-ignore
	onMount(async () => {
		const unsubscribe = page.subscribe(($page) => {
			if ($page.data) {
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

		// Wait for all resources to load
		await Promise.all([waitForResources(), waitForFonts(), waitForImages()]);

		// Add a small delay to ensure smooth transition
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Animate out the loading screen
		await gsap.to(loadingElement, {
			opacity: 0,
			duration: 0.5,
			ease: 'expo.out'
		});

		resourcesLoaded = true;
		loading.set(false);

		return () => {
			unsubscribe();
			unsubscribeDarkMode();
		};
	});

	// Remove the afterUpdate function

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
			duration: 0.3,
			ease: 'expo.out'
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

<div dir={isRTL ? 'rtl' : 'ltr'} class="px-4 md:px-6 mx-auto space-y-8 w-full max-w-2xl">
	{#if $loading}
		<div class="loading-screen" bind:this={loadingElement}>
			<div class="color-wheel"></div>
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
		<main style="font-family: {isRTL ? 'YardenAlefAlefAlef' : 'Grandstander Variable'}, system-ui;">
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
		background-color: rgba(240, 240, 240, 0.8);
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		z-index: 9999;
		opacity: 1; /* Add this line */
	}

	.color-wheel {
		width: 300px;
		height: 300px;
		border-radius: 100%;
		background: conic-gradient(in hsl longer hue, red 0 0);
		animation: spin 0.3s linear infinite;
		transform: translate(50%, -50%) scale(15);
	}

	@keyframes spin {
		0% {
			transform: translate(50%, -50%) scale(15) rotate(0deg);
		}
		100% {
			transform: translate(50%, -50%) scale(15) rotate(360deg);
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
