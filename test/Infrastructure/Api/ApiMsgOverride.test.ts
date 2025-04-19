import express from "express";
import { ProcessingController } from "../../../src/Application/Controller/ProcessingController";
import { IDbConnection } from "../../../src/Core/Interfaces/IDbConnection";
import { ApiMsgOverride } from "../../../src/Infrastructure/Api/ApiMsgOverride";


jest.mock("../../../src/Application/Controller/ProcessingController");

describe("ApiMsgOverride", () => {
    let app: express.Express;
    let dbconnection: IDbConnection;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        dbconnection = {} as IDbConnection;
        jest.clearAllMocks();
        ApiMsgOverride.start(dbconnection, app);
    });

    describe("POST /msg/processamento", () => {
        it("should return 400 if body is missing", async () => {
            const res = await request(app)
                .post("/msg/processamento")
                .send();
            expect(res.status).toBe(400);
            expect(res.text).toContain("Erro criando processamento");
        });

        it("should return 400 if controller returns falsy", async () => {
            (ProcessingController.CreateProcessing as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app)
                .post("/msg/processamento")
                .send({ foo: "bar" });
            expect(res.status).toBe(400);
            expect(res.text).toContain("Erro criando processamento");
        });

        it("should return 200 and result if controller succeeds", async () => {
            (ProcessingController.CreateProcessing as jest.Mock).mockResolvedValue({ id: 1 });
            const res = await request(app)
                .post("/msg/processamento")
                .send({ foo: "bar" });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: 1 });
        });

        it("should return 500 on controller error", async () => {
            (ProcessingController.CreateProcessing as jest.Mock).mockRejectedValue(new Error("fail"));
            const res = await request(app)
                .post("/msg/processamento")
                .send({ foo: "bar" });
            expect(res.status).toBe(500);
            expect(res.text).toContain("fail");
        });
    });

    describe("PUT /msg/status", () => {
        it("should return 400 if body is missing", async () => {
            const res = await request(app)
                .put("/msg/status")
                .send();
            expect(res.status).toBe(400);
            expect(res.text).toContain("Erro registrando status");
        });

        it("should return 400 if controller returns falsy", async () => {
            (ProcessingController.RegisterProcessingStatus as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app)
                .put("/msg/status")
                .send({ foo: "bar" });
            expect(res.status).toBe(400);
            expect(res.text).toContain("Erro registrando status");
        });

        it("should return 200 and result if controller succeeds", async () => {
            (ProcessingController.RegisterProcessingStatus as jest.Mock).mockResolvedValue({ ok: true });
            const res = await request(app)
                .put("/msg/status")
                .send({ foo: "bar" });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ ok: true });
        });

        it("should return 500 on controller error", async () => {
            (ProcessingController.RegisterProcessingStatus as jest.Mock).mockRejectedValue(new Error("fail"));
            const res = await request(app)
                .put("/msg/status")
                .send({ foo: "bar" });
            expect(res.status).toBe(500);
            expect(res.text).toContain("fail");
        });
    });

    describe("PUT /msg/erro", () => {
        it("should return 400 if body is missing", async () => {
            const res = await request(app)
                .put("/msg/erro")
                .send();
            expect(res.status).toBe(400);
            expect(res.text).toContain("Erro registrando msg de erro");
        });

        it("should return 400 if controller returns falsy", async () => {
            (ProcessingController.RegisterProcessingError as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app)
                .put("/msg/erro")
                .send({ foo: "bar" });
            expect(res.status).toBe(400);
            expect(res.text).toContain("Erro registrando msg de erro");
        });

        it("should return 200 and result if controller succeeds", async () => {
            (ProcessingController.RegisterProcessingError as jest.Mock).mockResolvedValue({ ok: true });
            const res = await request(app)
                .put("/msg/erro")
                .send({ foo: "bar" });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ ok: true });
        });

        it("should return 500 on controller error", async () => {
            (ProcessingController.RegisterProcessingError as jest.Mock).mockRejectedValue(new Error("fail"));
            const res = await request(app)
                .put("/msg/erro")
                .send({ foo: "bar" });
            expect(res.status).toBe(500);
            expect(res.text).toContain("fail");
        });
    });
});

// Helper for supertest without import
function request(app: express.Express) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("supertest")(app);
}