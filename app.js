// Importing necessary libraries for 3D rendering, loading models, and animation.
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

// Set up a perspective camera with a 10-degree field of view and a 1000-unit far plane.
const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 6; // Position the camera along the z-axis

const scene = new THREE.Scene(); // Create the 3D scene
let bee; // Variable to hold the bee model
let mixer; // Variable to handle animations of the model
const loader = new GLTFLoader(); // Initialize the GLTFLoader for loading 3D models

// Load the 3D bee model
loader.load("/lt.glb", function (gltf) {
  bee = gltf.scene; // Extract the scene from the loaded GLTF file
  scene.add(bee); // Add the bee model to the scene
  bee.scale.set(2,2,2); // Scale the bee model to 10% of its original size
  mixer = new THREE.AnimationMixer(bee); // Initialize the animation mixer for the model
  mixer.clipAction(gltf.animations[0]).play(); // Play the first animation clip
});

const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set up the renderer with alpha transparency
renderer.setSize(window.innerWidth, window.innerHeight); // Set the renderer size based on the window size
document.getElementById("container3D").appendChild(renderer.domElement); // Attach the renderer to the DOM

// Light setup for the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 6); // Ambient light to illuminate the scene uniformly
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 6); // Directional light to simulate sunlight
topLight.position.set(500, 500, 500); // Position the light in the scene
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D); // Continuously render the scene
  renderer.render(scene, camera); // Render the scene from the perspective of the camera
  if (mixer) mixer.update(0.02); // Update the animation mixer if present
};
reRender3D(); // Start the rendering loop

// Infinite tumble rotation on scroll
let totalRotation = { x: 0, y: 0, z: 0 }; // Tracks total rotation applied on scroll

// Listen for scroll events to rotate the model
window.addEventListener("scroll", () => {
  const delta = window.scrollY; // How much you have scrolled vertically
  const rotationSpeed = 0.0001; // Slow down the rotation speed

  // Continuously apply rotation based on scroll position
  totalRotation.x += delta * rotationSpeed;
  totalRotation.y += delta * rotationSpeed;
  totalRotation.z += delta * rotationSpeed;

  // Apply the accumulated rotation to the bee model
  if (bee) {
    bee.rotation.x = totalRotation.x;
    bee.rotation.y = totalRotation.y;
    bee.rotation.z = totalRotation.z;
  }
});

// Hovercraft effect for infinite up and down movement (slower)
let hoverDirection = 1; // 1 means moving up, -1 means moving down
let hoverSpeed = 0.001; // Slowed down the hover speed
let hoverHeight = 0.5; // Maximum height variation (up/down range)

const hoverEffect = () => {
  if (bee) {
    // Update the Y position for the hover effect
    bee.position.y += hoverDirection * hoverSpeed;

    // Reverse direction when the model reaches the height limits
    if (bee.position.y >= hoverHeight || bee.position.y <= -hoverHeight) {
      hoverDirection *= -1;
    }
  }
};

// Call hover effect continuously to animate the model
const animate = () => {
  requestAnimationFrame(animate); // Loop the animation
  hoverEffect(); // Apply the hover effect
};
animate(); // Start the hover animation loop

// Resize handler to adjust camera and renderer when window is resized
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight); // Resize the renderer
  camera.aspect = window.innerWidth / window.innerHeight; // Adjust the camera's aspect ratio
  camera.updateProjectionMatrix(); // Update the projection matrix for the camera
});
