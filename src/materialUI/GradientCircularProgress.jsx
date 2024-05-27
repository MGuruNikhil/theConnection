import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function GradientCircularProgress() {
    return (
      <div className='p-2 w-full h-full flex items-center justify-center'>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#207175" />
              <stop offset="100%" stopColor="#c13434" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      </div>
    );
}

export default GradientCircularProgress;