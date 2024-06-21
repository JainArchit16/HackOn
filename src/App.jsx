import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/Logo.png";
import { ScaleLoader } from "react-spinners";

function App() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (url) {
      sendImageToServer(url);
    }
  }, [url]);

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

  async function sendImageToServer(dataURL) {
    try {
      const blob = dataURLToBlob(dataURL);
      const formData = new FormData();

      formData.append("image", blob, "screenshot.png");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const uniqueData = Array.from(new Set(data));
      setPredictions(uniqueData);

      console.log(uniqueData);
      console.log(data, "hello");
      console.log(typeof data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const getScreenshot = async () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { type: "id", id: Date.now().toString() },
      function (response) {
        console.log("Response from background:", response);
        setUrl(response);
      }
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-6">
        <p className="text-xl mb-4">AmazoNext</p>
        <img src={logo} className="h-32 w-32 rounded-full" />
      </div>
      <button onClick={getScreenshot}>Take screenshot</button>
      {url && (
        <div>
          <p className="my-3">Captured Image</p>
          <img src={url} className="h-40 w-64 my-4" />
          {loading ? (
            <ScaleLoader color="#ffffff" />
          ) : (
            <div className="w-full">
              <p className="font-semibold text-lg w-full">Results:</p>
              <ul className="w-full">
                {predictions?.map((result, index) => (
                  <li key={index} className="text-md my-2 w-full">
                    <a
                      href={`https://www.amazon.in/s?k=${result}&ref=nb_sb_noss`}
                      target="_blank"
                    >
                      {`https://www.amazon.in/s?k=${result}&ref=nb_sb_noss`}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
