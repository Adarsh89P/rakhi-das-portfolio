/* ==========================================================================
   Liquid glass, WebGL path — prototype, opt-in
   ==========================================================================
   Ported from dashersw/liquid-glass-js. The CSS in styles.css reproduces
   that library's *geometry* — the rim/edge/corner falloffs, the tint — but
   not the one thing the shader exists for: displacement. It resamples the
   backdrop at an offset along the shape normal, so content behind the glass
   genuinely bends at the rim. CSS has no backdrop-relative displacement, so
   there the bands are painted as light instead. This file is the real thing,
   for comparison.

   Off by default. Load the page with ?glass=webgl to turn it on; anything
   else leaves the CSS version untouched. Nothing about the default page
   changes by this file being present.

   ---- Where this departs from the library, deliberately -------------------

   The library samples the backdrop by rasterising the whole document with
   html2canvas, then re-capturing as the page moves. Two reasons not to do
   that here:

     1. It hides glass elements during capture, so glass never refracts other
        glass. Our cards ARE the backdrop — they overlap each other's corners
        and there is nothing else behind them but the section's flat white.
        Captured the library's way, every card would sample plain white and
        refract nothing at all.
     2. A ~150KB dependency and a full-page rasterisation, to recover
        something we already know exactly: the backdrop behind card N is
        white plus the rounded, rotated, tinted rectangles of the other
        cards. So we draw that directly onto a 2D canvas — cheap, exact, no
        dependency, and it gives each card the neighbours the library's own
        capture rule would have excluded.

   What is lost by synthesising rather than capturing: a neighbour's text and
   logo are not in the backdrop, only its fill. The cards overlap at their
   corners, which is padding, so in practice there is little there to miss.
   ========================================================================== */
(function () {
  'use strict';

  if (!/(^|[?&])glass=webgl($|&)/.test(window.location.search)) return;

  var cards = Array.prototype.slice.call(document.querySelectorAll('.exp-card'));
  if (!cards.length) return;

  /* Transparency and motion are both accessibility settings, and this effect
     is the loud version of both. Leave those visitors on the CSS card. */
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return;

  var probe = document.createElement('canvas');
  var probeGl = probe.getContext('webgl2') || probe.getContext('webgl');
  if (!probeGl) return;

  /* ---- Shader -----------------------------------------------------------
     The fragment shader is container.js's, with the page-scroll uniforms
     dropped: our texture is local to one card rather than the whole
     document, so there is no scroll offset to correct for. The refraction
     maths, the 13x13 gaussian kernel, the tint mix and the rounded-rect mask
     are unchanged, including their default parameter values. */

  var VERT = [
    'attribute vec2 a_position;',
    'attribute vec2 a_texcoord;',
    'varying vec2 v_texcoord;',
    'void main() {',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '  v_texcoord = a_texcoord;',
    '}'
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'uniform sampler2D u_image;',
    'uniform vec2 u_resolution;',     /* card size, css px */
    'uniform vec2 u_textureSize;',    /* backdrop size, css px */
    'uniform vec2 u_margin;',         /* card origin inside the backdrop */
    'uniform float u_blurRadius;',
    'uniform float u_borderRadius;',
    'uniform float u_edgeIntensity;',
    'uniform float u_rimIntensity;',
    'uniform float u_baseIntensity;',
    'uniform float u_edgeDistance;',
    'uniform float u_rimDistance;',
    'uniform float u_baseDistance;',
    'uniform float u_cornerBoost;',
    'uniform float u_rippleEffect;',
    'uniform float u_tintOpacity;',
    'uniform float u_warp;',
    'varying vec2 v_texcoord;',
    '',
    /* Signed distance to a rounded rectangle: negative inside, 0 on the
       edge. Verbatim from the library. */
    'float roundedRectDistance(vec2 coord, vec2 size, float radius) {',
    '  vec2 center = size * 0.5;',
    '  vec2 pixelCoord = coord * size;',
    '  vec2 toCorner = abs(pixelCoord - center) - (center - radius);',
    '  float outsideCorner = length(max(toCorner, 0.0));',
    '  float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);',
    '  return outsideCorner + insideCorner - radius;',
    '}',
    '',
    'void main() {',
    '  vec2 coord = v_texcoord;',
    '',
    /* Card space -> backdrop space. The library does this against the whole
       page and its scroll offset; here the backdrop is the card's own
       neighbourhood, so it is one translate by the margin. */
    '  vec2 pixelInCard = coord * u_resolution;',
    '  vec2 textureCoord = (pixelInCard + u_margin) / u_textureSize;',
    '',
    '  float distFromEdgeShape = roundedRectDistance(coord, u_resolution, u_borderRadius);',
    '',
    /* Outward normal of the rounded rect, by gradient of the distance
       field. The library switches on shape type (rect / pill / circle); the
       cards are only ever rounded rects, so that branch is gone. */
    '  float eps = 1.0;',
    '  vec2 px = vec2(eps, 0.0) / u_resolution;',
    '  vec2 py = vec2(0.0, eps) / u_resolution;',
    '  vec2 shapeNormal = normalize(vec2(',
    '    roundedRectDistance(coord + px, u_resolution, u_borderRadius) -',
    '    roundedRectDistance(coord - px, u_resolution, u_borderRadius),',
    '    roundedRectDistance(coord + py, u_resolution, u_borderRadius) -',
    '    roundedRectDistance(coord - py, u_resolution, u_borderRadius)',
    '  ) + vec2(0.0001));',
    '',
    '  float distFromLeft = coord.x;',
    '  float distFromRight = 1.0 - coord.x;',
    '  float distFromTop = coord.y;',
    '  float distFromBottom = 1.0 - coord.y;',
    '  float distFromEdge = abs(distFromEdgeShape) / min(u_resolution.x, u_resolution.y);',
    '',
    /* The three falloffs. This is the whole material. */
    '  float normalizedDistance = distFromEdge * min(u_resolution.x, u_resolution.y);',
    '  float baseIntensity = 1.0 - exp(-normalizedDistance * u_baseDistance);',
    '  float edgeIntensity = exp(-normalizedDistance * u_edgeDistance);',
    '  float rimIntensity = exp(-normalizedDistance * u_rimDistance);',
    '',
    '  float baseComponent = u_warp > 0.5 ? baseIntensity * u_baseIntensity : 0.0;',
    '  float totalIntensity = baseComponent + edgeIntensity * u_edgeIntensity + rimIntensity * u_rimIntensity;',
    '  vec2 baseRefraction = shapeNormal * totalIntensity;',
    '',
    '  float cornerProximityX = min(distFromLeft, distFromRight);',
    '  float cornerProximityY = min(distFromTop, distFromBottom);',
    '  float cornerDistance = max(cornerProximityX, cornerProximityY);',
    '  float cornerNormalized = cornerDistance * min(u_resolution.x, u_resolution.y);',
    '  float cornerBoost = exp(-cornerNormalized * 0.3) * u_cornerBoost;',
    '  vec2 cornerRefraction = shapeNormal * cornerBoost;',
    '',
    '  vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);',
    '  float ripple = sin(distFromEdge * 25.0) * u_rippleEffect * rimIntensity;',
    '  vec2 textureRefraction = perpendicular * ripple;',
    '',
    '  textureCoord += baseRefraction + cornerRefraction + textureRefraction;',
    '',
    /* 13x13 gaussian, sigma = blurRadius / 2, as in the library. */
    '  vec4 color = vec4(0.0);',
    '  vec2 texelSize = 1.0 / u_textureSize;',
    '  float sigma = max(u_blurRadius / 2.0, 0.0001);',
    '  vec2 blurStep = texelSize * sigma;',
    '  float totalWeight = 0.0;',
    '  for (float i = -6.0; i <= 6.0; i += 1.0) {',
    '    for (float j = -6.0; j <= 6.0; j += 1.0) {',
    '      float d = length(vec2(i, j));',
    '      if (d > 6.0) continue;',
    '      float weight = exp(-(d * d) / (2.0 * sigma * sigma));',
    '      color += texture2D(u_image, textureCoord + vec2(i, j) * blurStep) * weight;',
    '      totalWeight += weight;',
    '    }',
    '  }',
    '  color /= totalWeight;',
    '',
    /* Vertical tint: white at the top to 0.7 grey at the bottom, mixed in at
       tintOpacity. The library then mixes a second time against colours it
       samples out of the page; that pass is dropped, because our synthesised
       backdrop is already the card tints it would be averaging. */
    '  vec3 topTint = vec3(1.0);',
    '  vec3 bottomTint = vec3(0.7);',
    '  vec3 gradientTint = mix(topTint, bottomTint, coord.y);',
    '  color = vec4(mix(color.rgb, gradientTint, u_tintOpacity), color.a);',
    '',
    /* Shape mask, smoothstepped over 1px for an antialiased rim. */
    '  float maskDistance = roundedRectDistance(coord, u_resolution, u_borderRadius);',
    '  float mask = 1.0 - smoothstep(-1.0, 1.0, maskDistance);',
    '  gl_FragColor = vec4(color.rgb, mask);',
    '}'
  ].join('\n');

  /* Library defaults, verbatim (container.js lines 608-618). */
  var PARAMS = {
    blurRadius: 5.0,
    edgeIntensity: 0.01,
    rimIntensity: 0.05,
    baseIntensity: 0.01,
    edgeDistance: 0.15,
    rimDistance: 0.8,
    baseDistance: 0.1,
    cornerBoost: 0.02,
    rippleEffect: 0.1,
    tintOpacity: 0.2,
    warp: false
  };

  /* How far outside the card the backdrop reaches. The largest displacement
     the parameters above can produce is (rim + edge + corner) ~= 0.08 of the
     texture, and a neighbour's corner intrudes further than that, so this is
     sized for the neighbours rather than for the maths. */
  var MARGIN = 48;

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      window.console && console.warn('[glass] shader:', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function program(gl) {
    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var pr = gl.createProgram();
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      window.console && console.warn('[glass] link:', gl.getProgramInfoLog(pr));
      return null;
    }
    return pr;
  }

  /* ---- Card geometry ----------------------------------------------------
     Read from layout + the custom properties that drive the fan, not from
     getBoundingClientRect: a rect is the axis-aligned bounding box of a
     rotated card, which is not the shape we need to draw. */
  function geometryOf(card) {
    var cs = getComputedStyle(card);
    function num(prop, fallback) {
      var v = parseFloat(cs.getPropertyValue(prop));
      return isNaN(v) ? fallback : v;
    }
    return {
      x: card.offsetLeft,
      y: card.offsetTop,
      w: card.offsetWidth,
      h: card.offsetHeight,
      /* The transform is composed from custom properties (see the note above
         [data-reveal] in styles.css) so it can be read back in pieces. */
      rotate: num('--card-rotate', 0) * Math.PI / 180,
      shift: num('--base-y', 0) + num('--lift', 0),
      radius: parseFloat(cs.borderTopLeftRadius) || 0,
      tint: cs.getPropertyValue('--card-tint').trim() || '#ffffff'
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* The backdrop behind one card: the section's own background, then every
     card painted where it actually sits — including the card being rendered.

     That inclusion is the one real judgement call in this file, and it went
     the other way first. The library hides glass elements before capturing,
     so glass never refracts glass; done that way here, each card sampled
     nothing but the section's white and came out a white rectangle with the
     tints gone. The mistake was treating a card's pastel as part of the
     *pane*. It isn't — it is the page underneath, the same as the colour
     under one of the library's buttons. Painted into the backdrop it gets
     refracted like any other content, and the payoff is at the rim: the
     displacement there pulls the surrounding white in under the fill's own
     edge, which is the lensing the CSS version can only imply. */
  function paintBackdrop(ctx, all, self, geo, sectionBg) {
    var W = geo.w + MARGIN * 2;
    var H = geo.h + MARGIN * 2;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = sectionBg;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < all.length; i++) {
      var g = all[i].geo;
      ctx.save();
      /* Into this backdrop's coordinate space: neighbour position relative
         to the card, plus the margin offset. */
      var cx = g.x - geo.x + MARGIN + g.w / 2;
      var cy = g.y - geo.y + MARGIN + g.h / 2 + g.shift;
      ctx.translate(cx, cy);
      ctx.rotate(g.rotate);
      ctx.fillStyle = g.tint;
      roundRect(ctx, -g.w / 2, -g.h / 2, g.w, g.h, g.radius);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ---- Per-card renderer ------------------------------------------------ */
  function makeCard(card) {
    var canvas = document.createElement('canvas');
    canvas.className = 'exp-card-glass';
    canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl2', { premultipliedAlpha: false, alpha: true }) ||
             canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });
    if (!gl) return null;

    var pr = program(gl);
    if (!pr) return null;
    gl.useProgram(pr);

    var posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(pr, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var texBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), gl.STATIC_DRAW);
    var texLoc = gl.getAttribLocation(pr, 'a_texcoord');
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var u = {};
    ['u_resolution', 'u_textureSize', 'u_margin', 'u_blurRadius', 'u_borderRadius',
     'u_edgeIntensity', 'u_rimIntensity', 'u_baseIntensity', 'u_edgeDistance',
     'u_rimDistance', 'u_baseDistance', 'u_cornerBoost', 'u_rippleEffect',
     'u_tintOpacity', 'u_warp', 'u_image'].forEach(function (name) {
      u[name] = gl.getUniformLocation(pr, name);
    });

    var backdrop = document.createElement('canvas');
    var bctx = backdrop.getContext('2d');

    card.appendChild(canvas);
    card.classList.add('has-webgl-glass');

    return {
      card: card,
      canvas: canvas,
      gl: gl,
      texture: texture,
      backdrop: backdrop,
      bctx: bctx,
      u: u,
      geo: null
    };
  }

  function render(inst, all, sectionBg, dpr) {
    var geo = inst.geo;
    var gl = inst.gl;
    var W = geo.w + MARGIN * 2;
    var H = geo.h + MARGIN * 2;

    if (inst.backdrop.width !== W || inst.backdrop.height !== H) {
      inst.backdrop.width = W;
      inst.backdrop.height = H;
    }
    paintBackdrop(inst.bctx, all, inst.card, geo, sectionBg);

    var cw = Math.round(geo.w * dpr);
    var ch = Math.round(geo.h * dpr);
    if (inst.canvas.width !== cw || inst.canvas.height !== ch) {
      inst.canvas.width = cw;
      inst.canvas.height = ch;
    }
    gl.viewport(0, 0, cw, ch);

    gl.bindTexture(gl.TEXTURE_2D, inst.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inst.backdrop);

    var u = inst.u;
    gl.uniform1i(u.u_image, 0);
    gl.uniform2f(u.u_resolution, geo.w, geo.h);
    gl.uniform2f(u.u_textureSize, W, H);
    gl.uniform2f(u.u_margin, MARGIN, MARGIN);
    gl.uniform1f(u.u_blurRadius, PARAMS.blurRadius);
    gl.uniform1f(u.u_borderRadius, geo.radius);
    gl.uniform1f(u.u_edgeIntensity, PARAMS.edgeIntensity);
    gl.uniform1f(u.u_rimIntensity, PARAMS.rimIntensity);
    gl.uniform1f(u.u_baseIntensity, PARAMS.baseIntensity);
    gl.uniform1f(u.u_edgeDistance, PARAMS.edgeDistance);
    gl.uniform1f(u.u_rimDistance, PARAMS.rimDistance);
    gl.uniform1f(u.u_baseDistance, PARAMS.baseDistance);
    gl.uniform1f(u.u_cornerBoost, PARAMS.cornerBoost);
    gl.uniform1f(u.u_rippleEffect, PARAMS.rippleEffect);
    gl.uniform1f(u.u_tintOpacity, PARAMS.tintOpacity);
    gl.uniform1f(u.u_warp, PARAMS.warp ? 1.0 : 0.0);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /* ---- Wiring ----------------------------------------------------------- */
  var instances = [];
  for (var i = 0; i < cards.length; i++) {
    var inst = makeCard(cards[i]);
    if (inst) instances.push(inst);
  }
  if (!instances.length) return;

  var section = document.getElementById('experience');
  var sectionBg = getComputedStyle(section).backgroundColor;
  if (!sectionBg || sectionBg === 'rgba(0, 0, 0, 0)') {
    sectionBg = getComputedStyle(document.body).backgroundColor || '#ffffff';
  }

  function renderAll() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var k;
    /* Read every geometry first, then draw — the usual split, and it matters
       here because paintBackdrop for one card reads all the others. */
    for (k = 0; k < instances.length; k++) instances[k].geo = geometryOf(instances[k].card);
    for (k = 0; k < instances.length; k++) render(instances[k], instances, sectionBg, dpr);
  }

  renderAll();

  /* Hover straightens a card out of the fan and lifts it 22px, which moves
     what is behind its neighbours — so the backdrops are stale until they
     are redrawn. The library re-captures the page for the same reason; here
     it is a handful of 2D fills, so it can just run on the transition. */
  var pending = 0;
  function schedule() {
    if (pending) return;
    pending = window.requestAnimationFrame(function () {
      pending = 0;
      renderAll();
    });
  }

  for (var j = 0; j < instances.length; j++) {
    instances[j].card.addEventListener('mouseenter', schedule);
    instances[j].card.addEventListener('mouseleave', schedule);
    instances[j].card.addEventListener('transitionend', schedule);
  }

  window.addEventListener('resize', schedule, { passive: true });
  /* Reveal transitions move the cards on first scroll-in. */
  window.addEventListener('load', schedule);
})();
