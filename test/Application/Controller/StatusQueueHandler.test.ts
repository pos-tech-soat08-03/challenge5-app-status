import { StatusQueueHandler } from "../../../src/Application/Controller/StatusQueueHandler";
import { StatusReadMsgGatewayInterface } from "../../../src/Core/Interfaces/Gateway/StatusReadMsgGatewayInterface";
import { IDbConnection } from "../../../src/Core/Interfaces/IDbConnection";
import { StatusMsgDTO } from "../../../src/Core/Types/DTO/StatusMsgDTO";
import { ProcessingUseCases } from "../../../src/Core/Usecase/ProcessingUseCases";
import { ProcessingRepoGatewayInterface } from "../../../src/Core/Interfaces/Gateway/ProcessingRepoGatewayInterface";

jest.mock("../../../src/Core/Usecase/ProcessingUseCases");

describe("StatusQueueHandler", () => {
  let mockDbConnection: jest.Mocked<IDbConnection>;
  let mockQueueService: jest.Mocked<StatusReadMsgGatewayInterface>;
  let mockProcessingGateway: jest.Mocked<ProcessingRepoGatewayInterface>;
  let handler: StatusQueueHandler;

  beforeEach(() => {
    mockProcessingGateway = {} as any;
    mockDbConnection = {
      gateways: {
        processingRepoGateway: mockProcessingGateway,
      },
    } as any;
    mockQueueService = {
      getNextStatusMessage: jest.fn(),
    } as any;
    handler = new StatusQueueHandler(mockDbConnection, mockQueueService);
    jest.clearAllMocks();
  });

  it("should process a status message when one is available", async () => {
    const statusDTO: StatusMsgDTO = {
      id_video: "vid1",
      status: "PROCESSING",
      percentage: 50,
      id_usuario: "user1",
      status_time: new Date(),
      message: "Processing",
    };
    mockQueueService.getNextStatusMessage.mockResolvedValue(statusDTO);
    (ProcessingUseCases.RegisterProcessingStatus as jest.Mock).mockResolvedValue({ success: true });

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await handler.handle();

    expect(mockQueueService.getNextStatusMessage).toHaveBeenCalled();
    expect(ProcessingUseCases.RegisterProcessingStatus).toHaveBeenCalledWith(
      mockProcessingGateway,
      statusDTO
    );
    expect(consoleLogSpy).toHaveBeenCalledWith("Mensagem de status recebida:", statusDTO);

    consoleLogSpy.mockRestore();
  });

  it("should log when no status message is available", async () => {
    mockQueueService.getNextStatusMessage.mockResolvedValue(undefined);
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await handler.handle();

    expect(mockQueueService.getNextStatusMessage).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("Nenhuma mensagem de status no momento.");

    consoleLogSpy.mockRestore();
  });

  it("should throw an error if RegisterProcessingStatus throws", async () => {
    const statusDTO: StatusMsgDTO = {
      id_video: "vid1",
      status: "PROCESSING",
      percentage: 50,
      id_usuario: "user1",
      status_time: new Date(),
      message: "Processing",
    };
    mockQueueService.getNextStatusMessage.mockResolvedValue(statusDTO);
    (ProcessingUseCases.RegisterProcessingStatus as jest.Mock).mockRejectedValue(new Error("Some error"));

    await expect(handler.handle()).rejects.toThrow("Some error");
    expect(mockQueueService.getNextStatusMessage).toHaveBeenCalled();
    expect(ProcessingUseCases.RegisterProcessingStatus).toHaveBeenCalledWith(
      mockProcessingGateway,
      statusDTO
    );
  });

  it("should throw an error if RegisterProcessingStatus returns falsy", async () => {
    const statusDTO: StatusMsgDTO = {
      id_video: "vid1",
      status: "PROCESSING",
      percentage: 50,
      id_usuario: "user1",
      status_time: new Date(),
      message: "Processing",
    };
    mockQueueService.getNextStatusMessage.mockResolvedValue(statusDTO);
    (ProcessingUseCases.RegisterProcessingStatus as jest.Mock).mockResolvedValue(undefined);

    await expect(handler.handle()).rejects.toThrow("No processing status updated");
    expect(mockQueueService.getNextStatusMessage).toHaveBeenCalled();
    expect(ProcessingUseCases.RegisterProcessingStatus).toHaveBeenCalledWith(
      mockProcessingGateway,
      statusDTO
    );
  });
});