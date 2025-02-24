import express from 'express';
import { config } from 'dotenv';
import { Supabase } from './database.js';

config();

const app = express();
const port = process.env.port;
const url = 'https://ewkvopmxfjtsiwghbipw.supabase.co';
const supabase = new Supabase(process.env.SECRET_KEY as string);

app.use(express.json());

app.get('/api', (req, res) => {
    console.log('GET request received!')
    res.json({
        username: "John Doe",
        email: "test@mail.com"
    })
});

app.post('/api', (req, res) => {
    console.log('POST request made!')
    // console.log(req.body)

    res.json({ message: 'Data received' })
});

app.post('/api/budgets', async (req, res) => {
    const uploadData = req.body;
    const { data, error } = await supabase.uploadBudget(uploadData);

    if(error) {
        res.status(500).json(error);
        return;
    } 
    
    res.send(data);
});

app.get('/api/budgets/:id', async (req, res) => {
    const userId = req.params.id;
    const { data, error } = await supabase.getBudgets(userId);

    if(error) {
        res.status(404).json(error);
        return;
    }

    console.log(data)
    res.send(data);
});

app.listen(port, () => {
    console.log(`Listening on port ${ port }`);
});