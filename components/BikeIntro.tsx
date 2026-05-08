'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// ─── Bike PNG crop measurements (from pixel analysis of bici.png) ───────────
// Original image: 1201×1201 px   |   Bike bounding box: x=422–777, y=482–718
// Display scale: 0.975           |   Container: 346×230 px
// Full image at scale: 1171 px   |   Offset: left=-411, top=-470
const BW   = 346   // bike container width
const BH   = 230   // bike container height
const RCX  = 68    // rear axle x inside container
const RCY  = 162   // rear axle y inside container
const CREAM = '#c8c3a8'
const NAVY  = '#1e2535'

interface Props {
  /** Called the instant cross-fade begins — page starts fading in */
  onComplete : () => void
  /** Called after BikeIntro has fully faded — safe to unmount */
  onGone     : () => void
}

export default function BikeIntro ({ onComplete, onGone }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const bikeRef    = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafId      = useRef<number>(0)
  const t0         = useRef<number>(0)
  const fired      = useRef(false)          // prevent double-fire (StrictMode)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width  = W
    canvas.height = H

    // ── Dynamic logo measurements (must mirror Hero.tsx exactly) ─────────────
    // Hero uses: width = min(620px, 90vw), height = width × 0.24
    // Visible text lives at x: 28.9%–70.9% of the 1201-px image
    const LOGO_W        = Math.min(620, W * 0.9)
    const LOGO_H        = LOGO_W * 0.24
    const LOGO_ATTACH_X = LOGO_W * 0.71        // right edge of text within container
    const STRING_LEN    = 220                   // visual gap between axle and logo text edge

    // Target position: matches Hero's logo in its flex-col justify-center layout.
    // Total hero content ≈ LOGO_H + rule + tagline + CTA + margins ≈ LOGO_H + 156 px.
    // Logo top  = (H − totalContentH) / 2  ≈  H/2 − LOGO_H/2 − 78
    const LOGO_TARGET_X = W / 2 - LOGO_W / 2
    const LOGO_TARGET_Y = H / 2 - LOGO_H / 2 - 78

    const BIKE_START    = -BW - 80
    const BIKE_END      = W  + BW + 80
    // Bike x at the moment the string snaps (logo has reached LOGO_TARGET_X):
    //   logoX = bikeX + RCX − STRING_LEN − LOGO_ATTACH_X  =>  bikeX:
    const RELEASE_X     = LOGO_TARGET_X + STRING_LEN + LOGO_ATTACH_X - RCX

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize)

    // ── Easing helpers ────────────────────────────────────────────────────────
    const clamp  = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
    const lerp   = (a: number, b: number, t: number)   => a + (b - a) * t
    const easeIO = (t: number) => t < .5 ? 2*t*t : -1 + (4-2*t)*t
    const easeI3 = (t: number) => t * t * t
    const elasticOut = (t: number) =>
      t <= 0 || t >= 1 ? t
      : Math.pow(2, -9 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.45) + 1

    // ── Animation timeline: 5 s total ────────────────────────────────────────
    //   0.00–0.54  Phase A : bike + logo travel across, string taut
    //   0.54–0.59  Phase B : string snaps + fades
    //   0.54–1.00  Phase C : bike accelerates off-screen right, logo settles
    const TOTAL_MS = 5000
    const SNAP     = 0.54
    const FADE_END = SNAP + 0.05

    const getBikeX = (p: number) =>
      p <= SNAP
        ? lerp(BIKE_START, RELEASE_X, easeIO(p / SNAP))
        : lerp(RELEASE_X,  BIKE_END,  easeI3((p - SNAP) / (1 - SNAP)))

    const getLogoX = (bikeX: number, p: number) =>
      p <= SNAP ? bikeX + RCX - STRING_LEN - LOGO_ATTACH_X : LOGO_TARGET_X

    const getLogoY = (p: number) => {
      if (p <= SNAP) return LOGO_TARGET_Y - 6
      const t = clamp((p - SNAP) / 0.38, 0, 1)
      return lerp(LOGO_TARGET_Y - 6, LOGO_TARGET_Y, elasticOut(t))
    }

    const getLogoOpacity = (logoX: number, p: number) => {
      // Fade in as the logo text slides onto screen from the left
      const textLeft  = logoX + LOGO_W * 0.29   // approx left edge of visible text
      const enterFade = clamp(textLeft / 160, 0, 1)
      const phaseFade = p <= SNAP
        ? 0.62
        : 0.62 + clamp((p - SNAP) / 0.38, 0, 1) * 0.38
      return enterFade * phaseFade
    }

    // ── String drawing ────────────────────────────────────────────────────────
    const drawString = (
      bikeX: number, bikeY: number,
      logoX: number, logoY: number,
      p: number
    ) => {
      ctx.clearRect(0, 0, W, H)
      if (p > FADE_END) return
      const alpha = p > SNAP ? 1 - (p - SNAP) / (FADE_END - SNAP) : 1
      if (alpha <= 0) return

      const sx  = bikeX + RCX
      const sy  = bikeY + RCY
      const ex  = clamp(logoX + LOGO_ATTACH_X, -60, W + 60)
      const ey  = logoY + LOGO_H * 0.5
      const droop = Math.max(5, Math.abs(ex - sx) * 0.038)

      ctx.save()
      ctx.globalAlpha = alpha * 0.85
      ctx.strokeStyle = CREAM
      ctx.lineWidth   = 1
      ctx.lineCap     = 'round'
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.quadraticCurveTo((sx + ex) / 2, (sy + ey) / 2 + droop, ex, ey)
      ctx.stroke()
      ctx.globalAlpha = alpha * 0.45
      ctx.fillStyle   = CREAM
      ctx.beginPath(); ctx.arc(sx, sy, 1.8, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    // ── Main rAF loop ─────────────────────────────────────────────────────────
    const tick = (ts: number) => {
      if (!t0.current) t0.current = ts
      const p     = clamp((ts - t0.current) / TOTAL_MS, 0, 1)
      const bikeX = getBikeX(p)
      const bikeY = H / 2 - BH / 2
      const logoX = getLogoX(bikeX, p)
      const logoY = getLogoY(p)

      bikeRef.current!.style.transform = `translate(${bikeX}px,${bikeY}px)`
      logoRef.current!.style.transform = `translate(${logoX}px,${logoY}px)`
      logoRef.current!.style.opacity   = String(getLogoOpacity(logoX, p))

      drawString(bikeX, bikeY, logoX, logoY, p)

      if (p < 1) {
        rafId.current = requestAnimationFrame(tick)
      } else if (!fired.current) {
        fired.current = true
        // Brief pause so the logo settles visually, then cross-fade
        setTimeout(() => {
          onComplete()  // page wrapper begins opacity transition
          gsap.to(overlayRef.current, {
            opacity  : 0,
            duration : 1.1,
            ease     : 'power2.inOut',
            onComplete: onGone,
          })
        }, 320)
      }
    }

    // ── Set initial off-screen positions ─────────────────────────────────────
    bikeRef.current!.style.transform = `translate(${BIKE_START}px,${H / 2 - BH / 2}px)`
    logoRef.current!.style.opacity   = '0'
    logoRef.current!.style.transform =
      `translate(${BIKE_START + RCX - STRING_LEN - LOGO_ATTACH_X}px,${LOGO_TARGET_Y}px)`

    // Slight start delay so fonts/assets have loaded
    const init = setTimeout(() => { rafId.current = requestAnimationFrame(tick) }, 480)

    return () => {
      clearTimeout(init)
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', onResize)
    }
  }, [onComplete, onGone])

  // Spoke positions for 10 spokes at 36° intervals
  const spokes10 = Array.from({ length: 10 }, (_, i) => {
    const a = (i * 36 * Math.PI) / 180
    return { x: Math.sin(a), y: -Math.cos(a) }
  })

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999, background: NAVY }}
    >
      {/* Tartan — matches Hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "url('/assets/patron.png')", backgroundSize: '320px', opacity: 0.09 }}
      />
      {/* Radial vignette — matches Hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 90% at 50% 46%, transparent 20%, rgba(6,9,18,0.75) 100%)' }}
      />

      {/* String canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* ── Bicycle ──────────────────────────────────────────────────────────── */}
      <div
        ref={bikeRef}
        className="absolute pointer-events-none"
        style={{ width: BW, height: BH, overflow: 'hidden', willChange: 'transform' }}
      >
        {/* Original PNG — exactly the bici.png, cropped to the bicycle */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/bici.png"
          alt=""
          style={{ position: 'absolute', width: 1171, height: 1171, left: -411, top: -470 }}
        />

        {/* SVG overlay: covers static spokes, draws spinning replacements */}
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: BW, height: BH }}
          viewBox={`0 0 ${BW} ${BH}`}
        >
          {/* ── Rear wheel (cx=68, cy=162, outer r≈70) ── */}
          {/* Navy disc hides original spokes but leaves the outer tyre ring */}
          <circle cx="68" cy="162" r="60" fill={NAVY} />
          <g transform="translate(68,162)">
            <g className="bike-wheel-spin" stroke={CREAM} strokeWidth="1.1" strokeLinecap="round">
              {spokes10.map(({ x, y }, i) => (
                <line key={i} x1="0" y1="0" x2={x * 57} y2={y * 57} />
              ))}
            </g>
          </g>
          <circle cx="68"  cy="162" r="5.5" fill={CREAM} />
          <circle cx="68"  cy="162" r="2"   fill={NAVY}  />

          {/* ── Front wheel (cx=279, cy=164, outer r≈68) ── */}
          <circle cx="279" cy="164" r="58" fill={NAVY} />
          <g transform="translate(279,164)">
            <g className="bike-wheel-spin" stroke={CREAM} strokeWidth="1.1" strokeLinecap="round">
              {spokes10.map(({ x, y }, i) => (
                <line key={i} x1="0" y1="0" x2={x * 55} y2={y * 55} />
              ))}
            </g>
          </g>
          <circle cx="279" cy="164" r="5.5" fill={CREAM} />
          <circle cx="279" cy="164" r="2"   fill={NAVY}  />
        </svg>
      </div>

      {/* ── Logo — mirrors Hero crop exactly ──────────────────────────────────── */}
      <div
        ref={logoRef}
        className="absolute pointer-events-none overflow-hidden"
        style={{
          width       : 'min(620px, 90vw)',
          height      : 'calc(min(620px, 90vw) * 0.24)',
          opacity     : 0,
          willChange  : 'transform, opacity',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logo-main.png"
          alt="Studio G.D."
          className="logo-invert w-full"
          style={{ marginTop: 'calc(min(620px, 90vw) * -0.38)' }}
        />
      </div>
    </div>
  )
}
