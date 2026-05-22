(async () => {
  const base = 'http://localhost:3001/api';
  try {
    // Try to register a test user (may return 409 if already exists)
    const email = 'apitest+1@example.com';
    const password = 'secret123';

    let res = await fetch(base + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: 'APITest' }),
    });
    console.log('register status', res.status);
    let body = await res.json().catch(() => null);
    console.log('register body', body);

    // Login
    res = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const login = await res.json().catch(() => null);
    console.log('login', login);

    const token = login?.data?.token;
    if (!token) {
      console.log('No token received, aborting further tests');
      return;
    }

    // Update profile
    res = await fetch(base + '/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'APITestUpdated', bio: 'Hello from automated test' }),
    });
    console.log('update status', res.status);
    console.log('update', await res.json().catch(() => null));

    // Get me
    res = await fetch(base + '/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('me', await res.json().catch(() => null));

    // Delete account
    res = await fetch(base + '/auth/account', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('delete status', res.status);
    console.log('delete', await res.json().catch(() => null));
  } catch (err) {
    console.error('Test script error:', err);
  }
})();
