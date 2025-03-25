import React from 'react';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/core/text';

const InlineMediaRenderer = ({ media = [] }) => {
  if (!Array.isArray(media)) return null;

  return media.map((item) => {
    const mediaUrl =
      item.links?.content_direct_temporary ||
      `https://mcs.us1.twilio.com/v1/Media/${item.sid}/ContentTemporary`;

    const contentType = item.content_type;
    const isImage = contentType?.startsWith('image/');
    const isAudio = contentType?.startsWith('audio/');
    const isPDF = contentType === 'application/pdf';
    const isCSV = contentType === 'text/csv';

    return (
      <Box key={item.sid} marginTop="space30">
        {isImage && (
          <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={mediaUrl}
              alt={item.filename || 'Image'}
              style={{ maxWidth: '200px', borderRadius: '4px' }}
            />
          </a>
        )}

        {isAudio && (
          <audio controls style={{ width: '100%' }}>
            <source src={mediaUrl} type={contentType} />
            Your browser does not support the audio element.
          </audio>
        )}

        {(isPDF || isCSV) && (
          <Text as="p">
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
              Download {item.filename || 'file'}
            </a>
          </Text>
        )}

        {!isImage && !isAudio && !isPDF && !isCSV && (
          <Text as="p">
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
              Download {item.filename || 'unknown file'}
            </a>
          </Text>
        )}
      </Box>
    );
  });
};

export default InlineMediaRenderer;
