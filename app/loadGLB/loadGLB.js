let THREE = require('three');

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instantiate a loader
let loader = new GLTFLoader();

let clock = new THREE.Clock();
let mixer;

// Load a glTF resource
loader.load(
	// resource URL
	'../assets/models/glb/HumanoidAnimation.glb',
	// called when the resource is loaded
	function ( gltf ) {
		scene.add(gltf.scene);

		/*
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		 */

		mixer = new THREE.AnimationMixer(gltf.scene);

		console.debug('gltf.animations : ' + gltf.animations.length);

		let action0 = mixer.clipAction(gltf.animations[0]);
		action0.play();
		console.debug('action0');

		let action1 = mixer.clipAction(gltf.animations[1]);
		setTimeout(function(){action0.stop();action1.play();console.debug('action1.play');}, 3000);
		console.debug('action1');
	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);

// White directional light at half intensity shining from the top.
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
directionalLight.position.x = 1;
directionalLight.position.y = 2;
directionalLight.position.z = 3;
scene.add(directionalLight);

camera.position.y = 0;
camera.position.z = 6;

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);

	if (mixer) {
		let delta = clock.getDelta();
		mixer.update(delta);
	}
}

animate();
