import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
	try {
		const { email } = await request.json();

		// Validate email
		if (!email || !isValidEmail(email)) {
			return json(
				{ error: 'Please provide a valid email address' },
				{ status: 400 }
			);
		}

		// Check if email already exists
		const existingEmail = await platform.env.EMAILS.get(email);
		if (existingEmail) {
			return json(
				{ error: 'This email is already subscribed' },
				{ status: 409 }
			);
		}

		// Store email in Cloudflare KV
		const emailData = {
			email,
			timestamp: Date.now(),
			source: 'landing-page',
			ip: request.headers.get('cf-connecting-ip') || 'unknown'
		};

		await platform.env.EMAILS.put(email, JSON.stringify(emailData));

		// Also store with timestamp as key for easy querying
		await platform.env.EMAILS.put(
			`subscriber:${Date.now()}:${email}`,
			JSON.stringify(emailData)
		);

		return json({ success: true, message: 'Successfully subscribed!' });
	} catch (error) {
		console.error('Subscription error:', error);
		return json(
			{ error: 'Failed to subscribe. Please try again.' },
			{ status: 500 }
		);
	}
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
