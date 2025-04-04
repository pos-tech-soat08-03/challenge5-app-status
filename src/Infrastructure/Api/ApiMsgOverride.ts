import express from "express";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ProcessingController } from "../../Application/Controller/ProcessingController";

export class ApiMsgOverride {

    static start(dbconnection: IDbConnection, app: express.Express): void {
        
        app.use(express.json());

        app.post("/msg/processamento", async (req, res) => {
            /**
                #swagger.tags = ['Tests Only']
                #swagger.description = 'Mensagem de Processamento'\
                #swagger.produces = ['application/json']
                #swagger.method = 'POST'
             */
            try {
                if (req.body === undefined || req.body === "" || req.body === null) {
                    res.status(400).send("Erro: Mensagem não informada");
                    return;
                }
                const content = req.body;
                const result = await ProcessingController.CreateProcessing(dbconnection, content);
                if (!result) {
                    res.status(404).send("Erro criando processamento");
                }
                res.status(200).send(result);
            } catch (error: any) {
                res.status(500).send(error.message);
            }
        });

        app.put("/msg/status", async (req, res) => {
            /**
                #swagger.tags = ['Tests Only']
                #swagger.description = 'Mensagem de Status'
                #swagger.consumes = ['application/json']
                #swagger.produces = ['application/json']
                #swagger.method = 'PUT'
             */
            try {
                if (req.body === undefined || req.body === "" || req.body === null) {
                    res.status(400).send("Erro: Mensagem não informada");
                    return;
                }
                const result = await ProcessingController.RegisterProcessingStatus(dbconnection, req.body);
                if (!result) {
                    res.status(404).send("Erro registrando status");
                }
                res.status(200).send(result);
            } catch (error: any) {
                res.status(500).send(error.message);
            }
        });

        app.put("/msg/erro", async (req, res) => {
            /**
                #swagger.tags = ['Tests Only']
                #swagger.description = 'Mensagem de Erro'
                #swagger.consumes = ['application/json']
                #swagger.produces = ['application/json']
                #swagger.method = 'PUT'
             */
            try {
                if (req.body === undefined || req.body === "" || req.body === null) {
                    res.status(400).send("Erro: Mensagem não informada");
                    return;
                }
                const result = await ProcessingController.RegisterProcessingError(dbconnection, req.body);
                if (!result) {
                    res.status(404).send("Erro registrando msg de erro");
                }
                res.status(200).send(result);
            } catch (error: any) {
                res.status(500).send(error.message);
            }
        });

    }

}