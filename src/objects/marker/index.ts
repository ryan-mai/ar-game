import { Mesh, MeshBasicMaterial, RingGeometry } from "three";

/*
 *  Creates a simple circular marker mesh to overlay on scanned planes.
 */
export function createPlaneMarker() {
  const planeMarkerMaterial = new MeshBasicMaterial({ color: 0xffffff });
  
  const planeMarkerGeometry = new RingGeometry(0.07, 0.08, 32).rotateX(
    -Math.PI / 2,
  );

  const planeMarker = new Mesh(planeMarkerGeometry, planeMarkerMaterial);

  planeMarker.matrixAutoUpdate = false;

  return planeMarker;
};
