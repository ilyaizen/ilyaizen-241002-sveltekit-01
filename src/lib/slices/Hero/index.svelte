<script lang="ts">
	import { onMount } from 'svelte';
	import type { Content } from '@prismicio/client';
	import gsap from 'gsap';
	import { PrismicImage } from '@prismicio/svelte';

	export let slice: Content.HeroSlice;

	onMount(() => {
		const tl = gsap.timeline();

		tl.fromTo(
			'.welcome-animation-1',
			{
				opacity: 0
			},
			{
				delay: 0.5,
				opacity: 1,
				duration: 0.001, // Nearly instantaneous opacity change
				stagger: 0.2 // Delay between each word
			}
		)
			.fromTo(
				'.wave-animation',
				{
					x: -10,
					opacity: 0
				},
				{
					x: 0,
					opacity: 1,
					ease: 'expo.out',
					duration: 0.8
				}
			)
			.fromTo(
				'.welcome-animation-2',
				{
					opacity: 0
				},
				{
					opacity: 1,
					duration: 0.001 // Nearly instantaneous opacity change
				},
				'-=0.3'
			)
			.fromTo(
				'.welcome-animation-3',
				{
					x: -10,
					opacity: 0
				},
				{
					x: 0,
					ease: 'expo.out',
					opacity: 1,
					stagger: 0.2 // Delay between each word
				}
			)
			.fromTo(
				'.profile-image-animation',
				{
					x: -20,
					opacity: 0
				},
				{
					x: 0,
					opacity: 1,
					ease: 'expo.out',
					duration: 1.2
				},
				0 // Start at the same time as the welcome animation
			)
			.fromTo(
				'.tagline-animation',
				{
					x: -10,
					opacity: 0
				},
				{
					x: 0,
					opacity: 1,
					ease: 'expo.out',
					duration: 0.8,
					stagger: 0.025
				},
				'-=0.6'
			)
			.fromTo(
				'.about-heading',
				{
					x: -5,
					opacity: 0
				},
				{
					x: 0,
					opacity: 1,
					duration: 0.8,
					delay: 0.5,
					ease: 'power4.out'
				},
				'-=1'
			)
			.fromTo(
				'.about-text-animation',
				{
					x: -5,
					opacity: 0
				},
				{
					x: 0,
					opacity: 1,
					duration: 0.4,
					stagger: 0.01,
					ease: 'power4.out'
				},
				'-=0.4'
			);

		// Add jiggle and click animations for wave emoji
		const waveEmoji = document.querySelector('.wave-animation');
		if (waveEmoji) {
			// Jiggle animation on hover
			waveEmoji.addEventListener('mouseenter', () => {
				gsap.to(waveEmoji, {
					rotation: 20,
					scale: 1.2,
					duration: 0.3,
					ease: 'elastic.out(1, 0.3)',
					onComplete: () => {
						gsap.to(waveEmoji, {
							rotation: -15,
							yoyo: true,
							repeat: 5,
							duration: 0.1,
							ease: 'power1.inOut'
						});
					}
				});
			});

			waveEmoji.addEventListener('mouseleave', () => {
				gsap.to(waveEmoji, {
					rotation: 0,
					scale: 1,
					duration: 0.5,
					ease: 'elastic.out(1, 0.3)'
				});
			});

			// Special animation on click
			waveEmoji.addEventListener('click', () => {
				gsap.to(waveEmoji, {
					rotation: 360,
					scale: 1.5,
					y: -20,
					duration: 0.5,
					ease: 'back.out(1.7)',
					onComplete: () => {
						gsap.to(waveEmoji, {
							rotation: 0,
							scale: 1,
							y: 0,
							duration: 0.5,
							ease: 'bounce.out'
						});
					}
				});
			});
		}
	});
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="px-4 md:px-6 mx-auto space-y-8 w-full max-w-2xl"
	id="hero"
>
	<div class="pt-40 flex gap-2 justify-between">
		<div class="flex flex-col flex-1 space-y-1.5">
			<div class="flex flex-wrap">
				{#each ['Hey', 'there,'] as word}
					<span
						class="welcome-animation-1 inline-block text-3xl sm:text-5xl font-bold tracking-tighter mr-2"
						>{word}</span
					>
				{/each}
				<span
					class="wave-animation inline-block text-3xl sm:text-5xl font-bold tracking-tighter cursor-pointer"
					>👋</span
				>
			</div>
			<div class="flex flex-wrap">
				<span
					class="welcome-animation-2 inline text-3xl sm:text-5xl font-bold tracking-tighter mr-2"
					>I'm</span
				>
				{#each [slice.primary.first_name, slice.primary.last_name] as word}
					<span
						class="welcome-animation-3 inline text-3xl sm:text-5xl font-bold tracking-tighter mr-2"
						>{word}</span
					>
				{/each}
			</div>

			<div class="flex flex-wrap">
				{#if slice.primary.tag_line}
					{#each slice.primary.tag_line.split(' ') as word}
						<span class="tagline-animation inline-block text-xs sm:text-xl">{word}&nbsp;</span>
					{/each}
				{/if}
			</div>
		</div>
		<span
			class="profile-image-animation flex overflow-hidden relative shrink-0 size-28 rounded-full shadow-xl"
		>
			<div role="figure" class="aspect-square w-full h-full">
				<PrismicImage field={slice.primary.profile_picture} />
			</div>
		</span>
	</div>
	<section id="about">
		<h2 class="text-xl font-bold about-heading pt-8">About</h2>
		<div class="max-w-full text-sm text-muted-foreground">
			{#if slice.primary.about_line}
				{#each slice.primary.about_line.split(' ') as word}
					<span class="about-text-animation inline-block">{word}&nbsp;</span>
				{/each}
			{/if}
		</div>
	</section>
</section>
