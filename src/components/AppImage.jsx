import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const text = alt.charAt(0).toUpperCase() || 'W';
        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3Ctext x='50' y='65' font-family='sans-serif' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
        e.target.onerror = null; // Prevent infinite loop
      }}
      {...props}
    />
  );
}

export default Image;
