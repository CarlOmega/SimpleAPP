import React, { useContext, useEffect, useState, useMemo } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const AuthContext = React.createContext<any>({});

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      authSubscriber();
    };
  }, []);

  const onAuthStateChanged: FirebaseAuthTypes.AuthListenerCallback = async (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (user)
      console.log(await auth().currentUser?.getIdToken(true));
    if (isLoading) setLoading(false);
  }

  const authContext = useMemo(() => ({
    logout: async () => {
      setLoading(true);
      auth().signOut();
    },
    login: async (email: string, password: string) => {
      setLoading(true);
      return auth()
        .signInWithEmailAndPassword(email, password);
    },
    forgotPassword: (email: string) => {
      return auth().sendPasswordResetEmail(email);
    },
    getCurrentUser: () => {
      return auth().currentUser;
    },
    user,
    isLoading,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);