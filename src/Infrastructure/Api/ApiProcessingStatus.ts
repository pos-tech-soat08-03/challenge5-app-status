import express from "express";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";

export class ApiProcessingStatus {

    static start(dbconnection: IDbConnection, app: express.Express): void {

        app.use(express.json());

        

    }


}