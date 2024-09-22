import { useRef } from 'react';
import mediumZoom from 'medium-zoom';

export function ImageZoom({ options, ...props }) {
  const zoomRef = useRef(null);

  function getZoom() {
    if (zoomRef.current === null) {
      zoomRef.current = mediumZoom(options);
    }

    return zoomRef.current;
  }

  const attachZoom = node => {
    const zoom = getZoom();

    if (node) {
      zoom.attach(node);
    } else {
      zoom.detach();
    }
  };

  return <img {...props} ref={attachZoom} />;
}
