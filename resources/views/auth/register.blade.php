@extends('layouts.guest')

@section('title', 'Create Account — ' . config('app.name', 'Sagaki Restaurant POS'))

@push('styles')
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

/* ════════════════════════════════════════════════════════
   LifeBOX-STYLE DARK / LIGHT SPLIT WITH CURVED ARC
   ════════════════════════════════════════════════════════ */
.sg-page {
    min-height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    position: relative;
    overflow: hidden;
    background: #ffffff;
}

/* ─────────── DARK LEFT PANEL ─────────── */
.sg-dark {
    background: linear-gradient(160deg, #141410 0%, #1c1917 35%, #292524 100%);
    position: relative;
    min-height: 100vh;
    padding: 3.2rem 5rem 3rem 3.4rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: sg-fade-dark 0.8s ease both;
}

/* Full-height S-curve overlay on dark panel (curves into the light area) */
.sg-dark-curve {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
    z-index: 2;
}
@keyframes sg-fade-dark {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
}

/* Hexagonal pattern overlay */
.sg-dark::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(circle at 20% 20%, rgba(132, 204, 22, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.18) 0%, transparent 45%);
    opacity: 0.95;
    pointer-events: none;
}
.sg-hex-bg {
    position: absolute;
    inset: 0;
    opacity: 0.07;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23ffffff' d='M28 66L0 50V18l28-16 28 16v32L28 66zm0-52L7 26v20l21 12 21-12V26L28 14z'/%3E%3C/svg%3E");
    background-size: 56px 100px;
}

/* Floating decorative orbs */
.sg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    opacity: 0.4;
}
@keyframes sg-drift {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(12px, -14px); }
}

/* Brand */
.sg-brand {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: sg-fade-up 0.7s ease 0.1s both;
}
@keyframes sg-fade-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
}
.sg-logo {
    width: 46px; height: 46px;
    border-radius: 13px;
    background: linear-gradient(145deg, #fbbf24 0%, #f59e0b 45%, #ea580c 100%);
    box-shadow:
        0 10px 26px -8px rgba(234, 88, 12, 0.55),
        inset 0 1px 0 rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
}
.sg-logo::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
    animation: sg-shine 4.5s ease-in-out infinite;
}
@keyframes sg-shine {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(120%); }
}
.sg-brand-name {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.4px;
}
.sg-brand-name span { color: #f59e0b; }
.sg-brand-tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    color: rgba(253, 230, 138, 0.65);
    text-transform: uppercase;
    margin-top: 2px;
}

/* Dark panel center content */
.sg-dark-center {
    position: relative;
    z-index: 2;
    margin-top: auto;
    margin-bottom: auto;
    padding: 2rem 0;
    animation: sg-fade-up 0.7s ease 0.2s both;
}
.sg-dark-h1 {
    font-size: clamp(2rem, 3.4vw, 2.7rem);
    font-weight: 850;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 1.1rem;
}
.sg-dark-h1 span {
    background: linear-gradient(135deg, #a3e635 0%, #fbbf24 55%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.sg-dark-text {
    font-size: 14.5px;
    line-height: 1.75;
    color: rgba(254, 243, 199, 0.72);
    max-width: 520px;
}

/* Colored dots */
.sg-dots {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 13px;
    margin-top: 2.5rem;
    animation: sg-fade-up 0.7s ease 0.3s both;
}
.sg-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    position: relative;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
    cursor: default;
}
.sg-dot:hover { transform: scale(1.15); }
.sg-dot::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s;
}
.sg-dot:hover::after { opacity: 1; }
.sg-dot.cyan {
    background: linear-gradient(135deg, #22d3ee, #06b6d4);
    box-shadow: 0 4px 20px rgba(34,211,238,0.45);
    animation: sg-pulse-c 2.8s ease-in-out infinite;
}
.sg-dot.cyan::after { box-shadow: 0 0 24px rgba(34,211,238,0.5); }
.sg-dot.red {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 4px 20px rgba(239,68,68,0.45);
    animation: sg-pulse-r 2.8s ease-in-out infinite 0.3s;
}
.sg-dot.red::after { box-shadow: 0 0 24px rgba(239,68,68,0.5); }
.sg-dot.amber {
    background: linear-gradient(135deg, #fbbf24, #ea580c);
    box-shadow: 0 4px 20px rgba(251,191,36,0.45);
    animation: sg-pulse-a 2.8s ease-in-out infinite 0.6s;
}
.sg-dot.amber::after { box-shadow: 0 0 24px rgba(251,191,36,0.5); }
@keyframes sg-pulse-c {
    0%,100% { box-shadow: 0 4px 20px rgba(34,211,238,0.45); transform: scale(1); }
    50%     { box-shadow: 0 4px 34px rgba(34,211,238,0.65); transform: scale(1.06); }
}
@keyframes sg-pulse-r {
    0%,100% { box-shadow: 0 4px 20px rgba(239,68,68,0.45); transform: scale(1); }
    50%     { box-shadow: 0 4px 34px rgba(239,68,68,0.65); transform: scale(1.06); }
}
@keyframes sg-pulse-a {
    0%,100% { box-shadow: 0 4px 20px rgba(251,191,36,0.45); transform: scale(1); }
    50%     { box-shadow: 0 4px 34px rgba(251,191,36,0.65); transform: scale(1.06); }
}

/* Register link bottom */
.sg-dark-foot {
    position: relative;
    z-index: 2;
    animation: sg-fade-up 0.7s ease 0.4s both;
}
.sg-foot-q {
    font-size: 13.5px;
    color: rgba(191, 219, 254, 0.7);
    font-weight: 500;
    margin-bottom: 8px;
}
.sg-foot-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    padding-bottom: 3px;
    border-bottom: 2px solid #f59e0b;
    transition: all 0.25s ease;
}
.sg-foot-link:hover { color: #fbbf24; gap: 10px; }
.sg-copy {
    position: relative;
    z-index: 2;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(254, 243, 199, 0.12);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: rgba(253, 230, 138, 0.42);
}

/* ─────────── LIGHT RIGHT PANEL (with CURVE) ─────────── */
.sg-light {
    background: transparent;
    position: relative;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: sg-fade-light 0.8s ease 0.2s both;
}
@keyframes sg-fade-light {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
}

/* The BIG CURVE overlay on left edge of light panel */
.sg-curve {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}
.sg-curve svg {
    width: 100%;
    height: 100%;
    display: block;
}

/* Deep glow band following the curve (extra luxury layer) */
.sg-curve-glow {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

/* Mobile-only curve (top dark section bottom curve) */
.sg-curve-mobile { display: none; }

/* Form container */
.sg-form-wrap {
    position: relative;
    z-index: 20;
    width: 100%;
    max-width: 440px;
    padding: 3rem 2.75rem;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(15,23,42,0.05);
    border-radius: 26px;
    box-shadow:
        0 60px 120px -48px rgba(15,23,42,0.35),
        0 24px 48px -28px rgba(245,158,11,0.14),
        0 0 90px -24px rgba(251,191,36,0.16);
    animation: sg-fade-up 0.7s ease 0.4s both;
}

/* ─── Decorative overlay behind the box ─── */
.sg-form-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
}
.sg-form-decor svg.sg-swish {
    width: 100%;
    height: 100%;
    display: block;
}
.sg-form-halo {
    position: absolute;
    left: 50%; top: 50%;
    width: 540px; height: 540px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(253,224,71,0.16) 0%, rgba(255,255,255,0) 62%);
    filter: blur(46px);
}
.sg-form-hex {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='none' stroke='%23f59e0b' stroke-width='1.5' d='M28 66L0 50V18l28-16 28 16v32L28 66zm0-52L7 26v20l21 12 21-12V26L28 14z'/%3E%3C/svg%3E");
    background-size: 56px 100px;
}

/* Soft dark spill — the dark side's shadow gently crosses onto the white panel */
.sg-light-edge {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 100%;
    pointer-events: none;
    z-index: 1;
}
.sg-light-edge svg {
    width: 100%;
    height: 100%;
    display: block;
}

.sg-form-head { margin-bottom: 2.4rem; }
.sg-close-x {
    position: absolute;
    top: 2rem; right: 2.2rem;
    width: 30px; height: 30px;
    border-radius: 50%;
    background: rgba(15,23,42,0.05);
    display: none;
    align-items: center; justify-content: center;
    cursor: pointer;
    color: rgba(15,23,42,0.5);
    transition: all 0.2s;
    z-index: 30;
}
.sg-close-x:hover { background: rgba(15,23,42,0.1); color: rgba(15,23,42,0.8); }

.sg-h2 {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: #0f172a;
    margin-bottom: 6px;
}
.sg-h2 span {
    color: #f59e0b;
}
.sg-h2-sub {
    font-size: 14.5px;
    color: #64748b;
    line-height: 1.6;
}

/* ─── Form Fields ─── */
.sg-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}
.sg-field-label {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #334155;
    margin-bottom: 8px;
}
.sg-field {
    position: relative;
    display: block;
}
.sg-input {
    width: 100%;
    height: 54px;
    padding: 0 16px 0 48px;
    background: #fefce8;
    border: 1.5px solid transparent;
    border-radius: 14px;
    font-size: 14.5px;
    font-weight: 500;
    color: #1c1917;
    outline: none;
    transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: inset 0 1px 2px rgba(202,138,4,0.08);
}
.sg-input::placeholder { color: #a8a29e; font-weight: 400; }
.sg-input:focus {
    border-color: #ca8a04;
    background: #fff;
    box-shadow:
        0 0 0 4px rgba(251, 191, 36, 0.18),
        0 10px 28px -10px rgba(202, 138, 4, 0.35);
    transform: translateY(-1.5px);
}
.sg-input.error { border-color: #ef4444; background: #fff1f2; }
.sg-field-icon {
    position: absolute;
    top: 50%; left: 17px;
    transform: translateY(-50%);
    color: #94a3b8;
    display: flex; align-items: center;
    transition: color 0.22s, transform 0.22s;
    pointer-events: none;
}
.sg-field:focus-within .sg-field-icon {
    color: #f59e0b;
    transform: translateY(-50%) scale(1.1);
}
.sg-field-error {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #dc2626;
    display: flex;
    align-items: center;
    gap: 5px;
}

/* Password reveal */
.sg-toggle-pw {
    position: absolute;
    top: 50%; right: 14px;
    transform: translateY(-50%);
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border: none; background: transparent;
    color: #94a3b8;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.2s;
}
.sg-toggle-pw:hover { color: #f59e0b; background: #fef3c7; }

/* Remember row */
.sg-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 2px 0 0;
}
.sg-remember {
    display: flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
    user-select: none;
}
.sg-cb {
    width: 20px; height: 20px;
    border-radius: 5px;
    border: 1.8px solid #cbd5e1;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.22s;
}
.sg-cb.on {
    background: linear-gradient(135deg, #ca8a04, #a16207);
    border-color: #a16207;
    box-shadow: 0 3px 12px rgba(202,138,4,0.55);
}
.sg-remember-label {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
}
.sg-link {
    font-size: 13px;
    font-weight: 700;
    color: #f59e0b;
    text-decoration: none;
    transition: color 0.2s;
}
.sg-link:hover { color: #b45309; }

/* CTA Button - Luxury Gold + Green Gradient */
.sg-btn {
    position: relative;
    width: 100%;
    height: 56px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #a16207 0%, #ca8a04 40%, #84cc16 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow:
        0 16px 36px -12px rgba(202, 138, 4, 0.65),
        0 4px 14px -4px rgba(132, 204, 22, 0.35),
        inset 0 1px 0 rgba(255,255,255,0.28),
        inset 0 -2px 0 rgba(0,0,0,0.12);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    overflow: hidden;
    margin-top: 4px;
}
.sg-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 25%, rgba(255,255,255,0.32) 50%, transparent 75%);
    transform: translateX(-100%);
    transition: transform 0.7s ease;
}
.sg-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    padding: 1.5px;
    background: linear-gradient(135deg, rgba(253,224,71,0.5), rgba(163,230,53,0.3), rgba(253,224,71,0.4));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    opacity: 0.7;
    pointer-events: none;
}
.sg-btn:hover {
    transform: translateY(-2.5px);
    box-shadow:
        0 24px 52px -14px rgba(202, 138, 4, 0.78),
        0 8px 22px -6px rgba(132, 204, 22, 0.45),
        inset 0 1px 0 rgba(255,255,255,0.36),
        inset 0 -2px 0 rgba(0,0,0,0.12);
}
.sg-btn:hover::before { transform: translateX(100%); }
.sg-btn:active { transform: translateY(0) scale(0.985); }
.sg-btn:disabled { cursor: not-allowed; opacity: 0.7; }
.sg-btn span {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 8px;
}

/* Sign-in link bottom */
.sg-forgot {
    margin-top: 1.7rem;
    text-align: center;
    animation: sg-fade-up 0.7s ease 0.55s both;
}
.sg-forgot a {
    font-size: 13.5px;
    font-weight: 600;
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 2px;
}
.sg-forgot a:hover { color: #f59e0b; border-color: #fbbf24; }

/* Alerts */
.sg-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1.5;
    margin-bottom: 16px;
}
.sg-alert.ok { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
.sg-alert.err { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; }

/* Spinner */
@keyframes sg-spin { to { transform: rotate(360deg); } }

/* ─────────── RESPONSIVE: DESKTOP ↔ MOBILE ─────────── */
@media (max-width: 960px) {
    .sg-page {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        min-height: auto;
    }

    /* Dark panel becomes top section */
    .sg-dark {
        padding: 2.5rem 1.75rem 7rem;
        min-height: 42vh;
    }
    .sg-dark-center { padding: 2rem 0 0; }
    .sg-dark-foot { margin-top: 1.5rem; }

    /* Light panel - bring up over the curve */
    .sg-light {
        background: #ffffff;
        margin-left: 0;
        margin-top: -6.5rem;
        padding: 2.2rem 0 3rem;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
        z-index: 2;
        position: relative;
    }
    .sg-curve { display: none; }
    .sg-dark-curve { display: none; }
    .sg-light-edge { display: none; }

    /* Show mobile curve */
    .sg-curve-mobile {
        display: block;
        position: absolute;
        bottom: -1px; left: 0;
        width: 100%;
        height: 180px;
        z-index: 2;
        pointer-events: none;
    }
    .sg-curve-mobile svg { width: 100%; height: 100%; display: block; }

    .sg-form-wrap {
        padding: 1rem 1.75rem 2rem;
        max-width: 500px;
    }
    .sg-close-x { display: flex; position: absolute; top: 1.4rem; right: 1.4rem; z-index: 5; }
}

/* ─── Bento Feature Cards ─── */
.sg-bento {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 12px;
    margin-top: 2rem;
    max-width: 520px;
    animation: sg-fade-up 0.7s ease 0.35s both;
}
.sg-bento-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    padding: 14px 14px 13px;
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    overflow: hidden;
    cursor: default;
}
.sg-bento-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(251,191,36,0.08) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.8s ease;
}
.sg-bento-card:hover {
    transform: translateY(-3px);
    border-color: rgba(251,191,36,0.3);
    background: linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.05) 100%);
    box-shadow: 0 18px 40px -18px rgba(0,0,0,0.6);
}
.sg-bento-card:hover::before { transform: translateX(100%); }
.sg-bento-card.wide { grid-column: 1 / -1; }
.sg-bento-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
    position: relative; z-index: 1;
}
.sg-bento-icon.i-kds {
    background: linear-gradient(135deg, rgba(34,211,238,0.25), rgba(6,182,212,0.15));
    color: #22d3ee;
}
.sg-bento-icon.i-order {
    background: linear-gradient(135deg, rgba(251,191,36,0.25), rgba(234,88,12,0.15));
    color: #fbbf24;
}
.sg-bento-icon.i-report {
    background: linear-gradient(135deg, rgba(134,239,172,0.25), rgba(34,197,94,0.15));
    color: #86efac;
}
.sg-bento-title {
    font-size: 13px;
    font-weight: 750;
    color: #fff;
    margin-bottom: 3px;
    letter-spacing: -0.01em;
    position: relative; z-index: 1;
}
.sg-bento-desc {
    font-size: 11.5px;
    line-height: 1.5;
    color: rgba(254, 243, 199, 0.68);
    font-weight: 500;
    position: relative; z-index: 1;
}
.sg-bento-card.wide .sg-bento-icon {
    background: linear-gradient(135deg, rgba(249,115,22,0.28), rgba(234,88,12,0.18));
    color: #fb923c;
}
.sg-bento-card.wide .sg-bento-inner {
    display: flex;
    align-items: center;
    gap: 12px;
}
.sg-bento-card.wide .sg-bento-text-wrap { flex: 1; }
.sg-bento-card.wide .sg-bento-title { font-size: 13.5px; }
.sg-bento-card.wide .sg-bento-desc { font-size: 12px; }
.sg-bento-badge {
    position: relative; z-index: 1;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 3px 7px;
    border-radius: 999px;
    background: linear-gradient(135deg, #fbbf24, #ea580c);
    color: #1c1917;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 2px;
    box-shadow: 0 4px 12px -4px rgba(234,88,12,0.6);
}

/* ─── Float animation for bento icons ─── */
@keyframes sg-icon-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-2px); }
}
.sg-bento-icon { animation: sg-icon-float 3.2s ease-in-out infinite; }
.sg-bento-card:nth-child(2) .sg-bento-icon { animation-delay: 0.4s; }
.sg-bento-card:nth-child(3) .sg-bento-icon { animation-delay: 0.8s; }

/* ─── Steam / subtle particle on dark panel ─── */
@keyframes sg-steam-rise {
    0%   { opacity: 0; transform: translateY(0) scale(0.9); }
    40%  { opacity: 0.5; }
    100% { opacity: 0; transform: translateY(-40px) scale(1.15); }
}
.sg-steam {
    position: absolute;
    bottom: 15%;
    right: 14%;
    width: 30px; height: 30px;
    pointer-events: none;
    opacity: 0;
    z-index: 1;
}
.sg-steam span {
    position: absolute;
    bottom: 0;
    width: 100%; height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    animation: sg-steam-rise 3.5s ease-out infinite;
}
.sg-steam span:nth-child(2) { left: 14px; animation-delay: 0.8s; }
.sg-steam span:nth-child(3) { left: -14px; animation-delay: 1.6s; }

@media (max-width: 560px) {
    .sg-dark { padding: 2rem 1.25rem 5rem; min-height: 38vh; }
    .sg-dark-h1 { font-size: 1.8rem; }
    .sg-dark-text { font-size: 13.5px; }
    .sg-dots { margin-top: 1.8rem; gap: 10px; }
    .sg-dot { width: 24px; height: 24px; }

    .sg-bento { grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 1.5rem; }
    .sg-bento-card { padding: 11px 11px 10px; border-radius: 13px; }
    .sg-bento-icon { width: 30px; height: 30px; margin-bottom: 8px; }
    .sg-bento-icon svg { width: 15px; height: 15px; }
    .sg-bento-title { font-size: 12px; }
    .sg-bento-desc { font-size: 10.5px; }
    .sg-bento-card.wide .sg-bento-title { font-size: 12.5px; }
    .sg-bento-card.wide .sg-bento-desc { font-size: 11px; }
    .sg-bento-badge { font-size: 8px; padding: 2px 6px; }

    .sg-light { background:#ffffff; margin-left:0; margin-top: -3.8rem; padding: 1.8rem 0 2.5rem; border-top-left-radius: 26px; border-top-right-radius: 26px; }
    .sg-form-wrap { padding: 0.5rem 1.25rem 1.5rem; }
    .sg-h2 { font-size: 22px; }
    .sg-h2-sub { font-size: 13.5px; }
    .sg-input { height: 50px; }
    .sg-input--sm { height: 50px; }
    .sg-btn { height: 52px; }
    .sg-brand-tag { display: none; }
}
</style>
@endpush

@section('content')
<div class="sg-page">

    {{-- ════════════════════════════════════════
         DARK LEFT / TOP PANEL
    ════════════════════════════════════════ --}}
    <section class="sg-dark">
        <div class="sg-hex-bg"></div>

        <div class="sg-orb" style="width:340px;height:340px;background:radial-gradient(circle,rgba(132,204,22,0.28),transparent 65%);top:-80px;left:-60px;animation:sg-drift 8s ease-in-out infinite;"></div>
        <div class="sg-orb" style="width:300px;height:300px;background:radial-gradient(circle,rgba(251,191,36,0.32),transparent 65%);bottom:-60px;right:-40px;animation:sg-drift 10s ease-in-out infinite 2s;"></div>

        {{-- Brand --}}
        <div class="sg-brand">
            <div class="sg-logo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
                     stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="position:relative;z-index:1;">
                    <path d="M6 2v3a4 4 0 0 1-4 4"/>
                    <path d="M18 2v3a4 4 0 0 0 4 4"/>
                    <path d="M12 2C9.5 2 8 4 8 7v12a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V7c0-3-1.5-5-4-5Z"/>
                    <path d="M8 14h8"/>
                </svg>
            </div>
            <div>
                <div class="sg-brand-name">Sagaki<span>POS</span></div>
                <div class="sg-brand-tag">Restaurant Management</div>
            </div>
        </div>

        {{-- Steam effect decoration --}}
        <div class="sg-steam" style="opacity:1;">
            <span></span><span></span><span></span>
        </div>

        {{-- Center marketing text --}}
        <div class="sg-dark-center">
            <h1 class="sg-dark-h1">
                Four steps from signup
                <br>
                <span>to your first order.</span>
            </h1>
            <p class="sg-dark-text">
                Join Sagaki and bring every moving piece of your restaurant together —
                tables, kitchen, orders and insights flowing in one calm, intuitive workspace.
            </p>

            {{-- Bento Feature Cards --}}
            <div class="sg-bento">
                {{-- Card 1: KDS --}}
                <div class="sg-bento-card">
                    <div class="sg-bento-icon i-kds">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                            <path d="M8 21h8"/><path d="M12 17v4"/>
                            <path d="M7 9h6"/><path d="M7 12h10"/>
                        </svg>
                    </div>
                    <div class="sg-bento-title">Live KDS</div>
                    <div class="sg-bento-desc">Real-time kitchen display sync</div>
                </div>

                {{-- Card 2: Orders --}}
                <div class="sg-bento-card">
                    <div class="sg-bento-icon i-order">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 7h10v2H7z"/><path d="M7 11h10v2H7z"/><path d="M7 15h6v2H7z"/>
                            <path d="M6 3h12l1 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8z"/>
                        </svg>
                    </div>
                    <div class="sg-bento-title">Instant Orders</div>
                    <div class="sg-bento-desc">One-tap table service</div>
                </div>

                {{-- Card 3: Wide - Reports with badge --}}
                <div class="sg-bento-card wide">
                    <div class="sg-bento-inner">
                        <div class="sg-bento-icon">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 3v18h18"/>
                                <path d="M7 15l4-4 3 3 5-6"/>
                            </svg>
                        </div>
                        <div class="sg-bento-text-wrap">
                            <div class="sg-bento-title">Smart Analytics & Reports</div>
                            <div class="sg-bento-desc">Daily sales, peak hours, bestsellers — all in one elegant dashboard.</div>
                        </div>
                        <div class="sg-bento-badge">PRO</div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Footer login --}}
        <div class="sg-dark-foot">
            <div class="sg-foot-q">Already have an account?</div>
            <a href="{{ route('login') }}" class="sg-foot-link">
                Log in
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
            </a>
        </div>

        {{-- Copyright --}}
        <div class="sg-copy">2026 © Nerdtech Labs. All rights reserved.</div>

        {{-- Radiant gold→lime glowing edge along the organic S-curve cutout --}}
        <div class="sg-dark-curve" aria-hidden="true">
            <svg viewBox="0 0 320 900" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="dcEdgeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   style="stop-color:#fde68a;stop-opacity:0" />
                        <stop offset="10%"  style="stop-color:#fef08a;stop-opacity:0.3" />
                        <stop offset="30%"  style="stop-color:#a3e635;stop-opacity:0.6" />
                        <stop offset="50%"  style="stop-color:#facc15;stop-opacity:0.9" />
                        <stop offset="65%"  style="stop-color:#fde047;stop-opacity:0.85" />
                        <stop offset="80%"  style="stop-color:#f59e0b;stop-opacity:0.45" />
                        <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0" />
                    </linearGradient>
                    <filter id="dcBeam" x="-80%" y="-25%" width="260%" height="150%">
                        <feGaussianBlur stdDeviation="12" result="b"/>
                        <feColorMatrix in="b" type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 0.8 0"/>
                    </filter>
                    <filter id="dcSoft" x="-60%" y="-20%" width="220%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="b"/>
                        <feColorMatrix in="b" type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 0.7 0"/>
                    </filter>
                </defs>

                {{-- Organic S-curve cutout with a deep, sweeping central arc --}}
                <path id="sg-divider-curve" fill="#ffffff"
                      d="M320,0
                         C312,110 316,200 302,280
                         C288,360 246,430 262,540
                         C276,640 300,720 308,790
                         C314,830 318,860 320,900
                         L320,0 Z"/>

                {{-- Radiant beam: wide luminous wash --}}
                <path fill="none" stroke="url(#dcEdgeGrad)" stroke-width="13"
                      filter="url(#dcBeam)" opacity="0.45"
                      d="M320,0 C312,110 316,200 302,280 C288,360 246,430 262,540 C276,640 300,720 308,790 C314,830 318,860 320,900"/>
                {{-- Glow aura --}}
                <path fill="none" stroke="url(#dcEdgeGrad)" stroke-width="5"
                      filter="url(#dcSoft)" opacity="0.6"
                      d="M320,0 C312,110 316,200 302,280 C288,360 246,430 262,540 C276,640 300,720 308,790 C314,830 318,860 320,900"/>
                {{-- Soft luminous core (gradient, never a solid line) --}}
                <path fill="none" stroke="url(#dcEdgeGrad)" stroke-width="1.2" opacity="0.55"
                      d="M320,0 C312,110 316,200 302,280 C288,360 246,430 262,540 C276,640 300,720 308,790 C314,830 318,860 320,900"/>
            </svg>
        </div>

        {{-- Mobile curve (dark panel bottom edge curves DEEPLY down into light panel) --}}
        <div class="sg-curve-mobile">
            <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="mcGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(251,191,36,0.55);stop-opacity:1"/>
                        <stop offset="55%" style="stop-color:rgba(163,230,53,0.4);stop-opacity:1"/>
                        <stop offset="100%" style="stop-color:rgba(202,138,4,0.55);stop-opacity:1"/>
                    </linearGradient>
                    <filter id="mcSoft" x="-5%" y="-20%" width="110%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="mb"/>
                        <feColorMatrix in="mb" type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 0.65 0"/>
                    </filter>
                </defs>
                {{-- Layer 1: Deep outer glow --}}
                <path filter="url(#mcSoft)" fill="url(#mcGlow)" opacity="0.9"
                      d="M0,40 C240,180 520,180 720,130 C920,80 1200,10 1440,10 L1440,180 L0,180 Z"/>
                {{-- Layer 2: Mid lime/gold band --}}
                <path fill="rgba(163,230,53,0.18)"
                      d="M0,60 C260,180 540,172 740,124 C940,76 1220,22 1440,22 L1440,180 L0,180 Z" opacity="0.9"/>
                <path fill="rgba(251,191,36,0.2)"
                      d="M0,76 C300,180 560,164 760,118 C960,72 1240,32 1440,32 L1440,180 L0,180 Z" opacity="0.7"/>
                {{-- Layer 3: MAIN WHITE fill --}}
                <path fill="#ffffff"
                      d="M0,96 C320,180 580,162 780,114 C980,66 1260,38 1440,38 L1440,180 L0,180 Z"/>
            </svg>
        </div>
    </section>

    {{-- ════════════════════════════════════════
         LIGHT RIGHT / BOTTOM PANEL
    ════════════════════════════════════════ --}}
    <section class="sg-light">

        {{-- Soft dark spill onto the white panel, echoing the S-curve edge --}}
        <div class="sg-light-edge" aria-hidden="true">
            <svg viewBox="0 0 320 900" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="edgeShadowGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   style="stop-color:rgba(20,20,16,0.32);stop-opacity:1" />
                        <stop offset="45%"  style="stop-color:rgba(20,20,16,0.10);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(20,20,16,0);stop-opacity:1" />
                    </linearGradient>
                    <filter id="edgeShadowSoft" x="-40%" y="-20%" width="180%" height="140%">
                        <feGaussianBlur stdDeviation="8"/>
                    </filter>
                </defs>
                <path fill="url(#edgeShadowGrad)" filter="url(#edgeShadowSoft)"
                      d="M0,0 C8,110 4,200 18,280 C32,360 74,430 58,540 C44,640 20,720 12,790 C6,830 2,860 0,900 L0,0 Z"/>
            </svg>
        </div>

        {{-- Decorative overlay: golden swish flowing behind the box --}}
        <div class="sg-form-decor" aria-hidden="true">
            <div class="sg-form-halo"></div>
            <svg class="sg-swish" viewBox="0 0 720 900" preserveAspectRatio="none">
                <defs>
                    <filter id="swishSoft" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="9"/>
                    </filter>
                </defs>
                <path d="M-40,640 C120,470 240,560 380,430 C520,300 600,360 740,200"
                      fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"
                      opacity="0.08" filter="url(#swishSoft)"/>
                <path d="M-40,640 C120,470 240,560 380,430 C520,300 600,360 740,200"
                      fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" opacity="0.22"/>
                <path d="M-40,720 C140,560 260,640 400,520 C540,400 640,460 740,330"
                      fill="none" stroke="#eab308" stroke-width="1.3" stroke-linecap="round" opacity="0.13"/>
            </svg>
            <div class="sg-form-hex"></div>
        </div>

        {{-- Close X (mobile only) --}}
        <div class="sg-close-x" onclick="window.history.length > 1 ? window.history.back() : null">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
        </div>

        <div class="sg-form-wrap">
            <div class="sg-form-head">
                <h2 class="sg-h2">Create your account <span>to get started</span></h2>
                <p class="sg-h2-sub">Join Sagaki and start turning tables into sales in minutes.</p>
            </div>

            {{-- Alerts --}}
            @if ($errors->any())
                <div class="sg-alert err">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;margin-top:1px;" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 9v4"/><path d="M12 17h.01"/>
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
                    </svg>
                    <div>@foreach ($errors->all() as $e)<div style="margin:0 0 2px;">{{ $e }}</div>@endforeach</div>
                </div>
            @endif

            {{-- Form --}}
            <form method="POST" action="{{ route('register') }}" id="register-form" class="sg-form">
                @csrf

                {{-- Full Name --}}
                <div>
                    <label for="name" class="sg-field-label">Full Name</label>
                    <div class="sg-field">
                        <div class="sg-field-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <input id="name" name="name" type="text" value="{{ old('name') }}"
                               required autofocus autocomplete="name"
                               placeholder="John Doe"
                               class="sg-input @error('name') error @enderror">
                    </div>
                    @error('name')
                        <div class="sg-field-error">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                {{-- Email --}}
                <div>
                    <label for="email" class="sg-field-label">Email Address</label>
                    <div class="sg-field">
                        <div class="sg-field-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/>
                                <path d="m22 6-10 7L2 6"/>
                            </svg>
                        </div>
                        <input id="email" name="email" type="email" value="{{ old('email') }}"
                               required autocomplete="email"
                               placeholder="yourmail@mail.com"
                               class="sg-input @error('email') error @enderror">
                    </div>
                    @error('email')
                        <div class="sg-field-error">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                {{-- Password --}}
                <div>
                    <label for="password" class="sg-field-label">Password</label>
                    <div class="sg-field">
                        <div class="sg-field-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                        <input id="password" name="password" type="password"
                               required autocomplete="new-password"
                               placeholder="••••••••"
                               class="sg-input @error('password') error @enderror"
                               style="padding-right:56px;letter-spacing:0.14em;">
                        <button type="button" id="toggle-pw" class="sg-toggle-pw" tabindex="-1">
                            <svg id="eye-show" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <svg id="eye-hide" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                                <path d="M9.88 9C9 9.17 8.19 9.48 7.5 10M5 16.5A10.7 10.7 0 0 1 1.94 12a10.75 10.75 0 0 1 6.53-5.05M14.12 14.12A10.75 10.75 0 0 0 22.06 12a10.7 10.7 0 0 0-4.56-4.5"/>
                                <path d="M1 1l22 22"/>
                            </svg>
                        </button>
                    </div>
                    @error('password')
                        <div class="sg-field-error">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                {{-- Confirm Password --}}
                <div>
                    <label for="password_confirmation" class="sg-field-label">Confirm Password</label>
                    <div class="sg-field">
                        <div class="sg-field-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 12l2 2 4-4"/>
                                <path d="M21 7v3a10 10 0 0 1-10 10H6a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a2 2 0 0 0 2 2 10 10 0 0 0 10-10V7"/>
                                <path d="M12 3h3a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V5a2 2 0 0 0-2-2Z"/>
                                <path d="M15 5h3a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V5"/>
                            </svg>
                        </div>
                        <input id="password_confirmation" name="password_confirmation" type="password"
                               required autocomplete="new-password"
                               placeholder="••••••••"
                               class="sg-input @error('password') error @enderror"
                               style="padding-right:56px;letter-spacing:0.14em;">
                        <button type="button" id="toggle-pw2" class="sg-toggle-pw" tabindex="-1">
                            <svg id="eye-show2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <svg id="eye-hide2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                                <path d="M9.88 9C9 9.17 8.19 9.48 7.5 10M5 16.5A10.7 10.7 0 0 1 1.94 12a10.75 10.75 0 0 1 6.53-5.05M14.12 14.12A10.75 10.75 0 0 0 22.06 12a10.7 10.7 0 0 0-4.56-4.5"/>
                                <path d="M1 1l22 22"/>
                            </svg>
                        </button>
                    </div>
                    @error('password_confirmation')
                        <div class="sg-field-error">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                {{-- Terms checkbox --}}
                <div class="sg-row" style="justify-content:flex-start;">
                    <label class="sg-remember" onclick="sgToggleTerms()">
                        <div id="sg-terms-cb" class="sg-cb">
                            <svg id="sg-terms-check" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                                <path d="m5 13 4 4L19 7"/>
                            </svg>
                        </div>
                        <input type="checkbox" name="terms" id="terms" value="1" style="position:absolute;opacity:0;pointer-events:none;" required>
                        <span class="sg-remember-label">I agree to the <a href="#" class="sg-link" onclick="event.preventDefault()">Terms of Service & Privacy Policy</a></span>
                    </label>
                </div>

                {{-- Submit --}}
                <button type="submit" id="register-submit" class="sg-btn">
                    <span>
                        CREATE ACCOUNT
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                        </svg>
                    </span>
                </button>
            </form>

            {{-- Sign-in link --}}
            <div class="sg-forgot">
                <a href="{{ route('login') }}">Already have an account? Log in</a>
            </div>
        </div>
    </section>
</div>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Password toggle
    function bindToggle(btnId, inputId, eyeShowId, eyeHideId) {
        var toggle = document.getElementById(btnId);
        var input  = document.getElementById(inputId);
        var show   = document.getElementById(eyeShowId);
        var hide   = document.getElementById(eyeHideId);
        if (!toggle || !input) return;
        toggle.addEventListener('click', function () {
            var isPw = input.type === 'password';
            input.type = isPw ? 'text' : 'password';
            input.style.letterSpacing = isPw ? '0' : '0.14em';
            show.style.display = isPw ? 'none' : '';
            hide.style.display = isPw ? ''     : 'none';
        });
    }
    bindToggle('toggle-pw',  'password',               'eye-show',  'eye-hide');
    bindToggle('toggle-pw2', 'password_confirmation',  'eye-show2', 'eye-hide2');

    // Submit loading state
    var form = document.getElementById('register-form');
    var btn  = document.getElementById('register-submit');
    if (form && btn) {
        form.addEventListener('submit', function () {
            btn.disabled = true;
            btn.querySelector('span').innerHTML =
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.8" style="animation:sg-spin .7s linear infinite;">' +
                '<path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>' +
                'CREATING ACCOUNT…';
        });
    }
});

// Custom terms checkbox
var sgTermsState = false;
function sgToggleTerms() {
    sgTermsState = !sgTermsState;
    var wrap  = document.getElementById('sg-terms-cb');
    var check = document.getElementById('sg-terms-check');
    var input = document.getElementById('terms');
    if (sgTermsState) {
        wrap.classList.add('on'); check.style.display = ''; input.checked = true;
    } else {
        wrap.classList.remove('on'); check.style.display = 'none'; input.checked = false;
    }
}
</script>
@endsection