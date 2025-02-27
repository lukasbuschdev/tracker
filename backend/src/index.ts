import express, { Response } from 'express';
import { config } from 'dotenv';
import { Supabase, Tables } from './database.js';

config();

const app = express();
const port = process.env.port;
const url = 'https://ewkvopmxfjtsiwghbipw.supabase.co';
const supabase = new Supabase(process.env.SECRET_KEY as string);

const idColumns: Record<keyof Tables, string> = {
    budgets: 'userId',
    expenses: 'budgetId',
    categories: 'budgetId',
    users: 'id'
}

app.use(express.json());


// POST

app.post('/api/:table', async (req, res) => {
    try {
        const receivedData = req.body;
        const table = req.params.table as keyof Tables;
        const { data, error } = await supabase.uploadData(receivedData, table);
    
        if(error) return statusError(res, error);
    
        res.send(data);
    } catch (error) {
        statusError(res, error);       
    }
});


// GET

app.get(`/api/:table/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        const table = req.params.table as keyof Tables;
        const idColumn = idColumns[table];
        const { data, error } = await supabase.getData(id, table, idColumn, table === 'users');
    
        if(error) return statusError(res, error, 404);
    
        res.send(data);
    } catch (error) {
        statusError(res, error);
    }
});


// DELETE

app.delete('/api/:table/:id', async (req, res) => {
    try {
        const table = req.params.table as keyof Tables;
        const id = req.params.id;
    
        const { data, error } = await supabase.deleteData(id, table);
    
        if(error) return statusError(res, error, 404);
    
        res.send(data);
    } catch (error) {
        statusError(res, error);
    }
});


// UPDATE 

app.patch('/api/:table/:id', async (req, res) => {
    try {
        const table = req.params.table as keyof Tables;
        const id = req.params.id;
        const receivedData = req.body;

        const { data, error } = await supabase.patchData(id, table, receivedData);

        if(error) return statusError(res, error, 404);

        res.send(data);
    } catch (error) {
        statusError(res, error);
    }
});

function statusError(res: Response, error: any, statusCode: number = 500): void {
    res.status(statusCode).json({ error });
}

// LISTEN

app.listen(port, () => {
    console.log(`Listening on port ${ port }`);
});