import React from "react";
import useScript from "../hooks/useScript";

export default function FooterSmall(props) {
  useScript('https://buttons.github.io/buttons.js');

  return (
    <>
      <footer
        className={
          (props.absolute
            ? "absolute w-full bottom-0 bg-rose-100"
            :  "relative bg-rose-100") + " pb-6"
        }
      >
        <div className="container mx-auto px-4">
          <hr className="mb-6 border-b-1 border-rose-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-grey-300 font-semibold py-1">
                Helped? Star this project on Github!
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                <a className="github-button" href="https://github.com/nathanjiazhao/asd"
                  data-icon="octicon-star" data-size="large" aria-label="Star nathanjiazhao/asd on GitHub"
                >
                  Star
                </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}