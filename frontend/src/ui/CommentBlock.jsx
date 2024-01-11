import { Box, Paper, Typography } from '@mui/material';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CommentBlock = (props) => {
  const {author, content, timestamp} = props;
  const {theme} = useTheme();

  return (
    <Paper elevation={3} sx={{ padding: '10px', margin: '10px 0', bgcolor: theme.palette.background.table }} color={theme.palette.text.main}>
      <Typography variant="caption" color={theme.palette.text.dark}>{author}:</Typography>
      <Typography variant="body1" color={theme.palette.text.main}>{content}</Typography>
      <Box mt={1} fontSize={12} sx={{bgcolor: theme.palette.background.table}}>
        <Typography variant="caption" style={{ marginLeft: '10px', display: 'flex', justifyContent: 'right', bgcolor: theme.palette.background.table }} color={theme.palette.text.light}>
          {timestamp}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CommentBlock;
