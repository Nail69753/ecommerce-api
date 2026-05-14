require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'E-Commerce REST API', version: '1.0.0', description: 'Cloud-based e-commerce REST API' },
    servers: [{ url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;