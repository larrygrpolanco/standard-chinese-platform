// src/lib/supabase/client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Module functions
export async function getModules(moduleType = 'core') {
	const { data, error } = await supabase
		.from('modules')
		.select('*')
		.eq('module_type', moduleType)
		.order('order_num');

	if (error) {
		console.error('Error fetching modules:', error);
		return [];
	}
	return data;
}

export async function getModuleById(id) {
	const { data, error } = await supabase.from('modules').select('*').eq('id', id).single();

	if (error) {
		console.error(`Error fetching module ${id}:`, error);
		return null;
	}
	return data;
}

// Unit functions
export async function getUnitsByModuleId(moduleId) {
	const { data, error } = await supabase
		.from('units')
		.select('*')
		.eq('module_id', moduleId)
		.order('order_num');

	if (error) {
		console.error(`Error fetching units for module ${moduleId}:`, error);
		return [];
	}
	return data;
}

export async function getUnitById(id) {
	const { data, error } = await supabase.from('units').select('*').eq('id', id).single();

	if (error) {
		console.error(`Error fetching unit ${id}:`, error);
		return null;
	}
	return data;
}

// Vocabulary functions
export async function getVocabularyForUnit(unitId) {
	const { data, error } = await supabase
		.from('vocabulary')
		.select('*')
		.eq('unit_id', unitId)
		.order('order_num');

	if (error) {
		console.error(`Error fetching vocabulary for unit ${unitId}:`, error);
		return [];
	}
	return data;
}

// Tape functions
export async function getTapesByUnitId(unitId, tapeType = null) {
	let query = supabase.from('tapes').select('*').eq('unit_id', unitId);

	if (tapeType) {
		query = query.eq('tape_type', tapeType);
	}

	const { data, error } = await query.order('order_num');

	if (error) {
		console.error(`Error fetching tapes for unit ${unitId}:`, error);
		return [];
	}
	return data;
}

// Reference list functions
export async function getReferenceListForTape(tapeId) {
	const { data, error } = await supabase
		.from('reference_list')
		.select('*')
		.eq('tape_id', tapeId)
		.order('order_num');

	if (error) {
		console.error(`Error fetching reference list for tape ${tapeId}:`, error);
		return [];
	}
	return data;
}

// Exercise functions
export async function getExercisesForTape(tapeId) {
	const { data, error } = await supabase
		.from('exercises')
		.select('*')
		.eq('tape_id', tapeId)
		.order('order_num');

	if (error) {
		console.error(`Error fetching exercises for tape ${tapeId}:`, error);
		return [];
	}
	return data;
}

// Get complete unit data
export async function getCompleteUnit(unitId) {
	// Get basic unit info
	const unit = await getUnitById(unitId);
	if (!unit) return null;

	// Get vocabulary
	const vocabulary = await getVocabularyForUnit(unitId);

	// Get review tapes and reference lists
	const reviewTapes = await getTapesByUnitId(unitId, 'review');
	const reviewTapesWithContent = await Promise.all(
		reviewTapes.map(async (tape) => {
			const referenceList = await getReferenceListForTape(tape.id);
			return { ...tape, referenceList };
		})
	);

	// Get workbook tapes and exercises
	const workbookTapes = await getTapesByUnitId(unitId, 'workbook');
	const workbookTapesWithContent = await Promise.all(
		workbookTapes.map(async (tape) => {
			const exercises = await getExercisesForTape(tape.id);
			return { ...tape, exercises };
		})
	);

	return {
		...unit,
		vocabulary,
		reviewTapes: reviewTapesWithContent,
		workbookTapes: workbookTapesWithContent
	};
}

// Audio URL helper
export function getAudioUrl(filename) {
	if (!filename) return null;
	return `${supabaseUrl}/storage/v1/object/public/audio/${filename}`;
}
