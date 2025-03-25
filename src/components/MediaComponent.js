import React from 'react';

const MediaComponent = ({ media }) => {
  return media ? <a href={media.url} target="_blank" rel="noopener noreferrer">View Media</a> : <p>No media available</p>;
};

export default MediaComponent;
