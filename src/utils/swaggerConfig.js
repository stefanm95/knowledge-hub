import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions ={
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Team Knowledge Hub API",
            version: "1.0.0",
            description: "API documentation for Team Knowledge Hub",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        components: {
            schemas: {
                Folder: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "folder-id" },
                        name: { type: "string", example: "Project Documents" },
                        description: { type: "string", example: "Folder for storing project-related documents" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        documents: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Document" },
                        },
                    },
                },
                Document: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "document-id" },
                        title: { type: "string", example: "Document Title" },
                        content: { type: "string", example: "Extracted content..." },
                        folder: { type: "string", example: "folder-id" },
                        createdBy: { type: "string", example: "user-id" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.js", "./src/controllers/*.js"],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;
// This code sets up Swagger documentation for the API. It uses the swagger-jsdoc package to generate documentation based on JSDoc comments in the route and controller files. The generated documentation includes information about the API's endpoints, request/response formats, and other details. The documentation can be accessed at the specified server URL (http://localhost:5000) when the API is running.