'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import {Typography} from "@/src/components/atoms/Typography";
import {Input} from "@/src/components/atoms/Input";
import {Button} from "@/src/components/atoms/Button";
import Link from "next/link";
import { useAuth } from '@/src/context/AuthProvider';

const RegisterForm = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();
    const router = useRouter();

    const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await register(email, password, name);
            router.replace('/dashboard');
        } catch (err) {
            setError((err as Error).message || 'Не удалось зарегистрироваться');
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className="flex flex-col gap-y-10">
            <div className='flex flex-col gap-y-5 mt-5'>
                <Typography as="h1">Create your account</Typography>
                <Typography as="p">Start your 14-day free trial. No card required.</Typography>
            </div>

            <form
                onSubmit={sendForm}
                className=' flex flex-col gap-y-5'>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    label='Full name'
                    placeholder='Ilon Mask'
                />
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
                    type="submit"
                    className='mt-4'
                    variant='primary'
                    size='md'
                    loading={submitting}
                    disabled={submitting || !name || !email || !password}
                >
                    Create account
                </Button>
                {error && (
                    <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</p>
                )}
            </form>
            <Typography as="p">Already have account? <Link href='/login'>Sign In</Link></Typography>
        </div>
    )
}

export default RegisterForm;