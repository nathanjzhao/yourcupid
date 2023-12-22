import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase.js"

//api here is an axios instance which has the baseURL set according to the env.

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     async function loadUserFromCookies() {
    //         const token = Cookies.get('token')
    //         if (token) {
    //             console.log("Got a token in the cookies, let's see if it is valid")
    //             api.defaults.headers.Authorization = `Bearer ${token}`
    //             const { data: user } = await api.get('users/me')
    //             if (user) setUser(user);
    //         }
    //         setLoading(false)
    //     }
    //     loadUserFromCookies()
    // }, [])

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        // Logged in?
        if(authUser) {
          if (!authUser.emailVerified) {
            signOut(auth)
            setUser(null);
          } else {
            setUser(authUser);
          }
        } else {
          setUser(null);
        }
      })
  
      return () => {
        // deletes listener so not many running at once
        unsubscribe(); 
      }
    }, []);

    return (
        // CAN'T PASS USER THROUGH PROPS
        <AuthContext.Provider value={{ user, isAuthenticated: user, isLoading: loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [loadScreen, setLoadScreen] = useState(false)
  useEffect(() => {
    // FOR BLOCKING OFF PATHS FROM UNAUTHENTICATED USERS
    // if (isLoading || (!isAuthenticated && window.location.pathname !== '/')){
    if (isLoading) {
      setLoadScreen(false) // regularly false
    } else {
      setLoadScreen(false) 
    }
  }, [])

  if (loadScreen) {
    return (<div>LOADING SCREEN</div>)
  } else {
    return children
  }
};