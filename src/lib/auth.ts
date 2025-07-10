import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Auth helper functions for client components
export const auth = {
  async signUp(email: string, password: string, name?: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signInWithGoogle() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  async signInWithGithub() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  async updatePassword(password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  },

  async getUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async getSession() {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },
}; 