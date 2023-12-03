import React, { useState } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';

import Link from "next/link";
import { useAuth } from "contexts/auth";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";

export default function Navbar(props) {
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const {user} = useAuth();

  return (
    <nav
      className={
        (props.transparent
          ? "top-0 absolute z-50 w-full"
          : "relative shadow-lg bg-white shadow-lg") +
        " flex flex-wrap items-center justify-between px-2 py-3 "
      }
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link
            className={
              (props.transparent ? "text-white" : "text-gray-800") +
              " text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            }
            href="/"
          >
            <Image
              alt="..."
              src="/images/logo-image.png"
              width={50}
              height={50}
              />
          </Link>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i
              className={
                (props.transparent ? "text-white" : "text-gray-800") +
                "fas fa-bars"
              }
            ></i>
          </button>
        </div>
        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none" +
            (navbarOpen ? " block rounded shadow-lg" : " hidden")
          }
          id="example-navbar-warning"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">

            { !props.authpages && user ? 
            <Link className="flex items-center" href="/profile">
            <button
              className={
                (props.transparent
                  ? "bg-pink-800 text-white active:bg-pink-900"
                  : "bg-pink-800 text-white active:bg-pink-900") +
                " text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
              }
              type="button"
              style={{ transition: "all .15s ease" }}
            >
              <i className="fa-solid fa-user"></i> Your Profile
            </button>
          </Link>
            : null
            }
            { !props.authpages ? 
              <div>
                {!user ?
                <Link className="flex items-center" href="/login">
                  <button
                    className={
                      (props.transparent
                        ? "bg-white text-gray-800 active:bg-gray-100"
                        : "bg-pink-500 text-white active:bg-pink-600") +
                      " text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                    }
                    type="button"
                    style={{ transition: "all .15s ease" }}
                  >
                    <i className="fas fa-arrow-alt-circle-down"></i> Login
                  </button>
                </Link>
                :
                <Link className="flex items-center" href="/">
                  <button
                    className={
                      (props.transparent
                        ? "bg-white text-gray-800 active:bg-gray-100"
                        : "bg-pink-500 text-white active:bg-pink-600") +
                      " text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                    }
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => {signOut(auth); router.push('/');}}
                  >
                    <i className="fas fa-right-from-bracket"></i> Logout
                  </button> 
                </Link>
                }
              </div>
            
            : null }
          </ul>
        </div>
      </div>
    </nav>
  );
}