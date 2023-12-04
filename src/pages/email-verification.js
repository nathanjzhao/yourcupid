
import React, { useState } from "react"; 

import Navbar from "../components/Navbar.js";
import FooterSmall from "../components/FooterSmall.js";

export default function EmailVerification() {
  return (
    <>
      <Navbar authpages/>

      <section className="pt-20 pb-48">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-24">
              <div className="w-full lg:w-8/12 px-4">
                <h2 className="text-4xl font-semibold">
                  Your verification email has been sent!
                </h2>
                <br/>
                  Return to the homepage and login again once you've verified.
              </div>
            </div>
          </div>
        </section>

      <FooterSmall absolute/>
    </>
  )
}