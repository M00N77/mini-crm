'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Typography } from '@/src/components/atoms/Typography';
import { Input } from '@/src/components/atoms/Input';
import {Button} from "@/src/components/atoms/Button";
import Link from "next/link";
import { useAuth } from '@/src/context/AuthProvider';

const LoginForm = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const router = useRouter();

    const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email, password);
            router.replace('/dashboard');
        } catch (err) {
            setError((err as Error).message || 'Не удалось войти');
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className="flex flex-col gap-y-10">
            <div className='flex flex-col gap-y-5 mt-5'>
                <Typography as="h2">Welcome back</Typography>
                <Typography as="p">Sign in to pick up where you left off.</Typography>
            </div>

            <form
                onSubmit={sendForm}
                className=' flex flex-col gap-y-5'>
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    label='Email'
                    placeholder='your@email.com'
                />
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    label='Password'
                    placeholder='••••••••'
                />
                <Button
                    className='mt-4'
                    variant='primary'
                    size='md'
                    loading={submitting}
                    disabled={submitting}
                >
                    Sign In
                </Button>
                {error && (
                    <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</p>
                )}
            </form>
            <Typography as="p">New to here? <Link href='/register'>Create one</Link></Typography>
        </div>
    )
}

export default LoginForm;