gsap.registerPlugin(ScrollTrigger);

// Layers already scroll together at 1x as normal page content (they're not
// position: fixed). data-speed describes how fast a layer should APPEAR to
// move relative to that base scroll: 1 = moves exactly with scroll (no extra
// offset), <1 = background layers that should lag behind (appear farther),
// >1 = foreground layers that should outrun the scroll (appear closer).
document.querySelectorAll(".hero [data-speed]").forEach((layer) => {
  const speed = parseFloat(layer.dataset.speed);

  gsap.to(layer, {
    yPercent: (1 - speed) * 40,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
});

// Cursor-driven 3D parallax: each layer drifts/tilts by its own amount as the
// mouse moves, independent of the scroll-driven yPercent tweens above (GSAP
// tracks x/y/rotationY separately from yPercent on the same target).
const heroEl = document.querySelector(".hero");

const mouseTargets = [
  { el: document.querySelector(".hero-mountain"), x: 6, y: 3 },
  { el: document.querySelector(".hero-grill"), x: 10, y: 4 },
  { el: document.querySelector(".hero-headshot"), x: 22, y: 10 },
  { el: document.querySelector(".hero-leaf-upper"), x: 32, y: 14, rotate: 8 },
  { el: document.querySelector(".hero-leaf-lower"), x: 28, y: 12, rotate: -8 },
].filter((t) => t.el);

const movers = mouseTargets.map((t) => ({
  ...t,
  xTo: gsap.quickTo(t.el, "x", { duration: 0.7, ease: "power3.out" }),
  yTo: gsap.quickTo(t.el, "y", { duration: 0.7, ease: "power3.out" }),
  rTo: t.rotate
    ? gsap.quickTo(t.el, "rotationY", { duration: 0.7, ease: "power3.out" })
    : null,
}));

heroEl.addEventListener("mousemove", (e) => {
  const rect = heroEl.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;

  movers.forEach((m) => {
    m.xTo(px * m.x);
    m.yTo(py * m.y);
    if (m.rTo) m.rTo(px * m.rotate);
  });
});

heroEl.addEventListener("mouseleave", () => {
  movers.forEach((m) => {
    m.xTo(0);
    m.yTo(0);
    if (m.rTo) m.rTo(0);
  });
});

// Background music: browsers block autoplay-with-sound, so playback starts
// on the visitor's first interaction with the page (click/scroll/key/touch)
// rather than on load. The toggle button lets them mute/unmute afterward.
const music = document.getElementById("bg-music");
const soundToggle = document.querySelector(".sound-toggle");

if (music && soundToggle) {
  music.volume = 0.35;

  function setPlayingUI(isPlaying) {
    soundToggle.classList.toggle("is-muted", !isPlaying);
    soundToggle.setAttribute("aria-pressed", String(isPlaying));
    soundToggle.setAttribute(
      "aria-label",
      isPlaying ? "Mute background music" : "Play background music"
    );
  }

  function playMusic() {
    music.play().catch(() => {});
    setPlayingUI(true);
  }

  soundToggle.addEventListener("click", () => {
    if (music.paused) {
      playMusic();
    } else {
      music.pause();
      setPlayingUI(false);
    }
  });

  function autoStart(e) {
    if (e.target.closest && e.target.closest(".sound-toggle")) return;
    if (!music.paused) return;
    playMusic();
  }

  ["click", "keydown", "touchstart", "scroll"].forEach((evt) =>
    document.addEventListener(evt, autoStart, { once: true, passive: true })
  );
}
