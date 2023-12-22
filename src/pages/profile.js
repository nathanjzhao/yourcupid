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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_CRUSHES = 7;
  const [crushes, setCrushes] = useState([]);
  const [crushers, setCrushers] = useState([]);

  const [displayName, setDisplayName] = useState('');

  const [crushName, setCrushName] = useState('')
  const [crushEmail, setCrushEmail] = useState('')
  const [matched, setMatched] = useState(null)

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
            setMatched(docSnap.data().matched);
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

  const editCrushes = (crushes, email, newStatus) => {
    return crushes.map(item => {
        var temp = Object.assign({}, item);
        if (temp.email === email) {
            temp.status = newStatus;
        }
        return temp;
    });
}
  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if (!crushName || !re.test(crushEmail)) {
      alert("Make sure you fill both fields correctly!");
      setIsSubmitting(false);
      return;
    }

    if (crushes.length == MAX_CRUSHES) {
      alert("You've submitted 7 of your crushes already. You've had enough!");
      setIsSubmitting(false);
      return;
    }

    if (crushes.some(e => e.email == crushEmail) || crushes.some(e => e.name == crushName)) {
      alert("You've already told us this crush!");
      setIsSubmitting(false);
      return;
    }

    var userName = displayName;
    var userEmail = user.email;

    if (crushEmail == userEmail) {
      alert("You cannot have a crush on yourself (or at least, you already know)!");
      setIsSubmitting(false);
      return;
    }

    if (matched != null) {
      alert("You've already matched. Go off and have fun with them!");
      setIsSubmitting(false);
      return;
    }

    var crushStatus = 0;
    const collectionRef = collection(db, "users");

    // BAD CODE !! 
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
              getDoc(docSnap.ref).then(async crushDoc => {

                const crushData = crushDoc.data();
                const crushCrushes = crushData.crushes;
                
                if (crushCrushes.some(e => e.email == userEmail)) {
                  if (crushData.matched == null) {
                    crushStatus = 2;

                    q = query(collectionRef, where("email", "==", user.email));
                    await getDocs(q).then(innerQueryDoc => {
                      innerQueryDoc.forEach((innerDocSnap) => {
                        updateDoc(innerDocSnap.ref, {
                          matched: crushEmail
                        });
                      })
                    })

                    const updatedCrushCrushes = editCrushes(crushCrushes, userEmail, 2);

                    await updateDoc(crushDoc.ref, {
                      matched: userEmail,
                      crushes: updatedCrushCrushes
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
                resolve();
              })

              updateDoc(docSnap.ref, {
                crushers: arrayUnion({name : displayName, email : userEmail})
              });
            })
          })
        }
      })
    })
    
    promise
      .then(async () => {

        let fetchPromises = [];
        
        const promise = new Promise(async (resolve) => {
          const q = query(collection(db, "users"), where("email", "==", userEmail));
          const querySnap = await getDocs(q);
          const updatePromises = querySnap.docs.map((docSnap) => 
            updateDoc(docSnap.ref, {
              crushes: arrayUnion({name : crushName, email : crushEmail, status : crushStatus})
            })
          );
          await Promise.all(updatePromises);
          resolve();
        });
        
        fetchPromises.push(promise);

        if (crushes.length == MAX_CRUSHES - 1) {
          const crusherPromises = crushers.map(async (crusher) => {
            if (crusher.email != matched) {
              const q = query(collectionRef, where("email", "==", crusher.email));
              const queryDoc = await getDocs(q);
              const docPromises = [];
              for (const crusherDocSnap of queryDoc.docs) {
                const crusherDoc = await getDoc(crusherDocSnap.ref);
                const crusherData = crusherDoc.data();
                if (crusherData.matched == null) {
                  const crusherCrushes = crusherData.crushes;
                  const updatedCrusherCrushes = editCrushes(crusherCrushes, userEmail, 1);
                  const updatePromise = updateDoc(crusherDocSnap.ref, {
                    crushes: updatedCrusherCrushes
                  });
                  docPromises.push(updatePromise);
                }
              }
              return Promise.all(docPromises);
            }
          });
        
          fetchPromises.push(...(await Promise.all(crusherPromises)));
        }


        if (crushStatus == 1) {
          fetchPromises.push(fetch("/api/send-crush", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: crushName, email: crushEmail }),
          }));
        } else if (crushStatus == 2) {
          fetchPromises.push(fetch("/api/send-match", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: crushName, email: crushEmail }),
          }));

          fetchPromises.push(fetch("/api/send-match", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: userName, email: userEmail }),
          }));
        }

        // Wait for all fetch requests to complete
        await Promise.all(fetchPromises);

        setIsSubmitting(false);
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
                    {crushes.length < MAX_CRUSHES ? 
                      `${crushers.length == 0 ? `You have ${MAX_CRUSHES - crushes.length} chances to try and find someone!`
                      : `You have ${MAX_CRUSHES - crushes.length} chances to try and match with them!`}`
                    : "You are out of crushes to send out :("
                    }
                    
                    <br/>
                    <br/>
                    
                    {crushes.length != 0 && "Your crush statuses:"}
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
                        {crushes.length < MAX_CRUSHES ? "Below, you can input your crushes' name and email so we can try to match you!" : "You've used up all of your chances!"}

                        <div className="flex flex-col mt-8">
                          <div className="mb-4 flex items-center">
                            <label htmlFor="input1" className="mb-2 mr-3 whitespace-nowrap">Crush Name:</label>
                            <input type="text" onChange={(e) => setCrushName(e.target.value)} id="input1" className="border w-full px-4 py-2" placeholder="..." />
                          </div>

                          <div className="mb-4 flex items-center">
                            <label htmlFor="input2" className="mb-2 mr-3 whitespace-nowrap">Crush Email:</label>
                            <input type="text" onChange={(e) => setCrushEmail(e.target.value)} id="input2" className="border w-full px-4 py-2" placeholder="randomemail@gmail.com" />
                          </div>

                          <button type="submit" onClick={submit} disabled={isSubmitting} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
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