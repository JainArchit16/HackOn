/* eslint-disable no-undef */
console.log("bbbbbitch");
function dataURLToBlob(dataURL) {
  if (!dataURL) {
    // Handle the case where dataURL is undefined
    return null;
  }

  const base64Data = dataURL.split(",")[1];
  const byteCharacters = atob(base64Data);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteArray], { type: "image/png" });
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log("in thereeeeeeee");
  console.log("from background");
  if (data.type === "id") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
      const blob = dataURLToBlob(dataUrl);
      console.log(blob + "hllllll");
      // chrome.storage.local.set({ screenshotUrl: dataUrl }, function () {
      //   chrome.windows.create({
      //     url: dataUrl,
      //     type: "popup",
      //     width: 800,
      //     height: 600,
      //   });
      // });
      sendResponse(dataUrl);
    });

    return true;
  }
});
chrome.action.onClicked.addListener(() => {
  console.log("hellllll bitch");
});
