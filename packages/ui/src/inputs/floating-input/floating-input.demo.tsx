'use client';

import React, { useState } from 'react';
import { FloatingInput } from './floating-input';

export function FloatingInputDemo() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('sec_live_9a8bc42f9e');

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-5 p-6">
      <FloatingInput
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText="We will never share your private developer credentials."
      />

      <FloatingInput
        label="Live API Key"
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <FloatingInput
        label="Workspace Slug"
        type="text"
        defaultValue="acme-corp"
        error="Slug 'acme-corp' is already reserved."
      />
    </div>
  );
}

export default FloatingInputDemo;

