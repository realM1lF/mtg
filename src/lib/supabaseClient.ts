import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseEnvConfig = {
	supabaseUrl: string;
	supabaseKey: string;
};

function readConfig(): SupabaseEnvConfig | null {
	const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
	const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		return null;
	}

	return { supabaseUrl, supabaseKey };
}

let cachedClient: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
	return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseClient(): SupabaseClient | null {
	if (cachedClient !== undefined) {
		return cachedClient;
	}

	const config = readConfig();

	if (!config) {
		cachedClient = null;
		return cachedClient;
	}

	cachedClient = createClient(config.supabaseUrl, config.supabaseKey, {
		realtime: { params: { eventsPerSecond: 5 } },
	});

	return cachedClient;
}
