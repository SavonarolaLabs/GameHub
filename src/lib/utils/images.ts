// SVG → data URI
export const svgDataURI = (svg: string) => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

// простая onerror без двоеточий: <img onerror={(e)=>onImgError(e, fallback)} />
export function onImgError(e: Event, fallback: string) {
	const img = e.currentTarget as HTMLImageElement;
	if (img && img.src !== fallback) img.src = fallback;
}

// 🔶 плейсхолдер для сотрудников (кружок-аватар)
export const staffFallback = svgDataURI(`
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <rect width="100%" height="100%" fill="#334155"/>
  <circle cx="64" cy="48" r="26" fill="#64748b"/>
  <rect x="26" y="82" width="76" height="34" rx="17" fill="#64748b"/>
</svg>`);

// 🔷 плейсхолдер для площадок (иконка сцены)
export const spaceFallback = svgDataURI(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="100%" height="100%" fill="#1f2937"/>
  <rect x="80" y="220" width="480" height="40" rx="8" fill="#4b5563"/>
  <rect x="120" y="160" width="400" height="40" rx="8" fill="#6b7280"/>
  <rect x="160" y="120" width="320" height="30" rx="6" fill="#9ca3af"/>
</svg>`);

// 🔶 плейсхолдер для фотобанка (иконка камеры)
export const photobankFallback = svgDataURI(`
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#475569"/>
      <stop offset="1" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="64" cy="64" r="46" fill="#1f2937"/>
  <rect x="36" y="54" width="56" height="30" rx="6" fill="#64748b"/>
  <rect x="44" y="48" width="20" height="10" rx="3" fill="#94a3b8"/>
  <circle cx="64" cy="69" r="12" fill="#0ea5e9"/>
  <circle cx="64" cy="69" r="6" fill="#e2e8f0"/>
</svg>`);
