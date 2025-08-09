import { createMarker } from "./objects/marker";
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
import { Raycaster, Vector3 } from "three";
import { delay } from "framer-motion";


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
  let ghastModel: Object3D | null = null;
  let fireballModel: Object3D | null = null;
  const pursuingModels: Object3D[] = [];
  interface Projectile { mesh: Object3D; velocity: Vector3; ttl: number; }
  const projectiles: Projectile[] = [];
  const tmpDir = new Vector3();
  const tmpCamPos = new Vector3();

  const raycaster = new Raycaster();
  const cameraDirection = new Vector3();
  let gazeTimer = 3;

  const BASE_SPEED = 0.1;
  
  const FIREBALL_INTERVAL = 4;
  const FIREBALL_SPEED = 1.5;
  const FIREBALL_TTL = 5;
  let prevFireballTime = 0;

  let lastTs: number | null = null;
  gltfLoader.load("../assets/models/ghast.glb", (gltf: GLTF) => {
    ghastModel = gltf.scene.children[0];
    ghastModel.scale.set(0.03, 0.03, 0.03);
  }, undefined, (e) => console.warn('Failed to load ghast.glb', e));

  gltfLoader.load("../assets/models/fireball.glb", (gltf: GLTF) => {
    fireballModel = gltf.scene.children[0];
    fireballModel.scale.set(0.05, 0.05, 0.05);
  }, undefined, (e) => console.warn('Failed to load fireball.glb', e));

  onSelect

  const marker = createMarker();
  marker.position.set(0, 0, -1)
  camera.add(marker)
  scene.add(camera);
  

  const renderLoop = (timestamp: number, frame?: XRFrame) => {   
    const dt = lastTs == null ? 0 : (timestamp - lastTs) / 1000;
    lastTs = timestamp;
    if (renderer.xr.isPresenting) {
        camera.getWorldPosition(tmpCamPos);
        pursuingModels.forEach(obj => {
          tmpDir.copy(tmpCamPos).sub(obj.position);
          const dist = tmpDir.length();
          if (dist > 0.01) {
            tmpDir.normalize();
            const step = BASE_SPEED * dt;
            if (step < dist) {
              obj.position.addScaledVector(tmpDir, step);
            } else {
              obj.position.copy(tmpCamPos);
            }
          }
          obj.lookAt(tmpCamPos);
        });

          camera.getWorldDirection(cameraDirection);
          raycaster.set(camera.position, cameraDirection);
          const collision = raycaster.intersectObjects(pursuingModels, true);
          if (collision.length > 0) {
            const hitGhast = collision[0].object;
            if (gazeTimer > 0) {
              gazeTimer -= dt;
              if (gazeTimer <= 0) {
                console.log("BLEHHHHH!");
                gazeTimer = 3;
                const ghastIndex = pursuingModels.findIndex(obj => obj === hitGhast || obj === hitGhast.parent);
                if (ghastIndex !== -1) {
                  scene.remove(pursuingModels[ghastIndex]);
                  pursuingModels.splice(ghastIndex, 1);
                }
              }
            }

            const screenPos = getScreenPos(hitGhast, camera, renderer);
            const progressDiv = document.getElementById('gaze-progress');
            const barDiv = document.getElementById('gaze-bar');

            if (progressDiv && barDiv) {
              progressDiv.style.left = `${screenPos.x - 50}px`;
              progressDiv.style.top = `${screenPos.y - 20}px`;
              progressDiv.style.display = 'block';
              barDiv.style.width = `${(gazeTimer / 3) * 100}%`
            }
          } else {
            const progressDiv = document.getElementById('gaze-progress');
            if (progressDiv){
              progressDiv.style.display = 'none';
            }
          }

        prevFireballTime += dt;
        if (prevFireballTime >= FIREBALL_INTERVAL && pursuingModels.length && fireballModel) {
          prevFireballTime = 0;
          pursuingModels.forEach(shooter => {
            if (!fireballModel) return;
            const fb = fireballModel.clone();
            fb.position.copy(shooter.position);
            const dir = new Vector3().copy(tmpCamPos).sub(fb.position).normalize();
            const projectile: Projectile = { mesh: fb, velocity: dir.multiplyScalar(FIREBALL_SPEED), ttl: FIREBALL_TTL };
            scene.add(fb);
            projectiles.push(projectile);
          });
        }

        for (let i = projectiles.length - 1; i >= 0; i--) {
          const p = projectiles[i];
          p.mesh.position.addScaledVector(p.velocity, dt);
          p.ttl -= dt;
          if (p.ttl <= 0 || p.mesh.position.distanceTo(tmpCamPos) < 0.3) {
            scene.remove(p.mesh);
            projectiles.splice(i, 1);
          }
        }
      renderer.render(scene, camera);

    }
  }

  function getScreenPos(obj: Object3D, camera: PerspectiveCamera, renderer: WebGLRenderer){
    const vector = obj.position.clone();
    vector.project(camera);

    const widthHalf = 0.5 * renderer.domElement.width
    const heightHalf = 0.5 * renderer.domElement.height

    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: (vector.y * heightHalf) + heightHalf,
    };
  }

  function onSelect() {
  if (!ghastModel) return;

    camera.getWorldPosition(tmpCamPos);
    const angle = Math.random() * Math.PI * 2;
    const distance = 3 + Math.random() * 1.5;
    const spawnX = tmpCamPos.x + Math.cos(angle) * distance;
    const spawnZ = tmpCamPos.z + Math.sin(angle) * distance;
    const spawnY = tmpCamPos.y;
    const model = ghastModel.clone();
    model.position.set(spawnX, spawnY, spawnZ);
    model.lookAt(tmpCamPos);
    model.visible = true;
    scene.add(model);
    pursuingModels.push(model);
  }

  renderer.setAnimationLoop(renderLoop);
};