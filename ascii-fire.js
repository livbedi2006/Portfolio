// ascii-fire.js

const FONT_SIZE = 10;
const CHARSETS = {
  classic: " .:-=+*#%@",
  dense: " `.^,:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  blocks: " ░▒▓█",
  minimal: " .:*#",
};

const FPS = 30;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resolveWind(direction, force) {
  const amount = clamp(force, 10, 100);
  return direction === "left" ? -amount : amount;
}

function seedFuel(heat, columns, rows, config, elapsedSeconds) {
  const pulseMultiplier = config.pulse ? 0.88 + Math.sin(elapsedSeconds * 2.2) * 0.12 : 1;
  const fuelRows = clamp(Math.round(config.thickness), 1, Math.max(1, rows - 1));
  const baseHeat = clamp(config.intensity / 100, 0.05, 1) * pulseMultiplier;

  for (let rowOffset = 0; rowOffset < fuelRows; rowOffset += 1) {
    const row = rows - 1 - rowOffset;
    const rowStrength = 1 - rowOffset / Math.max(fuelRows * 2, 1);

    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const flicker = 0.58 + Math.random() * 0.42;
      heat[index] = clamp(baseHeat * rowStrength * flicker, 0, 1);
    }
  }
}

function propagateFire(heat, nextHeat, columns, rows, config) {
  nextHeat.fill(0);
  const windOffset = config.wind / 50;
  const turbulence = config.turbulence / 100;
  const cooling = config.decay / 1000;

  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const randomDrift = (Math.random() - 0.5) * (1.5 + turbulence * 5);
      const sourceColumn = clamp(Math.round(column - windOffset + randomDrift), 0, columns - 1);
      const rowBelow = (row + 1) * columns;
      const rowTwoBelow = Math.min(row + 2, rows - 1) * columns;
      const sideDirection = Math.random() < 0.5 ? -1 : 1;
      const side = rowBelow + clamp(sourceColumn + sideDirection, 0, columns - 1);
      const center = rowBelow + sourceColumn;
      const deep = rowTwoBelow + sourceColumn;
      let carriedHeat = heat[center] * 0.58 + heat[side] * 0.16 + heat[deep] * 0.26;
      const randomCooling = cooling * (0.2 + Math.random() * (1.3 + turbulence * 2));

      if (Math.random() < turbulence * 0.08) {
        carriedHeat *= 0.45 + Math.random() * 0.35;
      }

      nextHeat[row * columns + column] = clamp(carriedHeat - randomCooling, 0, 1);
    }
  }

  const fuelStart = Math.max(0, rows - Math.round(config.thickness));
  nextHeat.set(heat.subarray(fuelStart * columns), fuelStart * columns);
}

function updateParticles(particles, columns, rows, config) {
  const updatedParticles = particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.velocityX + config.wind / 500,
      y: particle.y + particle.velocityY,
      velocityX: particle.velocityX + (Math.random() - 0.5) * (config.turbulence / 300),
      heat: particle.heat * (particle.kind === "spark" ? 0.985 : 0.94),
      life: particle.life - 1,
    }))
    .filter((particle) => particle.life > 0 && particle.y >= 0 && particle.x >= 0 && particle.x < columns);

  const spawnParticle = (isSpark) => {
    const sourceColumn = Math.floor(Math.random() * columns);
    const life = isSpark ? 20 + Math.random() * 24 : 22 + Math.random() * 28;
    updatedParticles.push({
      kind: isSpark ? "spark" : "ember",
      glyph: isSpark ? (Math.random() < 0.5 ? "'" : "|") : ".",
      x: sourceColumn + (Math.random() - 0.5) * 2,
      y: rows - Math.max(2, config.thickness),
      velocityX: (Math.random() - 0.5) * (isSpark ? 0.45 : 0.16),
      velocityY: isSpark ? -(0.8 + Math.random() * 0.8) : -(0.16 + Math.random() * 0.24),
      heat: isSpark ? 1.2 : 0.76,
      life,
      maxLife: life,
    });
  };

  if (config.embers && Math.random() < 0.2 * 2.4) spawnParticle(false);
  if (config.sparks && Math.random() < 0.07 * 2.4) spawnParticle(true);

  return updatedParticles.slice(-Math.max(40, Math.round(columns * 1.5)));
}

function escapeHtml(character) {
  if (character === "&") return "&amp;";
  if (character === "<") return "&lt;";
  if (character === ">") return "&gt;";
  return character;
}

function renderFire(element, heat, particles, columns, rows, characters, palette, sparkColor) {
  const displayHeat = new Float32Array(heat);
  const particleGlyphs = new Map();

  for (const particle of particles) {
    const column = clamp(Math.round(particle.x), 0, columns - 1);
    const row = clamp(Math.round(particle.y), 0, rows - 1);
    const fade = particle.life / particle.maxLife;
    const index = row * columns + column;
    displayHeat[index] = Math.max(displayHeat[index], particle.heat * fade);
    if (particle.kind === "spark" || !particleGlyphs.has(index)) {
      particleGlyphs.set(index, {
        color: particle.kind === "spark" ? sparkColor : palette[Math.max(0, palette.length - 3)],
        glyph: particle.glyph,
      });
    }
  }

  const lines = [];
  for (let row = 0; row < rows; row += 1) {
    let line = "";
    let activeColor = "";
    let run = "";

    const flushRun = () => {
      if (!run) return;
      line += activeColor ? `<span style="color:${activeColor}">${run}</span>` : run;
      run = "";
    };

    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const value = displayHeat[index];
      const particleGlyph = particleGlyphs.get(index);
      const characterIndex = clamp(Math.floor(value * (characters.length - 1)), 0, characters.length - 1);
      const paletteIndex = clamp(Math.floor(Math.pow(value, 0.72) * (palette.length - 1)), 0, palette.length - 1);
      const color = particleGlyph?.color ?? (value < 0.025 ? "" : palette[paletteIndex]);
      const character = particleGlyph?.glyph ?? (value < 0.025 ? " " : characters[characterIndex]);

      if (color !== activeColor) {
        flushRun();
        activeColor = color;
      }
      run += escapeHtml(character);
    }

    flushRun();
    lines.push(line);
  }

  element.innerHTML = lines.join("\n");
}

function initAsciiFire() {
    const container = document.getElementById("ascii-fire-container");
    if (!container) return;

    // Custom palette matching the portfolio's lavender/blue theme!
    const palettes = {
        dark: ["#0f0b1a", "#2e1065", "#4c1d95", "#6d28d9", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ffffff"],
        light: ["#f5f3ff", "#e9d5ff", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#ffffff"]
    };

    let currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    let activePalette = palettes[currentTheme];
    let sparkColor = "#ffffff";

    const config = {
        intensity: 85, // Lower intensity for a cleaner edge
        wind: resolveWind("right", 15),
        decay: 14,
        turbulence: 40,
        thickness: 2,
        embers: true,
        sparks: true,
        pulse: true,
    };

    const characters = CHARSETS["dense"];

    const output = document.createElement("pre");
    output.setAttribute("role", "img");
    output.setAttribute("aria-label", "Animated ASCII wall of fire");
    output.style.position = "absolute";
    output.style.inset = "0";
    output.style.margin = "0";
    output.style.width = "100%";
    output.style.height = "100%";
    output.style.overflow = "hidden";
    output.style.userSelect = "none";
    output.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    output.style.fontSize = FONT_SIZE + "px";
    output.style.fontVariantLigatures = "none";
    output.style.lineHeight = "1.05";
    output.style.whiteSpace = "pre";
    output.style.textRendering = "optimizeSpeed";
    container.appendChild(output);

    const measurementContext = document.createElement("canvas").getContext("2d");
    if (measurementContext) {
        measurementContext.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    }
    const characterWidth = measurementContext ? measurementContext.measureText("M").width : FONT_SIZE * 0.6;
    const lineHeight = FONT_SIZE * 1.05;

    let columns = 1;
    let rows = 1;
    let heat = new Float32Array(1);
    let nextHeat = new Float32Array(1);
    let particles = [];
    let previousFrameTime = 0;
    let startTime = performance.now();
    let animationFrameId = 0;
    let isActive = true;

    function handleResize() {
        const bounds = container.getBoundingClientRect();
        const width = Math.max(bounds.width, container.clientWidth) || 600;
        const height = Math.max(bounds.height, container.clientHeight) || 600;

        const nextColumns = Math.max(1, Math.floor(width / characterWidth));
        const nextRows = Math.max(1, Math.floor(height / lineHeight));
        if (nextColumns === columns && nextRows === rows) return;

        columns = nextColumns;
        rows = nextRows;
        heat = new Float32Array(columns * rows);
        nextHeat = new Float32Array(columns * rows);
        particles = [];

        // Warm up the fire
        for (let warmUpStep = 0; warmUpStep < Math.min(rows, 48); warmUpStep += 1) {
            seedFuel(heat, columns, rows, config, warmUpStep / FPS);
            propagateFire(heat, nextHeat, columns, rows, config);
            [heat, nextHeat] = [nextHeat, heat];
        }

        renderFire(output, heat, particles, columns, rows, characters, activePalette, sparkColor);
    }

    function drawFrame(timestamp) {
        if (!isActive) return;
        const frameInterval = 1000 / FPS;
        const elapsedSinceFrame = timestamp - previousFrameTime;

        if (elapsedSinceFrame >= frameInterval || previousFrameTime === 0) {
            const elapsedSeconds = (timestamp - startTime) / 1000;
            seedFuel(heat, columns, rows, config, elapsedSeconds);
            propagateFire(heat, nextHeat, columns, rows, config);
            [heat, nextHeat] = [nextHeat, heat];
            particles = updateParticles(particles, columns, rows, config);
            renderFire(output, heat, particles, columns, rows, characters, activePalette, sparkColor);
            previousFrameTime = timestamp - (elapsedSinceFrame % frameInterval);
        }

        animationFrameId = requestAnimationFrame(drawFrame);
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            if (isActive) handleResize();
        });
    }

    animationFrameId = requestAnimationFrame(drawFrame);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                const theme = document.documentElement.getAttribute('data-theme');
                if (theme && palettes[theme]) {
                    activePalette = palettes[theme];
                }
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAsciiFire);
} else {
    initAsciiFire();
}
