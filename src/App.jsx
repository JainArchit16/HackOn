import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
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
  }

  // Example usage: Assume 'dataUrl' contains your data URL

  useEffect(() => {
    const getCart = async () => {
      let [tab] = await chrome.tabs.query({ active: true });
      const result = await chrome.tabs.sendMessage(tab.id, {
        type: "id",
        id: Date.now().toString(),
      });
      setUrl(result);
      console.log(typeof result, "jkshkjdah");
    };
    getCart();
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {url ? (
        <>
          {console.log(dataURLToBlob(url))}
          {sendImageToServer(url)}
          <div>{url}</div>
        </>
      ) : (
        ""
      )}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
