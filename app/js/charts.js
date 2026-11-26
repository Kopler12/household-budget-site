// HearthLedger — canvas charts. Vanilla, no libraries.
// Every chart reads its data from plain arguments and draws crisp lines
// at the device pixel ratio.

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const h = height;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

export function drawDonut(canvas, slices) {
  const { ctx, w, h } = setup(canvas, 260);
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 14, inner = r * 0.62;
  const total = slices.reduce((s, x) => s + x.amount, 0);
  if (!total) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No spending yet this month', cx, cy);
    return;
  }
  let a = -Math.PI / 2;
  for (const s of slices) {
    const sweep = (s.amount / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a + sweep);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    a += sweep;
  }
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#1f2937';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('$' + Math.round(total).toLocaleString('en-US'), cx, cy - 2);
  ctx.fillStyle = '#6b7280';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('spent in November', cx, cy + 20);
}

export function drawBars(canvas, series, opts = {}) {
  // series: [{label, income, spending}]
  const { ctx, w, h } = setup(canvas, opts.height || 240);
  const padL = 52, padR = 12, padT = 18, padB = 28;
  const max = Math.max(1, ...series.flatMap((s) => [s.income, s.spending]));
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = series.length, slot = plotW / n, bw = Math.min(26, (slot - 18) / 2);

  ctx.strokeStyle = '#e5e0d8';
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = padT + plotH - (plotH * v) / max;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillText('$' + Math.round(v / 1000) + 'k', padL - 8, y + 4);
  }

  series.forEach((s, i) => {
    const x0 = padL + i * slot + (slot - bw * 2 - 6) / 2;
    const hIn = (plotH * s.income) / max;
    const hSp = (plotH * s.spending) / max;
    ctx.fillStyle = '#2f6f5e';
    roundRect(ctx, x0, padT + plotH - hIn, bw, hIn, 3);
    ctx.fillStyle = '#e07840';
    roundRect(ctx, x0 + bw + 6, padT + plotH - hSp, bw, hSp, 3);
    ctx.fillStyle = '#374151';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.label, padL + i * slot + slot / 2, h - 8);
  });

  // Legend
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#2f6f5e'; ctx.fillRect(padL, 2, 10, 10);
  ctx.fillStyle = '#374151'; ctx.fillText('Income', padL + 15, 11);
  ctx.fillStyle = '#e07840'; ctx.fillRect(padL + 80, 2, 10, 10);
  ctx.fillStyle = '#374151'; ctx.fillText('Spending', padL + 95, 11);
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
}
