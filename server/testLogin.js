// Using built-in fetch API for Node.js v18+
async function testLogin() {
  try {
    console.log('Testing admin login...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    console.log('Login response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('Login successful!');
      console.log('User role:', data.user.role);
    } else {
      console.log('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin();
