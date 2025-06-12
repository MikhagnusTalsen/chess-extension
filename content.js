function waitForSelector(selector) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPGN") {
        (async () => {
            try {
                const shareBtn = await waitForSelector("button.share.live-game-buttons-button");
                shareBtn.click();

                await waitForSelector("#tab-pgn");
                document.querySelector("#tab-pgn").click();

                const pgnBox = await waitForSelector(".share-menu-tab-pgn-textarea");
                const pgn = pgnBox?.value;

                if (pgn) {
                    console.log("PGN successfully retrieved:", pgn);
                    sendResponse({ pgn });
                } else {
                    console.warn("PGN was empty or not found.");
                    sendResponse({ pgn: null });
                }
            } catch (e) {
                console.error("Error while getting PGN:", e);
                sendResponse({ pgn: null });
            }
        })();
        return true;
    }
});




//ver-1
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "getPGN") {
//         (async function () {
//             try {
//                 document.querySelector("button.share.live-game-buttons-button").click();

//                 function waitForSelector(selector) {
//                     return new Promise((resolve) => {
//                         const el = document.querySelector(selector);
//                         if (el) return resolve(el);

//                         const observer = new MutationObserver(() => {
//                             const el = document.querySelector(selector);
//                             if (el) {
//                                 observer.disconnect();
//                                 resolve(el);
//                             }
//                         });

//                         observer.observe(document.body, {
//                             childList: true,
//                             subtree: true
//                         });
//                     });
//                 }

//                 await waitForSelector("#tab-pgn");
//                 document.querySelector("#tab-pgn").click();

//                 const pgnBox = await waitForSelector(".share-menu-tab-pgn-textarea");
//                 const pgn = pgnBox?.value;

//                 if (pgn) {
//                     console.log("PGN successfully retrieved:", pgn);
//                     sendResponse({ pgn });
//                 } else {
//                     console.warn("PGN was empty or not found.");
//                     sendResponse({ pgn: null });
//                 }
//             } catch (e) {
//                 console.error("Error while getting PGN:", e);
//                 sendResponse({ pgn: null });
//             }
//         })();

//         return true; // Required to keep sendResponse alive
//     }
// });


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "getPGN") {

//         document.querySelector("button.share.live-game-buttons-button").click();

//         function waitForPGNTab() {
//             return new Promise((resolve, reject) => {
//                 let pgnBox = document.querySelector(".share-menu-tab-pgn-textarea");
//                 if (pgnBox && pgnBox.value) {
//                     console.log("PGN already available:", pgnBox.value);
//                     return resolve(pgnBox.value);
//                 }
//                 const observer = new MutationObserver(() => {
//                     const pgnTab = document.querySelector("#tab-pgn");
//                     if (pgnTab) {
//                         observer.disconnect();
//                         console.log("PGN tab appeared!");
//                         pgnTab.click();
//                         resolve();
//                     }
//                 });
//                 observer.observe(document.body, {
//                     childList: true,
//                     subtree: true
//                 });
//             });
//         }

//         function waitForPGN() {
//             return new Promise((resolve, reject) => {
//                 const observer = new MutationObserver(() => {
//                     let pgnBox = document.querySelector(".share-menu-tab-pgn-textarea");
//                     if (pgnBox) {
//                         observer.disconnect();
//                         console.log("PGN element added!");
//                         resolve(pgnBox.value);
//                     }
//                 });
//                 observer.observe(document.body, {
//                     childList: true,
//                     subtree: true
//                 });
//             });
//         }

//         waitForPGNTab()
//             .then(() => waitForPGN())
//             .then((pgn) => {
//                 console.log("Resolved PGN is:", pgn);
//                 if (pgn) {
//                     sendResponse({ pgn });
//                 } else {
//                     console.warn("PGN was undefined or empty.");
//                     sendResponse({ pgn: null });
//                 }
//             });

//         return true;
//     }
// });
