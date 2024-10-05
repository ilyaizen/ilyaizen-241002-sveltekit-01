<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { darkMode } from '$lib/stores/darkMode';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let effect: Effect;
	let animationId: number;
	let frameCount = 0;
	const updateInterval = 4; // Adjust this value to control the update rate

	class Symbol {
		characters: string;
		x: number;
		y: number;
		fontSize: number;
		canvasHeight: number;
		text: string;

		constructor(x: number, y: number, fontSize: number, canvasHeight: number) {
			this.characters = 'אבגדהוזחטיכלמנסעפצקרשת';
			this.x = x;
			this.y = y;
			this.fontSize = fontSize;
			this.canvasHeight = canvasHeight;
			this.text = '';
		}

		draw(context: CanvasRenderingContext2D, color: string): void {
			this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
			context.fillStyle = color;
			context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
			if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.95) {
				this.y = 0;
			} else {
				// Change this line to make the letters drop slower
				this.y += 0.8; // You can adjust this value to control the speed
			}
		}
	}

	class Effect {
		canvasWidth: number;
		canvasHeight: number;
		fontSize: number;
		columns: number;
		symbols: Symbol[];

		constructor(canvasWidth: number, canvasHeight: number) {
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
			this.fontSize = 32;
			this.columns = this.canvasWidth / this.fontSize;
			this.symbols = [];
			this.initialize();
		}

		initialize(): void {
			for (let i = 0; i < this.columns; i++) {
				this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
			}
		}

		resize(width: number, height: number): void {
			this.canvasWidth = width;
			this.canvasHeight = height;
			this.columns = this.canvasWidth / this.fontSize;
			this.symbols = [];
			this.initialize();
		}
	}

	function animate(): void {
		if (!ctx) return;
		ctx.fillStyle = $darkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = `${effect.fontSize}px YardenAlefAlefAlef, monospace`;

		frameCount++;
		if (frameCount % updateInterval === 0) {
			effect.symbols.forEach((symbol) => {
				if (ctx) {
					symbol.draw(ctx, $darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)');
				}
			});
		}

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d');
		effect = new Effect(canvas.width, canvas.height);
		animate();

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			effect.resize(canvas.width, canvas.height);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
		};
	});
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
</style>
