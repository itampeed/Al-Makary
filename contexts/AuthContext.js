import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth } from '../config/firebase';
import { loginToRevenueCat, logoutFromRevenueCat } from '../services/revenuecat';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  });

  // Load saved auth state on app start
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
        
        // Identify user in RevenueCat
        if (parsedUser.uid) {
            await loginToRevenueCat(parsedUser.uid);
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
      
      if (result.success) {
        // Block login if email not verified
        if (result.user && result.user.emailVerified === false) {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Please verify your email before logging in.' });
          return { success: false, error: 'Please verify your email before logging in.' };
        }
        // Save to storage
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        
        // Identify user in RevenueCat
        if (result.user.uid) {
            await loginToRevenueCat(result.user.uid);
        }

        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const result = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
      
      if (result.success) {
        // Do NOT log the user in until email is verified
        // Show success on caller; stay unauthenticated
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, pendingVerification: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await firebaseAuth.signOut();
      await AsyncStorage.removeItem('user');
      await logoutFromRevenueCat(); // Reset RevenueCat identity
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
