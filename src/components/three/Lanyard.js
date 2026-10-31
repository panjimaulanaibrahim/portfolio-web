"use client";

// 3D ID card on a lanyard, behind the hero text (desktop only; phones keep the flat card).
// Same behaviour as the approved "Lanyard Twist Lab" simulation:
// - The strap is a solid 3D band (printed front and back, plus side edges) that bends and twists.
// - The card hangs from a metal ring through a hole in the card; the ring links into a clamp
//   at the end of the strap, so the joint stays clean at any angle.
// - Click the card: the strap twists about one turn, springs back the other way, swings back and
//   forth a few times getting smaller, and stops facing front (a damped torsion spring).
//   Clicking the left or right half turns it the other way.
// - Drag the card: it swings like a heavy pendulum. The strap stays nearly taut and is stiff
//   enough that it can never fold back onto itself.
// Plain three.js with a small hand-written rope simulation, so no physics engine is needed.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createCardTextures, CARD_HOLE } from "./cardTextures";

// ---------- Sizes (scene units) ----------
const CARD_W = 2;
const CARD_H = 2.8;
const CARD_D = 0.04;
const CORNER = 0.12;
const HOLE_R = (CARD_HOLE.radius / 1400) * CARD_H; // 0.09
const HOLE_Y = CARD_H / 2 - (CARD_HOLE.fromTop / 1400) * CARD_H; // hole centre, card-local
const RING_R = 0.16;
const RING_TUBE = 0.03;
const CLAMP_H = 0.18;
const STRAP_W = 0.34;
const STRAP_T = 0.035;
const STRAP_LEN = 3.2;
const N = 16; // rope points
const SEG = STRAP_LEN / (N - 1);
const S = 140; // samples along the drawn strap

// Clamp at the strap end, then a small loop; the ring hangs from that loop and goes through the hole
const PIVOT_Y = -CLAMP_H + 0.01;
const RING_CY = -CLAMP_H - RING_R + 0.01;
const HOLE_WORLD_Y = RING_CY - RING_R - HOLE_R + RING_TUBE; // hole's top edge rests on the ring
const CARD_CY = HOLE_WORLD_Y - HOLE_Y;

// ---------- Motion tuning (values approved in the simulation) ----------
const PEAK_DEG = 360; // first twist after a click
const PERIOD = 2.0; // seconds for one back-and-forth
const BETA = 1.1; // damping: settles in about 4 / BETA = 3.6 s
const CARD_INV_MASS = 0.08; // card is ~12x heavier than one strap segment
const TAUT = 0.85; // card stays at least 85% of the strap length from the top end
const MAX_SWING = 0.95; // rad, about 55 degrees to the side
const BEND = [
  [2, 1.8],
  [3, 2.55],
  [4, 3.25],
]; // minimum distance across 2, 3 and 4 segments: smooth bends, never a fold
const CLICK_TOLERANCE = 6; // px
const CAM_Z = 9.5;
const FOV = 35;

function cardShape() {
  const w = CARD_W;
  const h = CARD_H;
  const r = CORNER;
  const x = -w / 2;
  const y = -h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const hole = new THREE.Path();
  hole.absarc(0, HOLE_Y, HOLE_R, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

// Flat face with the same outline and hole as the card body; texture spans the whole card
function faceGeometry(shape) {
  const geometry = new THREE.ShapeGeometry(shape, 24);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) + CARD_W / 2) / CARD_W, (position.getY(i) + CARD_H / 2) / CARD_H);
  }
  return geometry;
}

// One side of the strap: a strip with 2 vertices per sample. flip turns the face the other way.
function strip(material, flip) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(S * 2 * 3), 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(S * 2 * 2), 2));
  const index = [];
  for (let j = 0; j < S - 1; j++) {
    const a = j * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    if (flip) index.push(a, b, c, b, d, c);
    else index.push(a, c, b, b, c, d);
  }
  geometry.setIndex(index);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

// Builds the whole scene inside `host`, listens for the pointer on `source`, returns a cleanup function
function createLanyardScene(host, source, textures, onFirstFrame) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.pointerEvents = "none"; // text and buttons above stay clickable
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const envMap = pmrem.fromScene(roomEnvironment, 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);
  scene.add(new THREE.HemisphereLight(0xbcd0ff, 0x05070d, 0.6));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(3, 4, 6);
  const rimLight = new THREE.DirectionalLight(0x5b8cff, 1.6);
  rimLight.position.set(-4, 2, -5);
  scene.add(keyLight, rimLight);

  // ----- Card -----
  const shape = cardShape();
  const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: CARD_D,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 20,
  });
  bodyGeometry.translate(0, 0, -CARD_D / 2);
  const frontGeometry = faceGeometry(shape);
  const backGeometry = faceGeometry(shape);
  backGeometry.rotateY(Math.PI);
  const faceZ = CARD_D / 2 + 0.012;

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1a2440, roughness: 0.5, metalness: 0.2 });
  const frontMaterial = new THREE.MeshPhysicalMaterial({ map: textures.front, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const backMaterial = new THREE.MeshPhysicalMaterial({ map: textures.back, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  const front = new THREE.Mesh(frontGeometry, frontMaterial);
  front.position.z = faceZ;
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.z = -faceZ;
  const card = new THREE.Group();
  card.add(body, front, back);
  card.position.y = CARD_CY - PIVOT_Y;

  // ----- Clamp, loop and ring -----
  const metal = new THREE.MeshStandardMaterial({ color: 0xc8d0dc, metalness: 1, roughness: 0.25 });
  const clampGeometry = new THREE.BoxGeometry(STRAP_W + 0.06, CLAMP_H, 0.07);
  const loopGeometry = new THREE.TorusGeometry(0.05, 0.018, 10, 24);
  const ringGeometry = new THREE.TorusGeometry(RING_R, RING_TUBE, 16, 48);
  const clamp = new THREE.Mesh(clampGeometry, metal);
  clamp.position.y = -CLAMP_H / 2 + 0.02;
  const clampLoop = new THREE.Mesh(loopGeometry, metal);
  clampLoop.position.y = PIVOT_Y;
  const ring = new THREE.Mesh(ringGeometry, metal);
  ring.rotation.y = Math.PI / 2; // through the hole, so perpendicular to the card
  ring.position.y = RING_CY - PIVOT_Y;

  const hanger = new THREE.Group(); // clamp: lines up with the strap end
  hanger.add(clamp, clampLoop);
  const dangle = new THREE.Group(); // ring + card: swing on the clamp loop, hanging down
  dangle.add(ring, card);
  scene.add(hanger, dangle);

  // ----- Strap -----
  const printMaterial = new THREE.MeshStandardMaterial({ map: textures.strap, roughness: 0.62, metalness: 0.05 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
  const strapFront = strip(printMaterial, false);
  const strapBack = strip(printMaterial, true);
  const edgeLeft = strip(edgeMaterial, false);
  const edgeRight = strip(edgeMaterial, true);
  const strapMeshes = [strapFront, strapBack, edgeLeft, edgeRight];
  scene.add(...strapMeshes);

  // ----- Rope simulation (verlet) -----
  const anchor = new THREE.Vector3();
  const pts = Array.from({ length: N }, (_, i) => {
    const p = new THREE.Vector3(0, -i * SEG, 0);
    return { p, prev: p.clone(), inv: i === 0 ? 0 : i === N - 1 ? CARD_INV_MASS : 1 };
  });
  const end = pts[N - 1];
  const strapLead = new THREE.Vector3(); // guides the strap straight into the clamp
  const curve = new THREE.CatmullRomCurve3(
    [...pts.slice(0, N - 2).map((q) => q.p), strapLead, end.p],
    false,
    "centripetal"
  );
  const gravity = new THREE.Vector3(0, -22, 0);
  const tmp = new THREE.Vector3();

  // ----- Torsion spring for the card's turn -----
  const wd = (2 * Math.PI) / PERIOD;
  const stiffness = wd * wd + BETA * BETA;
  const damping = 2 * BETA;
  const firstPeakTime = Math.atan2(wd, BETA) / wd;
  const peakPerSpeed = (Math.exp(-BETA * firstPeakTime) * Math.sin(wd * firstPeakTime)) / wd;
  const kick = THREE.MathUtils.degToRad(PEAK_DEG) / peakPerSpeed;
  let theta = 0;
  let omega = 0;
  let time = 0;

  let dragging = false;
  const dragTarget = new THREE.Vector3();

  function keepTaut(v) {
    tmp.subVectors(v, anchor);
    const length = THREE.MathUtils.clamp(tmp.length(), STRAP_LEN * TAUT, STRAP_LEN * 0.98);
    const angle = THREE.MathUtils.clamp(Math.atan2(tmp.x, -tmp.y), -MAX_SWING, MAX_SWING);
    return v.set(anchor.x + Math.sin(angle) * length, anchor.y - Math.cos(angle) * length, 0);
  }

  function step(dt) {
    time += dt;
    for (const q of pts) {
      if (q.inv === 0) continue;
      const isCard = q === end;
      tmp.subVectors(q.p, q.prev).multiplyScalar(isCard ? 0.975 : 0.97);
      q.prev.copy(q.p);
      q.p.add(tmp).addScaledVector(gravity, dt * dt * (isCard ? 1.6 : 1));
      q.p.z *= 0.96;
    }
    if (dragging) {
      end.prev.copy(end.p);
      end.p.lerp(dragTarget, 0.2);
    }
    for (let iteration = 0; iteration < 24; iteration++) {
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const w = a.inv + b.inv;
        if (w === 0) continue;
        tmp.subVectors(b.p, a.p);
        const length = tmp.length() || 1e-6;
        const diff = (length - SEG) / length;
        a.p.addScaledVector(tmp, (diff * a.inv) / w);
        b.p.addScaledVector(tmp, (-diff * b.inv) / w);
      }
      for (const [span, ratio] of BEND) {
        for (let i = 0; i + span < N; i++) {
          const a = pts[i];
          const b = pts[i + span];
          const w = a.inv + b.inv;
          if (w === 0) continue;
          tmp.subVectors(b.p, a.p);
          const length = tmp.length() || 1e-6;
          const min = SEG * ratio;
          if (length >= min) continue;
          const diff = (length - min) / length;
          a.p.addScaledVector(tmp, (diff * a.inv) / w);
          b.p.addScaledVector(tmp, (-diff * b.inv) / w);
        }
      }
      tmp.subVectors(end.p, anchor);
      if (tmp.length() < STRAP_LEN * TAUT) end.p.copy(anchor).addScaledVector(tmp.normalize(), STRAP_LEN * TAUT);
    }
    const breeze = 0.35 * Math.sin(time * 0.7) + 0.2 * Math.sin(time * 1.3 + 1);
    omega += (-stiffness * theta - damping * omega + breeze) * dt;
    theta += omega * dt;
  }

  // ----- Drawing -----
  const Y = new THREE.Vector3(0, 1, 0);
  const NEG_Y = new THREE.Vector3(0, -1, 0);
  const X = new THREE.Vector3(1, 0, 0);
  const qTilt = new THREE.Quaternion();
  const qHang = new THREE.Quaternion();
  const qYaw = new THREE.Quaternion();
  const qIdentity = new THREE.Quaternion();
  const qTransport = new THREE.Quaternion();
  const P = new THREE.Vector3();
  const T = new THREE.Vector3();
  const side = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const cross = new THREE.Vector3();
  const cardSide = new THREE.Vector3();
  const Pa = Array.from({ length: S }, () => new THREE.Vector3());
  const Ta = Array.from({ length: S }, () => new THREE.Vector3());
  const Sa = Array.from({ length: S }, () => new THREE.Vector3());
  const tile = STRAP_W * (1024 / 96);

  function updateVisuals() {
    tmp.subVectors(end.p, pts[N - 3].p).normalize();
    qTilt.setFromUnitVectors(NEG_Y, tmp);
    const tiltAngle = tmp.angleTo(NEG_Y);
    qHang.copy(qIdentity).slerp(qTilt, tiltAngle > 1e-4 ? Math.min(0.8, 0.6 / tiltAngle) : 0.8);
    qYaw.setFromAxisAngle(Y, theta);
    hanger.position.copy(end.p);
    hanger.quaternion.multiplyQuaternions(qTilt, qYaw);
    dangle.quaternion.multiplyQuaternions(qHang, qYaw);
    dangle.position.set(0, PIVOT_Y, 0).applyQuaternion(hanger.quaternion).add(end.p);
    strapLead.set(0, 0.34, 0).applyQuaternion(hanger.quaternion).add(end.p);

    // Centre line, with a sideways direction carried along it without flipping (parallel transport)
    curve.updateArcLengths();
    const length = curve.getLength();
    for (let j = 0; j < S; j++) {
      const u = j / (S - 1);
      curve.getPointAt(u, Pa[j]);
      curve.getTangentAt(u, Ta[j]);
      if (j === 0) {
        Sa[0].copy(X).addScaledVector(Ta[0], -X.dot(Ta[0])).normalize();
        continue;
      }
      qTransport.setFromUnitVectors(Ta[j - 1], Ta[j]);
      Sa[j].copy(Sa[j - 1]).applyQuaternion(qTransport);
      Sa[j].addScaledVector(Ta[j], -Sa[j].dot(Ta[j])).normalize();
    }

    // Total twist: exactly what lines the strap's end up with the clamp, with the card's full turns
    const tEnd = Ta[S - 1];
    cardSide.copy(X).applyQuaternion(hanger.quaternion);
    cardSide.addScaledVector(tEnd, -cardSide.dot(tEnd)).normalize();
    cross.crossVectors(Sa[S - 1], cardSide);
    const wrapped = Math.atan2(cross.dot(tEnd), Sa[S - 1].dot(cardSide));
    const twist = wrapped + 2 * Math.PI * Math.round((-theta - wrapped) / (2 * Math.PI));

    const attr = (mesh) => mesh.geometry.attributes;
    const pf = attr(strapFront).position;
    const pb = attr(strapBack).position;
    const pl = attr(edgeLeft).position;
    const pr = attr(edgeRight).position;
    const uf = attr(strapFront).uv;
    const ub = attr(strapBack).uv;
    const hw = STRAP_W / 2;
    const ht = STRAP_T / 2;
    const put = (target, i, sx, nz) =>
      target.setXYZ(
        i,
        P.x + side.x * sx + normal.x * nz,
        P.y + side.y * sx + normal.y * nz,
        P.z + side.z * sx + normal.z * nz
      );
    for (let j = 0; j < S; j++) {
      const u = j / (S - 1);
      P.copy(Pa[j]);
      T.copy(Ta[j]);
      const phi = twist * u; // twist spreads evenly from the fixed top to the card
      cross.crossVectors(T, Sa[j]);
      side.copy(Sa[j]).multiplyScalar(Math.cos(phi)).addScaledVector(cross, Math.sin(phi));
      normal.crossVectors(T, side);
      const along = (u * length) / tile;
      const a = j * 2;
      const b = a + 1;
      put(pf, a, -hw, ht);
      put(pf, b, hw, ht);
      put(pb, a, -hw, -ht);
      put(pb, b, hw, -ht);
      put(pl, a, -hw, -ht);
      put(pl, b, -hw, ht);
      put(pr, a, hw, -ht);
      put(pr, b, hw, ht);
      uf.setXY(a, along, 0);
      uf.setXY(b, along, 1);
      ub.setXY(a, along, 1);
      ub.setXY(b, along, 0);
    }
    for (const mesh of strapMeshes) {
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.geometry.attributes.uv.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    }
  }

  // ----- Layout: hang the card above the hero's right column -----
  function layout() {
    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const halfHeight = CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const unitsPerPx = (2 * halfHeight) / height;
    // Half of the 1152 px content width, minus half of the 400 px card column, from the centre
    const columnCentrePx = Math.min(width / 2, 576) - 232;
    const next = new THREE.Vector3(columnCentrePx * unitsPerPx, halfHeight + 0.5, 0);
    const shift = next.clone().sub(anchor);
    for (const q of pts) {
      q.p.add(shift);
      q.prev.add(shift);
    }
    anchor.copy(next);
  }
  layout();

  // ----- Pointer: click to twist, drag to swing -----
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const planeHit = new THREE.Vector3();
  const grabOffset = new THREE.Vector3();
  const pickables = [body, front, back];
  let press = null;

  function aim(event) {
    const rect = host.getBoundingClientRect();
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
  }
  const onControl = (event) => event.target instanceof Element && event.target.closest("a, button, input, textarea, select, iframe");

  function onPointerDown(event) {
    if (event.button !== 0 || onControl(event)) return;
    aim(event);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (!hit) return;
    event.preventDefault(); // no text selection while holding the card
    if (raycaster.ray.intersectPlane(dragPlane, planeHit)) grabOffset.subVectors(planeHit, end.p).setZ(0);
    press = { x: event.clientX, y: event.clientY, side: card.worldToLocal(hit.point.clone()).x >= 0 ? 1 : -1 };
    source.setPointerCapture?.(event.pointerId);
  }
  function onPointerMove(event) {
    if (!press) {
      if (onControl(event)) return;
      aim(event);
      source.style.cursor = raycaster.intersectObjects(pickables, false).length ? "grab" : "";
      return;
    }
    if (!dragging && Math.hypot(event.clientX - press.x, event.clientY - press.y) > CLICK_TOLERANCE) {
      dragging = true;
      end.inv = 0;
      source.style.cursor = "grabbing";
    }
    if (dragging) {
      aim(event);
      if (raycaster.ray.intersectPlane(dragPlane, planeHit)) keepTaut(dragTarget.subVectors(planeHit, grabOffset));
    }
  }
  function onPointerUp() {
    if (!press) return;
    if (dragging) {
      tmp.subVectors(end.p, end.prev).clampLength(0, 0.05); // no flinging on release
      end.prev.copy(end.p).sub(tmp);
    } else {
      omega = THREE.MathUtils.clamp(omega + press.side * kick, -2 * kick, 2 * kick);
    }
    dragging = false;
    end.inv = CARD_INV_MASS;
    press = null;
    source.style.cursor = "grab";
  }
  source.addEventListener("pointerdown", onPointerDown);
  source.addEventListener("pointermove", onPointerMove);
  source.addEventListener("pointerup", onPointerUp);
  source.addEventListener("pointercancel", onPointerUp);

  // ----- Loop: runs only while the hero is on screen and the tab is visible -----
  let lastTime = performance.now();
  const DT = 1 / 120;
  let accumulator = 0;
  let frameId = 0;
  let onScreen = true;
  let firstFrame = true;

  function frame(now) {
    accumulator += Math.min((now - lastTime) / 1000, 1 / 20);
    lastTime = now;
    while (accumulator >= DT) {
      step(DT);
      accumulator -= DT;
    }
    updateVisuals();
    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      onFirstFrame?.();
    }
    frameId = requestAnimationFrame(frame);
  }
  function start() {
    cancelAnimationFrame(frameId);
    lastTime = performance.now();
    frameId = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(frameId);
  }
  const syncRunning = () => (onScreen && !document.hidden ? start() : stop());

  // Let the card settle before the first frame so it appears already hanging still
  for (let i = 0; i < 240; i++) step(DT);
  theta = 0;
  omega = 0;
  start();

  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    syncRunning();
  });
  visibility.observe(host);
  document.addEventListener("visibilitychange", syncRunning);
  const resizer = new ResizeObserver(layout);
  resizer.observe(host);

  return () => {
    stop();
    visibility.disconnect();
    resizer.disconnect();
    document.removeEventListener("visibilitychange", syncRunning);
    source.removeEventListener("pointerdown", onPointerDown);
    source.removeEventListener("pointermove", onPointerMove);
    source.removeEventListener("pointerup", onPointerUp);
    source.removeEventListener("pointercancel", onPointerUp);
    source.style.cursor = "";
    for (const mesh of strapMeshes) mesh.geometry.dispose();
    [bodyGeometry, frontGeometry, backGeometry, clampGeometry, loopGeometry, ringGeometry].forEach((g) => g.dispose());
    [bodyMaterial, frontMaterial, backMaterial, metal, printMaterial, edgeMaterial].forEach((m) => m.dispose());
    [textures.front, textures.back, textures.strap, envMap].forEach((t) => t.dispose());
    roomEnvironment.dispose?.();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

// eventSource: the element that receives pointer events (the hero section). The canvas itself
// ignores the pointer, so buttons and links on top of it stay clickable.
export default function Lanyard({ onReady, eventSource }) {
  const container = useRef(null);
  const readyCallback = useRef(onReady);

  useEffect(() => {
    readyCallback.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const host = container.current;
    if (!host || !eventSource) return;
    let cancelled = false;
    let cleanup = () => {};
    createCardTextures().then((textures) => {
      if (cancelled) return;
      cleanup = createLanyardScene(host, eventSource, textures, () => readyCallback.current?.());
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [eventSource]);

  return <div ref={container} className="h-full w-full" />;
}
