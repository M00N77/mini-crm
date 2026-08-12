import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini CRM API',
      version: '1.0.0',
      description: 'API documentation for Mini CRM',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Укажите ваш актуальный URL
        description: 'Development server',
      },
    ],
  },
  // Ищем JSDoc комментарии в этих файлах:
  apis: ['./routes/*.ts', './server/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Страница Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Маршрут для получения JSON спецификации
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
