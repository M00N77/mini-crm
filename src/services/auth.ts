import pool from '../db'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function registerUser(email: string, password: string,name: string) {
    const emailExists = await pool.query('select * from users where email=$1',[email]);
    if(emailExists.rows.length > 0) throw new Error('Email already exists');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query('insert into users (email,hashed_password,name) values($1,$2,$3) returning id,email,created_at',[email,hashedPassword,name]);

    const payload = {
        userId: result.rows[0].id,
        email: email,
        name:name
    }

    const secretKey = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
    const accessToken = jwt.sign(payload, secretKey, {expiresIn: '1h'});
    const refreshToken = jwt.sign(payload, secretKey, {expiresIn: '7d'});
    return {
        user: result.rows[0],
        accessToken : accessToken,
        refreshToken : refreshToken,
    }
}

export async function loginUser(email: string, password: string) {
    const user = await pool.query('select * from users where email=$1',[email]);
    if(user.rows.length > 0) {
        const isValidPassword = await bcrypt.compare(password, user.rows[0].hashed_password);
        if(!isValidPassword) throw new Error('Incorrect password');
        const { hashed_password, ...userWithoutPassword } = user.rows[0];

        const secretKey = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

        const payload = {
            userId: user.rows[0].id,
            email: email,
        }

        const accessToken = jwt.sign(payload, secretKey, {expiresIn: '1h'});
        const refreshToken = jwt.sign(payload, secretKey, {expiresIn: '7d'});

        return {
            user: userWithoutPassword,
            accessToken:accessToken,
            refreshToken:refreshToken,
        }
    }
    throw new Error('User not found');

}
