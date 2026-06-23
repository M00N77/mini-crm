'use client'

import {useState} from "react";
import { Typography } from '@/src/components/atoms/Typography';
import { Input } from '@/src/components/atoms/Input';
import {Button} from "@/src/components/atoms/Button";
import Link from "next/link";

const LoginForm = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);

    const sendForm = (e:React.FormEvent<HTMLFormElement>)  => {
        e.preventDefault();

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        },2000)

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
                    loading = {loading}
                >
                    Sign In
                </Button>
            </form>
            <Typography as="p">New to here? <Link href='/register'>Create one</Link></Typography>
        </div>
    )
}

export default LoginForm;