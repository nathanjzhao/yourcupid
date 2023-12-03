import React, { useState, useEffect } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from 'next/router'

import Navbar from "../components/Navbar.js";
import FooterSmall from "../components/FooterSmall.js";

import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, query, where, getCountFromServer } from "firebase/firestore"; 
import { db, auth } from "../firebase.js"

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = (event) => { 
        event.preventDefault();
      
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            router.push('/');
        })
        .catch((error) => {
            const message = error.message.replace("Firebase: ","");
            const alertDict = {
                "Error (auth/email-already-in-use)." : "Email already in use!",
                "Password should be at least 6 characters (auth/weak-password)." : "Password should be at least 6 characters!",
                "Error (auth/invalid-email)." : "Not a valid email!",
                "Error (auth/invalid-login-credentials)." : "Invalid login credentials."
            }
    
            if (alertDict[message] !== undefined) {
                alert(alertDict[message]);
            } else {
                alert(message);
            }
    
        });
        
    }


    const signInWithGoogle = (event) => {
        event.preventDefault();

        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;

            const collectionRef = collection(db, "users");
            const q = query(collectionRef, where("email", "==", user.email));

            getCountFromServer(q).then((querySnapshot) => {
                if (querySnapshot.data().count == 0) {
                    addDoc(collectionRef, {
                        email: user.email,
                        crushes: [],
                        crushers: [],
                        matched: null
                    })
                }
            })

            router.push('/');
        }).catch((error) => {
            console.log(error)
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // const email = error.customData.email;
            // const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }
    
    return (
        <>
        <Navbar authpages />
        <main>
            <section className="absolute w-full h-full">
            <div
                className="absolute top-0 h-full w-full bg-pink-100"
                // style={{
                // backgroundImage: `url("/images/pink_bg.svg")`,
                // height: "100%",
                // backgroundRepeat: "no-repeat"
                // }}
            ></div>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-4/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                    <div className="rounded-t mb-0 px-6 py-6">
                        <div className="text-center mb-3">
                        <h6 className="text-gray-600 text-sm font-bold">
                            Sign in with
                        </h6>
                        </div>
                        <div className="btn-wrapper text-center">
                        <button
                            className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                            type="button"
                            style={{ transition: "all .15s ease" }}
                            onClick={signInWithGoogle}
                        >
                            <Image
                            alt="..."
                            className="w-5 mr-1"
                            src="/images/google.svg"
                            width={50}
                            height={50}
                            />
                            Google
                        </button>
                        </div>
                        <hr className="mt-6 border-b-1 border-gray-400" />
                    </div>
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <div className="text-gray-500 text-center mb-3 font-bold">
                        <small>Or sign in with credentials</small>
                        </div>
                        <form>
                        <div className="relative w-full mb-3">
                            <label
                            className="block uppercase text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                            >
                            Email
                            </label>
                            <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Email"
                            style={{ transition: "all .15s ease" }}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative w-full mb-3">
                            <label
                            className="block uppercase text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                            >
                            Password
                            </label>
                            <input
                            type="password"
                            className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Password"
                            style={{ transition: "all .15s ease" }}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="text-center mt-6">
                            <button
                            className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full"
                            type="button"
                            style={{ transition: "all .15s ease" }}
                            onClick={signIn}
                            >
                            Sign In
                            </button>
                        </div>
                        </form>
                    </div>
                        <div className=" text-gray-900 mb-4">
                            <div className="text-center" >
                                <small>Need to Register? <Link href="/register" className="font-bold hover:text-gray-600">Click here!</Link></small>
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
                </div>
            </div>
            <FooterSmall relative />
            </section>
        </main>
        </>
    );
}