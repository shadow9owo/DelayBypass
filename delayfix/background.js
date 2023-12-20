const chromeUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
var isonytb = false;

function checkIfYouTubeTabIsOpen(callback) {
    browser.tabs.query({ url: "*://*/*" }, (tabs) => {
        const isYouTubeTabOpen = tabs.some(tab => tab.url.includes("youtube"));
        callback(isYouTubeTabOpen);
    });
}


function changeUserAgent() {
    function setUserAgent(details) {
        const newUserAgent = `Mozilla/5.0 (${details.platform}; ${details.geckoVersion}) ${details.firefoxVersion}`;

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

    const platform = navigator.platform || 'undefined';

    browser.runtime.getBrowserInfo().then((info) => {
        console.log("Browser Info:", info);

        const userAgentDetails = {
            platform: platform,
            geckoVersion: `Gecko/${info.version || '0.0.0'}`,
            firefoxVersion: `Firefox/${info.version || '0.0.0'}`,
        };

        console.log("User Agent Details:", userAgentDetails);
        setUserAgent(userAgentDetails);
    });
}

setInterval(() => {
    checkIfYouTubeTabIsOpen((result) => {
		console.log("in interval");
        if (result) {
            if (!isonytb) {
                isonytb = true;
				
                browser.webRequest.onBeforeSendHeaders.addListener(
                    (details) => {
                        for (const header of details.requestHeaders) {
                            if (header.name.toLowerCase() === "user-agent") {
                                header.value = chromeUserAgent;
                            }
                        }
                        return { requestHeaders: details.requestHeaders };
                    },
                    { urls: ["<all_urls>"] },
                    ["blocking", "requestHeaders"]
                );
                console.log("useragent changed to chrome");
            }
        } else {
            if (isonytb) {
                isonytb = false;
                changeUserAgent();
                console.log("useragent changed back to firefox");
            }
        }
    });
}, 2000);
