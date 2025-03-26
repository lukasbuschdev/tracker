import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { Supabase, Tables } from './database.js';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

config();

const app = express();
const port = process.env.port;
const url = 'https://ewkvopmxfjtsiwghbipw.supabase.co';
const supabase = new Supabase(process.env.SECRET_KEY as string);
const password = process.env.PASSWORD as string;

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const idColumns: Record<keyof Tables, string> = {
    budgets: 'userId',
    expenses: 'budgetId',
    categories: 'budgetId',
    users: 'id'
}

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'expensetracker@lukasbusch.dev',
        pass: password
    }
});


app.use(express.json());


// SEND MAILS

app.post('/api/send-mail', async (req: Request, res: Response) => {
    try {
        const { to, verificationCode, url, name, lang } = req.body;
        const templatePath = path.join(_dirname, '..', '..', 'shared', 'email-templates', `verification-${lang}.html`);
        
        let template = await fs.readFile(templatePath, 'utf8');

        template = template.replace('{{name}}', name);
        template = template.replace('{{url}}', url);
        template = template.replace('{{verificationCode}}', verificationCode);

        const info = await transporter.sendMail({
            from: "expensetracker@lukasbusch.dev",
            to: to,
            subject: "Welcome to ExpenseTracker",
            text: `Hello ${name}, thanks for signing up! Your verification code is: ${verificationCode}. Please verify your account by clicking (or copying) this link: ${url}`,
            html: template
        });

        res.json({ message: 'Email successfully sent', info });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to send email!' });
    }
});

app.post('/api/send-reset-mail', async (req: Request, res: Response) => {
    try {
        const { to, verificationCode, name, url, lang } = req.body;
        const templatePath = path.join(_dirname, '..', '..', 'shared', 'email-templates', `reset-password-${lang}.html`);
        
        let template = await fs.readFile(templatePath, 'utf8');

        template = template.replace('{{name}}', name);
        template = template.replace('{{url}}', url);
        template = template.replace('{{verificationCode}}', verificationCode);

        const info = await transporter.sendMail({
            from: "expensetracker@lukasbusch.dev",
            to: to,
            subject: "Welcome to ExpenseTracker",
            text: `Hello ${name}! Your verification code is: ${verificationCode}. Please use the verification code reset your password by clicking (or copying) this link: ${url}`,
            html: template
        });

        res.json({ message: 'Email successfully sent', info });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to send email!' });
    }
});


// POST

app.post('/api/:table', async (req: Request, res: Response) => {
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

app.get(`/api/users/byEmail`, async (req: Request, res: Response) => {
    try {
        const email = req.query.email as string;
        const { data, error } = await supabase.getUserByEmail(email);

        if(error) return statusError(res, error, 404);

        res.send(data);
    } catch (error) {
        statusError(res, error);
    }
});

app.get(`/api/:table/:id`, async (req: Request, res: Response) => {
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

app.get(`/api/users`, async (req: Request, res: Response) => {
    try {
        const emailOrName = req.query.emailOrName as string;
        const password = req.query.password as string;

        const { data, error } = await supabase.getUserByEmailOrUsername(emailOrName, password);

        if(error) return statusError(res, error, 404);

        res.send(data);
    } catch (error) {
        statusError(res, error);
    }
});


// DELETE

app.delete('/api/:table/:id', async (req: Request, res: Response) => {
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

app.patch('/api/:table/:id', async (req: Request, res: Response) => {
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