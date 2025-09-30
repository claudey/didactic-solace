<script>
	import { onMount } from 'svelte';

	let email = '';
	let submitted = false;
	let error = '';
	let loading = false;

	// Array of real estate image URLs (using Unsplash for high-quality images)
	const realEstateImages = [
		'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
		'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
		'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
		'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
		'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
		'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
	];

	let backgroundImage = '';

	onMount(() => {
		// Select a random real estate image
		backgroundImage = realEstateImages[Math.floor(Math.random() * realEstateImages.length)];
	});

	function validateEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		loading = true;

		if (!email) {
			error = 'Please enter your email address';
			loading = false;
			return;
		}

		if (!validateEmail(email)) {
			error = 'Please enter a valid email address';
			loading = false;
			return;
		}

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const data = await response.json();

			if (response.ok) {
				submitted = true;
			} else {
				error = data.error || 'Failed to subscribe. Please try again.';
			}
		} catch (err) {
			console.error('Subscription error:', err);
			error = 'Network error. Please check your connection and try again.';
		} finally {
			loading = false;
		}
	}
</script>

<main class="hero-section">
	<div class="background-image" style="background-image: url('{backgroundImage}')"></div>
	<div class="overlay"></div>

	<div class="content">
		<div class="signup-card">
			<img src="/gpp-logo.svg" alt="GPP Logo" class="logo" />
			<h1>We'll be back soon.</h1>
			<p>Stay updated with the latest real estate opportunities and market insights</p>

			{#if !submitted}
				<form on:submit={handleSubmit} class="email-form">
					<div class="input-group">
						<input
							type="email"
							bind:value={email}
							placeholder="Enter your email address"
							class="email-input"
							required
						/>
						<button type="submit" class="submit-btn" disabled={loading}>
							{loading ? 'Subscribing...' : 'Subscribe'}
						</button>
					</div>
					{#if error}
						<p class="error-message">{error}</p>
					{/if}
				</form>
			{:else}
				<div class="success-message">
					<h2>Thank you for subscribing!</h2>
					<p>We'll keep you updated with the latest real estate news and opportunities.</p>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.hero-section {
		position: relative;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 1;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 2;
	}

	.content {
		position: relative;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 20px;
	}

	.signup-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 40px;
		max-width: 500px;
		width: 100%;
		text-align: center;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.logo {
		height: 100px;
		width: auto;
		margin-bottom: 24px;
		object-fit: contain;
	}

	.signup-card h1 {
		color: #2c3e50;
		font-size: 2.5rem;
		margin: 0 0 16px 0;
		font-weight: 700;
	}

	.signup-card p {
		color: #7f8c8d;
		font-size: 1.1rem;
		margin: 0 0 32px 0;
		line-height: 1.6;
	}

	.email-form {
		width: 100%;
	}

	.input-group {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
	}

	.email-input {
		flex: 1;
		padding: 16px 20px;
		border: 2px solid #e1e8ed;
		border-radius: 12px;
		font-size: 1rem;
		outline: none;
		transition: all 0.3s ease;
		background: white;
	}

	.email-input:focus {
		border-color: #a90e0e;
		box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
	}

	.submit-btn {
		padding: 16px 32px;
		background: linear-gradient(135deg, #a90e0e, #9a0a0a);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
	}

	.submit-btn:hover {
		background: linear-gradient(135deg, #8a0909, #700404);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
	}

	.submit-btn:active {
		transform: translateY(0);
	}

	.submit-btn:disabled {
		background: linear-gradient(135deg, #ccc, #999);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.error-message {
		color: #e74c3c;
		font-size: 0.9rem;
		margin: 0;
		text-align: left;
	}

	.success-message {
		padding: 20px 0;
	}

	.success-message h2 {
		color: #27ae60;
		font-size: 1.8rem;
		margin: 0 0 16px 0;
	}

	.success-message p {
		color: #7f8c8d;
		font-size: 1rem;
		margin: 0;
	}

	@media (max-width: 768px) {
		.signup-card {
			padding: 30px 20px;
			margin: 20px;
		}

		.signup-card h1 {
			font-size: 2rem;
		}

		.input-group {
			flex-direction: column;
		}

		.submit-btn {
			width: 100%;
		}
	}
</style>
