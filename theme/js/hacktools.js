/**
 * 创建一个控制台面板
 */
try {
    chrome.devtools.panels.create(
        "HackTools",
        "/icons/icon.png",
        "/theme/hacktools-panel.html"
    );
} catch (e) {
}
