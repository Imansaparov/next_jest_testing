'use client';

import { type PropsWithChildren, useState } from 'react';

import { MotionConfig } from 'motion/react';
import { Provider } from 'react-redux';

import { makeStore } from './store';

export function Providers({ children }: PropsWithChildren) {
  
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Provider>
  );
}
