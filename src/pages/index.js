import React from "react";
import Image from 'next/image'

import "@fortawesome/fontawesome-free/css/all.min.css";

import Navbar from '../components/Navbar.js'
import FooterSmall from '../components/FooterSmall.js'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center"
            style={{
              minHeight: "75vh"
            }}>
          <div className="absolute top-0 w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url("/images/header.jpeg")`
              }}>
            <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-black"></span>
          </div>
          <div className="container relative mx-auto">
              <div className="items-center flex flex-wrap">
                <div className="w-full lg:w-7/12 px-4 ml-auto mr-auto text-center">
                  <div className="pr-12">
                    <h1 className="text-white font-semibold text-5xl">
                    The world is full of people too afraid to make the first move
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                    What's stopping you? The risk? We can help with that. We'll send your crush
                    an anonymous letter, and we'll do our best to find out if they like you back!
                    </p>
                  </div>
                </div>

              </div>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-pink-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>

        <section className="pb-20 bg-pink-200 -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-pink-400">
                      <i className="fas fa-heart"></i>
                    </div>
                    <h6 className="text-xl font-semibold">No risk!</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      We keep your information private so you can save the stress of sending <em>that</em> text. When they give us a list of who they like and they put you, we'll tell you immediately!
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-pink-400">
                    <i className="fas fa-heart"></i>
                    </div>
                    <h6 className="text-xl font-semibold">
                      7 chances!
                    </h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      Have multiple crushes in mind and trying to find who likes you? You have seven chances to find which of them likes you back (or who responds the quickest to your requests).
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-pink-400">
                      <i className="fas fa-heart"></i>
                    </div>
                    <h6 className="text-xl font-semibold">
                      End goal?
                    </h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      After you match with your first person, we disable your account from matching with new people. Go on that first date! Post about it with #YourCupid on TikTok and tell us how it goes.
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </section>

        <section className="relative py-20 bg-pink-100">
          <div
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
            style={{ height: "80px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-pink-100 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>

          <div className="container mx-auto px-4">
            <div className="items-center flex flex-wrap ">
              <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                <Image
                  alt="..."
                  className="max-w-full rounded-lg shadow-lg"
                  src="/images/cats.jpg"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </section>


        <section className="pb-4 text-pink-500 bg-pink-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-24">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold">
                  This could be you
                </h2>
                <p className="text-lg leading-relaxed m-4 text-pink-500">
                  (if you made an account)
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative block">
          <div
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
            style={{ height: "80px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-rose-100 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
      </main>
      <FooterSmall />
    </>
  );
}