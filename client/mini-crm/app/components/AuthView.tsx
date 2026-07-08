'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { Card } from '@/src/components/molecules/Card';
import { Tabs } from '@/src/components/molecules/Tabs';
import { FormField } from '@/src/components/molecules/FormField';
import { Input } from '@/src/components/atoms/Input';
import { Button } from '@/src/components/atoms/Button';
import { Typography } from '@/src/components/atoms/Typography';
import { useAuth } from '@/src/context/AuthProvider';

const advantages = [
  'Unified contacts, notes & pipeline',
  'Tasks that sync with every deal',
  'Built for teams that move fast',
];

interface AuthViewProps {
  mode: 'signin' | 'signup';
}

export function AuthView({ mode }: AuthViewProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignIn = activeTab === 'signin';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isSignIn) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.replace('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Не удалось выполнить вход');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left: Marketing */}
      <div className="hidden md:flex flex-col justify-center px-12 py-16 bg-[var(--bg-base)]">
        <Typography
          as="h2"
          className="text-[var(--action-primary-bg)] font-bold mb-1"
        >
          Halo
        </Typography>

        <Typography as="h1" className="mb-3 max-w-[420px]">
          The CRM that feels like it was made for you.
        </Typography>

        <Typography
          as="p"
          className="text-[var(--text-secondary)] mb-8 max-w-[400px]"
        >
          Manage relationships, capture every conversation, and keep work moving — all
          from one beautifully fast workspace.
        </Typography>

        <ul className="flex flex-col gap-3 mb-12 list-none p-0">
          {advantages.map((text) => (
            <li key={text} className="flex items-center gap-3">
              <FiCheck
                size={18}
                className="text-[var(--color-success)] shrink-0"
              />
              <Typography as="p">{text}</Typography>
            </li>
          ))}
        </ul>

        <Typography as="caption" className="text-[var(--text-secondary)] mt-auto">
          Trusted by 4,000+ revenue teams worldwide
        </Typography>
      </div>

      {/* Right: Auth Card */}
      <div className="flex items-center justify-center min-h-screen p-4 md:p-8 bg-[var(--bg-elevated)]">
        <Card.Root style={{ width: '100%', maxWidth: 420 }}>
          <Card.Header>
            <Tabs
              tabs={[
                { id: 'signin', label: 'Sign In' },
                { id: 'signup', label: 'Create Account' },
              ]}
              activeTab={activeTab}
              onChange={(id) => {
                const next = id as 'signin' | 'signup';
                setActiveTab(next);
                router.push(next === 'signin' ? '/login' : '/register');
              }}
            />
          </Card.Header>

          <Card.Content>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <Typography as="h2">
                  {isSignIn ? 'Welcome back' : 'Create your account'}
                </Typography>
                <Typography as="caption">
                  {isSignIn
                    ? 'Sign in to pick up where you left off.'
                    : 'Start your 14-day free trial. No card required.'}
                </Typography>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                {!isSignIn && (
                  <FormField label="Full name">
                    <Input
                      placeholder="Ilon Mask"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormField>
                )}

                <FormField label="Email">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormField>

                <FormField label="Password">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  iconRight={<FiArrowRight size={16} />}
                  className="w-full mt-2"
                  disabled={submitting}
                >
                  {submitting ? (isSignIn ? 'Signing in…' : 'Creating…') : (isSignIn ? 'Sign in' : 'Create account')}
                </Button>
                {error && (
                  <Typography as="caption" className="text-[var(--color-error)]">
                    {error}
                  </Typography>
                )}
              </form>

              <button
                type="button"
                className="text-sm text-center text-[var(--action-primary-bg)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary-bg)] focus-visible:ring-offset-2 rounded-sm"
                onClick={() => {
                  const next = isSignIn ? 'signup' : 'signin';
                  setActiveTab(next);
                  router.push(next === 'signin' ? '/login' : '/register');
                }}
              >
                {isSignIn ? "New to Halo? Create one" : 'Already have an account? Sign in'}
              </button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}
