import { ErrorQueueHandler } from "../../../src/Application/Controller/ErrorQueueHandler";
import { ProcessingStatusEnum } from "../../../src/Core/Entity/Enum/ProcessingStatusEnum";
import { ProcessingEntity } from "../../../src/Core/Entity/ProcessingEntity";
import { ErrorMsgDTO } from "../../../src/Core/Types/DTO/ErrorMsgDTO";
import { ProcessingResponse } from "../../../src/Core/Types/Responses";
import { ProcessingUseCases } from "../../../src/Core/Usecase/ProcessingUseCases";


const mockDbConnection = {
  gateways: {
    processingRepoGateway: {} as any,
  },
};

const mockQueueService = {
  getNextErrorMessage: jest.fn(),
};

const mockNotificationGateway = {
  sendProcessingMessage: jest.fn(),
};

const mockEmailAlert = {
  sendEmail: jest.fn(),
};

jest.mock("../../../src/Core/Usecase/ProcessingUseCases", () => ({
  ProcessingUseCases: {
    RegisterProcessingError: jest.fn(),
  },
}));


describe("ErrorQueueHandler", () => {
  let handler: ErrorQueueHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new ErrorQueueHandler(
      mockDbConnection as any,
      mockQueueService as any,
      mockNotificationGateway as any,
      mockEmailAlert as any
    );
  });

  it("should process error message and send for reprocessing if success", async () => {
    const errorDTO: ErrorMsgDTO = {
      id_video: "vid1",
      status: "INTERRUPTED",
      error_message: "Some error",
      id_user: "user1",
      status_time: new Date(),
    };
    const processingResponse: ProcessingResponse = {
      id_processing: "vid1",
      video: { id_video: "vid1", title: "Test", description: "", filename: "", file_size: 1, full_path: "", duration: 1, framerate: 1 },
      user: { id_usuario: "user1", email: "user@example.com" },
      config: { output_format: "mp4", resolution: "720p", interval: 5 },
      status: ProcessingStatusEnum.INTERRUPTED,
      percentage: 0,
      log: "",
      error_count: 1,
      success: true,
      message: "ok",
      error_message: undefined,
    };
    mockQueueService.getNextErrorMessage.mockResolvedValue(errorDTO);
    (ProcessingUseCases.RegisterProcessingError as jest.Mock).mockResolvedValue(processingResponse);
    jest.spyOn(ProcessingEntity, "fromResponse").mockReturnValue({} as any);

    await handler.handle();

    expect(mockQueueService.getNextErrorMessage).toHaveBeenCalled();
    expect(ProcessingUseCases.RegisterProcessingError).toHaveBeenCalledWith(
      mockDbConnection.gateways.processingRepoGateway,
      errorDTO
    );
    expect(mockNotificationGateway.sendProcessingMessage).toHaveBeenCalled();
    expect(mockEmailAlert.sendEmail).not.toHaveBeenCalled();
  });

  it("should send email if processing failed (success === false)", async () => {
    const errorDTO: ErrorMsgDTO = {
      id_video: "vid1",
      status: "INTERRUPTED",
      error_message: "Some error",
      id_user: "user1",
      status_time: new Date(),
    };
    const processingResponse: ProcessingResponse = {
      id_processing: "vid1",
      video: { id_video: "vid1", title: "Test", description: "", filename: "", file_size: 1, full_path: "", duration: 1, framerate: 1 },
      user: { id_usuario: "user1", email: "user@example.com" },
      config: { output_format: "mp4", resolution: "720p", interval: 5 },
      status: ProcessingStatusEnum.ERROR,
      percentage: 0,
      log: "",
      error_count: 2,
      success: false,
      message: "fail",
      error_message: "Some error",
    };
    mockQueueService.getNextErrorMessage.mockResolvedValue(errorDTO);
    (ProcessingUseCases.RegisterProcessingError as jest.Mock).mockResolvedValue(processingResponse);

    await handler.handle();

    expect(mockEmailAlert.sendEmail).toHaveBeenCalledWith(
      "user@example.com",
      "Erro no processamento",
      expect.stringContaining("Some error")
    );
    expect(mockNotificationGateway.sendProcessingMessage).not.toHaveBeenCalled();
  });

  it("should throw if RegisterProcessingError returns falsy", async () => {
    const errorDTO: ErrorMsgDTO = {
      id_video: "vid1",
      status: "INTERRUPTED",
      error_message: "Some error",
      id_user: "user1",
      status_time: new Date(),
    };
    mockQueueService.getNextErrorMessage.mockResolvedValue(errorDTO);
    (ProcessingUseCases.RegisterProcessingError as jest.Mock).mockResolvedValue(undefined);

    await expect(handler.handle()).rejects.toThrow("Error processing error message");
  });

  it("should log if no error message is available", async () => {
    mockQueueService.getNextErrorMessage.mockResolvedValue(undefined);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await handler.handle();

    expect(logSpy).toHaveBeenCalledWith("Nenhuma mensagem de erro no momento.");
    logSpy.mockRestore();
  });

  it("should throw if RegisterProcessingError throws", async () => {
    const errorDTO: ErrorMsgDTO = {
      id_video: "vid1",
      status: "INTERRUPTED",
      error_message: "Some error",
      id_user: "user1",
      status_time: new Date(),
    };
    mockQueueService.getNextErrorMessage.mockResolvedValue(errorDTO);
    (ProcessingUseCases.RegisterProcessingError as jest.Mock).mockRejectedValue(new Error("fail"));

    await expect(handler.handle()).rejects.toThrow("fail");
  });
});