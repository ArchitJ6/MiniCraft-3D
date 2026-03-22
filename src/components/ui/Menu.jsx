import React from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

export const Menu = () => {
  const exportWorldFile = useStore((state) => state.exportWorldFile);
  const importWorldFile = useStore((state) => state.importWorldFile);
  const resetWorld = useStore((state) => state.resetWorld);
  const isDay = useStore((state) => state.isDay);
  const toggleDayNight = useStore((state) => state.toggleDayNight);

  const btnStyle = {
    marginRight: 10,
    padding: '10px 15px',
    cursor: 'pointer',
    background: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
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
  const popupBtnStyle = {
    padding: '8px 10px',
    cursor: 'pointer',
    borderRadius: 6,
    border: '1px solid #888',
    background: 'white',
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

      <label
        style={{
          ...popupBtnStyle,
          position: 'relative',
          display: 'inline-block',
          textAlign: 'center',
          marginRight: 10,
          padding: '10px 15px',
        }}
      >
        Import World
        <input
          type="file"
          accept=".mmcw,.json,.txt,.bin,application/octet-stream,application/json,text/plain"
          onChange={handleFileChange}
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </label>

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
