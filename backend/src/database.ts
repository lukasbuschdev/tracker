import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase.js';

export class Supabase {
    supabaseUrl = 'https://ewkvopmxfjtsiwghbipw.supabase.co';
    supabaseKey;
    supabase;
    
    constructor(supabaseKey: string) {
        this.supabaseKey = supabaseKey;
        this.supabase = createClient<Database>(this.supabaseUrl, this.supabaseKey);
    }
}
