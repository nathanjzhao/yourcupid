/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_MJ_APIKEY_PUBLIC: process.env.REACT_APP_MJ_APIKEY_PUBLIC,
    REACT_APP_MJ_APIKEY_PRIVATE: process.env.REACT_APP_MJ_APIKEY_PRIVATE,
    REACT_APP_SENDER_EMAIL: process.env.REACT_APP_SENDER_EMAIL,
    REACT_APP_SENDER_NAME: process.env.REACT_APP_SENDER_NAME,
  }
}

module.exports = nextConfig
