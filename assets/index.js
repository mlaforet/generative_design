import * as THREE from 'three';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 1000);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const particleCount = 20;
let particles = new THREE.Geometry();
let material = new THREE.PointsMaterial({
  color: 0x0000ff,
  size: 20,
  map: THREE.ImageUtils.loadTexture('static/images/particle.png'),
  blending: THREE.AdditiveBlending,
  transparent: true
})

for (var p = 0; p < particleCount; p++) {
  let pX = Math.random() * 500 - 250;
  let pY = Math.random() * 500 - 250;
  let pZ = Math.random() * 500 - 250;
  let particle = new THREE.Vector3(pX, pY, pZ);
  particles.vertices.push(particle);
}

let particleSystem = new THREE.Points(particles, material);

scene.add(particleSystem);
renderer.render(scene, camera);
