import './style.css';

import * as THREE from "three";
import { BackSide, DoubleSide, PlaneGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene Creation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();


// Setup Renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Geometry
const box_geometry = new THREE.SphereGeometry(0.5, 25, 25);
const box_material = new THREE.MeshPhongMaterial({color: 0x00ff00});
const box_mesh = new THREE.Mesh(box_geometry, box_material);

const plane_geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
const plane_material = new THREE.MeshLambertMaterial({ color: 0xffffff, size : 1, opacity : 1, side: DoubleSide });
const plane_mesh = new THREE.Mesh(plane_geometry, plane_material);
scene.add(plane_mesh);

// Light
const directional_light = new THREE.PointLight(0xffffff, 1, 1000);
const light = new THREE.PointLight(0xffffff, 1, 1000);

directional_light.position.set(0, 5, 0);
light.position.set(0, 5, 0);
scene.add(light, directional_light);

camera.position.z = 5;

plane_mesh.rotation.x = 90;

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

var clock = new THREE.Clock();
const speed = 10;
var delta = 0;
const amplitude = 1;
var time = 0;
var a = 0;
var b = 0;
var c = 0;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate() {
  requestAnimationFrame(animate)

  raycaster.setFromCamera( mouse, camera );

  const {array} = plane_mesh.geometry.attributes.position;

  const intersects = raycaster.intersectObject(plane_mesh)

  const local = plane_mesh.worldToLocal(intersects[0].point);

  light.position.x = local.x;
  light.position.z = local.y;

  for (let i = 0; i < array.length; i+=3)
  {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    delta += clock.getDelta();
    time = delta * speed;
    
    const x0 = local.x;
    const y0 = local.y;
    const dist = Math.sqrt((x0 - x)**2 + (y0 - y)**2);
    if (dist <= 2.5) {
      array[i + 2] = dist * Math.sin(x0 + y0 + time);
    }
    else {
      array[i + 2] = 0;
    }
  }
  plane_mesh.geometry.attributes.position.needsUpdate = true;
  
  //plane_mesh.rotation.z += 0.001;
 
  controls.update();

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

}

window.addEventListener( 'mousemove', onMouseMove, false );

window.requestAnimationFrame(animate);

animate();