// Quick test to verify usuario routes are correctly exported
import usuarioRoutes from './backend/src/routes/usuario.routes.js';

console.log('usuarioRoutes type:', typeof usuarioRoutes);
console.log('usuarioRoutes is Router:', usuarioRoutes.constructor.name);
console.log('usuarioRoutes stack length:', usuarioRoutes.stack ? usuarioRoutes.stack.length : 'No stack');

if (usuarioRoutes.stack) {
    console.log('\nRegistered routes:');
    usuarioRoutes.stack.forEach((layer, index) => {
        const route = layer.route;
        if (route) {
            const methods = Object.keys(route.methods).join(', ').toUpperCase();
            console.log(`${index + 1}. ${methods} ${route.path}`);
        }
    });
}
