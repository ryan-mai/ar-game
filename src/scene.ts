import { createPlaneMarker } from "./objects/PlaneMarker";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { handleXRHitTest } from "./utils/hitTest";

import {
  AmbientLight,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  Texture,
  MeshStandardMaterial
} from "three";


export function createScene(renderer: WebGLRenderer) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.02,
    20,
  )

  const ambientLight = new AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const dirLight = new DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 5, 2);
  scene.add(dirLight);

  const gltfLoader = new GLTFLoader();
  let spiderModel: Object3D;
  gltfLoader.load("../assets/models/zombie.glb", (gltf: GLTF) => {
      spiderModel = gltf.scene.children[0];
      spiderModel.scale.set(0.05, 0.05, 0.05);
  });

  const planeMarker = createPlaneMarker();
  scene.add(planeMarker);

  const renderLoop = (timestamp: number, frame?: XRFrame) => {   
    if (renderer.xr.isPresenting) {

      if (frame) {
        handleXRHitTest(renderer, frame, (hitPoseTransformed: Float32Array) => {
          if (hitPoseTransformed) {
            planeMarker.visible = true;
            planeMarker.matrix.fromArray(hitPoseTransformed);
          }
        }, () => {
          planeMarker.visible = false;
        })
      }
      renderer.render(scene, camera);
    }
  }

  const controller = renderer.xr.getController(0);
scene.add(controller);

controller.addEventListener("select", onSelect);

  function onSelect() {
    if (planeMarker.visible) {
        const model = spiderModel.clone();

        model.position.setFromMatrixPosition(planeMarker.matrix);

        // Rotate the model randomly to give a bit of variation to the scene.
        model.rotation.y = Math.random() * (Math.PI * 2);
        model.visible = true;

        scene.add(model);
    }
  }

  renderer.setAnimationLoop(renderLoop);
};