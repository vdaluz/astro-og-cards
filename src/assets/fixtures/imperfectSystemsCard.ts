/**
 * Inlined equivalent of imperfectsystems.com's real og-default.html
 * (src/assets/og/og-default.html in that repo) - satori-html requires inline
 * styles, not <style> blocks/classes, so this is hand-translated from the
 * original class-based design. Used as the smoke-test fixture because it's the
 * realistic worst case: nested flex, gradients, border-radius, and - critically -
 * both box-shadow and text-shadow, which is what caught the resvg-js crash during
 * VDA-902's toolchain spike.
 */
export const imperfectSystemsCard = `
<div style="width:1200px;height:630px;display:flex;align-items:center;justify-content:center;background:#0a0a0a;font-family:'Space Mono';position:relative;">
  <div style="position:absolute;inset:0;display:flex;background-image:radial-gradient(circle at 50% 40%, rgba(0,255,0,0.06), transparent 60%);"></div>
  <div style="position:relative;width:960px;display:flex;flex-direction:column;background:#141414;border:1px solid #3a3a3a;border-radius:14px;box-shadow:0 30px 80px -20px rgba(0,0,0,0.8), 0 0 60px -20px rgba(0,255,0,0.25);overflow:hidden;">
    <div style="display:flex;align-items:center;gap:9px;padding:16px 20px;border-bottom:1px solid #2a2a2a;background:#1a1a1a;">
      <span style="display:flex;width:13px;height:13px;border-radius:50%;background:#ff5f56;"></span>
      <span style="display:flex;width:13px;height:13px;border-radius:50%;background:#ffbd2e;"></span>
      <span style="display:flex;width:13px;height:13px;border-radius:50%;background:#27c93f;"></span>
      <span style="margin-left:12px;color:#9ca3af;font-size:17px;letter-spacing:0.02em;">imperfect-systems — zsh</span>
    </div>
    <div style="display:flex;flex-direction:column;padding:44px 48px 52px;">
      <div style="color:#9ca3af;font-size:26px;line-height:1.9;letter-spacing:0.01em;">imperfect-systems ~ %</div>
      <div style="display:flex;font-size:34px;line-height:1.8;color:#00ff00;text-shadow:0 0 10px rgba(0,255,0,0.55), 0 0 24px rgba(0,255,0,0.3);letter-spacing:0.005em;">
        <span style="color:#80ff80;margin-right:14px;">$</span>./run <span style="color:#80ff80;">--software --games --music</span>
      </div>
      <div style="display:flex;margin-top:40px;justify-content:space-between;align-items:baseline;">
        <div style="display:flex;font-size:28px;font-weight:700;color:#ededed;letter-spacing:0.04em;">
          <span style="color:#00ff00;text-shadow:0 0 10px rgba(0,255,0,0.4);">Imperfect</span> Systems
        </div>
        <div style="color:#6b7280;font-size:20px;letter-spacing:0.04em;">imperfectsystems.com</div>
      </div>
    </div>
  </div>
</div>`;
