let THREE = require('three');

import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';

const TWEEN = require('@tweenjs/tween.js');

let scene, camera, renderer;

let raycaster, mouse = { x : 0, y : 0 };

let pickedObject;

function init () {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer({antialias: true});
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

	let sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	let sphereMaterial = new THREE.MeshLambertMaterial({color: 0xccaa00});
	let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.y = 0.5;
	scene.add(sphere);

	let sphereGeometry2 = new THREE.SphereGeometry(0.5, 32, 32);
	let sphereMaterial2 = new THREE.MeshLambertMaterial({color: 0x00ccaa});
	let sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
	sphere2.position.y = 0.5;
	sphere2.position.z = 15;
	scene.add(sphere2);

	// White directional light at half intensity shining from the top.
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
	directionalLight.position.x = 1;
	directionalLight.position.y = 2;
	directionalLight.position.z = 3;
	scene.add(directionalLight);

	camera.position.y = 2;
	camera.position.z = 20;

	raycaster = new THREE.Raycaster();
	renderer.domElement.addEventListener( 'click', pickObject, false );
}

init();

function animate(time) {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);

	TWEEN.default.update(time);
}

animate();

function pickObject ( e ) {

	//1. sets the mouse position with a coordinate system where the center
	//   of the screen is the origin
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	//2. set the picking ray from the camera position and mouse coordinates
	raycaster.setFromCamera( mouse, camera );

	//3. compute intersections
	var intersects = raycaster.intersectObjects( scene.children );

	console.log('Children : ' + scene.children);

	for ( var i = 0; i < intersects.length; i++ ) {
		console.log("Intersects : " + intersects[ i ]);
		/*
			An intersection has the following properties :
				- object : intersected object (THREE.Mesh)
				- distance : distance from camera to intersection (number)
				- face : intersected face (THREE.Face3)
				- faceIndex : intersected face index (number)
				- point : intersection point (THREE.Vector3)
				- uv : intersection point in the object's UV coordinates (THREE.Vector2)
		*/
	}


	if (intersects.length > 0) {
		if (pickedObject != intersects[0].object) {
			if (pickedObject) pickedObject.material.color.setHex(pickedObject.currentHex);

			console.log('Point : ' + intersects[0].point);

			pickedObject = intersects[0].object;
			pickedObject.currentHex = pickedObject.material.color.getHex();
			//pickedObject.material.emissive.setHex(0xff0000);

			let tweenColor = new TWEEN.default.Tween(pickedObject.material.color)
				.to({r: 0, g: 25, b: 155}, 750)
				.easing(TWEEN.default.Easing.Quartic.InOut)
				.repeat(1)
				.yoyo()
				.start();

			let tweenPosition = new TWEEN.default.Tween(pickedObject.position)
				.to({z: pickedObject.position.z + 5}, 2000)
				.easing(TWEEN.default.Easing.Quartic.InOut)
				.start();
		}
		else {
			//if(tween && currentTime) tween.update(currentTime);
		}
	} else {
		if (pickedObject) pickedObject.material.color.setHex(pickedObject.currentHex);

		pickedObject = null;
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
