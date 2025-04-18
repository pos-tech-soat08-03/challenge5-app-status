import express from "express";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ProcessingController } from "../../Application/Controller/ProcessingController";

export class ApiProcessingStatus {

    static start(dbconnection: IDbConnection, app: express.Express): void {
        
        app.use(express.json());

        app.get("/status/listar", async (req, res) => {
            /**
                #swagger.tags = ['Status']
                #swagger.description = 'Listar todos os Processamentos'
             */
            try {
                const result = await ProcessingController.GetProcessingList(dbconnection);
                if (!result) {
                    res.status(404).send("Erro: Nenhum processamento encontrado");
                }
                else{
                    res.status(200).send(result);
                }
            } catch (error: any) {
                res.status(500).send(error.message);
            }
        });

        app.get("/status/listar/id/:proc_id", async (req, res) => {
            /**
                #swagger.tags = ['Status']
                #swagger.description = 'Listar Processamento por ID'
             */
            try {
                if (req.params.proc_id === undefined || req.params.proc_id === "" || req.params.proc_id === null) {
                    res.status(400).send("Erro: Id do processamento não informado");
                    return;
                }
                const result = await ProcessingController.GetProcessingStatus(dbconnection, req.params.proc_id);
                if (!result) {
                    res.status(404).send("Erro: Nenhum processamento encontrado");
                }
                else { 
                    res.status(200).send(result);
                }
            } catch (error: any) {
                res.status(500).send(error.message);
            }
        });

        app.get("/status/listar/usuario/:user_id", async (req, res) => {
            /**
                #swagger.tags = ['Status']
                #swagger.description = 'Listar Processamentos por ID do Usuário'
             */
            try {
                if (req.params.user_id === undefined || req.params.user_id === "" || req.params.user_id === null) {
                    res.status(400).send("Erro: Id do usuário não informado");
                    return;
                }
                const result = await ProcessingController.GetProcessingListByUser(dbconnection, req.params.user_id);
                if (!result) {
                    res.status(404).send("Erro: Nenhum processamento encontrado");
                }
                else {
                    res.status(200).send(result);
                }
            } catch (error: any) {
                res.status(500).send(error.message);
            }
        });
    }

}