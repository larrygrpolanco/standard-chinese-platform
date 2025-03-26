// src/app.d.ts
import type { Session, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			session: Session | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
