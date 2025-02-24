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

    async uploadBudget(uploadData: any) {
        const { data, error } = await this.supabase.from('budgets').insert(uploadData).select('*').single();
        return { data, error };
    }

    async uploadUser(uploadData: any) {
        const { data, error } = await this.supabase.from('users').insert(uploadData).select('*').single();
        return { data, error };
    }

    async getBudgets(userId: string) {
        const { data, error } = await this.supabase.from('budgets').select('*').eq('userId', userId);
        return { data, error };
    }

    async getUser(userId: string) {
        const { data, error } = await this.supabase.from('users').select('*').eq('id', userId).single();
        return { data, error };
    }

    async getUserByEmailOrUsername(emailOrName: string, password: string) {
        const column = emailOrName.includes('@') ? 'email' : 'name';
        const { data, error } = await this.supabase.from('users').select('*').eq(column, emailOrName).eq('password', password).single();
        return { data, error }; 
    }
}
