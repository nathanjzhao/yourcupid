import React from 'react'
import { AuthProvider, ProtectRoute } from '../contexts/auth'
import Head from 'next/head';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

    return (
      <>
        <div>
          <Head>
            <title>YourCupid</title>
            <link rel="YourCupid" href="/images/logo-image.png" />
          </Head>
        </div>

        <AuthProvider>
          <ProtectRoute>
              <Component {...pageProps} />
          </ProtectRoute>
        </AuthProvider>
      </>
    )
}


export default MyApp