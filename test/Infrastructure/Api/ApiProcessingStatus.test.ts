import express, { Request } from "express";
import { ApiProcessingStatus } from "../../../src/Infrastructure/Api/ApiProcessingStatus";
import { ProcessingController } from "../../../src/Application/Controller/ProcessingController";
import { IDbConnection } from "../../../src/Core/Interfaces/IDbConnection";

jest.mock("../../../src/Application/Controller/ProcessingController");

describe("ApiProcessingStatus", () => {
    let app: express.Express;
    let dbconnection: IDbConnection;

    beforeEach(() => {
        app = express();
        dbconnection = {} as IDbConnection;
        ApiProcessingStatus.start(dbconnection, app);
    });

    describe("GET /status/listar", () => {
        it("should return 200 and processing list if found", async () => {
            const mockList = [{ id_processing: "1" }];
            (ProcessingController.GetProcessingList as jest.Mock).mockResolvedValue(mockList);

            const req = {} as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockList);
        });

        it("should return 404 if no processing found", async () => {
            (ProcessingController.GetProcessingList as jest.Mock).mockResolvedValue(undefined);

            const req = {} as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Erro: Nenhum processamento encontrado");
        });

        it("should return 500 on error", async () => {
            (ProcessingController.GetProcessingList as jest.Mock).mockRejectedValue(new Error("fail"));

            const req = {} as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("fail");
        });
    });

    describe("GET /status/listar/id/:proc_id", () => {
        it("should return 400 if proc_id is missing", async () => {
            const req = { params: { proc_id: "" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/id/:proc_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Erro: Id do processamento não informado");
        });

        it("should return 200 and processing if found", async () => {
            (ProcessingController.GetProcessingStatus as jest.Mock).mockResolvedValue({ id_processing: "1" });

            const req = { params: { proc_id: "1" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/id/:proc_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id_processing: "1" });
        });

        it("should return 404 if not found", async () => {
            (ProcessingController.GetProcessingStatus as jest.Mock).mockResolvedValue(undefined);

            const req = { params: { proc_id: "1" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/id/:proc_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Erro: Nenhum processamento encontrado");
        });

        it("should return 500 on error", async () => {
            (ProcessingController.GetProcessingStatus as jest.Mock).mockRejectedValue(new Error("fail"));

            const req = { params: { proc_id: "1" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/id/:proc_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("fail");
        });
    });

    describe("GET /status/listar/usuario/:user_id", () => {
        it("should return 400 if user_id is missing", async () => {
            const req = { params: { user_id: "" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/usuario/:user_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Erro: Id do usuário não informado");
        });

        it("should return 200 and processing list if found", async () => {
            (ProcessingController.GetProcessingListByUser as jest.Mock).mockResolvedValue([{ id_processing: "1" }]);

            const req = { params: { user_id: "u1" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/usuario/:user_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith([{ id_processing: "1" }]);
        });

        it("should return 404 if not found", async () => {
            (ProcessingController.GetProcessingListByUser as jest.Mock).mockResolvedValue(undefined);

            const req = { params: { user_id: "u1" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/usuario/:user_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Erro: Nenhum processamento encontrado");
        });

        it("should return 500 on error", async () => {
            (ProcessingController.GetProcessingListByUser as jest.Mock).mockRejectedValue(new Error("fail"));

            const req = { params: { user_id: "u1" } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            } as any;

            await app._router.stack.find((r: any) => r.route && r.route.path === "/status/listar/usuario/:user_id").route.stack[0].handle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("fail");
        });
    });
});