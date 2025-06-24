import { useState, useEffect } from 'react';

const ResizeHandle = ({
  direction = 'vertical', // 'vertical' or 'horizontal'
  onResize,
  minSize = 200,
  maxSize = null,
  className = '',
  style = {},
  title = 'Resize'
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Add global cursor style when resizing
  useEffect(() => {
    if (isResizing) {
      const cursor = direction === 'vertical' ? 'col-resize' : 'row-resize';
      document.body.style.cursor = cursor;
      document.body.style.userSelect = 'none';
      
      return () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, direction]);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();

    const startPos = direction === 'vertical' ? e.clientX : e.clientY;
    const windowSize = direction === 'vertical' ? window.innerWidth : window.innerHeight;
    const defaultMaxSize = windowSize * 0.7; // Default max 70% of window size

    // Notify that resizing started
    if (onResize) {
      onResize(0, {
        minSize,
        maxSize: maxSize || defaultMaxSize,
        isResizing: true
      });
    }

    const handleMouseMove = (e) => {
      const currentPos = direction === 'vertical' ? e.clientX : e.clientY;
      const delta = currentPos - startPos; // Calculate total delta from start position
      
      if (onResize) {
        onResize(delta, {
          minSize,
          maxSize: maxSize || defaultMaxSize,
          isResizing: true
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Notify that resizing ended
      if (onResize) {
        onResize(0, { 
          minSize,
          maxSize: maxSize || defaultMaxSize,
          isResizing: false 
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const baseClasses = direction === 'vertical' 
    ? 'w-1 cursor-col-resize' 
    : 'h-1 cursor-row-resize';
    
  const defaultClasses = 'flex-shrink-0 transition-all duration-200 relative group';
  
  const colorClasses = isResizing 
    ? 'bg-purple-500/80 shadow-lg shadow-purple-500/50' 
    : isHovered 
      ? 'bg-purple-500/60' 
      : 'bg-purple-500/20 hover:bg-purple-500/40';

  return (
    <div
      className={`${baseClasses} ${defaultClasses} ${colorClasses} ${className}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      {/* Visual indicator dots */}
      <div className={`absolute inset-0 flex ${direction === 'vertical' ? 'flex-col' : 'flex-row'} items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`${direction === 'vertical' ? 'w-0.5 h-0.5' : 'w-0.5 h-0.5'} bg-white/80 rounded-full`}
          />
        ))}
      </div>
      
      {/* Invisible extended hit area for easier interaction */}
      <div className={`absolute ${direction === 'vertical' ? '-left-1 -right-1 inset-y-0' : '-top-1 -bottom-1 inset-x-0'}`} />
    </div>
  );
};

export default ResizeHandle;
