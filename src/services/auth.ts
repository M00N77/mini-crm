import pool from '../db'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: number;
    email: string;
    name?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

async function generateRefreshToken(payload: TokenPayload, secretKey:string) {
    const userId = payload.userId;
    const timeForRefreshToken = {expiresIn: '7d' as const};
    const refreshTokenExpiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refreshToken = jwt.sign(payload, secretKey, timeForRefreshToken);
    const saltForRefreshToken = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken,  saltForRefreshToken);
    await pool.query('insert into refresh_tokens (user_id,token_hash,expires_at) values ($1,$2,$3) returning *',[userId,hashedRefreshToken,refreshTokenExpiresIn])

    return {refreshToken, hashedRefreshToken}
}

export async function rotateRefreshToken(curRefreshToken: string, ) {
    try{
        const secretKey = JWT_SECRET;
        const payload = jwt.verify(curRefreshToken, secretKey) as TokenPayload;

        const row = (await pool.query('select * from refresh_tokens where user_id=$1', [payload.userId])).rows;
        if(row.length === 0) return null;

        const isValid = await bcrypt.compare(curRefreshToken, row[0].token_hash);
        if(!isValid) throw new Error('Invalid password');



        await pool.query('delete from refresh_tokens where id=$1 and user_id = $2',[row[0].id,row[0].user_id])
        const {refreshToken} = await generateRefreshToken(payload, secretKey)
        const timeForAccessToken = {expiresIn: '15m' as const};
        const accessToken = jwt.sign(payload,secretKey,timeForAccessToken)

        return {refreshToken, accessToken}
    } catch (e){
        throw new Error('Invalid refreshToken', { cause: e });
    }
}

export async function registerUser(email: string, password: string,name: string) {
    const emailExists = await pool.query('select * from users where email=$1',[email]);
    if(emailExists.rows.length > 0) throw new Error('Email already exists');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query('insert into users (email,hashed_password,name) values($1,$2,$3) returning id,email,created_at',[email,hashedPassword,name]);

    const payload : TokenPayload = {
        userId: result.rows[0].id,
        email: email,
        name:name
    }

    const secretKey = JWT_SECRET;
    const timeForAccessToken = {expiresIn: '1h' as const}
    const accessToken = jwt.sign(payload, secretKey, timeForAccessToken);

    const {refreshToken, hashedRefreshToken} = await generateRefreshToken(payload, secretKey);

    return {
        user: result.rows[0],
        accessToken : accessToken,
        refreshToken : refreshToken,
    }
}

export async function loginUser(email: string, password: string) {
    const user = await pool.query('select * from users where email=$1',[email]);

    if(user.rows.length === 0) throw new Error('User not found');

    const isValidPassword = await bcrypt.compare(password, user.rows[0].hashed_password);
    if(!isValidPassword) throw new Error('Incorrect password');
    const { hashed_password, ...userWithoutPassword } = user.rows[0];

    const secretKey = JWT_SECRET;

    const payload : TokenPayload = {
        userId: user.rows[0].id,
        email: email,
    }

    const accessToken = jwt.sign(payload, secretKey, {expiresIn: '1h' as const});
    const {refreshToken, hashedRefreshToken} = await generateRefreshToken(payload, secretKey);

    return {
        user: userWithoutPassword,
        accessToken:accessToken,
        refreshToken:refreshToken,
    }


}




















