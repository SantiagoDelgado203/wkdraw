import { useEffect, useRef, useState } from "react";
// import { QueueProvider } from "./contexts/KanjiQueueContext";
import "./App.css";
import Guest from "./components/Guest";
import Auth from "./components/Auth";

const wk_api_path = "https://api.wanikani.com/v2/"

function prepareWanikaniRequest(apiEndpointPath, apiToken){
  if (!apiEndpointPath || !apiToken) throw new Error("Couold not prepare API Request.")
  const requestHeaders = new Headers({
    "Wanikani-Revision": "20170710",
    Authorization: "Bearer " + apiToken,
  });
  return new Request(
    apiEndpointPath,
    {
      method: "GET",
      headers: requestHeaders,
    }
  );
}

function App() {
  const [api, setAPI] = useState(localStorage.getItem("wk_api") || "");
  const [loading, setLoading] = useState(true);
  const formError = useRef('');
  const user = useRef([]);
  
  /**
   * Effect dependent on changes on api, should only trigger when form is submitted.
   * This will attempt to request user information and check if accoutn is active,
   * it will go back to Guest mode if there is any error.
   * User's API Token will be stored in LocalStorage to keep session active until User willingly logs out. 
   */
  useEffect(() => {
    // console.log("During Mounting App.js!")
    // console.log("Current API: ", api)
    // console.log("Current Loading state: ", loading ? "Loading" : "Not loading")
    // console.log("Current user: ", user.current)

    const verifyUser = async () => {
      //Request API User Endpoint
      try {
        if(!api) return
        const apiEndpoint = prepareWanikaniRequest( wk_api_path + "user", api);
        const response = await fetch(apiEndpoint)
        if (!response.ok)
          throw new Error(
            "Invalid Token. Please verify you are using a valid Wanikani v2 API Token."
          );
        const responseBody = await response.json()
        if (!responseBody.data.subscription.active)
          throw new Error(
            "Inactive account. You need an active Wanikani account to use this."
          );
        // console.log("User verified!")
        localStorage.setItem("wk_api", api);
        user.current = responseBody.data
        formError.current = "";
        return true;
      } catch (error) {
        formError.current = error.message;
        localStorage.removeItem("wk_api");
        setAPI(""); // Reset the API token state
      }
    }
    verifyUser()
    .catch((error) => console.log(error))
    .finally(() => setLoading(false))

  }, [api] );
  

  return (
    <>
      {loading ? (
        <>
        {console.log("Loading...")}
        </>
      ) : api && user ? (
          <Auth setAPI={setAPI} user={user.current} />
      ) : (
          <Guest setAPI={setAPI} setLoading={setLoading} formError={formError.current} />
      )}
    </>
  );
  
}

export default App;
