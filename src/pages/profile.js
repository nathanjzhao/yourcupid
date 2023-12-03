import React, { useState, useEffect }  from "react";
import { useRouter } from 'next/router'

import Navbar from "components/Navbar.js";
import FooterSmall from "components/FooterSmall.js";
import { useAuth } from "contexts/auth";
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, arrayUnion, query, where, getCountFromServer } from "firebase/firestore";
import { db, auth } from "../firebase.js"
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {

  const router = useRouter();

  const {user, setLoading} = useAuth();

  const MAX_CRUSHES = 7;
  const [crushes, setCrushes] = useState([])
  const [crushers, setCrushers] = useState([])

  const [displayName, setDisplayName] = useState('');

  const [crushName, setCrushName] = useState('')
  const [crushEmail, setCrushEmail] = useState('')

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
  }

  // Because context updates too slow!
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Logged in?
      if (user) {
        setDisplayName(user.displayName);

        const q = query(collection(db, "users"), where("email", "==", user.email))
        getDocs(q).then(querySnap => {
          querySnap.forEach((docSnap) => {
            setCrushes(docSnap.data().crushes);
            setCrushers(docSnap.data().crushers);
          })
        })
      } else {
        router.push('/');
      }

      return () => {
        // deletes listener so not many running at once
        unsubscribe(); 
      }
    })
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if (!crushName || !re.test(crushEmail)) {
      alert("Make sure you fill both fields correctly!");
      return;
    }

    if (crushes.length == MAX_CRUSHES) {
      alert("You've submitted 7 of your crushes already. You've had enough!");
      return;
    }

    if (crushes.some(e => e.email == crushEmail) || crushes.some(e => e.name == crushName)) {
      alert("You've already told us this crush!");
      return;
    }

    var userName = displayName;
    var userEmail = user.email;

    var crushStatus = 0;
    const collectionRef = collection(db, "users");
    var q = query(collectionRef, where("email", "==", crushEmail));

    const promise = new Promise ((resolve) => {
      getCountFromServer(q).then((querySnap) => {
        if (querySnap.data().count == 0) {
            addDoc(collectionRef, {
                email: crushEmail,
                crushes: [],
                crushers: [{name : displayName, email : userEmail}],
                matched: null
            })
            resolve();
        } else {
          q = query(collectionRef, where("email", "==", crushEmail));
          getDocs(q).then(queryDoc => {
            queryDoc.forEach((docSnap) => {
              updateDoc(docSnap.ref, {
                crushers: arrayUnion({name : displayName, email : userEmail})
              });

              getDoc(docSnap.ref).then(async crushDoc => {

                const crushData = crushDoc.data();
                const crushCrushes = crushData.crushes;
                
                if (crushCrushes.some(e => e.email == userEmail)) {
                  if (crushData.matched == null) {
                    crushStatus = 2;

                    updateDoc(docSnap.ref, {
                      matched: crushEmail
                    });

                    updateDoc(crushDoc.ref, {
                      matched: userEmail
                    });
                  } else {
                    crushStatus = 4;
                  }
                } else {

                  if (crushCrushes.length == MAX_CRUSHES) {
                    crushStatus = 1;
                  }
                  if (crushData.matched != null) {
                    crushStatus = 3;
                  }
                }

                console.log(crushes);
                if (crushes.length == MAX_CRUSHES - 1) {
                  await new Promise ((resolve) => {
                    resolve();
                  })
                }
                await new Promise(r => setTimeout(r, 10000));

                resolve();
              })
            })
          })
        }
      })
    })

    
    promise
      .then(async () => {
        
        q = query(collection(db, "users"), where("email", "==", userEmail))
        getDocs(q).then(querySnap => {
          querySnap.forEach((docSnap) => {
            updateDoc(docSnap.ref, {
              crushes: arrayUnion({name : crushName, email : crushEmail, status : crushStatus})
            });
          })
        })

        if (crushStatus == 0) {
          // Send invite
          const response = fetch("/api/send-invite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: crushName, email: crushEmail }),
          })
            
        } else if (crushStatus == 2) {
          // Matched!
          const response = fetch("/api/send-match", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: crushName, email: crushEmail }),
          })

          const selfResponse = fetch("/api/send-match", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: userName, email: userEmail }),
          })


        } 
        // Leave the people who don't want you (anymore) alone :(

        await new Promise(r => setTimeout(r, 2000));
        router.reload();

      })

  }

  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')"
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
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
                className="text-pink-100 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-pink-100">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                    {displayName}
                  </h3>
                  <div className="mb-2 text-gray-700 mt-10">
                    You currently have <b>{crushers.length}</b> people crushing on you. {crushers.length == 0 ? ":(" : null}<br/>
                    {crushes.length < 7 ? 
                      `${crushers.length == 0 ? `You have ${MAX_CRUSHES - crushes.length} chances to try and find someone!`
                      : `You have ${MAX_CRUSHES - crushes.length} chances to try and match with them!`}`
                    : "You are out of crushes to send out :("
                    }
                    
                    <br/>
                    <br/>
                    
                    Your crush statuses: 
                        {
                          crushes.map((item, index) => ( // matched, pending, did not match :(
                            <li key={index}><b>{item.name}:</b> {{
                              0: "Pending...",
                              1: "You did not match :(",
                              2: "You matched!",
                              3: "They have another match :(",
                              4: "They liked you but found somebody else. You should've been quicker!"
                            }[item.status] || "ERROR"}
                            </li>
                          ))
                        }
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <div className="mb-4 text-lg leading-relaxed text-gray-800">
                        {crushes.length < 7 ? "Below, you can input your crushes' name and email so we can try to match you!" : "You've used up all of your chances!"}

                        <div className="flex flex-col mt-8">
                          <div className="mb-4 flex items-center">
                            <label htmlFor="input1" className="mb-2 mr-3 whitespace-nowrap">Crush Name:</label>
                            <input type="text" onChange={(e) => setCrushName(e.target.value)} id="input1" className="border w-full px-4 py-2" placeholder="..." />
                          </div>

                          <div className="mb-4 flex items-center">
                            <label htmlFor="input2" className="mb-2 mr-3 whitespace-nowrap">Crush Email:</label>
                            <input type="text" onChange={(e) => setCrushEmail(e.target.value)} id="input2" className="border w-full px-4 py-2" placeholder="randomemail@gmail.com" />
                          </div>

                          <button type="submit" onClick={submit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      <FooterSmall/>
    </>
  );
}