// async function checkRWPAccess(userId, unitId) {
// 	// Check if user has paid subscription
// 	const { data: subscription } = await supabase
// 		.from('subscriptions')
// 		.select('*')
// 		.eq('user_id', userId)
// 		.single();

// 	if (subscription?.status === 'active') return true;

// 	// Check if user has used their free daily generation
// 	const today = new Date().toISOString().split('T')[0]; // Get today's date

// 	const { count } = await supabase
// 		.from('rwp_content')
// 		.select('id', { count: 'exact' })
// 		.eq('user_id', userId)
// 		.gte('created_at', today);

// 	return count === 0; // Allow if they haven't used their free generation today
// }

// async function checkRWPAccess(userId, unitId) {
// 	// Check if user has paid subscription
// 	const { data: subscription } = await supabase
// 		.from('subscriptions')
// 		.select('*')
// 		.eq('user_id', userId)
// 		.single();

// 	if (subscription?.status === 'active') return true;

// 	// Check if user has used their free daily generation
// 	const today = new Date().toISOString().split('T')[0]; // Get today's date

// 	const { count } = await supabase
// 		.from('rwp_content')
// 		.select('id', { count: 'exact' })
// 		.eq('user_id', userId)
// 		.gte('created_at', today);

// 	return count === 0; // Allow if they haven't used their free generation today
// }