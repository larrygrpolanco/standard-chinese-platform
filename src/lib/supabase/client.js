// src/lib/supabase/client.js

import { createClient } from '@supabase/supabase-js';

// Environment variables should be set in .env files
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Module functions
export async function getModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('order_num');
  
  if (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
  
  return data;
}

export async function getModuleById(id) {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('id', id)
    .single();
  
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

// Audio URL helper
export function getAudioUrl(filename) {
  return `${supabaseUrl}/storage/v1/object/public/audio/${filename}`;
}