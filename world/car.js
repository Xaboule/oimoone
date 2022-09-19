import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Quaternion } from 'cannon-es';

export default class Car {
  constructor(scene, world, groundMaterial) {
    this.scene = scene;
    this.world = world;
    this.groundMaterial = groundMaterial;
    // world.broadphase = new CANNON.SAPBroadphase(world);

    // Disable friction by default
 

    // this.car = {};
    this.car = {};
    this.chassis = {};
    this.wheels = [];
    this.chassisDimension = {
      x: 1.96,
      y: 1.01,
      z: 4.4,
    };
    this.chassisModelPos = {
      x: 0,
      y: -0.59,
      z: 0,
    };
    this.wheelScale = {
      frontWheel: 0.67,
      hindWheel: 0.67,
    };
    this.mass = 250;
  }

  init() {
    this.loadModels();
    this.setChassis();
    this.setWheels();
    this.controls();

    // this.update()
  }

  loadModels() {
    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
      this.update();
    };
    const gltfLoader = new GLTFLoader(manager);
    const dracoLoader = new DRACOLoader();

       this.world.defaultContactMaterial.friction = 0;
   
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load('./car/chassisBBox.glb', (gltf) => {
      this.chassis = gltf.scene;
      this.scene.add(this.chassis);
    });

    this.wheels = [];
    for (let i = 0; i < 4; i++) {
      gltfLoader.load('./car/wheel.gltf', (gltf) => {
        const model = gltf.scene;
        this.wheels[i] = model;
        if (i === 1 || i === 3)
          this.wheels[i].scale.set(
            -1 * this.wheelScale.frontWheel,
            1 * this.wheelScale.frontWheel,
            -1 * this.wheelScale.frontWheel
          );
        else
          this.wheels[i].scale.set(
            1 * this.wheelScale.frontWheel,
            1 * this.wheelScale.frontWheel,
            1 * this.wheelScale.frontWheel
          );
        this.scene.add(this.wheels[i]);
      });
    }
  }

  setChassis() {
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(
        this.chassisDimension.x * 0.45,
        this.chassisDimension.y * 0.4,
        this.chassisDimension.z * 0.5
      )
    );

    const carMaterial = new CANNON.Material({ wireframe: true, friction: 5 });

    const carContactMaterial = new CANNON.ContactMaterial(
      this.carMaterial,
      this.carMaterial,
      {
        friction: 0.1,
        restitution: 2,
      }
    );
    const chassisTop = new CANNON.Body({
      mass: this.mass,
      material: carMaterial,
    });
    
    const chassisTopS = new CANNON.Cylinder(0.3,0.3,3)
    // chassisTop.addShape(chassisTopS)



    
    const chassisBody = new CANNON.Body({
      mass: this.mass,
      material: carMaterial,
    });
    this.car = new CANNON.RaycastVehicle({
      chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });

///////-------- bordel pour rotate Cylindre
    // chassisBody.addShape(chassisTopS, new CANNON.Vec3(0,1,0), new CANNON.Quaternion(0.75,0,0,-Math.PI*0.5))
    
    // this.sliding = false;
    chassisBody.addShape(chassisShape);
    this.car.addToWorld(this.world);

    
  }

  setWheels() {
    this.car.wheelInfos = [];
    this.car.addWheel({
      radius: 0.34,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 55,
      suspensionRestLength: 0.5,
      frictionSlip: 30,
      dampingRelaxation: 2.3,
      dampingCompression: 4.3,
      maxSuspensionForce: 1000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(0.75, 0.1, -1.21),
      maxSuspensionTravel: 1,
      customSlidingRotationalSpeed: 30,
    });
    this.car.addWheel({
      radius: 0.34,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 55,
      suspensionRestLength: 0.5,
      frictionSlip: 30,
      dampingRelaxation: 2.3,
      dampingCompression: 4.3,
      maxSuspensionForce: 10000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(-0.78, 0.1, -1.21),
      maxSuspensionTravel: 1,
      customSlidingRotationalSpeed: 30,
    });
    this.car.addWheel({
      radius: 0.34,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 55,
      suspensionRestLength: 0.5,
      frictionSlip: 30,
      dampingRelaxation: 2.3,
      dampingCompression: 4.3,
      // maxSuspensionForce: 10000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(0.75, 0.1, 1.43),
      maxSuspensionTravel: 1,
      customSlidingRotationalSpeed: 30,
    });
    this.car.addWheel({
      radius: 0.34,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 55,
      suspensionRestLength: 0.5,
      frictionSlip: 30,
      dampingRelaxation: 2.3,
      dampingCompression: 4.3,
      // maxSuspensionForce: 10000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(-0.78, 0.1, 1.43),
      maxSuspensionTravel: 1,
      customSlidingRotationalSpeed: 30,
    });

    this.car.wheelInfos.forEach(
      function (wheel, index) {
        const cylinderShape = new CANNON.Cylinder(
          wheel.radius,
          wheel.radius,
          wheel.radius / 2,
          20
        );
        const wheelBody = new CANNON.Body({
          mass: 1,
          material: new CANNON.Material({ friction: 0 }),
        });
        const quaternion = new CANNON.Quaternion().setFromEuler(
          -Math.PI / 2,
          0,
          0
        );
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);
        // this.wheels[index].wheelBody = wheelBody;
      }.bind(this)
    );
  }

  // debug() {
  //   const cannonDebugger = new CannonDebugger(this.scene, this.world, {
  //     // options...
  //     color: 0xff0000,
  //     scale: 1,
  //   });
  //   // cannonDebugger.update()
  // }
 

  controls() {
    const maxSteerVal = 0.5;
    const maxForce = 750;
    const brakeForce = 36;
    const slowDownCar = 19.6;
    const keysPressed = [];

    window.addEventListener('keydown', (e) => {
      // e.preventDefault();
      if (!keysPressed.includes(e.key.toLowerCase()))
        keysPressed.push(e.key.toLowerCase());
      hindMovement();
    });
    window.addEventListener('keyup', (e) => {
      // e.preventDefault();
      keysPressed.splice(keysPressed.indexOf(e.key.toLowerCase()), 1);
      hindMovement();
    });

    const hindMovement = () => {
      if (keysPressed.includes('r') || keysPressed.includes('r')) resetCar();

      if (!keysPressed.includes(' ') && !keysPressed.includes(' ')) {
        this.car.setBrake(0, 0);
        this.car.setBrake(0, 1);
        this.car.setBrake(0, 2);
        this.car.setBrake(0, 3);

        if (keysPressed.includes('a') || keysPressed.includes('arrowleft')) {
          this.car.setSteeringValue(maxSteerVal * 1, 2);
          this.car.setSteeringValue(maxSteerVal * 1, 3);
        } else if (
          keysPressed.includes('d') ||
          keysPressed.includes('arrowright')
        ) {
          this.car.setSteeringValue(maxSteerVal * -1, 2);
          this.car.setSteeringValue(maxSteerVal * -1, 3);
        } else stopSteer();

        if (keysPressed.includes('w') || keysPressed.includes('arrowup')) {
          this.car.applyEngineForce(maxForce * -1, 0);
          this.car.applyEngineForce(maxForce * -1, 1);
          this.car.applyEngineForce(maxForce * -1, 2);
          this.car.applyEngineForce(maxForce * -1, 3);
        } else if (
          keysPressed.includes('s') ||
          keysPressed.includes('arrowdown')
        ) {
          this.car.applyEngineForce(maxForce * 1, 0);
          this.car.applyEngineForce(maxForce * 1, 1);
          this.car.applyEngineForce(maxForce * 1, 2);
          this.car.applyEngineForce(maxForce * 1, 3);
        } else stopCar();
      } else brake();
      if (keysPressed.includes('h')) {
        this.car.chassisBody.quaternion.set(0, -1, 0, 1);
      }
    };

    const resetCar = () => {
      this.car.chassisBody.position.set(0, 5, 0);
      this.car.chassisBody.quaternion.set(0, 0, 0, 1);
      this.car.chassisBody.angularVelocity.set(0, 0, 0);
      this.car.chassisBody.velocity.set(0, 0, 0);
    };

    const brake = () => {
      this.car.setBrake(brakeForce, 0);
      this.car.setBrake(brakeForce, 1);
      this.car.setBrake(brakeForce, 2);
      this.car.setBrake(brakeForce, 3);
    };

    const stopCar = () => {
      this.car.setBrake(slowDownCar, 0);
      this.car.setBrake(slowDownCar, 1);
      this.car.setBrake(slowDownCar, 2);
      this.car.setBrake(slowDownCar, 3);
    };

    const stopSteer = () => {
      this.car.setSteeringValue(0, 2);
      this.car.setSteeringValue(0, 3);
    };
  }

  update() {
    const updateWorld = () => {
      // this.debug();
      if (
        this.car.wheelInfos &&
        this.chassis.position &&
        this.wheels[0].position
      ) {
        this.chassis.position.set(
          this.car.chassisBody.position.x + this.chassisModelPos.x,
          this.car.chassisBody.position.y + this.chassisModelPos.y,
          this.car.chassisBody.position.z + this.chassisModelPos.z
        );
        this.chassis.children[0].quaternion.copy(
          this.car.chassisBody.quaternion
        );
        // console.log(this.chassis);

        for (let i = 0; i < 4; i++) {
          if (this.car.wheelInfos[i]) {
            this.car.updateWheelTransform(i);
            this.wheels[i].position.copy(
              this.car.wheelInfos[i].worldTransform.position
            );
            this.wheels[i].quaternion.copy(
              this.car.wheelInfos[i].worldTransform.quaternion
            );
          }
        }
      }
    };
  
    // this.world.addContactMaterial(carContactMaterial);
  
    this.world.addEventListener('postStep', updateWorld);
  }
}
