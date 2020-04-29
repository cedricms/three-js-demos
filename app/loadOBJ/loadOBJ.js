let THREE = require('three');

import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let mtlLoader = new MTLLoader();

let objLoader = new OBJLoader();

for (let i = 0; i < 9; i++) {
	mtlLoader.load('../assets/models/obj/HallTile.mtl', (materials) => {
		materials.preload();
		objLoader.setMaterials(materials);
		objLoader.load('../assets/models/obj/HallTile.obj', (object) => {
			scene.add(object);
			object.position.z = 2 * i;
		});
	})
}

// White directional light at half intensity shining from the top.
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
directionalLight.position.x = 1;
directionalLight.position.y = 2;
directionalLight.position.z = 3;
scene.add(directionalLight);

camera.position.y = 2;
camera.position.z = 20;

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

animate();
