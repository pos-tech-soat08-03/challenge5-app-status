import express, { Express } from "express";
import request from "supertest";
import swaggerUi from "swagger-ui-express";
import { DefaultApiEndpoints } from "../../../src/Infrastructure/Api/ApisDefaultEndpoints";
import swaggerOutput from "../../../src/swagger-output.json";


// Mock swagger-ui-express and swaggerOutput
jest.mock("swagger-ui-express", () => ({
  serve: jest.fn((req: any, res: any, next: any) => next()),
  setup: jest.fn(() => (req: any, res: any) => res.send("swagger doc")),
}));
jest.mock("../../../src/swagger-output.json", () => ({}), { virtual: true });

describe("DefaultApiEndpoints", () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    // To parse HTML/text responses
    app.use(express.text());
    DefaultApiEndpoints.start(app);
  });

  it("should mount swagger doc endpoint at /doc", async () => {
    const res = await request(app).get("/doc");
    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger doc");
    expect(swaggerUi.setup).toHaveBeenCalledWith(swaggerOutput);
  });

  it("should respond with HTML at root endpoint /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Challenge 5 SOAT8 v1.0");
    expect(res.text).toContain("Serviço de Status e Reprocessamento");
    expect(res.text).toContain("<h1>");
  });
});