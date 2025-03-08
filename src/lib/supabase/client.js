// client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all modules (ordered by order_num)
export async function getModules() {
	const { data, error } = await supabase
		.from('modules')
		.select('id, title, description, order_num, module_type')
		.order('order_num');

	if (error) {
		console.error('Error fetching modules:', error);
		return [];
	}

	return data || [];
}

// Fetch a specific module by ID
export async function getModuleById(id) {
	const { data, error } = await supabase
		.from('modules')
		.select('id, title, description, order_num, module_type')
		.eq('id', id)
		.single();

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
		.select('id, title, description, order_num, module_id')
		.eq('module_id', moduleId)
		.order('order_num');

	if (error) {
		console.error('Error fetching units:', error);
		return [];
	}

	return data || [];
}

// Fetch unit with its module - basic info needed for all tabs
export async function getUnitBasicInfo(unitId) {
	const { data, error } = await supabase
		.from('units')
		.select(
			`
      id, title, description, order_num, module_id,
      module:modules(id, title, description, order_num)
    `
		)
		.eq('id', unitId)
		.single();

	if (error) {
		console.error('Error fetching unit with module:', error);
		return null;
	}

	return data;
}

// Fetch vocabulary for the Vocabulary tab
export async function getUnitVocabularyData(unitId) {
	const { data, error } = await supabase
		.from('vocabulary')
		.select('id, chinese_simplified, chinese_traditional, pinyin, english, order_num')
		.eq('unit_id', unitId)
		.order('order_num');

	if (error) {
		console.error('Error fetching vocabulary:', error);
		return { vocabulary: [] };
	}

	return { vocabulary: data || [] };
}

// Fetch review tapes and dialogues for the Review tab
export async function getUnitReviewData(unitId) {
	const [tapesResult, dialoguesResult] = await Promise.all([
		supabase
			.from('tapes')
			.select('id, title, tape_type, audio_file, order_num')
			.eq('unit_id', unitId)
			.eq('tape_type', 'review')
			.order('order_num'),

		supabase
			.from('reference_list')
			.select(
				'id, number, chinese_simplified, chinese_traditional, pinyin, english, notes, order_num'
			)
			.eq('unit_id', unitId)
			.order('order_num')
	]);

	const { data: tapesData, error: tapesError } = tapesResult;
	const { data: dialoguesData, error: dialoguesError } = dialoguesResult;

	if (tapesError) console.error('Error fetching review tapes:', tapesError);
	if (dialoguesError) console.error('Error fetching dialogues:', dialoguesError);

	// Return the dialogues directly without restructuring them
	return {
		reviewTapes: tapesData || [],
		dialogues: dialoguesData || [] // <-- This is now correct
	};
}

// Fetch workbook tapes and exercises for the Exercises tab
export async function getUnitExercisesData(unitId) {
	const { data: tapesData, error: tapesError } = await supabase
		.from('tapes')
		.select('id, title, tape_type, audio_file, order_num')
		.eq('unit_id', unitId)
		.eq('tape_type', 'workbook')
		.order('order_num');

	if (tapesError) {
		console.error('Error fetching workbook tapes:', tapesError);
		return { workbookTapes: [], exercises: [] };
	}

	const workbookTapes = tapesData || [];
	const workbookTapeIds = workbookTapes.map((tape) => tape.id);

	if (workbookTapeIds.length === 0) {
		return { workbookTapes: [], exercises: [] };
	}

	const { data: exercisesData, error: exercisesError } = await supabase
		.from('exercises')
		.select('id, tape_id, title, exercise_type, instructions, display_url, order_num')
		.in('tape_id', workbookTapeIds)
		.order('order_num');

	if (exercisesError) {
		console.error('Error fetching exercises:', exercisesError);
		return { workbookTapes, exercises: [] };
	}

	return {
		workbookTapes,
		exercises: exercisesData || []
	};
}

// New function to fetch questions for a specific exercise
export async function getExerciseQuestions(exerciseId) {
	const { data, error } = await supabase
		.from('exercise_questions')
		.select('id, exercise_id, question_text, question_type, options, order_num')
		.eq('exercise_id', exerciseId)
		.order('order_num');

	if (error) {
		console.error('Error fetching exercise questions:', error);
		return [];
	}

	return data || [];
}

// Legacy function for backward compatibility
export async function getCompleteUnit(unitId) {
	const unitBasicInfo = await getUnitBasicInfo(unitId);
	if (!unitBasicInfo) return null;

	const [reviewData, exercisesData, vocabularyData] = await Promise.all([
		getUnitReviewData(unitId),
		getUnitExercisesData(unitId),
		getUnitVocabularyData(unitId)
	]);

	return {
		...unitBasicInfo,
		...reviewData,
		...exercisesData,
		...vocabularyData
	};
}
