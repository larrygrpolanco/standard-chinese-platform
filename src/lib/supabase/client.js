// src/lib/supabase/client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all modules (ordered by order_num)
export async function getModules() {
	const { data, error } = await supabase.from('modules').select('*').order('order_num');

	if (error) {
		console.error('Error fetching modules:', error);
		return [];
	}

	return data || [];
}

// Fetch a specific module by ID
export async function getModuleById(id) {
	const { data, error } = await supabase.from('modules').select('*').eq('id', id).single();

	if (error) {
		console.error('Error fetching module:', error);
		return null;
	}

	return data;
}

// Fetch units by module ID
export async function getUnitsByModuleId(moduleId) {
	const { data, error } = await supabase
		.from('units')
		.select('*')
		.eq('module_id', moduleId)
		.order('order_num');

	if (error) {
		console.error('Error fetching units:', error);
		return [];
	}

	return data || [];
}

// Fetch complete unit with related data
export async function getCompleteUnit(unitId) {
	// First get the base unit data
	const { data: unit, error: unitError } = await supabase
		.from('units')
		.select(
			`
      *,
      module:modules(*)
    `
		)
		.eq('id', unitId)
		.single();

	if (unitError) {
		console.error('Error fetching unit:', unitError);
		return null;
	}

	if (!unit) return null;

	// Get vocabulary for the unit
	const { data: vocabulary, error: vocabError } = await supabase
		.from('vocabulary')
		.select('*')
		.eq('unit_id', unitId)
		.order('order_num');

	if (vocabError) {
		console.error('Error fetching vocabulary:', vocabError);
	}

	// Get review tapes for the unit
	const { data: reviewTapes, error: tapesError } = await supabase
		.from('tapes')
		.select('*')
		.eq('unit_id', unitId)
		.eq('tape_type', 'review')
		.order('order_num');

	if (tapesError) {
		console.error('Error fetching review tapes:', tapesError);
	}

	// Get workbook tapes for the unit
	const { data: workbookTapes, error: workbookError } = await supabase
		.from('tapes')
		.select('*')
		.eq('unit_id', unitId)
		.eq('tape_type', 'workbook')
		.order('order_num');

	if (workbookError) {
		console.error('Error fetching workbook tapes:', workbookError);
	}

	// Get reference dialogues for the unit
	const { data: dialogues, error: dialoguesError } = await supabase
		.from('reference_list')
		.select('*')
		.eq('unit_id', unitId)
		.order('order_num');

	if (dialoguesError) {
		console.error('Error fetching dialogues:', dialoguesError);
	}

	// Get exercises for all workbook tapes
	const workbookTapeIds = (workbookTapes || []).map((tape) => tape.id);

	let exercises = [];
	if (workbookTapeIds.length > 0) {
		const { data: exercisesData, error: exercisesError } = await supabase
			.from('exercises')
			.select('*')
			.in('tape_id', workbookTapeIds)
			.order('order_num');

		if (exercisesError) {
			console.error('Error fetching exercises:', exercisesError);
		} else {
			exercises = exercisesData || [];
		}
	}

	// Return complete unit data
	return {
		...unit,
		vocabulary: vocabulary || [],
		reviewTapes: reviewTapes || [],
		workbookTapes: workbookTapes || [],
		dialogues: dialogues || [],
		exercises: exercises || []
	};
}
