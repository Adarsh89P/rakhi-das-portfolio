/* ==========================================================================
   MALTA TAXI — the hero's WebGL scene
   ==========================================================================
   An ES module, loaded with `type="module"` and importing three.js straight
   from a pinned CDN URL. No import map, no bundler, no build step: the file
   the browser fetches is the file in the repo, which is the same deal as
   every other script on this site.

   WHAT IT DRAWS
     - The app render (public/MaltaTaxi/malta-devices.png, transparent) on a
       plane, lit by two coloured point lights so the devices pick up the
       page's red and cyan rather than sitting flat on top of it.
     - A particle field in front of and behind that plane, which is what
       actually sells the depth: at 900 points the parallax between near and
       far particles is readable at a glance, and the devices float *in* it
       rather than on it.
     - A slow camera orbit driven by the pointer, so the whole scene has one
       viewpoint and the parallax is real perspective rather than per-layer
       translation.

   WHAT IT REFUSES TO DO
     - Run when the reader asked for reduced motion.
     - Run on a coarse pointer. A phone has no cursor to drive the camera,
       a much tighter power budget, and a static hero that already looks
       finished — three reasons and no counter-argument.
     - Run when WebGL is unavailable, or when three.js fails to load. Both
       are caught; both leave the static hero exactly as it is.
     - Draw while the hero is off screen. An IntersectionObserver stops the
       loop, so scrolling to the bottom of the page costs nothing.

   The canvas only becomes visible via `.is-live`, and that class is added at
   the end of a successful first frame — never before. So every failure path
   above ends with the reader looking at the static composition, which is a
   finished design in its own right, not a fallback.

   POINTER, ONCE
   This module also owns `--mx` / `--my` on <body>, because the CSS parallax
   and the WebGL camera want the same two numbers and there is no reason to
   read the pointer twice. They are set even when the scene itself declines
   to run, which is why this listener is installed before any of the bail-out
   checks below.
   ========================================================================== */

const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js';

const motion = window.SiteMotion;
const stage = document.getElementById('mStage');
const canvas = document.getElementById('mCanvas');

/* ---------------------------------------------------------------------------
   The pointer, published as two custom properties
   ---------------------------------------------------------------------------
   Written inside the shared rAF rather than in the listener: pointermove can
   fire many times per frame, and each write to a custom property that layout
   depends on is a style invalidation. Storing and flushing once per frame
   collapses that to one. */
let px = 0.5;
let py = 0.5;
let pointerDirty = false;

const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (fine && motion && !motion.reduced) {
  window.addEventListener('pointermove', (e) => {
    px = e.clientX / window.innerWidth;
    py = e.clientY / window.innerHeight;
    pointerDirty = true;
    motion.refresh();
  }, { passive: true });

  motion.onFrame(() => {
    if (!pointerDirty) return;
    pointerDirty = false;
    document.body.style.setProperty('--mx', px.toFixed(4));
    document.body.style.setProperty('--my', py.toFixed(4));
  });
}

/* ---------------------------------------------------------------------------
   Everything past here is the scene, and every line of it is optional
   --------------------------------------------------------------------------- */
if (stage && canvas && fine && motion && !motion.reduced && hasWebGL()) {
  init().catch(() => {
    /* Deliberately silent, and deliberately empty. Any failure — the CDN is
       blocked, the texture 404s, the context is lost on a machine with no
       GPU to spare — means `.is-live` is never added and the static hero
       stays. There is nothing for the reader to be told about. */
  });
}

/* A context probe, not a UA sniff: some machines have WebGL disabled by
   policy or driver blocklist and report every other capability normally. The
   probe context is released immediately so it does not count against the
   browser's small per-page context budget. */
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch (e) {
    return false;
  }
}

async function init() {
  const THREE = await import(THREE_URL);

  const scene = new THREE.Scene();

  /* A narrow field of view. A wide one would exaggerate the perspective into
     a fish-eye at the frame edges, and the whole point of the orbit below is
     that it reads as a camera move, not a distortion. */
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,          /* the page's own gradient shows through */
    antialias: true,
    powerPreference: 'low-power'
  });
  renderer.setClearColor(0x000000, 0);

  /* Capped at 2. Beyond that the pixel count quadruples for a difference
     nobody can see, and on a 3x phone-class panel it is the difference
     between a smooth hero and a hot one. */
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  /* ---- Light ------------------------------------------------------------
     Two coloured points and a dim ambient. The reds and cyans are the page's
     own accent tokens, so the devices are lit BY the page rather than
     composited over it — the single cheapest thing that makes a flat PNG
     read as an object in a space. */
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));

  const keyLight = new THREE.PointLight(0xfa0501, 26, 26);
  keyLight.position.set(-3.4, 2.2, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x4fd8ff, 16, 26);
  rimLight.position.set(3.6, -1.8, 3);
  scene.add(rimLight);

  /* ---- The devices ------------------------------------------------------ */
  const texture = await loadTexture(THREE, '../public/MaltaTaxi/malta-devices.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  /* The plane is sized from the texture's real aspect ratio, so the render is
     never stretched no matter what is dropped in to replace it. */
  const aspect = texture.image.width / texture.image.height;
  const height = 5.1;

  const devices = new THREE.Mesh(
    new THREE.PlaneGeometry(height * aspect, height),
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 0.72,
      metalness: 0.05,
      /* The render's own alpha is a clean cutout, so a hard cut is both
         correct and cheaper than sorting a translucent plane every frame. */
      alphaTest: 0.04
    })
  );
  scene.add(devices);

  /* ---- The particle field ----------------------------------------------
     Two shells, not one. The near shell is larger and brighter and passes in
     FRONT of the devices; the far shell is small, dim and behind. A single
     uniform cloud reads as noise on a flat plane — it is the difference in
     size and speed between the two that the eye reads as distance. */
  const near = makeField(THREE, 320, 9, 0.055, 0xff6b60, 0.85);
  const far = makeField(THREE, 620, 17, 0.03, 0x8b6bff, 0.5);
  scene.add(near, far);

  /* ---- Resize -----------------------------------------------------------
     Driven by the element's own box, not the window: the stage is a grid
     cell whose size changes when the hero reflows around it, which a resize
     listener alone would miss. */
  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(stage);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }
  resize();

  /* ---- The loop --------------------------------------------------------- */
  let running = true;
  let live = false;
  let camX = 0;
  let camY = 0;
  const clock = new THREE.Clock();

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);

    const t = clock.getElapsedTime();

    /* The camera chases the pointer instead of snapping to it. The 0.045
       coefficient is the whole feel of the thing: high enough to respond,
       low enough that a flicked mouse arrives as a glide rather than a jump.
       Framerate-independence is not worth the complexity here — the scene is
       ambient, and a fast display simply gets a slightly quicker glide. */
    camX += ((px - 0.5) * 2.6 - camX) * 0.045;
    camY += ((0.5 - py) * 1.7 - camY) * 0.045;

    camera.position.x = camX;
    camera.position.y = camY;
    camera.lookAt(0, 0, 0);

    /* A slow independent drift so the scene is alive when the pointer is
       still — without it, an idle hero is a photograph. */
    devices.rotation.y = camX * 0.06 + Math.sin(t * 0.22) * 0.035;
    devices.rotation.x = camY * 0.05 + Math.cos(t * 0.18) * 0.022;
    devices.position.y = Math.sin(t * 0.34) * 0.12;

    /* Counter-rotating shells: the near field turns one way and the far the
       other, which reads as the two lying at genuinely different depths. */
    near.rotation.y = t * 0.026;
    far.rotation.y = t * -0.016;
    far.rotation.x = t * 0.008;

    renderer.render(scene, camera);

    /* Revealed only after a frame has actually been drawn. Adding the class
       any earlier would cross-fade the static image out over a canvas that
       might still be blank. */
    if (!live) {
      live = true;
      stage.classList.add('is-live');
    }
  }

  /* Off screen is off. The hero is 100svh tall, so scrolling past it is the
     common case, not an edge case. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      if (visible === running) return;
      running = visible;
      if (running) frame();
    }, { threshold: 0 }).observe(stage);
  }

  /* A lost context (GPU reset, tab backgrounded for a long time) would
     otherwise leave a permanently blank canvas on top of the hero. Put the
     static composition back instead. */
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    running = false;
    stage.classList.remove('is-live');
  });

  frame();
}

function loadTexture(THREE, url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject);
  });
}

/* One shell of the particle field. Points are distributed on a sphere by
   inverse-transform sampling of cos(phi) — the naive `phi = random * PI`
   bunches them at the poles, which is visible as two bright knots. */
function makeField(THREE, count, radius, size, color, opacity) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    /* Cube-rooted so the points fill the volume evenly rather than piling up
       near the surface, which is what a uniform radius would do. */
    const r = radius * Math.cbrt(Math.random());

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return new THREE.Points(geometry, new THREE.PointsMaterial({
    color,
    size,
    sizeAttenuation: true,
    transparent: true,
    opacity,
    /* Additive, so overlapping particles brighten instead of stacking into
       flat opaque dots — and no depth write, so they never punch a hole in
       the transparent device plane. */
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
}
