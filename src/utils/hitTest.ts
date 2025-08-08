import { WebGLRenderer } from "three";

let hitTestSource: XRHitTestSource | null = null;
let hitTestSourceRequested = false;

export function handleXRHitTest(
  renderer: WebGLRenderer,
  frame: XRFrame,
  onHitTestResultReady: (hitPoseMatrix: Float32Array) => void,
  onHitTestResultEmpty: () => void,
) {
  const referenceSpace = renderer.xr.getReferenceSpace();
  const session = renderer.xr.getSession();

  let xrHitPoseMatrix: Float32Array | null | undefined;

  if (session && !hitTestSourceRequested) {
    const xrSession = session; // local stable ref
    xrSession.requestReferenceSpace("viewer").then((viewerRefSpace) => {
      (xrSession as any).requestHitTestSource({ space: viewerRefSpace }).then((source: XRHitTestSource) => {
        hitTestSource = source;
      });
    });
    hitTestSourceRequested = true;
  }

  if (hitTestSource !== null) {
    const hitTestResults = frame.getHitTestResults(hitTestSource);

    if (hitTestResults.length) {
      const hit = hitTestResults[0];

      if (hit && hit !== null && referenceSpace) {
        const xrHitPose = hit.getPose(referenceSpace);

        if (xrHitPose) {
          xrHitPoseMatrix = xrHitPose.transform.matrix;
          onHitTestResultReady(xrHitPoseMatrix);
        }
      }
    } else {
      onHitTestResultEmpty();
    }
  }
};