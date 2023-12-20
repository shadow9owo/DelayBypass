var isonytb = false;

function checkIfYouTubeTabIsOpen(callback) {
    browser.tabs.query({ url: "*://*/*" }, (tabs) => {
        const isYouTubeTabOpen = tabs.some(tab => tab.url.includes("youtube"));
        callback(isYouTubeTabOpen);
    });
}

function changeUserAgent(newUserAgent) {
    browser.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            for (const header of details.requestHeaders) {
                if (header.name.toLowerCase() === "user-agent") {
                    header.value = newUserAgent;
                }
            }
            return { requestHeaders: details.requestHeaders };
        },
        { urls: ["<all_urls>"] },
        ["blocking", "requestHeaders"]
    );

    console.log("User agent changed to:", newUserAgent);
}

function fetchUserAgent(callback) {
    const useragentSourceUrl = "https://raw.githubusercontent.com/shadow9owo/DelayBypass/main/delayfix/useragent.txt";

    fetch(useragentSourceUrl)
        .then(response => response.text())
        .then(userAgent => {
            callback(userAgent.trim());
        })
        .catch(error => {
            console.error("Error fetching the user agent. Using backup user agent.", error);
            callback("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        });
}

fetchUserAgent((userAgent) => {
    changeUserAgent(userAgent);
    console.log("User agent changed to:", userAgent);
});

setInterval(() => {
    checkIfYouTubeTabIsOpen((result) => {
        console.log("in interval");
        if (result) {
            if (!isonytb) {
                isonytb = true;
                console.log("YouTube tab is open");
            }
        } else {
            if (isonytb) {
                isonytb = false;
                console.log("User agent changed back to the original");
            }
        }
    });
}, 2000);
