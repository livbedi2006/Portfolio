import {
    Renderer,
    Camera,
    Transform,
    Geometry,
    Program,
    Mesh
} from 'ogl';

export function initHeroSphere(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const renderer = new Renderer({ alpha: true, dpr: window.devicePixelRatio });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.z = 4;

    function resize() {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize, false);
    resize();

    const scene = new Transform();

    const count = 3000;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        // Distribute points on a sphere using Fibonacci lattice
        const phi = Math.acos( -1 + ( 2 * i ) / count );
        const theta = Math.sqrt( count * Math.PI ) * phi;

        const x = Math.cos(theta) * Math.sin(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(phi);

        positions.set([x, y, z], i * 3);
        randoms.set([Math.random(), Math.random(), Math.random()], i * 3);
    }

    const geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        random: { size: 3, data: randoms },
    });

    const vertex = /* glsl */ `
        #version 300 es
        in vec3 position;
        in vec3 random;
        
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        
        out vec3 vColor;
        
        void main() {
            vec3 pos = position;
            
            // Add some gentle undulating motion
            pos.x += sin(uTime * 0.5 + random.x * 10.0) * 0.05;
            pos.y += cos(uTime * 0.6 + random.y * 10.0) * 0.05;
            pos.z += sin(uTime * 0.7 + random.z * 10.0) * 0.05;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            
            // Size attenuation based on distance
            gl_PointSize = (12.0 * random.x + 4.0) * (1.0 / gl_Position.z);
            
            // Color mix based on random values and current theme
            // Vibrant purples and blues
            vColor = mix(vec3(0.54, 0.36, 0.96), vec3(0.23, 0.51, 0.96), random.y);
        }
    `;

    const fragment = /* glsl */ `
        #version 300 es
        precision highp float;
        
        in vec3 vColor;
        out vec4 FragColor;
        
        void main() {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) {
                discard;
            }
            float alpha = (1.0 - r) * 0.8;
            FragColor = vec4(vColor, alpha);
        }
    `;

    const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
            uTime: { value: 0 },
        },
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    particles.setParent(scene);

    let mouseX = 0;
    let mouseY = 0;
    
    // Smooth follow
    let targetRotX = 0;
    let targetRotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    requestAnimationFrame(update);
    function update(t) {
        requestAnimationFrame(update);

        program.uniforms.uTime.value = t * 0.001;
        
        targetRotY = mouseX * 0.5;
        targetRotX = mouseY * 0.5;
        
        particles.rotation.y += (targetRotY - particles.rotation.y) * 0.05 + 0.005; // Constant slow spin + mouse
        particles.rotation.x += (targetRotX - particles.rotation.x) * 0.05;

        renderer.render({ scene, camera });
    }
}
