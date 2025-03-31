// hooks.server.js
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// For admin-level operations that need service role
const supabaseAdmin = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Simple in-memory rate limiter
// Using Maps with automatic cleanup to prevent memory leaks
const rateLimits = new Map();

// Rate limit configuration
const rateLimitConfig = {
  // Sensitive API endpoints (auth, account operations)
  sensitive: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10 // 10 requests per minute
  },
  // Standard API endpoints
  standard: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60 // 60 requests per minute
  }
};

// Clean up stale rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimits.entries()) {
    if (now > value.resetAt) {
      rateLimits.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Rate limit check function
function checkRateLimit(ip, path) {
  const now = Date.now();
  
  // Determine which limit to apply
  const isSensitiveEndpoint = path.includes('/api/auth') || 
                              path.includes('/api/account') || 
                              path.includes('/api/stripe') ||
                              path.includes('/login');
  
  const config = isSensitiveEndpoint ? rateLimitConfig.sensitive : rateLimitConfig.standard;
  const rateLimitKey = `${ip}:${isSensitiveEndpoint ? 'sensitive' : 'standard'}`;
  
  // Get current rate limit data for this IP and endpoint type
  let rateInfo = rateLimits.get(rateLimitKey);
  
  // Initialize if not exists
  if (!rateInfo) {
    rateInfo = { count: 0, resetAt: now + config.windowMs };
  }
  
  // Reset if window expired
  if (now > rateInfo.resetAt) {
    rateInfo.count = 0;
    rateInfo.resetAt = now + config.windowMs;
  }
  
  // Increment and store
  rateInfo.count++;
  rateLimits.set(rateLimitKey, rateInfo);
  
  // Check if limit exceeded
  if (rateInfo.count > config.maxRequests) {
    const retryAfterSeconds = Math.ceil((rateInfo.resetAt - now) / 1000);
    return {
      limited: true,
      retryAfter: retryAfterSeconds
    };
  }
  
  return { limited: false };
}

export async function handle({ event, resolve }) {
	// Skip logging for known bot paths
	const botPaths = ['/wp-admin', '/wordpress', '/wp-login', '/xmlrpc.php'];
	if (!botPaths.some((path) => event.url.pathname.includes(path))) {
		// Only log non-bot paths
		console.log(`Request path: ${event.url.pathname}`);
	}

	// Apply rate limiting only for API endpoints to start
	const path = event.url.pathname;
	if (path.startsWith('/api/') || path.includes('/login')) {
		const ip = event.getClientAddress() || 'unknown';
		const rateCheck = checkRateLimit(ip, path);
		
		if (rateCheck.limited) {
			// Return 429 Too Many Requests with Retry-After header
			return new Response('Too many requests. Please try again later.', {
				status: 429,
				headers: {
					'Retry-After': rateCheck.retryAfter.toString(),
					'Content-Type': 'text/plain'
				}
			});
		}
	}

	// Get the auth token from the request headers
	const authHeader = event.request.headers.get('Authorization');
	let session = null;

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];
		if (token) {
			try {
				// Add a timeout to prevent hanging
				const authPromise = supabaseAdmin.auth.getUser(token);
				const timeoutPromise = new Promise((_, reject) =>
					setTimeout(() => reject(new Error('Auth verification timed out')), 5000)
				);

				// Use Promise.race to implement the timeout
				const { data, error } = await Promise.race([authPromise, timeoutPromise]);

				if (!error) {
					session = {
						user: data.user
					};
				}
			} catch (err) {
				console.error('Auth verification error or timeout:', err.message);
				// Continue without session rather than hanging
			}
		}
	}

	// Add the session and admin client to event.locals
	event.locals.session = session;
	event.locals.supabaseAdmin = supabaseAdmin;

	// Helper method to get the session
	event.locals.getSession = async () => {
		return session;
	};

	const response = await resolve(event);
	return response;
}
