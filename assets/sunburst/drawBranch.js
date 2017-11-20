import * as THREE from 'three';

function drawBranch(x, y, radius, level) {
  console.log('draw');
  let lineWidth = level*2
  let curve = new THREE.EllipseCurve(x, y, radius, radius, 0, 2 * Math.PI, false, 0);
  var points = curve.getPoints( 50 );
  let geometry = new THREE.BufferGeometry().setFromPoints(points);
  let material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
  let ellipse = new THREE.Line( geometry, material );
  ellipse.position.set(x, y, 0);
  return ellipse;
}


export default drawBranch;
