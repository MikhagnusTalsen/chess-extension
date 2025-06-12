console.log("hello");
alert("hello");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    alert("msg received");
    console.log("yay inside !")
    sendResponse("Message received by content script");
    if (message.action === "pastePGN") {
        (async () => {
            try {
                console.log("msg.action===pastePGN");
                alert("Paste PGN message received.");

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

                let dropdown = await waitForSelector(".Q25xPvRiw5QyQNKxbAYp");
                dropdown.value = "PGN";
                dropdown.dispatchEvent(new Event("change"));

                let pgnArea = await waitForSelector(".F4_zJ5lO9K5VVnbRoZC1");
                pgnArea.value = message.pgn;
                pgnArea.dispatchEvent(new Event("input"));

                let analyzeButton = await waitForSelector(".rHBNQrpvd7mwKp3HqjVQ.rXk_dTAAN7SfhkEPu9mU");
                analyzeButton.click();

                sendResponse("PGN pasted and analyze button triggered.");
            } catch (err) {
                console.error("Error in wintrchess_script:", err);
                sendResponse("Error: " + (err.message || "Failed to paste PGN."));
            }
        })();
        return true;
    }
});


//ver-1
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // document.addEventListener("DOMContentLoaded", () => {
//     //     document.querySelector(".rHBNQrpvd7mwKp3HqjVQ.rXk_dTAAN7SfhkEPu9mU").click();
//     // })
//     alert("message received: ", message);
//     if (message.action === "pastePGN") {
//         (async function () {
//             console.log("inside the async function");
//             function waitForSelector(selector) {
//                 return new Promise((resolve) => {
//                     const element = document.querySelector(selector);
//                     if (element) {
//                         return resolve(element);
//                     }
//                     let observer = new MutationObserver(() => {
//                         const element = document.querySelector(selector);
//                         observer.disconnect();
//                         resolve(element);
//                     })
//                     observer.observe(document.body, {
//                         childList: true,
//                         subtree: true
//                     })
//                 });
//             }

//             let dropdown = await waitForSelector(".Q25xPvRiw5QyQNKxbAYp");
//             dropdown.value = "PGN";
//             dropdown.dispatchEvent(new Event("change"));

//             let pgnArea = await waitForSelector(".F4_zJ5lO9K5VVnbRoZC1");
//             pgnArea.value = message.pgn;
//             pgnArea.dispatchEvent(new Event("input"));

//             let analyzeButton = await waitForSelector(".rHBNQrpvd7mwKp3HqjVQ.rXk_dTAAN7SfhkEPu9mU");
//             analyzeButton.click();

//             sendResponse("PGN pasted and analyze button triggered.");
//         })();

//         return true;

//     }
// })

