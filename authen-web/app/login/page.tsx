'use client';

import { useState } from 'react';
import { trpc } from '@/app/utils/trpc';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const login = async () => {
    const res = await trpc.auth.login.mutate({ username, password });
    console.log(res);
    setToken(res.token);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input className="border p-2 w-full mb-2" placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="password" type="password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={login}>Login</button>
      {token && <p className="mt-4 break-words text-green-600">Token: {token}</p>}
    </div>
  );
}
