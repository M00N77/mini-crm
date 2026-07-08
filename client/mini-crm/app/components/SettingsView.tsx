'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiBell, FiLogOut } from 'react-icons/fi';
import { Card } from '@/src/components/molecules/Card';
import { Typography } from '@/src/components/atoms/Typography';
import { Divider } from '@/src/components/atoms/Divider';
import { Input } from '@/src/components/atoms/Input';
import { Button } from '@/src/components/atoms/Button';
import { Toggle } from '@/src/components/atoms/Toggle';
import { MOCK_USER, MOCK_USER_EMAIL } from '@/src/lib/mock';
import { useAuth } from '@/src/context/AuthProvider';

const sections: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <FiUser size={16} /> },
  { id: 'security', label: 'Security', icon: <FiLock size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <FiBell size={16} /> },
];

export function SettingsView() {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [passwordData, setPasswordData] = useState({ current: '', newPwd: '', confirm: '' });
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div className="flex gap-6 p-6 max-w-[960px] mx-auto">
      {/* Side navigation */}
      <Card.Root style={{ width: 220, height: 'fit-content' }}>
        <Card.Content>
          <nav className="flex flex-col gap-1 ">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm text-left transition-colors duration-150 ${
                  activeSection === s.id
                    ? 'bg-[var(--action-secondary-bg)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--action-secondary-bg)]'
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </nav>
        </Card.Content>
      </Card.Root>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Profile */}
        {activeSection === 'profile' && (
          <Card.Root>
            <Card.Header>
              <Typography as="h3">Profile</Typography>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-4 max-w-md">
                <Input label="Full name" value={MOCK_USER} disabled />
                <Input label="Email" value={MOCK_USER_EMAIL} disabled />
              </div>
            </Card.Content>
          </Card.Root>
        )}

        {/* Security */}
        {activeSection === 'security' && (
          <Card.Root>
            <Card.Header>
              <Typography as="h3">Change password</Typography>
            </Card.Header>
            <Card.Content>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-4 max-w-md"
              >
                <Input
                  label="Current password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData((p) => ({ ...p, current: e.target.value }))}
                />
                <Input
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPwd}
                  onChange={(e) => setPasswordData((p) => ({ ...p, newPwd: e.target.value }))}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData((p) => ({ ...p, confirm: e.target.value }))}
                />
                <Button type="submit" variant="primary" className="self-start mt-2">
                  Update password
                </Button>
              </form>
            </Card.Content>
          </Card.Root>
        )}

        {/* Notifications */}
        {activeSection === 'notifications' && (
          <Card.Root>
            <Card.Header>
              <Typography as="h3">Notifications</Typography>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-4">
                <Toggle
                  checked={emailNotif}
                  onChange={setEmailNotif}
                  label="Email alerts"
                  description="Receive email notifications for important updates"
                />
                <Divider />
                <Toggle
                  checked={pushNotif}
                  onChange={setPushNotif}
                  label="Push notifications"
                  description="Get push alerts in your browser"
                />
                <Divider />
                <Toggle
                  checked={weeklyDigest}
                  onChange={setWeeklyDigest}
                  label="Weekly digest"
                  description="A weekly summary of your contacts and tasks"
                />
              </div>
            </Card.Content>
          </Card.Root>
        )}

        {/* Sign out */}
        <Card.Root>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Typography as="p">Sign out</Typography>
                <Typography as="caption">End your current session on this device</Typography>
              </div>
              <Button variant="danger" size="sm" iconLeft={<FiLogOut size={14} />} onClick={async () => { await logout(); router.replace('/login'); }}>
                Sign out
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}
