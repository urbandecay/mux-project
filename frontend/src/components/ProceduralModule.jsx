import React, { memo, useState, useRef } from 'react';
import ProceduralIcon from './ProceduralIcon';

const RED_DATA = [
  [null, null, null, "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", null, null, null],
  [null, null, "#160102", "#c40015", "#e90018", "#f30019", "#f30019", "#eb0018", "#c60015", "#160001", null, null],
  [null, null, "#5f0106", "#da0016", "#e90018", "#f30019", "#f30019", "#eb0018", "#dc0017", "#5f0106", null, null],
  [null, "#160102", "#ba0013", "#da0016", "#e90018", "#f30019", "#f30019", "#eb0018", "#dc0017", "#ba0013", "#160001", null],
  [null, "#610006", "#c80015", "#da0016", "#e90018", "#f30019", "#f30019", "#eb0018", "#dc0017", "#ca0015", "#610006", null],
  ["#000000", "#b10011", "#c80015", "#da0016", "#e90018", "#f30019", "#f30019", "#eb0018", "#dc0017", "#ca0015", "#b30011", "#000000"],
  ["#000000", "#ba0013", "#c80015", "#da0016", "#e90018", "#f30019", "#f30019", "#eb0018", "#dc0017", "#ca0015", "#bc0013", "#000000"],
  ["#000000", "#ba0013", "#c80015", "#da0016", "#e90018", "#f30019", "#f30019", "#eb0018", "#dc0017", "#ca0015", "#bc0013", "#000000"],
  ["#000000", "#ba0013", "#c80015", "#da0016", "#e90018", "#f30019", "#f30019", "#eb0018", "#dc0017", "#ca0015", "#bc0013", "#000000"]
];

const GREEN_DATA = [
  [null, null, null, "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", null, null, null],
  [null, null, "#031702", "#3ad106", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#3bd306", "#031702", null, null],
  [null, null, "#1d6503", "#41e807", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#41ea07", "#1d6503", null, null],
  [null, "#031702", "#37c705", "#41e807", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#41ea07", "#37c705", "#011700", null],
  [null, "#1d6703", "#3bd506", "#41e807", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#41ea07", "#3cd706", "#1d6703", null],
  ["#000000", "#35bc04", "#3bd506", "#41e807", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#41ea07", "#3cd706", "#35be04", "#000000"],
  ["#000000", "#37c705", "#3bd506", "#41e807", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#41ea07", "#3cd706", "#38c905", "#000000"],
  ["#000000", "#37c705", "#3bd506", "#41e807", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#41ea07", "#3cd706", "#38c905", "#000000"],
  ["#000000", "#37c705", "#3bd506", "#41e807", "#45f908", "#48ff09", "#48ff09", "#46fb08", "#41ea07", "#3cd706", "#38c905", "#000000"]
];

const BLUE_DATA = [
  [null, null, null, "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", null, null, null],
  [null, null, "#030c16", "#3060ce", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#305fcc", "#030c16", null, null],
  [null, null, "#183263", "#3669e4", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#3568e2", "#183263", null, null],
  [null, "#030c16", "#2e5bc2", "#3669e4", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#3568e2", "#2e5bc2", "#030c16", null],
  [null, "#183365", "#3161d2", "#3669e4", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#3568e2", "#3161d0", "#183365", null],
  ["#000000", "#2c57ba", "#3161d2", "#3669e4", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#3568e2", "#3161d0", "#2b56b8", "#000000"],
  ["#000000", "#2e5bc4", "#3161d2", "#3669e4", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#3568e2", "#3161d0", "#2e5bc2", "#000000"],
  ["#000000", "#2e5bc4", "#3161d2", "#3669e4", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#3568e2", "#3161d0", "#2e5bc2", "#000000"],
  ["#000000", "#2e5bc4", "#3161d2", "#3669e4", "#3970f5", "#3b74fd", "#3b74fd", "#396ff3", "#3568e2", "#3161d0", "#2e5bc2", "#000000"]
];

const INDICATOR_DATA = [
  ["#525560", "#525560", "#51545e", "#44464f", "#49513e", "#3f482c", "#414a2f", "#475039", "#515753", "#525560", "#525560", "#525560"],
  ["#525560", "#50535d", "#48503d", "#5b6c23", "#83a120", "#97ba23", "#96b823", "#84a320", "#516023", "#474f39", "#4e515b", "#525560"],
  ["#51545f", "#464f38", "#6d8521", "#9dc124", "#a6cc27", "#a9d027", "#a9d027", "#a4cb27", "#99bc24", "#69801e", "#49513e", "#525560"],
  ["#454851", "#576724", "#9dc124", "#a9d027", "#b0d929", "#b1da29", "#b1da29", "#aed728", "#a6cc27", "#97ba23", "#445120", "#505750"],
  ["#474f39", "#83a120", "#a6cc27", "#aed728", "#b4de29", "#b7e22a", "#b6e12a", "#b3dc29", "#add528", "#a1c725", "#78931e", "#4a523e"],
  ["#414a2e", "#96b823", "#a9d027", "#b1da29", "#b7e22a", "#b8e32a", "#b8e32a", "#b6e12a", "#b0d929", "#a4cb27", "#8cac21", "#414a2d"],
  ["#414a2e", "#96b823", "#a9d027", "#b1da29", "#b7e22a", "#b8e32a", "#b8e32a", "#b6e12a", "#b0d929", "#a4cb27", "#8aaa21", "#414a2d"],
  ["#474f39", "#83a120", "#a6cc27", "#aed728", "#b4de29", "#b7e22a", "#b6e12a", "#b3dc29", "#add528", "#a1c725", "#78931e", "#4a523e"],
  ["#454851", "#576724", "#9dc124", "#a9d027", "#b0d929", "#b1da29", "#b1da29", "#aed728", "#a6cc27", "#97ba23", "#445120", "#505750"],
  ["#51545f", "#464f38", "#6d8521", "#9dc124", "#a6cc27", "#a9d027", "#a9d027", "#a4cb27", "#99bc24", "#69801e", "#49513e", "#525560"],
  ["#525560", "#50535d", "#48503d", "#5b6c23", "#83a120", "#97ba23", "#96b823", "#84a320", "#516023", "#474f39", "#4e515b", "#525560"],
  ["#525560", "#525560", "#51545e", "#44464f", "#49513e", "#3f482c", "#414a2f", "#475039", "#515753", "#525560", "#525560", "#525560"]
];

const INDICATOR_OFF_DATA = [
  ["#525560", "#525560", "#50535d", "#464850", "#41444b", "#3b3e44", "#3a3d43", "#40434a", "#484a51", "#525560", "#525560", "#525560"],
  ["#525560", "#4e5058", "#42454b", "#55585f", "#6f7279", "#7d8087", "#7b7f85", "#6f7379", "#53565d", "#41444a", "#4a4c54", "#525560"],
  ["#4f525c", "#41434a", "#5b5e65", "#81848b", "#868a90", "#868a91", "#878a91", "#86898f", "#80838a", "#5a5d64", "#40434a", "#525560"],
  ["#464850", "#50535a", "#81848b", "#868a91", "#8f9299", "#8d9197", "#8d9197", "#8e9198", "#878a91", "#7e8188", "#4e5158", "#494c52"],
  ["#40434a", "#6b6e75", "#868a91", "#8e9198", "#90949a", "#92969c", "#91959b", "#90949a", "#8d9197", "#84888e", "#65686f", "#41444b"],
  ["#393c42", "#7c7f86", "#868a91", "#8d9197", "#92969c", "#94989e", "#94989e", "#92969c", "#8d9197", "#85898f", "#787b82", "#3a3c42"],
  ["#3a3d43", "#7b7f85", "#878a91", "#8d9197", "#91959b", "#94989e", "#94989e", "#92969c", "#8d9197", "#868a90", "#767980", "#3a3d43"],
  ["#40434a", "#6e7178", "#86898f", "#8e9198", "#90949a", "#92969c", "#92969c", "#90949a", "#8c9096", "#82868c", "#676a71", "#41444a"],
  ["#484a51", "#53565d", "#80838a", "#878a91", "#8d9197", "#8d9197", "#8d9197", "#8c9096", "#868a91", "#7e8188", "#50535a", "#4a4c53"],
  ["#525560", "#41444a", "#5a5d64", "#7e8188", "#84888e", "#85898f", "#868a90", "#82868c", "#7e8188", "#575a61", "#404349", "#525560"],
  ["#525560", "#4a4c54", "#40434a", "#4e5158", "#65686f", "#787b82", "#767980", "#676a71", "#50535a", "#404349", "#494c53", "#525560"],
  ["#525560", "#525560", "#525560", "#494c52", "#41444b", "#3a3c42", "#3a3d43", "#41444a", "#4a4c53", "#525560", "#525560", "#525560"]
];

const bakeGrid = (data, w, h) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${data.flatMap((row, y) => row.map((color, x) => color ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${color.length === 9 ? color.slice(0, 7) : color}" fill-opacity="${color.length === 9 ? parseInt(color.slice(7, 9), 16) / 255 : 1}"/>` : '')).join('')}</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const BAKED = {
  red: bakeGrid(RED_DATA, 12, 9), red_rev: bakeGrid([...RED_DATA].reverse(), 12, 9),
  green: bakeGrid(GREEN_DATA, 12, 9), green_rev: bakeGrid([...GREEN_DATA].reverse(), 12, 9),
  blue: bakeGrid(BLUE_DATA, 12, 9), blue_rev: bakeGrid([...BLUE_DATA].reverse(), 12, 9),
  indicator: bakeGrid(INDICATOR_DATA, 12, 12), indicator_off: bakeGrid(INDICATOR_OFF_DATA, 12, 12)
};

const ProceduralModule = ({ 
  width, inputs = [], outputs = [], originalLabel, displayName, isSelected, hasIndicator = false, isActive = true, onIndicatorClick, icon = null, dockedTop = false, dockedBottom = false, color
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef(null);
  const handleMouseEnter = (e) => {
    const el = e.currentTarget.querySelector('.module-label-text'), isCustom = displayName && displayName !== originalLabel;
    if (el && (el.scrollWidth > el.clientWidth || isCustom)) hoverTimer.current = setTimeout(() => setIsHovered(true), 1000);
  };
  const handleMouseLeave = () => { if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; } setIsHovered(false); };

  const BODY_HIGHLIGHT = isSelected ? '#282b30' : '#525560', BODY_MAIN = isSelected ? '#282b30' : '#505560', BORDER_OUTLINE = isSelected ? '#949598' : '#1a1a1a';
  const offset = 10.5, maxPorts = Math.max(inputs.length, outputs.length);
  const finalWidth = Math.max(width || 99, (maxPorts > 0 ? (offset + (maxPorts - 1) * 14 + 6) + 5 : 99));

  const isOutputModule = originalLabel?.toLowerCase().includes('output');
  const iconLeft = (hasIndicator ? 22 : 6) - (isOutputModule ? 2 : 0), iconWidth = isOutputModule ? 13 : 14, textGap = isOutputModule ? 2 : 3, textLeft = icon ? (iconLeft + iconWidth + textGap) : (hasIndicator ? 29 : 12);

  const clipTop = dockedTop ? 9 : 0, clipBottom = dockedBottom ? 9 : 0, clipPath = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;

  return (
    <div style={{ width: finalWidth, height: 38, display: 'flex', flexDirection: 'column', cursor: 'grab', imageRendering: 'pixelated', userSelect: 'none', position: 'relative', zIndex: isHovered ? 1000 : 1, clipPath: (dockedTop || dockedBottom) ? clipPath : 'none', pointerEvents: 'none' }}>
      {!dockedTop ? (
        <div style={{ height: 9, display: 'flex', position: 'relative', pointerEvents: 'none' }}>
          {inputs.map((type, i) => (
            <div key={`in-${i}`} style={{ position: 'absolute', left: offset + i * 14 - 6, width: 12, height: 9, backgroundImage: `url("${type === 'modulation' ? BAKED.green : (type === 'event' ? BAKED.blue : BAKED.red)}")`, backgroundSize: '100% 100%' }} />
          ))}
        </div>
      ) : <div style={{ height: 9, pointerEvents: 'none' }} />}
      
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ height: 20, width: '100%', background: color || `linear-gradient(to bottom, ${BODY_HIGHLIGHT} 0px, ${BODY_HIGHLIGHT} 2px, ${BODY_MAIN} 2px, ${BODY_MAIN} 18px, ${BODY_HIGHLIGHT} 18px, ${BODY_HIGHLIGHT} 20px)`, border: `1px solid ${BORDER_OUTLINE}`, boxSizing: 'border-box', display: 'block', padding: 0, overflow: 'visible', position: 'relative', pointerEvents: 'auto' }}>
        {hasIndicator && <div onMouseDown={(e) => { if (onIndicatorClick) { e.stopPropagation(); onIndicatorClick(); } }} style={{ position: 'absolute', left: 5, top: 4, width: 12, height: 12, backgroundImage: `url("${isActive ? BAKED.indicator : BAKED.indicator_off}")`, backgroundSize: '100% 100%', pointerEvents: 'auto', cursor: onIndicatorClick ? 'pointer' : 'default' }} />}
        {icon && <ProceduralIcon name={icon} useOffset={true} width={iconWidth} style={{ position: 'absolute', left: iconLeft, top: 2 }} />}
        <span className="module-label-text" style={{ fontSize: '10px', color: '#fff', fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '0px', whiteSpace: 'nowrap', pointerEvents: 'none', WebkitFontSmoothing: 'none', MozOsxFontSmoothing: 'unset', position: 'absolute', left: textLeft, right: 5, top: -1, lineHeight: '20px', height: '20px', overflow: 'hidden', textOverflow: 'clip', display: 'block' }}>{displayName || originalLabel}</span>
      </div>

      {!dockedBottom ? (
        <div style={{ height: 9, display: 'flex', position: 'relative', pointerEvents: 'none' }}>
          {outputs.map((type, i) => (
            <div key={`out-${i}`} style={{ position: 'absolute', left: offset + i * 14 - 6, width: 12, height: 9, backgroundImage: `url("${type === 'modulation' ? BAKED.green_rev : (type === 'event' ? BAKED.blue_rev : BAKED.red_rev)}")`, backgroundSize: '100% 100%' }} />
          ))}
        </div>
      ) : <div style={{ height: 9, pointerEvents: 'none' }} />}

      {isHovered && (
        <div style={{ position: 'absolute', top: displayName && displayName !== originalLabel ? -54 : -42, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.85)', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', zIndex: 10000, whiteSpace: 'nowrap', pointerEvents: 'none', border: '1px solid #555', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {displayName && displayName !== originalLabel ? (<><div style={{ borderBottom: '1px solid #555', paddingBottom: '2px', marginBottom: '2px', width: '100%', textAlign: 'center' }}>{originalLabel}</div><div>{displayName}</div></>) : originalLabel}
        </div>
      )}
    </div>
  );
};

export default memo(ProceduralModule);
