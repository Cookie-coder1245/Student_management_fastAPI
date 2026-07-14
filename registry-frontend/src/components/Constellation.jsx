import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The signature visual: students rendered as small lit nodes,
 * clustered into three orbiting rings — one per city — slowly
 * turning like a campus star-chart. Cluster sizes follow the
 * real data passed in via `groups`.
 */
export default function Constellation({ groups = [] }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const goldColor = new THREE.Color("#e8a94c");
    const tealColor = new THREE.Color("#4fbdb0");
    const lineColor = new THREE.Color("#2a3457");

    const root = new THREE.Group();
    scene.add(root);

    // A faint central hub sphere — "the registry" itself
    const hubGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const hubMat = new THREE.MeshBasicMaterial({
      color: goldColor,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    root.add(hub);

    const ringGroups = [];
    const safeGroups = groups.length ? groups : [{ label: "—", count: 6 }];

    safeGroups.forEach((group, gi) => {
      const ringGroup = new THREE.Group();
      const radius = 2.6 + gi * 1.55;
      const tilt = (gi - (safeGroups.length - 1) / 2) * 0.32;
      ringGroup.rotation.x = 0.5 + tilt;
      ringGroup.rotation.z = gi * 0.35;

      // orbit ring line
      const ringPoints = [];
      const segments = 96;
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.7,
      });
      ringGroup.add(new THREE.Line(ringGeo, ringMat));

      // student nodes on this ring
      const count = Math.max(3, Math.min(group.count, 14));
      const nodeColor = gi % 2 === 0 ? goldColor : tealColor;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + gi;
        const nodeGeo = new THREE.SphereGeometry(0.075, 12, 12);
        const nodeMat = new THREE.MeshBasicMaterial({ color: nodeColor });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(Math.cos(a) * radius, Math.sin(a * 3) * 0.12, Math.sin(a) * radius);

        const glowGeo = new THREE.SphereGeometry(0.16, 12, 12);
        const glowMat = new THREE.MeshBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.16,
        });
        node.add(new THREE.Mesh(glowGeo, glowMat));

        ringGroup.add(node);
      }

      root.add(ringGroup);
      ringGroups.push({ mesh: ringGroup, speed: 0.05 + gi * 0.015 });
    });

    let frameId;
    let t = 0;
    const animate = () => {
      t += prefersReduced ? 0 : 0.0038;
      root.rotation.y = t * 0.6;
      hub.rotation.y = t * 1.4;
      hub.rotation.x = t * 0.7;
      ringGroups.forEach(({ mesh, speed }, i) => {
        mesh.rotation.y = t * (i % 2 === 0 ? speed : -speed) * 6;
      });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      hubGeo.dispose();
      hubMat.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
    };
  }, [groups]);

  return <div ref={mountRef} className="constellation" aria-hidden="true" />;
}
