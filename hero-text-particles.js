class Particle {
    constructor(x, y, color) {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.originX = x;
        this.originY = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.color = color;
        this.size = Math.random() * 1.2 + 0.5; // Smaller, softer particles
        this.friction = 0.88;
        this.springFactor = 0.05;
        this.ease = 0.1;
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Mouse repulsion
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let angle = Math.atan2(dy, dx);
            let repelX = Math.cos(angle) * force * 15;
            let repelY = Math.sin(angle) * force * 15;
            
            this.vx -= repelX;
            this.vy -= repelY;
        }

        // Return to origin (spring physics)
        this.vx += (this.originX - this.x) * this.springFactor;
        this.vy += (this.originY - this.y) * this.springFactor;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.random() > 0.8 ? 0.8 : 1.0; // slight twinkle effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d'); // Removed alpha: false to allow transparent background
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 120 };
        
        this.textLines = ["Livjot", "Singh"];
        this.fontFamily = "Inter, sans-serif";
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Mouse events
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        window.addEventListener('touchmove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.touches[0].clientX - rect.left;
            this.mouse.y = e.touches[0].clientY - rect.top;
        }, { passive: true });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.initParticles();
    }

    initParticles() {
        this.particles = [];
        
        // Offscreen canvas to render text and read pixels
        const offscreen = document.createElement('canvas');
        const oCtx = offscreen.getContext('2d', { willReadFrequently: true });
        offscreen.width = this.width;
        offscreen.height = this.height;
        
        // Ensure font fits both width and height (2 lines of text)
        let maxByWidth = this.width / 5.5; 
        let maxByHeight = this.height / 2.8;
        let fontSize = Math.min(maxByWidth, maxByHeight, 220); 
        
        // Adjust for mobile screens where width is very small
        if (this.width < 768) {
            fontSize = Math.min(this.width / 4.5, this.height / 2.8);
        }
        
        oCtx.font = `900 ${fontSize}px ${this.fontFamily}`;
        oCtx.textAlign = "center";
        oCtx.textBaseline = "middle";
        oCtx.fillStyle = "#ffffff";
        
        // Draw text
        const lineHeight = fontSize * 1.1;
        const startY = this.height / 2 - (this.textLines.length - 1) * lineHeight / 2;
        
        this.textLines.forEach((line, index) => {
            const textX = this.width < 768 ? this.width / 2 : this.width * 0.75;
            oCtx.fillText(line, textX, startY + index * lineHeight);
        });
        
        const pixels = oCtx.getImageData(0, 0, this.width, this.height).data;
        
        // Adjust gap based on screen size to maintain performance
        const gap = this.width < 768 ? 3 : 4;
        
        for (let y = 0; y < this.height; y += gap) {
            for (let x = 0; x < this.width; x += gap) {
                const index = (y * this.width + x) * 4;
                const alpha = pixels[index + 3];
                
                if (alpha > 128) {
                    // Slight color variation
                    const rand = Math.random();
                    let color = "#ffffff";
                    if (rand > 0.8) color = "#a78bfa"; // primary-light
                    else if (rand > 0.6) color = "#c4b5fd"; // text-secondary
                    // Add a tiny bit of random jitter so it doesn't look like a perfect grid
                    let offsetX = (Math.random() - 0.5) * gap;
                    let offsetY = (Math.random() - 0.5) * gap;
                    
                    this.particles.push(new Particle(x + offsetX, y + offsetY, color));
                }
            }
        }
    }

    animate() {
        // Clear canvas for transparent background
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(p => {
            p.update(this.mouse);
            p.draw(this.ctx);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleEngine('textParticleCanvas');
});
