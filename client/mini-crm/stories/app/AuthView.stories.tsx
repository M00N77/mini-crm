import type { Meta, StoryObj } from '@storybook/react';
import { AuthView } from '../../app/components/AuthView';

const meta: Meta<typeof AuthView> = {
  title: 'App/AuthView',
  component: AuthView,
};

export default meta;
type Story = StoryObj<typeof AuthView>;

export const SignIn: Story = {
  args: {
    mode: 'signin',
  },
};

export const SignUp: Story = {
  args: {
    mode: 'signup',
  },
};
