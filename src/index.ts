import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { SRGBColorSpace } from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { createScene } from "./scene";
import {
  browserHasImmersiveArCompatibility,
  displayIntroductionMessage,
  displayUnsupportedBrowserMessage,
} from "./utils/domUtils";

import "./styles.css";

function initializeXRApp() {
  const { devicePixelRatio, innerHeight, innerWidth } = window;
  
  // Create a new WebGL renderer and set the size + pixel ratio.
  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  // Use new colorSpace API (replaces deprecated outputEncoding).
  (renderer as any).outputColorSpace = SRGBColorSpace;
  
  // Enable XR functionality on the renderer.
  renderer.xr.enabled = true;

  // Add it to the DOM.
  document.body.appendChild( renderer.domElement );

  // Get the XR UI container
  const xrUIContainer = document.getElementById("xr-ui-container");

  // Create the AR button element, configure our XR session with DOM Overlay, and append it to the DOM.
  const arButton = ARButton.createButton(
    renderer,
    { 
      requiredFeatures: ["hit-test"],
      optionalFeatures: xrUIContainer ? ["dom-overlay"] : [],
      ...(xrUIContainer && { domOverlay: { root: xrUIContainer } })
    },
  );
  arButton.textContent = "Enter";
  arButton.style.bottom = "auto"; // Override default bottom positioning
  arButton.style.top = "55%";     // Position at 65% from the top (lower down)
  arButton.style.transform = "translateY(-50%)"; // Center vertically
  arButton.style.fontSize = "13px"; // Keep original size
  arButton.style.fontWeight = "normal"; // Keep original weight
  arButton.style.color = "#000"; // Make text black for visibility
  arButton.style.background = "rgba(147, 0, 227, 1)"; // Slightly more visible background
  arButton.style.padding = "12px 6px"; // Keep original padding
  document.body.appendChild(arButton);

  // Pass the renderer to the createScene-function.
  createScene(renderer);

  // Display a welcome message to the user that will persist in AR mode.
  displayIntroductionMessage();
};


async function start() {
  // Check if browser supports WebXR with "immersive-ar".
  const immersiveArSupported = await browserHasImmersiveArCompatibility();
  
  // Initialize app if supported.
  immersiveArSupported ?
    initializeXRApp() : 
    displayUnsupportedBrowserMessage();
};

start();
