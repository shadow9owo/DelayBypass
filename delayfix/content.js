browser.runtime.sendMessage("getWindowsUserAgent", (result) => {
    if (result && typeof result === "string") {
        console.log(result);
    } else {
        console.error("Failed to get Windows user agent.");
    }
});
