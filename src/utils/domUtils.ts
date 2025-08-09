/*  
 * Returns true if navigator has xr with 'immersive-ar' capabilities
 * Returns false otherwise.
 */
export async function browserHasImmersiveArCompatibility(): Promise<boolean> {
  if (window.navigator.xr) {
    const isSupported: boolean = await navigator.xr.isSessionSupported(
      "immersive-ar",
    );
    console.info(
      `[DEBUG] ${
        isSupported
          ? "Browser supports immersive-ar"
          : "Browser does not support immersive-ar"
      }`,
    );
    return isSupported;
  }
  return false;
}

/*
 * Create and display message when no XR capabilities are found.
 */
export function displayUnsupportedBrowserMessage(): void {
  const appRoot: HTMLElement | null = document.getElementById("app-root");
  const bigMessage: HTMLParagraphElement = document.createElement("p");

  bigMessage.innerText = "😢 Oh no!";
  if (appRoot) {
    appRoot.appendChild(bigMessage);
  }

  const middleMessage: HTMLParagraphElement = document.createElement("p");
  middleMessage.innerText =
    "Your browser does not seem to support augmented reality with WebXR. 😔";

  if (appRoot) {
    appRoot.appendChild(middleMessage);
  }

  const helpMessage: HTMLParagraphElement = document.createElement("p");

  helpMessage.innerText =
    "Wait! Try opening the page using Chrome on Android or XRViewer (Appstore) on IOS 😎";

  if (appRoot) {
    appRoot.appendChild(helpMessage);
  }
}

export function displayIntroductionMessage() {
  const appRoot: HTMLElement | null = document.getElementById("app-root");
  const xrUIContainer: HTMLElement | null = document.getElementById("xr-ui-container");

  let username = localStorage.getItem("ar_username") || "";
  if (!username) {
    username = prompt("🛑 Wait builder...What's your name:", "") || "Builder";
    localStorage.setItem("ar_username", username);
  }


  const createXRDomElements = () => {
    const xrBigMessage = document.createElement("h1");
    xrBigMessage.innerText = `Welcome, ${username}! ⛏️`;
    xrBigMessage.style.color = "white";
    xrBigMessage.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.7)";
    xrBigMessage.style.margin = "0 auto";
    xrBigMessage.style.fontSize = "24px";
    xrBigMessage.style.fontFamily = 'Open Sans, Montserrat, Arial, sans-serif';
      
    const xrMiddleMessage = document.createElement("p");
    xrMiddleMessage.innerText = "You are about to step into the Nether World";
    xrMiddleMessage.style.color = "white";
    xrMiddleMessage.style.textShadow = "1px 1px 3px rgba(0, 0, 0, 1)";
    xrMiddleMessage.style.margin = "1rem auto";
    xrMiddleMessage.style.fontFamily = 'Open Sans, Montserrat, Arial, sans-serif';

    const xrPortalImg = document.createElement("img");
    xrPortalImg.src = "assets/images/nether_portal.png";
    xrPortalImg.alt = "Nether Portal";
    xrPortalImg.style.width = "120px";
    xrPortalImg.style.height = "120px";
    xrPortalImg.style.margin = "1rem auto";
    xrPortalImg.style.display = "block";
    xrPortalImg.style.borderRadius = "8px";
    xrPortalImg.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 1)";

    const xrHelpMessage = document.createElement("p");
    xrHelpMessage.innerText = "Caution: Stay alert of your surroundings! ⚠️";
    xrHelpMessage.style.fontSize = "16px";
    xrHelpMessage.style.fontWeight = "bold";
    xrHelpMessage.style.padding = "10px";
    xrHelpMessage.style.opacity = "0.8";
    xrHelpMessage.style.color = "white";
    xrHelpMessage.style.textShadow = "1px 1px 3px rgba(0, 0, 0, 1)";
    xrHelpMessage.style.margin = "0 auto";
    xrHelpMessage.style.fontFamily = 'Open Sans, Montserrat, Arial, sans-serif';

    return { xrBigMessage, xrMiddleMessage, xrPortalImg, xrHelpMessage };
  };


  if (appRoot) {
    appRoot.innerHTML = '';
    appRoot.style.display = 'flex';
    appRoot.style.flexDirection = 'column';
    appRoot.style.paddingTop = '12rem';
    appRoot.style.width = '100%';
    appRoot.style.height = '100vh';

    const bigMessage = document.createElement("h1");
    bigMessage.innerText = `Welcome, ${username}! ⛏️`;
    bigMessage.style.fontSize = "36px";
    bigMessage.style.color = "#999";
    bigMessage.style.margin = "0";
    bigMessage.style.marginLeft = "-40px";
    bigMessage.style.fontFamily = 'Open Sans, Montserrat, Arial, sans-serif';

    const middleMessage = document.createElement("p");
    middleMessage.innerText = "You are about to step into the Nether World";
    middleMessage.style.fontSize = "16px";
    middleMessage.style.color = "#999";
    middleMessage.style.margin = "1rem 0";
    middleMessage.style.marginLeft = "-40px";
    middleMessage.style.fontFamily = 'Open Sans, Montserrat, Arial, sans-serif';

    appRoot.appendChild(bigMessage);
    appRoot.appendChild(middleMessage);
  }

  if (xrUIContainer) {
    xrUIContainer.innerHTML = '';
  }

  return () => {
    if (appRoot) {
      appRoot.innerHTML = '';
    }
    if (xrUIContainer) {
      xrUIContainer.innerHTML = '';
    }
  };
}

export default {
  browserHasImmersiveArCompatibility,
  displayIntroductionMessage,
  displayUnsupportedBrowserMessage,
};
