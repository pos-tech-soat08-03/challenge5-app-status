import { ProcessingQueueHandler } from "../../../src/Application/Controller/ProcessingQueueHandler";
import { ProcessingReadMsgGatewayInterface } from "../../../src/Core/Interfaces/Gateway/ProcessingReadMsgGatewayInterface";
import { IDbConnection } from "../../../src/Core/Interfaces/IDbConnection";
import { ProcessingDTO } from "../../../src/Core/Types/DTO/ProcessingDTO";
import { ProcessingUseCases } from "../../../src/Core/Usecase/ProcessingUseCases";

jest.mock("../../../src/Core/Usecase/ProcessingUseCases");

describe("ProcessingQueueHandler", () => {
  let mockDbConnection: jest.Mocked<IDbConnection>;
  let mockQueueService: jest.Mocked<ProcessingReadMsgGatewayInterface>;
  let handler: ProcessingQueueHandler;

  const mockProcessingGateway = {} as any;

  beforeEach(() => {
    mockDbConnection = {
      gateways: {
        processingRepoGateway: mockProcessingGateway,
      },
    } as any;

    mockQueueService = {
      getNextProcessingMessage: jest.fn(),
    } as any;

    handler = new ProcessingQueueHandler(mockDbConnection, mockQueueService);
    jest.clearAllMocks();
  });

  it("should process a message from the queue and call CreateProcessing", async () => {
    const mockProcessingData: ProcessingDTO = {
      video: { id_video: "vid1" } as any,
      user: { id_usuario: "user1" } as any,
      config: { output_format: "mp4" } as any,
    };
    mockQueueService.getNextProcessingMessage.mockResolvedValue(mockProcessingData);
    (ProcessingUseCases.CreateProcessing as jest.Mock).mockResolvedValue({ id_processing: "vid1" });

    await handler.handle();

    expect(mockQueueService.getNextProcessingMessage).toHaveBeenCalled();
    expect(ProcessingUseCases.CreateProcessing).toHaveBeenCalledWith(
      mockProcessingGateway,
      mockProcessingData.video,
      mockProcessingData.user,
      mockProcessingData.config
    );
  });

  it("should throw an error if CreateProcessing returns undefined", async () => {
    const mockProcessingData: ProcessingDTO = {
      video: { id_video: "vid1" } as any,
      user: { id_usuario: "user1" } as any,
      config: { output_format: "mp4" } as any,
    };
    mockQueueService.getNextProcessingMessage.mockResolvedValue(mockProcessingData);
    (ProcessingUseCases.CreateProcessing as jest.Mock).mockResolvedValue(undefined);

    await expect(handler.handle()).rejects.toThrow("No processing created");
  });

  it("should throw an error if CreateProcessing throws", async () => {
    const mockProcessingData: ProcessingDTO = {
      video: { id_video: "vid1" } as any,
      user: { id_usuario: "user1" } as any,
      config: { output_format: "mp4" } as any,
    };
    mockQueueService.getNextProcessingMessage.mockResolvedValue(mockProcessingData);
    (ProcessingUseCases.CreateProcessing as jest.Mock).mockRejectedValue(new Error("Some error"));

    await expect(handler.handle()).rejects.toThrow("Some error");
  });

  it("should log if there is no message in the queue", async () => {
    mockQueueService.getNextProcessingMessage.mockResolvedValue(undefined);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await handler.handle();

    expect(logSpy).toHaveBeenCalledWith("Nenhum vídeo na fila de processamento no momento.");
    logSpy.mockRestore();
  });
});