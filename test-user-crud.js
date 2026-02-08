// Test script para verificar el endpoint de usuarios
const testUserCRUD = async () => {
    const BASE_URL = 'http://192.168.1.234:3000/api';

    console.log('=== Testing User CRUD Endpoints ===\n');

    // 1. Test login to get token
    console.log('1. Testing login...');
    try {
        const loginRes = await fetch(`${BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@wardogs.com',
                contrasena: 'admin123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login response:', loginData.success ? 'SUCCESS' : 'FAILED');

        if (!loginData.success || !loginData.data.token) {
            console.error('Login failed, cannot continue tests');
            return;
        }

        const token = loginData.data.token;
        console.log('Token obtained:', token.substring(0, 20) + '...\n');

        // 2. Test GET /api/usuarios
        console.log('2. Testing GET /api/usuarios...');
        const getUsersRes = await fetch(`${BASE_URL}/usuarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await getUsersRes.json();
        console.log('GET usuarios response:', getUsersRes.status, getUsersRes.statusText);
        console.log('Data:', usersData);

        if (usersData.success && usersData.data.usuarios.length > 0) {
            const testUser = usersData.data.usuarios[0];
            console.log('\nTest user found:', testUser.email, '(ID:', testUser._id + ')\n');

            // 3. Test PUT /api/usuarios/:id
            console.log('3. Testing PUT /api/usuarios/' + testUser._id + '...');
            const updateRes = await fetch(`${BASE_URL}/usuarios/${testUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: testUser.nombre,
                    apellidos: testUser.apellidos || '',
                    email: testUser.email,
                    telefono: testUser.telefono || '',
                    rol: testUser.rol,
                    activo: testUser.activo
                })
            });

            const updateData = await updateRes.json();
            console.log('PUT response status:', updateRes.status, updateRes.statusText);
            console.log('PUT response data:', updateData);
        }

    } catch (error) {
        console.error('Error during test:', error.message);
    }
};

testUserCRUD();
