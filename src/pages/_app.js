import React from 'react'
import { AuthProvider, ProtectRoute } from '../contexts/auth'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

    return (
      <AuthProvider>
        <ProtectRoute>
            <Component {...pageProps} />
        </ProtectRoute>
      </AuthProvider>
    )
}


export default MyApp