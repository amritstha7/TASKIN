/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { AuthGate } from './components/AuthGate';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </QueryProvider>
  );
}
