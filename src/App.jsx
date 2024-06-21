import { useState } from "react";
import "./App.css";
import logo from "./assets/Logo.png";
import { ScaleLoader } from "react-spinners";

function App() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  function dataURLToBlob(dataURL) {
    const base64Data = dataURL.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: "image/png" });
  }

  function sendImageToServer(dataURL) {
    try {
      const blob = dataURLToBlob(dataURL);
      const formData = new FormData();

      formData.append("image", blob, "screenshot.png");

      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from server:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const getScreenshot = async () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { type: "id", id: Date.now().toString() },
      function (response) {
        console.log("Response from background:", response);
        setUrl(response);
        // sendResponse(response);
      }
    );
    // setUrl(result);
    console.log(typeof result, "jkshkjdah");
  };
  // getCart();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-6">
        <p className="text-xl mb-4">AmazoNext</p>
        <img src={logo} className="h-32 w-32 rounded-full" />
      </div>
      <button onClick={() => getScreenshot()}>Take screenshot</button>
      {url ? (
        <div>
          {/* {console.log(dataURLToBlob(url))} */}
          {/* {sendImageToServer(url)} */}
          {/* {url} */}
          {/* <img src={url} /> */}
          {/* <div>{dataURLToBlob(url)}</div> */}

          <p className="my-3">Captured Image</p>
          <img src={url} className="h-40 w-64 my-4" />
          {loading && <ScaleLoader color="#ffffff" />}
          {!loading && <p className="font-semibold text-lg"> Results:-</p>}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
