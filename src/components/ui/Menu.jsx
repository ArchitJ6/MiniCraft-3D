import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

export const Menu = () => {
  const exportWorldFile = useStore((state) => state.exportWorldFile);
  const importWorldFile = useStore((state) => state.importWorldFile);
  const resetWorld = useStore((state) => state.resetWorld);
  const isDay = useStore((state) => state.isDay);
  const toggleDayNight = useStore((state) => state.toggleDayNight);
  const fileInputRef = useRef(null);

  const btnStyle = {
    padding: '10px 15px',
    cursor: 'pointer',
    background: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.2,
    fontFamily: 'inherit',
  };
  const menuStyle = {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 999,
    display: 'flex',
    gap: '5px',
    alignItems: 'flex-start',
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedCount = await importWorldFile(file);
      toast.success(`Imported ${importedCount} blocks from file.`);
    } catch {
      toast.error('Could not import this file. Use a valid .mmcw or JSON world file.');
    }

    e.target.value = '';
  };

  const triggerImportPicker = (e) => {
    e.stopPropagation();
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  return (
    <div style={menuStyle}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDayNight();
        }}
        style={btnStyle}
      >
        {isDay ? '☀️ Switch to Night' : '🌙 Switch to Day'}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          const exported = exportWorldFile();
          if (exported) {
            toast.success('World exported. Check your Downloads folder.');
          } else {
            toast.error('Export failed. Please try again.');
          }
        }}
        style={btnStyle}
      >
        Export World
      </button>

      <button onClick={triggerImportPicker} style={btnStyle}>
        Import World
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".mmcw,.json,.txt,.bin,application/octet-stream,application/json,text/plain"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'none' }}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          resetWorld();
        }}
        style={{ ...btnStyle, background: '#ffcccc' }}
      >
        Reset
      </button>
    </div>
  );
};
