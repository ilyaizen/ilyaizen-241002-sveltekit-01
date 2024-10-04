<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let slice: Content.EducationSlice;

	let tl: gsap.core.Timeline;

	onMount(() => {
		tl = gsap.timeline({ paused: true });

		tl.fromTo(
			'.education-heading-animation',
			{
				x: -5,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				duration: 0.8,
				ease: 'expo.out'
			}
		).fromTo(
			'.education-item-animation',
			{
				y: 20,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.6,
				stagger: 0.2,
				ease: 'expo.out'
			},
			'-=0.4'
		);

		// Listen for the work animation complete event
		const handleWorkAnimationComplete = () => {
			startEducationAnimation();
		};

		window.addEventListener('workAnimationComplete', handleWorkAnimationComplete);

		return () => {
			window.removeEventListener('workAnimationComplete', handleWorkAnimationComplete);
		};
	});

	function startEducationAnimation() {
		tl.play();
	}

	function getIconStyle(color: string | undefined, iconUrl: string) {
		return `
			background-color: ${color || '#000000'};
			-webkit-mask-image: url(${iconUrl});
			mask-image: url(${iconUrl});
			-webkit-mask-size: contain;
			mask-size: contain;
			-webkit-mask-repeat: no-repeat;
			mask-repeat: no-repeat;
			-webkit-mask-position: center;
			mask-position: center;
		`;
	}
</script>

<section id="education" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<h2 class="education-heading-animation text-xl font-bold pt-8 pb-4">
		{slice.primary.education_heading}
	</h2>
	<div>
		{#each slice.primary.education_item as item}
			<div class="education-item-animation">
				<a class="block cursor-pointer pb-4" href={item.education_url}>
					<div class="rounded-xl bg-card text-card-foreground flex items-center">
						<div class="flex-none">
							<span
								class="relative flex shrink-0 overflow-hidden rounded-full border size-12 m-auto bg-muted-background dark:bg-foreground"
							>
								<div
									class="w-full h-full"
									style={getIconStyle(
										item.education_icon_color ?? '',
										item.education_icon?.url ?? ''
									)}
								></div>
							</span>
						</div>
						<div class="flex-grow ml-4 flex items-center justify-between">
							<div class="flex flex-col">
								<h3
									class="inline-flex items-center justify-start font-semibold leading-none text-xs sm:text-sm group"
								>
									{item.education_title}
									<span class="inline-flex gap-x-1"></span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-chevron-right size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 rotate-0"
									>
										<path d="m9 18 6-6-6-6"></path>
									</svg>
								</h3>
								<div class="font-sans text-xs">{item.education_description}</div>
							</div>
							<div
								class="text-xs sm:text-sm tabular-nums text-muted-foreground text-right ml-4 mr-4 shrink-0"
							>
								{item.education_dates}
							</div>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</section>
