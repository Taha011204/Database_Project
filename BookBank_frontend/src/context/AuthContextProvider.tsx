import { ReactNode, useState, useEffect, useCallback } from 'react';
import React from 'react';
import { AuthContext } from './AuthContext';
import { AdminProps, UserContextProps, FireToastEnum } from '../types';

import { fireToast } from '../hooks';

const blankUser: AdminProps = {
  userID: 0,
  username: '',
  email: '',
  authenticated: false,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminProps>(blankUser);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const t = await localStorage.getItem('email');

        if (!t) throw new Error('Logged out');
      } catch (err: any) {
        fireToast(
          'There seems to be a problem',
          err.message,
          FireToastEnum.DANGER,
        );
        await localStorage.removeItem('email');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUser = useCallback((user: AdminProps) => {
    setUser(user);
    localStorage.setItem('email', user?.email as string);
  }, []);

  const handleUpdate = useCallback((props: AdminProps) => {
    setUser((prev) => ({ ...prev, ...props }));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('email');
    setUser(blankUser);
  };

  const val: UserContextProps = {
    user: user,
    setUser: handleUser,
    handleUpdate: handleUpdate,
    logout: handleLogout,
    loading: loading,
    setLoading: setLoading,
  };

  return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
};
