import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

function simpleMarkdownToHtml(text) {
  if (typeof text !== 'string') return '';

  let html = text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n/g, '<br />');

  return html;
}

export default function SummaryDisplay({ summary }) {
  if (!summary) {
    return <Typography variant="body2" color="textSecondary">No summary available.</Typography>;
  }

  return (
    <Card sx={{mt: 2}}>
      <Box sx={{ typography: 'body1', p: 2,  whiteSpace: 'pre-line' }}>
        <div dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(summary) }} />
      </Box>
    </Card>
  );
}
