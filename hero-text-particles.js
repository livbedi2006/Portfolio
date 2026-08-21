class Particle {
    constructor(x, y, color, boundsWidth, boundsHeight) {
        this.x = Math.random() * (boundsWidth || 600);
        this.y = Math.random() * (boundsHeight || 400);
        this.originX = x;
        this.originY = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.color = color;
        this.size = Math.random() * 1.5 + 1.0;
        this.friction = 0.84;
        this.springFactor = 0.07;
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Mouse repulsion force inside glass container
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let angle = Math.atan2(dy, dx);
            let repelX = Math.cos(angle) * force * 20;
            let repelY = Math.sin(angle) * force * 20;
            
            this.vx -= repelX;
            this.vy -= repelY;
        }

        // Return to target origin position (spring physics)
        this.vx += (this.originX - this.x) * this.springFactor;
        this.vy += (this.originY - this.y) * this.springFactor;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 95 };
        
        this.textLines = ["LIVJOT", "SINGH"];
        this.fontFamily = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';
        
        this.resize();
        
        // Window & observer resize handlers
        window.addEventListener('resize', () => this.resize());

        const parent = this.canvas.parentElement || document.body;
        if (window.ResizeObserver && parent) {
            const ro = new ResizeObserver(() => this.resize());
            ro.observe(parent);
        }

        // Font readiness trigger
        if (document.fonts) {
            document.fonts.ready.then(() => {
                setTimeout(() => this.resize(), 100);
            });
        }

        // Canvas relative mouse events
        const updateMousePos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            this.mouse.x = clientX - rect.left;
            this.mouse.y = clientY - rect.top;
        };

        parent.addEventListener('mousemove', updateMousePos);
        parent.addEventListener('touchmove', updateMousePos, { passive: true });
        parent.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        // Safety retries to guarantee rendering after initial load/loading screen
        setTimeout(() => this.resize(), 300);
        setTimeout(() => this.resize(), 1000);

        this.animate();
    }

    setText(lines) {
        if (!lines || !lines.length) return;
        this.textLines = lines;
        
        // Explode particles outward dramatically on text change
        this.particles.forEach(p => {
            p.vx = (Math.random() - 0.5) * 40;
            p.vy = (Math.random() - 0.5) * 40;
        });

        setTimeout(() => {
            this.initParticles();
        }, 120);
    }

    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        if (parent) {
            const rect = parent.getBoundingClientRect();
            this.width = Math.floor(rect.width) || 520;
            this.height = Math.floor(rect.height) || 380;
        } else {
            this.width = Math.floor(window.innerWidth * 0.45) || 520;
            this.height = 380;
        }
        
        if (this.width <= 0 || this.height <= 0) return;

        // Handle high DPI crisp canvas rendering
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix before scaling
        this.ctx.scale(dpr, dpr);
        this.initParticles();
    }

    initParticles() {
        if (!this.width || !this.height || this.width < 50 || this.height < 50) return;

        // Offscreen canvas for typography rasterization
        const offscreen = document.createElement('canvas');
        const oCtx = offscreen.getContext('2d', { willReadFrequently: true });
        offscreen.width = this.width;
        offscreen.height = this.height;
        
        // Compute responsive font size based on glass panel dimensions
        const maxLen = Math.max(...this.textLines.map(l => l.length));
        let maxByWidth = this.width / (maxLen * 0.72); 
        let maxByHeight = (this.height * 0.60) / this.textLines.length;
        let fontSize = Math.floor(Math.min(maxByWidth, maxByHeight, 84)); 
        
        if (fontSize < 24) fontSize = 24;

        oCtx.font = `900 ${fontSize}px ${this.fontFamily}`;
        oCtx.textAlign = "center";
        oCtx.textBaseline = "middle";
        oCtx.fillStyle = "#ffffff";
        
        // Compute text placement
        const lineHeight = fontSize * 1.15;
        const startY = this.height / 2 - ((this.textLines.length - 1) * lineHeight) / 2;
        
        this.textLines.forEach((line, index) => {
            oCtx.fillText(line, this.width / 2, startY + index * lineHeight);
        });
        
        const imageData = oCtx.getImageData(0, 0, this.width, this.height);
        const pixels = imageData.data;
        
        // Sampling gap based on resolution & size
        const gap = this.width < 450 ? 3 : 4;
        const newTargets = [];
        
        for (let y = 0; y < this.height; y += gap) {
            for (let x = 0; x < this.width; x += gap) {
                const index = (y * this.width + x) * 4;
                const alpha = pixels[index + 3];
                
                if (alpha > 40) {
                    const rand = Math.random();
                    let color = "#ffffff";
                    if (rand > 0.70) color = "#a855f7";      // Vivid Purple
                    else if (rand > 0.45) color = "#38bdf8"; // Electric Cyan
                    else if (rand > 0.30) color = "#c4b5fd"; // Soft Lavender
                    else if (rand > 0.20) color = "#34d399"; // Emerald Mint
                    
                    const offsetX = (Math.random() - 0.5) * (gap * 0.6);
                    const offsetY = (Math.random() - 0.5) * (gap * 0.6);
                    
                    newTargets.push({
                        x: x + offsetX,
                        y: y + offsetY,
                        color: color
                    });
                }
            }
        }

        // Morph existing particles or create missing ones
        if (this.particles.length > 0) {
            const updatedParticles = [];
            for (let i = 0; i < newTargets.length; i++) {
                const target = newTargets[i];
                if (i < this.particles.length) {
                    const p = this.particles[i];
                    p.originX = target.x;
                    p.originY = target.y;
                    p.color = target.color;
                    updatedParticles.push(p);
                } else {
                    updatedParticles.push(new Particle(target.x, target.y, target.color, this.width, this.height));
                }
            }
            this.particles = updatedParticles;
        } else {
            this.particles = newTargets.map(t => new Particle(t.x, t.y, t.color, this.width, this.height));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 1. Draw neural constellation net lines between nearby particles
        const particleCount = this.particles.length;
        const connectDistance = 22;
        
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < particleCount; i += 4) {
            const p1 = this.particles[i];
            for (let j = i + 1; j < particleCount; j += 5) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < connectDistance * connectDistance) {
                    const alpha = (1 - Math.sqrt(distSq) / connectDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        // 2. Update and draw particles
        this.particles.forEach(p => {
            p.update(this.mouse);
            p.draw(this.ctx);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

let activeInstance = null;

export function initTextParticles() {
    activeInstance = new ParticleEngine('textParticleCanvas');
    return activeInstance;
}

export function getTextParticleEngine() {
    return activeInstance;
}

// Fallback auto-init if standalone
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initTextParticles());
    } else {
        initTextParticles();
    }
}
