 import * as THREE from "three";
import { GLTFLoader } from "https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.5, 8);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

//lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 8, 5);
scene.add(directionalLight);

//cube loader 
const texture = new THREE.TextureLoader().load("./img/loader.png");

const loaderCube = new THREE.Mesh(

    new THREE.BoxGeometry(0.8, 0.8, 0.8),

    new THREE.MeshStandardMaterial({
        map: texture
    })

);



scene.add(loaderCube);

//star
const starGeometry = new THREE.BufferGeometry();

const starCount = 4000;
const positions = [];

for (let i = 0; i < starCount; i++) {

    positions.push(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
    );

}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);



let animalSound = new Audio();
animalSound.volume = 0.8;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


renderer.domElement.addEventListener("pointerdown", (event) => {

    if (!currentAnimal) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(currentAnimal, true);

    if (intersects.length > 0) {

        animalSound.pause();
        animalSound.currentTime = 0;

       animalSound.src = animals[currentIndex].sound;


targetScale = baseScale * 1.2;

animalSound.play().catch(err => {
    console.log("Audio could not play:", err);
});

    }

});

// animal data
const animals = [

    {
        name: "Lion",
        path: "./models/lion.glb",
        sound: "./sounds/lion.mp3",
        scale: 1,
        y: -0.7,
        fact: "Lions are the only cats that live in social groups called prides."
    },

    {
        name: "Tiger",
        path: "./models/tiger.glb",
        sound: "./sounds/tiger.mp3",
        scale: 3,
        y: 1,
        fact: "Every tiger has a unique stripe pattern, just like human fingerprints."
    },

    {
        name: "Wolf",
        path: "./models/wolf.glb",
        sound: "./sounds/wolf.mp3",
        scale: 3,
        y: -1,
        fact: "Wolves communicate through howls, body language, and facial expressions."
    },

    {
        name: "Elephant",
        path: "./models/elephant.glb",
        sound: "./sounds/elephant.mp3",
        scale: 1.1,
        y: -0.5,
        fact: "Elephants are the largest land animals and can recognize themselves in a mirror."
    },

    {
        name: "Monkey",
        path: "./models/monkey.glb",
        sound: "./sounds/monkey.mp3",
        scale: 1,
        y: -0.4,
        fact: "Many monkeys use tools such as stones and sticks to find food."
    }

];

const animalName = document.getElementById("animalName");
const animalFact = document.getElementById("animalFact");

let typingInterval;

function showFact(animal) {

    clearInterval(typingInterval);

    animalName.textContent = animal.name;
    animalFact.textContent = "";

    let i = 0;

    typingInterval = setInterval(() => {

        animalFact.textContent += animal.fact.charAt(i);
        i++;

        if (i >= animal.fact.length) {
            clearInterval(typingInterval);
        }

    }, 25);

}


const loader = new GLTFLoader();

let currentAnimal = null;
let currentIndex = 0;

let baseScale = 1;
let targetScale = 1;

function loadAnimal(index){

    const animal = animals[index];

    animalSound.pause();
    animalSound.currentTime = 0;

    if(currentAnimal){

        scene.remove(currentAnimal);

    }

  
    loaderCube.visible = true;

   
    setTimeout(()=>{

        loader.load(

            animal.path,

            (gltf)=>{

                currentAnimal = gltf.scene;

                currentAnimal.scale.setScalar(animal.scale);

                baseScale = animal.scale;
                targetScale = animal.scale;

                const box = new THREE.Box3().setFromObject(currentAnimal);
                const center = box.getCenter(new THREE.Vector3());

                
                currentAnimal.position.sub(center);
                currentAnimal.position.y = animal.y;

                scene.add(currentAnimal);

                showFact(animal);

                // Hide loader
                loaderCube.visible = false;

            },

            undefined,

            (error)=>{

                loaderCube.visible = false;

                console.error(error);

            }

        );

    },1000);

}


loadAnimal(currentIndex);

//btns
document.getElementById("next").addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= animals.length)
        currentIndex = 0;

    loadAnimal(currentIndex);

});

document.getElementById("prev").addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0)
        currentIndex = animals.length - 1;

    loadAnimal(currentIndex);

});
//animation
function animate() {

    requestAnimationFrame(animate);

    stars.rotation.y += 0.00015;
    stars.rotation.x += 0.00005;

  if (currentAnimal) {

    currentAnimal.rotation.y += 0.003;

    const current = currentAnimal.scale.x;

    const next = THREE.MathUtils.lerp(current, targetScale, 0.15);

    currentAnimal.scale.setScalar(next);

    targetScale = THREE.MathUtils.lerp(targetScale, baseScale, 0.10);

}
    renderer.render(scene, camera);
if (loaderCube.visible) {

    loaderCube.rotation.x += 0.03;
    loaderCube.rotation.y += 0.03;

}
}



animate();
//size
window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});
