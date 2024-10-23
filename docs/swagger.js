const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "USB Token Management API from Stabolut",
      version: "1.0.0",
      description: "API documentation for USB Token Management",
      contact: {
        name: "Stabolut Support",
        email: "press@stabolut.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:8003",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "Wallet",
        description: "Wallet management endpoints",
      },
      {
        name: "User",
        description: "User management endpoints",
      },
      {
        name: "Staking",
        description: "Staking operations endpoints",
      },
      {
        name: "Purchase",
        description: "Token purchase endpoints",
      },
      {
        name: "General",
        description: "General purpose endpoints",
      },
    ],
  },
  apis: ["./routes/*.js", "./docs/schemas.js"],
};

module.exports = {
  swaggerUi,
  swaggerDocs: swaggerJsDoc(swaggerOptions),
};
