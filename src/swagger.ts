const swaggerAutogen = require('swagger-autogen')({ language: 'pt-BR', openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Microserviço de Status v1.0 - Documentação da API.',
    description: 'Challenge5 SOAT8 Grupo 03 - Microserviço de Status e Reprocessamento'
  },

  schemes: ['http'],

  components: {
    securitySchemes:{
        bearerAuth: {
            type: 'http',
            scheme: 'bearer'
        }
    }
  },

  '@definitions': {

    ID: {
      type: "string",
      minLength: 36,
      maxLength: 36,
      format: "uuid",
      example: '29a81eeb-d16d-4d6c-a86c-e13597667307',
    },

    Video: {
        id_video: {
          $ref: '#/definitions/ID',
        },
        title: {
          type: 'string',
          example: 'Título do vídeo'
        },
        description: {
          type: 'string',
          example: 'Descrição do vídeo'
        },
        filename: {
          type: 'string',
          example: 'video.mp4'
        },
        file_size: {
          type: 'number',
          example: 104857600
        },
        full_path: {
          type: 'string',
          example: 's3:/caminho/para/o/video.mp4'
        },
        duration: {
          type: 'number',
          example: 120
        },
        framerate: {
          type: 'number',
          example: 30
        }
    },

    User: {
        id_user: {
          $ref: '#/definitions/ID',
        },
        email: {
          type: 'string',
          example: 'email@teste.com'
        }
    },

    Config: {
        output_format: {
          type: 'string',
          example: 'jpg'
        },
        resolution: {
          type: 'string',
          example: '1920x1080'
        },
        interval: {
          type: 'number',
          example: 20
        }
    },

    Processamento: {
        video: {
          $ref: '#/definitions/Video',
        },
        user: {
          $ref: '#/definitions/User',
        },
        config: {
          $ref: '#/definitions/Config',
        },
    },

    Status: {
        id_video: {
          $ref: '#/definitions/ID',
        },
        id_user: {
          $ref: '#/definitions/ID',
        },
        status: {
          type: 'string',
          enum: ['NOT_STARTED', 'PROCESSING', 'COMPLETED'],
          example: 'NOT_STARTED'
        },
        status_time: {
          type: 'string',
          format: 'date-time',
          example: '2023-10-01T12:00:00Z'
        },
        percentage: {
          type: 'number',
          format: 'integer',
          example: 25
        },
    },

    Error: {
        id_video: {
          $ref: '#/definitions/ID',
        },
        id_user: {
          $ref: '#/definitions/ID',
        },
        status: {
          type: 'string',
          enum: ['ERROR', 'INTERRUPTED'],
          example: 'INTERRUPTED'
        },
        status_time: {
          type: 'string',
          format: 'date-time',
          example: '2023-10-01T12:00:00Z'
        },
        error_message: {
          type: 'string',
          example: 'Erro ao processar o vídeo'
        },
    },
  },

};

const outputFile = './swagger-output.json';
const routes = ['./app.ts', './Infrastructure/Api/*.ts'];

swaggerAutogen(outputFile, routes, doc);