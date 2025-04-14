import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";  // Importing Three.js for 3D graphics
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";  // Importing the GLTFLoader to load 3D models in .glb format
import { gsap } from "https://cdn.skypack.dev/gsap";  // Importing GSAP for smooth animations

// Scene setup
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);  // Create a perspective camera with a field of view of 10 degrees
camera.position.z = 6;  // Set the camera's initial position along the Z-axis (away from the origin)

// Create a scene where objects will be added
const scene = new THREE.Scene();
let bee;  // Declare a variable to hold the loaded model
let mixer;  // Declare a variable to hold the animation mixer for handling animations

const loader = new GLTFLoader();  // Instantiate the GLTFLoader to load GLB models

// Load the 3D model
loader.load("/battery_free.glb", function (gltf) {  // Load the GLB model from the path '/battery_free.glb'
  bee = gltf.scene;  // Store the loaded model in the 'bee' variable
  bee.scale.set(0.1, 0.1, 0.1);  // Scale the model down by 0.1 in all directions

  // Compute bounding box and center the model manually to ensure it's positioned correctly
  const box = new THREE.Box3().setFromObject(bee);  // Create a bounding box around the model
  const center = new THREE.Vector3();  // Create a vector to store the center of the model
  box.getCenter(center);  // Get the center of the model's bounding box
  bee.position.sub(center);  // Move the model so that its center is at the origin

  scene.add(bee);  // Add the model to the scene

  mixer = new THREE.AnimationMixer(bee);  // Create an animation mixer for the model
  if (gltf.animations.length > 0) {  // If the model has animations
    mixer.clipAction(gltf.animations[0]).play();  // Play the first animation
  }
});

// Renderer setup
const renderer = new THREE.WebGLRenderer({ alpha: true });  // Create a WebGL renderer with transparency enabled
renderer.setSize(window.innerWidth, window.innerHeight);  // Set the renderer size to match the window size
document.getElementById("container3D").appendChild(renderer.domElement);  // Append the renderer's canvas to the container with ID "container3D"

// Lighting setup
scene.add(new THREE.AmbientLight(0xffffff, 6));  // Add ambient light with a white color and intensity of 6
const topLight = new THREE.DirectionalLight(0xffffff, 6);  // Create a directional light (like sunlight)
topLight.position.set(500, 500, 500);  // Set the light's position to (500, 500, 500)
scene.add(topLight);  // Add the light to the scene

// Render loop for continuous rendering of the scene
const reRender3D = () => {
  requestAnimationFrame(reRender3D);  // Request the next frame of the render loop
  renderer.render(scene, camera);  // Render the scene from the camera's perspective
  if (mixer) mixer.update(0.02);  // Update the animation mixer (if exists) by a small increment
};
reRender3D();  // Start the render loop

// Scroll-based rotation
let totalRotation = { x: 0, y: 0, z: 0 };  // Initialize total rotation variables

window.addEventListener("scroll", () => {  // Add an event listener for the scroll event
  const delta = window.scrollY;  // Get the scroll position (distance scrolled vertically)
  const rotationSpeed = 0.0001;  // Set the speed of rotation

  // Update total rotation based on the scroll position
  totalRotation.x += delta * rotationSpeed;
  totalRotation.y += delta * rotationSpeed;
  totalRotation.z += delta * rotationSpeed;

  if (bee) {  // If the bee model exists
    // Apply the calculated rotation to the model's rotation
    bee.rotation.x = totalRotation.x;
    bee.rotation.y = totalRotation.y;
    bee.rotation.z = totalRotation.z;
  }
});

// Hover effect (bounce effect)
let hoverDirection = 1;  // Direction of the bounce (1 = upwards, -1 = downwards)
let hoverSpeed = 0.001;  // Speed of the bounce
let hoverHeight = 0.5;  // Maximum height of the bounce

const hoverEffect = () => {  // Function that implements the bounce effect
  if (bee) {  // If the bee model exists
    // Reverse the bounce direction if it reaches the maximum or minimum height
    if (bee.position.y >= hoverHeight) hoverDirection = -1;
    else if (bee.position.y <= -hoverHeight) hoverDirection = 1;
    
    // Update the position of the bee model for the bounce effect
    bee.position.y += hoverDirection * hoverSpeed;
  }
};

// Animate loop for continuous hover and other effects
const animate = () => {
  requestAnimationFrame(animate);  // Request the next animation frame
  hoverEffect();  // Apply the hover effect to the model
};
animate();  // Start the animation loop

// Handle window resizing to keep the 3D scene responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);  // Adjust the renderer size when the window is resized
  camera.aspect = window.innerWidth / window.innerHeight;  // Update the camera's aspect ratio
  camera.updateProjectionMatrix();  // Update the camera's projection matrix to apply the new aspect ratio
});
