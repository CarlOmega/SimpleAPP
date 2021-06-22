import React, { useContext, useEffect, useState, useMemo } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UserAPI } from '@utils/API';

export const AuthContext = React.createContext<any>({});

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [claims, setClaims] = useState<any>(null)
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged);
    const tokenSubscriber = auth().onIdTokenChanged(onIdTokenChanged);
    return () => {
      authSubscriber();
      tokenSubscriber();
    };
  }, []);

  const onAuthStateChanged: FirebaseAuthTypes.AuthListenerCallback = async (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    await reloadClaims();
    if (user)
      console.log(await auth().currentUser?.getIdToken());
    if (isLoading) setLoading(false);
  }

  const onIdTokenChanged: FirebaseAuthTypes.AuthListenerCallback = async (user: FirebaseAuthTypes.User | null) => {
    try {
      const result = await auth().currentUser?.getIdTokenResult();
      if (result)
        setClaims(result.claims);
      else throw new Error("Result empty");
    } catch (error) {
      console.log(error.message);
      setClaims(null);
    }
  }

  const reloadClaims = async () => {
    try {
      const result = await auth().currentUser?.getIdTokenResult(true);
      if (!result) throw new Error("Result empty");
    } catch (error) {
      console.log(error.message);
    }
  }

  const authContext = useMemo(() => ({
    logout: async () => {
      setLoading(true);
      try {
        await auth().signOut();
      } finally {
        setLoading(false);
      }
    },
    login: async (email: string, password: string) => {
      setLoading(true);
      try {
        return await auth().signInWithEmailAndPassword(email, password);
      } finally {
        setLoading(false);
      }
    },
    forgotPassword: (email: string) => {
      return auth().sendPasswordResetEmail(email);
    },
    getCurrentUser: () => {
      return auth().currentUser;
    },
    createAccount: async (user: User, password: string) => {
      setLoading(true);
      try {
        await auth().createUserWithEmailAndPassword(user.email, password);
        const res = await UserAPI.create(user);
      } catch (error) {
        await auth().currentUser?.delete();
        await auth().signOut();
        throw new Error("Failed to create account");
      } finally {
        await reloadClaims();
        setLoading(false);
      }
    },
    claims,
    user,
    isLoading,
  }), [user, isLoading, claims]);

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);