import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Stats from 'stats-js';
import Car from './world/car';
import { generateTerrain} from './world/terrainHelp.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});
world.broadphase = new CANNON.SAPBroadphase(world);
// cannonDebugger(scene, world.bodies, {color: 0x00ff00})

const cannonDebugger = new CannonDebugger(scene, world, {
  // options...
  color: 0x00ff00,
  scale: 1,
});

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const bodyMaterial = new CANNON.Material();
const groundMaterial = new CANNON.Material();
const bodyGroundContactMaterial = new CANNON.ContactMaterial(
  bodyMaterial,
  groundMaterial,
  {
    friction: 0.1,
    restitution: 0.3,
  }
);
world.addContactMaterial(bodyGroundContactMaterial);

const car = new Car(scene, world, groundMaterial);
car.init();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.set(
  car.car.chassisBody.position.x + 8,
  car.car.chassisBody.position.y + 2,
  car.car.chassisBody.position.z + 6
);
// camera.lookAt(car)
scene.add(camera);
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const spotLight = new THREE.SpotLight(0xffffff, 1, 3, 9, 1, 0);
spotLight.position.set(0, 6, 0);


scene.background = new THREE.Color('orange');
/**
 * Cube Texture Loader
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeEnvironmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/px.png',
  '/textures/environmentMaps/nx.png',
  '/textures/environmentMaps/py.png',
  '/textures/environmentMaps/ny.png',
  '/textures/environmentMaps/pz.png',
  '/textures/environmentMaps/nz.png',
]);

// scene.background = cubeEnvironmentMapTexture
scene.environment = cubeEnvironmentMapTexture;


const heightField = generateTerrain();
console.log(heightField)
world.addBody(heightField);
/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


let color;



/**
 * Floor
 */
const loader = new THREE.TextureLoader();

const fog = new THREE.Fog(0xffa315, 30, 50);
//  scene.fog = fog;

const loadFloor = () => {
  const dracoLoader = new DRACOLoader();
  const gltfLoader = new GLTFLoader();


dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('./car/desertforHeightMap2-2.glb', (gltf) => {
  const floorMap = gltf.scene;
  floorMap.position.y = -3;
  console.log('flooooooor', floorMap)
  scene.add(floorMap);
});
console.log('flooooooor', scene.children[3])
}

loadFloor()
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timeStep = 1 / 60; // seconds
let lastCallTime;

// let userControl = 0;
// document.addEventListener('mousedown', (e) => {
//   (userControl = 1), console.log(userControl);
// });
// document.addEventListener('mouseup', (e) => {
//   (userControl = 0), console.log(userControl);
// });

// let lastUserControl = 0;

// setTimeout(() => {console.log(car.chassis.children[0].children[10])}, "4000")
const tick = () => {
  stats.begin();
  // Update controls

  const time = performance.now() / 1000; // seconds
  if (!lastCallTime) {
    world.step(timeStep);
  } else {
    const dt = time - lastCallTime;
    world.step(timeStep, dt);
  }
  lastCallTime = time;

  controls.update();
  // }
  ////////////-----------camera SETTINGS OK-------
  camera.lookAt(
    car.car.chassisBody.position.x,
    car.car.chassisBody.position.y,
    car.car.chassisBody.position.z - 2
  );

  // camera.position.lerp(
  //   new THREE.Vector3(
  //     car.car.chassisBody.position.x,
  //     car.car.chassisBody.position.y + 1,
  //     car.car.chassisBody.position.z - 5
  //   ),
  //   0.03
  // );

  cannonDebugger.update();
  // controls.update()
  // Render
  // console.log('nb of objs', scene.children.length)
  renderer.render(scene, camera);
  stats.end();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();