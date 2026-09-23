import { useEffect, useRef, useState } from 'react';
import type { Product } from '../../types';

interface ModelViewerProps {
  product: Product;
  filamentHex?: string;
}

type ViewerStatus = 'loading' | 'ready' | 'fallback';

/**
 * Lightweight procedural 3D preview (dynamic three import).
 * Shows a skeleton while three.js boots, then the live mesh.
 * Falls back to a clear message if three is not installed.
 */
export function ModelViewer({ product, filamentHex = '#1a1a1a' }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ViewerStatus>('loading');

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const THREE = await import('three');
        if (cancelled || !mountRef.current) return;

        const width = el.clientWidth || 400;
        const height = el.clientHeight || 400;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0c);

        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(2.2, 1.6, 2.8);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        el.innerHTML = '';
        el.appendChild(renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 0.55);
        scene.add(ambient);
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(3, 5, 2);
        scene.add(dir);
        const rim = new THREE.DirectionalLight(0x34d399, 0.35);
        rim.position.set(-2, 1, -2);
        scene.add(rim);

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(filamentHex),
          roughness: 0.45,
          metalness: 0.15,
        });

        let mesh: InstanceType<typeof THREE.Mesh>;
        const type = product.modelType ?? 'generic';

        if (type === 'planter') {
          const geo = new THREE.CylinderGeometry(0.55, 0.7, 0.9, 6);
          mesh = new THREE.Mesh(geo, material);
        } else if (type === 'hub') {
          const geo = new THREE.BoxGeometry(1.4, 0.35, 0.6);
          mesh = new THREE.Mesh(geo, material);
        } else if (type === 'stand') {
          const geo = new THREE.TorusGeometry(0.55, 0.12, 16, 48);
          mesh = new THREE.Mesh(geo, material);
          mesh.rotation.x = Math.PI / 2.5;
        } else if (type === 'mask') {
          const geo = new THREE.DodecahedronGeometry(0.75, 0);
          mesh = new THREE.Mesh(geo, material);
        } else if (type === 'sculpture') {
          const geo = new THREE.IcosahedronGeometry(0.75, 0);
          mesh = new THREE.Mesh(geo, material);
        } else {
          const geo = new THREE.OctahedronGeometry(0.7, 0);
          mesh = new THREE.Mesh(geo, material);
        }

        scene.add(mesh);

        const grid = new THREE.GridHelper(4, 12, 0x1a3d32, 0x12201c);
        grid.position.y = -0.85;
        scene.add(grid);

        let dragging = false;
        let prevX = 0;
        let prevY = 0;
        let rotY = 0.4;
        let rotX = 0.3;

        const onDown = (e: PointerEvent) => {
          dragging = true;
          prevX = e.clientX;
          prevY = e.clientY;
          el.setPointerCapture(e.pointerId);
        };
        const onUp = () => {
          dragging = false;
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          rotY += (e.clientX - prevX) * 0.01;
          rotX += (e.clientY - prevY) * 0.01;
          rotX = Math.max(-0.8, Math.min(0.8, rotX));
          prevX = e.clientX;
          prevY = e.clientY;
        };
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          camera.position.multiplyScalar(e.deltaY > 0 ? 1.06 : 0.94);
        };

        // Resize observer so the canvas stays sharp on layout changes
        const resizeObserver = new ResizeObserver(() => {
          if (!mountRef.current) return;
          const w = mountRef.current.clientWidth;
          const h = mountRef.current.clientHeight;
          if (w < 1 || h < 1) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        });
        resizeObserver.observe(el);

        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('wheel', onWheel, { passive: false });

        let frame = 0;
        const animate = () => {
          frame = requestAnimationFrame(animate);
          if (!dragging) rotY += 0.004;
          mesh.rotation.y = rotY;
          mesh.rotation.x = rotX;
          renderer.render(scene, camera);
        };
        animate();

        if (!cancelled) setStatus('ready');

        cleanup = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          el.removeEventListener('pointerdown', onDown);
          el.removeEventListener('pointerup', onUp);
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('wheel', onWheel);
          renderer.dispose();
          material.dispose();
          mesh.geometry.dispose();
          el.innerHTML = '';
        };
      } catch {
        if (cancelled) return;
        setStatus('fallback');
        if (el) {
          el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#0a0a0c;color:#34d399;font-size:13px;padding:1rem;text-align:center">
            3D preview needs <code style="margin:0 4px">three</code> package.<br/>Run: npm install three @types/three
          </div>`;
        }
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [product.id, product.modelType, filamentHex]);

  return (
    <div className="relative">
      {/* Loading skeleton overlay — sits above the mount until three is ready */}
      {status === 'loading' && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg border border-emerald-500/20 bg-brand-950"
          aria-busy="true"
          aria-label="Loading 3D preview"
        >
          <div className="h-16 w-16 animate-pulse rounded-full bg-emerald-500/20" />
          <div className="mt-4 h-3 w-32 animate-pulse rounded bg-brand-800" />
          <p className="mt-3 text-xs text-emerald-400/80">Loading 3D preview…</p>
        </div>
      )}

      <div
        ref={mountRef}
        className="aspect-square w-full rounded-lg overflow-hidden border border-emerald-500/20 bg-brand-950 cursor-grab active:cursor-grabbing"
        role="img"
        aria-label={`3D preview of ${product.name}`}
      />

      <p className="mt-2 text-xs text-brand-500 text-center">
        {status === 'ready'
          ? 'Drag to rotate · scroll to zoom · colour updates with filament'
          : status === 'loading'
            ? 'Preparing interactive preview…'
            : 'Install three.js for the live 3D preview'}
      </p>
    </div>
  );
}
