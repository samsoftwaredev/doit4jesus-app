import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
  link: string;
}

function CopyLinkButton({ link }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500); // Reset after 1.5 seconds
  };

  return (
    <Box display="flex" justifyItems="center" alignItems="center">
      <Typography noWrap>{link}</Typography>
      <CopyToClipboard text={link} onCopy={handleCopy}>
        <Button variant="outlined" size="small">
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </CopyToClipboard>
    </Box>
  );
}

export default CopyLinkButton;
