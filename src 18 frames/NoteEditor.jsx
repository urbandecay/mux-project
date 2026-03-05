import React, { useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { DISPLAY_NAMES } from './moduleRegistry';

// Safe registration of Quill formats/attributors
if (Quill) {
  // Register standard system fonts
  const Font = Quill.import('formats/font');
  Font.whitelist = [
    '', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Trebuchet MS', 'Verdana', 
    'separator', 'Ubuntu', 'Roboto', 'DejaVu Sans', 'Liberation Serif', 'Impact', 
    'Tahoma', 'Comic Sans MS', 'Palatino Linotype', 'Garamond', 'Century Gothic', 
    'Consolas', 'Noto Sans', 'Open Sans', 'Helvetica', 'Calibri'
  ];
  Quill.register(Font, true);

  // Register pixel sizes
  const Size = Quill.import('formats/size');
  Size.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '64px', '72px'];
  Quill.register(Size, true);

  // Ensure Quill uses inline styles for both fonts and sizes
  try {
    const DirectionAttribute = Quill.import('attributors/style/direction');
    Quill.register(DirectionAttribute, true);
    const AlignStyle = Quill.import('attributors/style/align');
    Quill.register(AlignStyle, true);
    const BackgroundStyle = Quill.import('attributors/style/background');
    Quill.register(BackgroundStyle, true);
    const ColorStyle = Quill.import('attributors/style/color');
    Quill.register(ColorStyle, true);
    const FontStyle = Quill.import('attributors/style/font');
    FontStyle.whitelist = Font.whitelist;
    Quill.register(FontStyle, true);
    const SizeStyle = Quill.import('attributors/style/size');
    Quill.register(SizeStyle, true);
  } catch (e) {
    console.error('Error registering Quill inline styles:', e);
  }
}

const NoteEditor = ({ node, onClose, onSave }) => {
  const quillRef = useRef(null);
  const [text, setText] = React.useState(node.text || '');
  
  // Floating Window State
  const [pos, setPos] = React.useState(node.editorPos || { x: window.innerWidth / 2 - 400, y: 50 });
  const [size, setSize] = React.useState(node.editorSize || { w: 800, h: window.innerHeight * 0.8 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
      if (isResizing) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setSize(prev => ({
          w: Math.max(400, prev.w + dx),
          h: Math.max(300, prev.h + dy)
        }));
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing]);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      
      const updateToolbarStyles = () => {
        if (!quill) return;
        const format = quill.getFormat();
        const color = format.color || '#ccc';
        const bgColor = format.background || '#333';
        const font = format.font || '';
        const size = format.size || '';
        
        const toolbarModule = quill.getModule('toolbar');
        if (!toolbarModule || !toolbarModule.container) return;
        const toolbar = toolbarModule.container;
        
        toolbar.style.setProperty('--current-color', color);
        toolbar.style.setProperty('--current-bg-color', bgColor);
        
        // Sync Font Label
        const fontPicker = toolbar.querySelector('.ql-font .ql-picker-label');
        if (fontPicker) {
          fontPicker.style.fontFamily = font || 'inherit';
          fontPicker.setAttribute('data-value', font || '');
        }

        // Sync Size Label
        const sizePicker = toolbar.querySelector('.ql-size .ql-picker-label');
        if (sizePicker) {
          sizePicker.setAttribute('data-value', size || '16px');
        }
      };

      const timer = setTimeout(() => {
        quill.on('editor-change', updateToolbarStyles);
        quill.on('selection-change', updateToolbarStyles);
        updateToolbarStyles();

        // Add tooltips
        const toolbar = document.querySelector('.ql-toolbar');
        if (toolbar) {
          const buttons = {
            'font': 'Font Family',
            'size': 'Font Size',
            'bold': 'Bold',
            'italic': 'Italic',
            'underline': 'Underline',
            'strike': 'Strikethrough',
            'color': 'Text Color',
            'background': 'Highlight Color',
            'list[value="ordered"]': 'Numbered List',
            'list[value="bullet"]': 'Bulleted List',
            'clean': 'Clear Formatting'
          };

          Object.entries(buttons).forEach(([className, title]) => {
            const el = toolbar.querySelector(`.ql-${className}`);
            if (el) {
              el.setAttribute('title', title);
              const label = el.querySelector('.ql-picker-label');
              if (label) label.setAttribute('title', title);
            }
          });
        }
      }, 200);

      return () => {
        clearTimeout(timer);
        if (quill) {
          quill.off('editor-change', updateToolbarStyles);
          quill.off('selection-change', updateToolbarStyles);
        }
      };
    }
  }, []);

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.4)', zIndex: 20000,
        pointerEvents: 'auto'
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose(); // Act as Cancel
        }
      }}
    >
      <div style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        background: '#252525',
        border: '1px solid #555',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        pointerEvents: 'auto'
      }}>

        <div 
          style={{
            padding: '12px 20px', background: '#333', borderBottom: '1px solid #444',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'move', userSelect: 'none'
          }}
          onMouseDown={(e) => {
            if (e.target.tagName !== 'BUTTON') {
              setIsDragging(true);
              dragStartRef.current = { x: e.clientX, y: e.clientY };
            }
          }}
        >
          <span style={{ color: '#eee', fontWeight: 'bold' }}>
            Note Editor: {node.displayName || DISPLAY_NAMES[node.label] || node.label}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={onClose}
              style={{ 
                background: '#555', color: '#fff', border: 'none', padding: '5px 15px', 
                borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' 
              }}
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onSave(node.id, text, false, { editorPos: pos, editorSize: size });
                onClose();
              }}
              style={{ 
                background: '#c00', color: '#fff', border: 'none', padding: '5px 15px', 
                borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' 
              }}
            >
              Close & Save
            </button>
          </div>
        </div>
        <div style={{ flex: 1, background: '#1a1a1a', overflow: 'hidden', display: 'flex', flexDirection: 'row', position: 'relative' }}>
          <style>{`
            .quill { height: 100%; display: flex; flexDirection: row; flex: 1; }
            .ql-container { flex: 1; border: none !important; font-size: 16px; color: #eee; }
            
            .ql-toolbar {
              display: flex;
              flex-direction: column;
              align-items: flex-start !important;
              gap: 10px;
              padding: 12px 10px !important;
              width: 200px !important;
              background: #333; 
              border: none !important; 
              border-right: 1px solid #444 !important;
              overflow-y: auto;
            }

            .ql-snow .ql-stroke { stroke: #e0e0e0 !important; }
            .ql-snow .ql-fill { fill: #e0e0e0 !important; }
            .ql-snow .ql-picker { color: #e0e0e0 !important; }
            .ql-snow .ql-button.ql-active .ql-stroke { stroke: #0080ff !important; }
            .ql-snow .ql-button.ql-active .ql-fill { fill: #0080ff !important; }
            .ql-snow button:hover .ql-stroke { stroke: #0080ff !important; }
            
            .ql-formats {
              display: flex !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              width: 100% !important;
              margin: 0 !important;
            }
            .ql-picker.ql-font, .ql-picker.ql-size {
              width: 100% !important;
            }
            .ql-picker-label {
              width: 100% !important;
              padding-left: 8px !important;
              padding-right: 20px !important;
              display: flex !important;
              align-items: center;
            }
            .ql-picker-options {
              width: 200px !important;
              background-color: #333 !important; 
              border: 1px solid #555 !important; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important; 
              max-height: 300px; 
              overflow-y: auto;
            }
            
            .ql-color .ql-picker-label {
              width: auto !important;
              min-width: 30px !important;
              padding-left: 4px !important;
            }
            .ql-background .ql-picker-label {
              width: auto !important;
              min-width: 30px !important;
              padding-left: 4px !important;
            }

            .ql-color .ql-picker-label svg, .ql-background .ql-picker-label svg {
              display: none !important;
            }

            .ql-color .ql-picker-label::after {
              content: "A";
              font-family: sans-serif;
              font-weight: 700;
              font-size: 18px;
              color: #e0e0e0;
              border-bottom: 3px solid var(--current-color, #e0e0e0);
              line-height: 1.2;
              text-align: center;
              margin-left: 2px;
            }

            .ql-background .ql-picker-label::after {
              content: "";
              display: block;
              width: 16px !important;
              height: 16px !important;
              background-color: var(--current-bg-color, #333);
              border: 2px solid #e0e0e0;
              margin-left: 0;
              flex-shrink: 0; 
              box-sizing: border-box;
            }

            .ql-picker-item { color: #ccc !important; }
            .ql-picker.ql-font .ql-picker-item { color: var(--current-color, #ccc) !important; }
            .ql-picker.ql-font .ql-picker-label { color: var(--current-color, #ccc) !important; }
            .ql-picker.ql-size .ql-picker-item { color: var(--current-color, #ccc) !important; }
            .ql-picker.ql-size .ql-picker-label { color: var(--current-color, #ccc) !important; }
            .ql-picker-item:hover { background-color: #0080ff !important; color: #fff !important; }
            .ql-picker-label:hover { color: #fff !important; }
            .ql-picker-label.ql-active { color: var(--current-color, #0080ff) !important; }
            
            .ql-editor.ql-blank::before { color: #666 !important; font-style: normal; }

            .ql-picker.ql-font .ql-picker-item[data-value="separator"] {
              border-top: 1px solid #555 !important;
              margin-top: 4px !important;
              padding: 0 !important;
              height: 0 !important;
              pointer-events: none !important;
            }
            .ql-picker.ql-font .ql-picker-item[data-value="separator"]::before { content: "" !important; }

            .ql-picker.ql-size .ql-picker-label::before,
            .ql-picker.ql-size .ql-picker-item::before { content: '16px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="8px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="8px"]::before { content: '8px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before { content: '10px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before { content: '12px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before { content: '14px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before { content: '16px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before { content: '18px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before { content: '20px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before { content: '24px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before { content: '30px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before { content: '36px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before { content: '48px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="64px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="64px"]::before { content: '64px'; }
            .ql-picker.ql-size .ql-picker-label[data-value="72px"]::before,
            .ql-picker.ql-size .ql-picker-item[data-value="72px"]::before { content: '72px'; }

            .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before { content: 'Arial'; font-family: Arial, Helvetica, sans-serif; }
            .ql-picker.ql-font .ql-picker-label[data-value="Times New Roman"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Times New Roman"]::before { content: 'Times New Roman'; font-family: "Times New Roman"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Courier New"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Courier New"]::before { content: 'Courier New'; font-family: "Courier New"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Georgia"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Georgia"]::before { content: 'Georgia'; font-family: Georgia; }
            .ql-picker.ql-font .ql-picker-label[data-value="Trebuchet MS"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Trebuchet MS"]::before { content: 'Trebuchet MS'; font-family: "Trebuchet MS"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Verdana"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Verdana"]::before { content: 'Verdana'; font-family: Verdana; }
            .ql-picker.ql-font .ql-picker-label[data-value="Ubuntu"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Ubuntu"]::before { content: 'Ubuntu'; font-family: Ubuntu; }
            .ql-picker.ql-font .ql-picker-label[data-value="Roboto"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Roboto"]::before { content: 'Roboto'; font-family: Roboto; }
            .ql-picker.ql-font .ql-picker-label[data-value="DejaVu Sans"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="DejaVu Sans"]::before { content: 'DejaVu Sans'; font-family: "DejaVu Sans"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Liberation Serif"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Liberation Serif"]::before { content: 'Liberation Serif'; font-family: "Liberation Serif"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Impact"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Impact"]::before { content: 'Impact'; font-family: Impact; }
            .ql-picker.ql-font .ql-picker-label[data-value="Tahoma"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Tahoma"]::before { content: 'Tahoma'; font-family: Tahoma; }
            .ql-picker.ql-font .ql-picker-label[data-value="Comic Sans MS"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Comic Sans MS"]::before { content: 'Comic Sans'; font-family: "Comic Sans MS"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Palatino Linotype"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Palatino Linotype"]::before { content: 'Palatino'; font-family: Palatino; }
            .ql-picker.ql-font .ql-picker-label[data-value="Garamond"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Garamond"]::before { content: 'Garamond'; font-family: Garamond; }
            .ql-picker.ql-font .ql-picker-label[data-value="Century Gothic"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Century Gothic"]::before { content: 'Century Gothic'; font-family: "Century Gothic"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Consolas"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Consolas"]::before { content: 'Consolas'; font-family: Consolas; }
            .ql-picker.ql-font .ql-picker-label[data-value="Noto Sans"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Noto Sans"]::before { content: 'Noto Sans'; font-family: "Noto Sans"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Open Sans"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Open Sans"]::before { content: 'Open Sans'; font-family: "Open Sans"; }
            .ql-picker.ql-font .ql-picker-label[data-value="Helvetica"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Helvetica"]::before { content: 'Helvetica'; font-family: Helvetica; }
            .ql-picker.ql-font .ql-picker-label[data-value="Calibri"]::before,
            .ql-picker.ql-font .ql-picker-item[data-value="Calibri"]::before { content: 'Calibri'; font-family: Calibri; }
          `}</style>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={text}
            onChange={setText}
            modules={{
              toolbar: [
                [{ 'font': [
                  '', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Trebuchet MS', 'Verdana', 
                  'separator', 'Ubuntu', 'Roboto', 'DejaVu Sans', 'Liberation Serif', 'Impact', 
                  'Tahoma', 'Comic Sans MS', 'Palatino Linotype', 'Garamond', 'Century Gothic', 
                  'Consolas', 'Noto Sans', 'Open Sans', 'Helvetica', 'Calibri'
                ] }, { 'size': ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '64px', '72px'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['clean']
              ],
            }}
          />
          <div 
            style={{
              position: 'absolute', right: 0, bottom: 0, width: '15px', height: '15px',
              cursor: 'nwse-resize', background: 'linear-gradient(135deg, transparent 50%, #555 50%)',
              zIndex: 10
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              dragStartRef.current = { x: e.clientX, y: e.clientY };
            }}
          />
        </div>
        <div style={{ padding: '8px 20px', background: '#333', color: '#888', fontSize: '11px', borderTop: '1px solid #444' }}>
          Press "Close & Save" or click outside the editor to save.
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;