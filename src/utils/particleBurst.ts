/**
 * Subtle enterprise particle burst explosion utility
 * Creates a delicate, high-performance particle burst effect on mouse click coordinates.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'square' | 'sparkle';
  rotation: number;
  rotationSpeed: number;
}

const ENTERPRISE_PALETTE = [
  '#2f6481', // slate navy
  '#5995b7', // soft ocean blue
  '#a1d4f5', // cyan ice
  '#eab308', // gold / brass
  '#10b981', // emerald
  '#ffffff', // pure highlight
];

export function createParticleBurst(
  originX: number,
  originY: number,
  customColors?: string[],
  particleCount = 24
) {
  const colors = customColors || ENTERPRISE_PALETTE;

  // Create or reuse an overlay canvas
  let canvas = document.getElementById('particle-burst-canvas') as HTMLCanvasElement;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-burst-canvas';
    canvas.className = 'fixed inset-0 pointer-events-none z-[99999]';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  // Ensure canvas dimensions match viewport
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2.5;
    const maxLife = Math.floor(Math.random() * 25 + 25);
    const shapes: ('circle' | 'square' | 'sparkle')[] = ['circle', 'circle', 'sparkle'];

    particles.push({
      x: originX * dpr,
      y: originY * dpr,
      vx: Math.cos(angle) * speed * dpr,
      vy: Math.sin(angle) * speed * dpr,
      size: (Math.random() * 3 + 2) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      life: 0,
      maxLife,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    });
  }

  let animationFrameId: number;

  function render() {
    if (!ctx) return;

    // Clear previous particles
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.life < p.maxLife) {
        activeParticles++;
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Apply slight drag and subtle gravity
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy += 0.08 * dpr; // subtle downward drift
        p.rotation += p.rotationSpeed;

        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'sparkle') {
          // 4-point diamond star
          ctx.beginPath();
          const s = p.size * 1.5;
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.35, -s * 0.35);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.35, s * 0.35);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.35, s * 0.35);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.35, -s * 0.35);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      }
    }

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  render();
}
