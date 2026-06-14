import express, {type Request,type Response } from 'express';
import pool from "./db";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (req : Request, res: Response) => {
    try{
        const result = await pool.query('SELECT * FROM users');
        res.send({message: result});
    } catch (e){
        res.send({error: e});
    }
})

app.listen(PORT, async () => {
    console.log("Server started on port 3000");
    try {
        const result = await pool.query('SELECT NOW()');
        console.log("DB connected:", result.rows[0].now);
    } catch (err) {
        console.error("DB connection error:", err);
    }
});