class Particle {
    constructor(x, y, color, boundsWidth, boundsHeight) {
        // Start from random point inside container or slightly dispersed
        this.x = Math.random() * (boundsWidth || 600);
        this.y = Math.random() * (boundsHeight || 400);
        this.originX = x;
        this.originY = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.color = color;
        this.size = Math.random() * 1.4 + 0.8;
        this.friction = 0.85;
        this.springFactor = 0.06;
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Mouse repulsion force inside glass container
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let angle = Math.atan2(dy, dx);
            let repelX = Math.cos(angle) * force * 18;
            let repelY = Math.sin(angle) * force * 18;
            
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
        this.mouse = { x: -1000, y: -1000, radius: 90 };
        
        this.textLines = ["LIVJOT", "SINGH"];
        this.fontFamily = "'Plus Jakarta Sans', 'Inter', sans-serif";
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Canvas relative mouse events
        const parent = this.canvas.parentElement || document.body;
        
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

        this.animate();
    }

    setText(lines) {
        if (!lines || !lines.length) return;
        this.textLines = lines;
        
        // Explode particles outward dramatically on text change
        this.particles.forEach(p => {
            p.vx = (Math.random() - 0.5) * 35;
            p.vy = (Math.random() - 0.5) * 35;
        });

        setTimeout(() => {
            this.initParticles();
        }, 150);
    }

    resize() {
        const parent = this.canvas.parentElement;
        if (parent) {
            const rect = parent.getBoundingClientRect();
            this.width = rect.width || 500;
            this.height = rect.height || 400;
        } else {
            this.width = window.innerWidth * 0.45;
            this.height = 420;
        }
        
        // Handle high DPI crisp canvas rendering
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        
        this.ctx.scale(dpr, dpr);
        this.initParticles();
    }

    initParticles() {
        // Offscreen canvas for typography rasterization
        const offscreen = document.createElement('canvas');
        const oCtx = offscreen.getContext('2d', { willReadFrequently: true });
        offscreen.width = this.width;
        offscreen.height = this.height;
        
        // Compute responsive font size based on glass panel dimensions
        let maxByWidth = this.width / (Math.max(...this.textLines.map(l => l.length)) * 0.75); 
        let maxByHeight = (this.height * 0.65) / this.textLines.length;
        let fontSize = Math.floor(Math.min(maxByWidth, maxByHeight, 82)); 
        
        if (fontSize < 24) fontSize = 24;

        oCtx.font = `800 ${fontSize}px ${this.fontFamily}`;
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
                
                if (alpha > 120) {
                    const rand = Math.random();
                    let color = "#ffffff";
                    if (rand > 0.75) color = "#8b5cf6";      // Violet primary
                    else if (rand > 0.50) color = "#38bdf8"; // Cyan blue
                    else if (rand > 0.35) color = "#c4b5fd"; // Soft lavender
                    
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
            const count = Math.max(this.particles.length, newTargets.length);
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
        const connectDistance = 20;
        
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < particleCount; i += 3) {
            const p1 = this.particles[i];
            for (let j = i + 1; j < particleCount; j += 4) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < connectDistance * connectDistance) {
                    const alpha = (1 - Math.sqrt(distSq) / connectDistance) * 0.25;
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
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
