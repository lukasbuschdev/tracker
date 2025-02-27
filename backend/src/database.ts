import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase.js';

export type Tables = Database['public']['Tables'];
type Update<Key extends keyof Tables> = Tables[Key]['Update'];

export class Supabase {
    supabaseUrl = 'https://ewkvopmxfjtsiwghbipw.supabase.co';
    supabaseKey;
    supabase;
    
    constructor(supabaseKey: string) {
        this.supabaseKey = supabaseKey;
        this.supabase = createClient<Database>(this.supabaseUrl, this.supabaseKey);
    }


    //UPLOAD

    async uploadData(uploadData: any, table: keyof Tables) {
        return this.supabase.from(table).insert(uploadData).select('*').single();
    }


    //GET

    getUserByEmailOrUsername(emailOrName: string, password: string) {
        const column = emailOrName.includes('@') ? 'email' : 'name';
        return this.supabase.from('users').select('*').eq(column, emailOrName).eq('password', password).single();
    }

    getData(id: string, table: keyof Tables, idColumn: string, isSingle: boolean = false) {
        const query = this.supabase.from(table).select('*').eq(idColumn, id);
        return (isSingle ? query.single() : query);
    }


    // DELETE

    deleteData(id: string, table: keyof Tables) {
        return this.supabase.from(table).delete().eq('id', id);
    }


    //PATCH

    patchData<Table extends keyof Tables>(id: string, table: Table, updateData: Update<Table>) {
        return this.supabase.from(table).update(updateData as any).eq('id', id as any).select('*').single();
    }
}
