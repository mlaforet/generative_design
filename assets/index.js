import * as THREE from 'three';
import drawBranch from './sunburst/drawBranch';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
console.log('Width: ', WIDTH, ' Height: ', HEIGHT)

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000 );
camera.position.set(0, 0, 1000);
camera.lookAt(new THREE.Vector3(0, 0, 0));

let renderer = new THREE.WebGLRenderer();
renderer.setSize( WIDTH, HEIGHT );
document.body.appendChild( renderer.domElement );


const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
let geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 10, 0));
geometry.vertices.push(new THREE.Vector3(10, 0, 0));

let line = new THREE.Line(geometry, material);

scene.add(line);
scene.add(drawBranch(20, 20, 50));
renderer.render(scene, camera);
