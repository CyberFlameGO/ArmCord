import electron from "electron";
import {getConfig} from "../utils";

const unstrictCSP = () => {
    console.log("Setting up CSP unstricter...");

    electron.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders, resourceType}, done) => {
        if (!responseHeaders) return done({});

        if (resourceType === "mainFrame") {
            delete responseHeaders["content-security-policy"];
        } else if (resourceType === "stylesheet") {
            // Fix hosts that don't properly set the css content type, such as
            // raw.githubusercontent.com
            responseHeaders["content-type"] = ["text/css"];
        }

        done({responseHeaders});
    });
};

electron.app.whenReady().then(async () => {
    if (await getConfig("armcordCSP")) {
        unstrictCSP();
    } else {
        console.log("ArmCord CSP is disabled. The CSP should be managed by a third-party plugin(s).");
    }
});
