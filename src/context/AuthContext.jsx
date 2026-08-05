import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, INITIAL_MOCK_DATA } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state - default to NULL so user ALWAYS lands on Login screen first
  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchSupabaseProfile(session.user.id);
        } else {
          loadStoredLocalUser();
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            await fetchSupabaseProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        loadStoredLocalUser();
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  function loadStoredLocalUser() {
    const stored = localStorage.getItem('astraea_active_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setProfile(u);
        return;
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    // Default to NULL so the app starts on the Login Page!
    setUser(null);
    setProfile(null);
  }

  async function fetchSupabaseProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data);
      } else {
        setProfile({
          id: userId,
          full_name: user?.email?.split('@')[0] || 'Court Member',
          role: 'Judge'
        });
      }
    } catch (err) {
      console.error("Error fetching Supabase profile:", err);
    }
  }

  const loginWithCredentials = async (emailOrUsername, password) => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password: password
      });

      if (error) {
        setLoading(false);
        throw error;
      }
      setUser(data.user);
      await fetchSupabaseProfile(data.user.id);
      setLoading(false);
      return data;
    } else {
      // Local Auth Matching across Judge, Clerk, Lawyer, Admin
      const matched = INITIAL_MOCK_DATA.users.find(
        u => u.username === emailOrUsername || u.email === emailOrUsername
      );

      if (matched) {
        setUser(matched);
        setProfile(matched);
        localStorage.setItem('astraea_active_user', JSON.stringify(matched));
        setLoading(false);
        return matched;
      } else {
        const newUser = {
          id: 'U-' + Date.now(),
          username: emailOrUsername.split('@')[0],
          email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@court.gov`,
          role: 'Lawyer',
          name: emailOrUsername.split('@')[0]
        };
        setUser(newUser);
        setProfile(newUser);
        localStorage.setItem('astraea_active_user', JSON.stringify(newUser));
        setLoading(false);
        return newUser;
      }
    }
  };

  const loginAsRole = (roleName) => {
    const roleMap = {
      'Judge': INITIAL_MOCK_DATA.users[1],
      'Lawyer': INITIAL_MOCK_DATA.users[2],
      'Clerk': INITIAL_MOCK_DATA.users[3],
      'Admin': INITIAL_MOCK_DATA.users[0]
    };

    const targetUser = roleMap[roleName] || INITIAL_MOCK_DATA.users[1];
    setUser(targetUser);
    setProfile(targetUser);
    localStorage.setItem('astraea_active_user', JSON.stringify(targetUser));
  };

  const registerUser = async ({ email, password, fullName, role }) => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: role }
        }
      });

      if (error) {
        setLoading(false);
        throw error;
      }

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role: role,
          username: email.split('@')[0]
        });
      }
      setLoading(false);
      return data;
    } else {
      const newUser = {
        id: 'U-' + Date.now(),
        username: email.split('@')[0],
        email: email,
        name: fullName,
        role: role || 'Lawyer'
      };
      setUser(newUser);
      setProfile(newUser);
      localStorage.setItem('astraea_active_user', JSON.stringify(newUser));
      setLoading(false);
      return newUser;
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('astraea_active_user');
    setUser(null);
    setProfile(null);
  };

  const switchRole = (newRole) => {
    const updated = { ...profile, role: newRole };
    setProfile(updated);
    setUser(updated);
    localStorage.setItem('astraea_active_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithCredentials,
        loginAsRole,
        registerUser,
        logout,
        switchRole,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
