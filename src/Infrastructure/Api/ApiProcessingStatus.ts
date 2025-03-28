import express from "express";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";

export class ApiProcessingStatus {

    static start(dbconnection: IDbConnection, app: express.Express): void {

        app.use(express.json());

        app.put("/status/update", async (req, res) => {
            /**
                #swagger.tags = ['Update Status']
                #swagger.path = '/status/update'
                #swagger.method = 'put'
                #swagger.summary = 'Atualizar Status de Processamento'
                #swagger.description = 'Atualiza o Status de Processamento do Vídeo<br>
                - Utiliza como chave de atualização o ID Único de Processamento<br><br>
                [ Endpoint para integração à mensageria ]'
                #swagger.produces = ["application/json"]  
                #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: '#/definitions/UpdateProcessingStatus'
                            },
                            example: {
                                cpf: '12345678910',
                                nome: 'Nome Atualizado',
                                email: 'exemplo.atualizado@dominio.com'
                            }
                        }
                    }                  
                }
                #swagger.responses[200] = {
                    'description': 'Sucesso: Status de Processamento Atualizado',
                    '@schema': {
                        'properties': {
                            mensagem: {
                                type: 'string',
                                example: 'Erro: Não foi possível atualizar o Status'
                            }
                        }
                    }
                }`
                #swagger.responses[400] = {
                    'description': 'Ocorreu um erro inesperado',
                    '@schema': {
                        'properties': {
                            mensagem: {
                                type: 'string',
                                example: 'Error: Não foi possível atualizar o cliente'
                            }
                        }
                    }
                }
            */
            try {
                if (req.body === undefined || Object.keys(req.body).length === 0) {
                    throw new Error("No data found in request body");
                }
                const processUpdateBody = req.body;
                const processingId = processUpdateBody.processingId;

                const clientePayload = await ClientesController.CadastrarCliente(dbconnection, cpf, nome, email);
                res.send(clientePayload); 
            }
            catch (error: any) {
                res.status(400).send("Error: " + error.message);
            }

        });

    }


}