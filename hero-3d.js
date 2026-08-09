import * as THREE from 'three';
import { animate } from 'motion';

export function init3DHero() {
    const container = document.getElementById('hero3d-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create an aesthetic 3D object (e.g. an Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x6A3CFF, 
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add some particles around it
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    const clock = new THREE.Clock();
    
    function render() {
        requestAnimationFrame(render);
        
        const elapsedTime = clock.getElapsedTime();
        
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;
        
        particlesMesh.rotation.y = -0.1 * elapsedTime;

        // Easing for smooth mouse tracking
        sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
        sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

        renderer.render(scene, camera);
    }
    
    render();

    // Intro animation with motion.dev
    animate(renderer.domElement, { opacity: [0, 1], scale: [0.8, 1] }, { duration: 1.5, easing: "ease-out" });
}
