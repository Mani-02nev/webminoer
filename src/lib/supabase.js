import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
    try {
        return Boolean(new URL(url));
    } catch (e) {
        return false;
    }
};

let supabaseClient;

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
    console.warn('⚠️ Supabase Invalid/Missing Keys. Using Mock Client to prevent crash.');
    // Mock client to allow UI to render (but data fetching will fail)
    supabaseClient = {
        from: () => ({
            select: () => ({
                eq: () => ({ single: () => ({ data: null, error: 'Misconfigured Supabase' }), maybeSingle: () => ({ data: null, error: 'Misconfigured Supabase' }) }),
                order: () => Promise.resolve({ data: [], error: null })
            }),
            insert: () => Promise.resolve({ error: 'Supabase Misconfigured' })
        })
    };
} else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;
