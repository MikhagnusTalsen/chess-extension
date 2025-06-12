document.addEventListener("DOMContentLoaded", () => {
    const para = document.getElementById("para");
    const button = document.getElementById("analyze-button");

    async function switchToWintrchess(PGN) {
        alert(PGN);
        if (!PGN || !PGN.trim()) {
            para.textContent = "Error: No PGN found.";
            return;
        }

        console.log("Opening wintrchess.com/analysis...");
        chrome.tabs.create({
            url: "https://wintrchess.com/analysis",
            active: false
        }, tab => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === "complete") {
                // alert(tabId);
                // alert(tab.id);
                // alert(info.status);
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.tabs.sendMessage(tab.id, {
                    action: "pastePGN",
                    pgn: PGN
                })
                .then(response => {
                    console.log("content script responded: ", response);
                })
                .catch(err => {
                    para.textContent = "Error sending PGN to wintrchess.com.";
                    console.error("SendMessage Error:", err);
                });
                }
            });
        });
    }

    async function onClick() {
        para.textContent = "Getting PGN...";
        try {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (!tab?.id) {
                para.textContent = "Error: No active tab found.";
                return;
            }
            const response = await chrome.tabs.sendMessage(tab.id, { action: "getPGN" });
            if (!response?.pgn) {
                para.textContent = "Error: PGN not found.";
                return;
            }
            para.textContent = "PGN received! Analyzing...";
            await switchToWintrchess(response.pgn);
        } catch (err) {
            para.textContent = "Error: " + (err.message || "Failed to get PGN.");
            console.error("Popup Error:", err);
        }
    }

    button.addEventListener('click', onClick);
});


//ver-1
// document.addEventListener("DOMContentLoaded", () => {
//     function switchToWintrchess(pgn) {
//         console.log("switching to wintrchess");
//         console.log(pgn);
//         chrome.tabs.create({
//             url: "https://wintrchess.com/analysis"
//         }, function (tab) {
//             chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
//                 if (tabId === tab.id && info.status === "complete") {
//                     alert("tab ids matched and info status completed.");

//                     chrome.tabs.onUpdated.removeListener(listener);
//                     chrome.tabs.sendMessage(tab.id, {
//                         action: "pastePGN",
//                         pgn: pgn
//                     })
//                 }
//             })
//         })
//     }
//     function responseCallback(response) {
//         if (!response || !response.pgn) {
//             console.error("PGN response invalid:", response);
//             document.querySelector("#para").textContent = "Failed to get PGN.";
//             return;
//         }

//         document.querySelector("#para").textContent = "PGN received successfully !";
//         console.log("inside the reponse callback function");
//         console.log(response.pgn); //look at this log it is priniting fine in the console
//         switchToWintrchess(response.pgn);
//     }

//     document.getElementById("analyze-button").addEventListener('click',
//         async () => {
//             let queryOptions = { active: true, lastFocusedWindow: true };
//             let [tab] = await chrome.tabs.query(queryOptions);
//             chrome.tabs.sendMessage(tab.id, {
//                 action: "getPGN"
//             }, responseCallback)
//         })
// })