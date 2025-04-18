import { ProcessingController } from "../../../src/Application/Controller/ProcessingController";
import { ProcessingAdapter } from "../../../src/Application/Presenter/ProcessingAdapter";
import { ErrorMsgDTO } from "../../../src/Core/Types/DTO/ErrorMsgDTO";
import { ProcessingConfigDTO } from "../../../src/Core/Types/DTO/ProcessingConfigDTO";
import { StatusMsgDTO } from "../../../src/Core/Types/DTO/StatusMsgDTO";
import { UserDTO } from "../../../src/Core/Types/DTO/UserDTO";
import { VideoDTO } from "../../../src/Core/Types/DTO/VideoDTO";
import { ProcessingUseCases } from "../../../src/Core/Usecase/ProcessingUseCases";


jest.mock("../../../src/Core/Usecase/ProcessingUseCases");
jest.mock("../../../src/Application/Presenter/ProcessingAdapter");

const mockDbConnection = {
    gateways: {
        processingRepoGateway: {},
    },
};

describe("ProcessingController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GetProcessingList", () => {
        it("should return adapted HTML list response", async () => {
            const mockList = [{ id: "1" }];
            (ProcessingUseCases.GetProcessingList as jest.Mock).mockResolvedValue(mockList);
            (ProcessingAdapter.adaptProcessingHtmlListResponse as jest.Mock).mockReturnValue("html-list");

            const result = await ProcessingController.GetProcessingList(mockDbConnection as any);
            expect(ProcessingUseCases.GetProcessingList).toHaveBeenCalledWith(mockDbConnection.gateways.processingRepoGateway);
            expect(ProcessingAdapter.adaptProcessingHtmlListResponse).toHaveBeenCalledWith(mockList);
            expect(result).toBe("html-list");
        });

        it("should throw if no processing found", async () => {
            (ProcessingUseCases.GetProcessingList as jest.Mock).mockResolvedValue(undefined);

            await expect(ProcessingController.GetProcessingList(mockDbConnection as any))
                .rejects.toThrow("No processing found");
        });

        it("should throw on error", async () => {
            (ProcessingUseCases.GetProcessingList as jest.Mock).mockRejectedValue(new Error("fail"));

            await expect(ProcessingController.GetProcessingList(mockDbConnection as any))
                .rejects.toThrow("fail");
        });
    });

    describe("GetProcessingListByUser", () => {
        it("should return adapted HTML list response", async () => {
            const mockList = [{ id: "2" }];
            (ProcessingUseCases.GetProcessingListByUser as jest.Mock).mockResolvedValue(mockList);
            (ProcessingAdapter.adaptProcessingHtmlListResponse as jest.Mock).mockReturnValue("html-list-user");

            const result = await ProcessingController.GetProcessingListByUser(mockDbConnection as any, "user1");
            expect(ProcessingUseCases.GetProcessingListByUser).toHaveBeenCalledWith(mockDbConnection.gateways.processingRepoGateway, "user1");
            expect(ProcessingAdapter.adaptProcessingHtmlListResponse).toHaveBeenCalledWith(mockList);
            expect(result).toBe("html-list-user");
        });

        it("should throw if no processing found", async () => {
            (ProcessingUseCases.GetProcessingListByUser as jest.Mock).mockResolvedValue(undefined);

            await expect(ProcessingController.GetProcessingListByUser(mockDbConnection as any, "user1"))
                .rejects.toThrow("No processing found");
        });

        it("should throw on error", async () => {
            (ProcessingUseCases.GetProcessingListByUser as jest.Mock).mockRejectedValue(new Error("fail"));

            await expect(ProcessingController.GetProcessingListByUser(mockDbConnection as any, "user1"))
                .rejects.toThrow("fail");
        });
    });

    describe("GetProcessingStatus", () => {
        it("should return adapted HTML response", async () => {
            const mockProcessing = { id: "3" };
            (ProcessingUseCases.GetProcessing as jest.Mock).mockResolvedValue(mockProcessing);
            (ProcessingAdapter.adaptProcessingHtmlResponse as jest.Mock).mockReturnValue("html-status");

            const result = await ProcessingController.GetProcessingStatus(mockDbConnection as any, "proc1");
            expect(ProcessingUseCases.GetProcessing).toHaveBeenCalledWith(mockDbConnection.gateways.processingRepoGateway, "proc1");
            expect(ProcessingAdapter.adaptProcessingHtmlResponse).toHaveBeenCalledWith(mockProcessing);
            expect(result).toBe("html-status");
        });

        it("should throw if no processing found", async () => {
            (ProcessingUseCases.GetProcessing as jest.Mock).mockResolvedValue(undefined);

            await expect(ProcessingController.GetProcessingStatus(mockDbConnection as any, "proc1"))
                .rejects.toThrow("No processing found");
        });

        it("should throw on error", async () => {
            (ProcessingUseCases.GetProcessing as jest.Mock).mockRejectedValue(new Error("fail"));

            await expect(ProcessingController.GetProcessingStatus(mockDbConnection as any, "proc1"))
                .rejects.toThrow("fail");
        });
    });

    describe("CreateProcessing", () => {
        const video: VideoDTO = { id_video: "v1", title: "", description: "", filename: "", file_size: 1, full_path: "", duration: 1, framerate: 1 };
        const user: UserDTO = { id_usuario: "u1", email: "e@e.com" };
        const config: ProcessingConfigDTO = { output_format: "mp4", resolution: "720p", interval: 5 };

        it("should return adapted JSON response", async () => {
            const mockProcessing = { id: "4" };
            (ProcessingUseCases.CreateProcessing as jest.Mock).mockResolvedValue(mockProcessing);
            (ProcessingAdapter.adaptProcessingJsonValidResponse as jest.Mock).mockReturnValue("json-processing");

            const payload = { video, user, config };
            const result = await ProcessingController.CreateProcessing(mockDbConnection as any, payload);
            expect(ProcessingUseCases.CreateProcessing).toHaveBeenCalledWith(mockDbConnection.gateways.processingRepoGateway, video, user, config);
            expect(ProcessingAdapter.adaptProcessingJsonValidResponse).toHaveBeenCalledWith(mockProcessing);
            expect(result).toBe("json-processing");
        });

        it("should throw if payload is invalid", async () => {
            await expect(ProcessingController.CreateProcessing(mockDbConnection as any, {}))
                .rejects.toThrow("Invalid payload");
        });

        it("should throw if no processing created", async () => {
            (ProcessingUseCases.CreateProcessing as jest.Mock).mockResolvedValue(undefined);
            const payload = { video, user, config };
            await expect(ProcessingController.CreateProcessing(mockDbConnection as any, payload))
                .rejects.toThrow("No processing created");
        });

        it("should throw on error", async () => {
            (ProcessingUseCases.CreateProcessing as jest.Mock).mockRejectedValue(new Error("fail"));
            const payload = { video, user, config };
            await expect(ProcessingController.CreateProcessing(mockDbConnection as any, payload))
                .rejects.toThrow("fail");
        });
    });

    describe("RegisterProcessingStatus", () => {
        const statusDTO: StatusMsgDTO = { 
            id_video: "v1", 
            status: "PROCESSING", 
            status_time: new Date(),
            id_usuario: "u1",
            percentage: 0,
            message: ""
        };

        it("should return adapted JSON response", async () => {
            const mockStatus = { id: "5" };
            (ProcessingUseCases.RegisterProcessingStatus as jest.Mock).mockResolvedValue(mockStatus);
            (ProcessingAdapter.adaptProcessingJsonValidResponse as jest.Mock).mockReturnValue("json-status");

            const result = await ProcessingController.RegisterProcessingStatus(mockDbConnection as any, statusDTO);
            expect(ProcessingUseCases.RegisterProcessingStatus).toHaveBeenCalledWith(mockDbConnection.gateways.processingRepoGateway, statusDTO);
            expect(ProcessingAdapter.adaptProcessingJsonValidResponse).toHaveBeenCalledWith(mockStatus);
            expect(result).toBe("json-status");
        });

        it("should throw if payload is invalid", async () => {
            await expect(ProcessingController.RegisterProcessingStatus(mockDbConnection as any, undefined))
                .rejects.toThrow("Invalid payload");
        });

        it("should throw if no processing status updated", async () => {
            (ProcessingUseCases.RegisterProcessingStatus as jest.Mock).mockResolvedValue(undefined);
            await expect(ProcessingController.RegisterProcessingStatus(mockDbConnection as any, statusDTO))
                .rejects.toThrow("No processing status updated");
        });

        it("should throw on error", async () => {
            (ProcessingUseCases.RegisterProcessingStatus as jest.Mock).mockRejectedValue(new Error("fail"));
            await expect(ProcessingController.RegisterProcessingStatus(mockDbConnection as any, statusDTO))
                .rejects.toThrow("fail");
        });
    });

    describe("RegisterProcessingError", () => {
        const errorDTO: ErrorMsgDTO = { id_video: "v1", status: "ERROR", error_message: "err", id_user: "u1", status_time: new Date() };

        it("should return adapted JSON response", async () => {
            const mockStatus = { id: "6" };
            (ProcessingUseCases.RegisterProcessingError as jest.Mock).mockResolvedValue(mockStatus);
            (ProcessingAdapter.adaptProcessingJsonValidResponse as jest.Mock).mockReturnValue("json-error");

            const result = await ProcessingController.RegisterProcessingError(mockDbConnection as any, errorDTO);
            expect(ProcessingUseCases.RegisterProcessingError).toHaveBeenCalledWith(mockDbConnection.gateways.processingRepoGateway, errorDTO);
            expect(ProcessingAdapter.adaptProcessingJsonValidResponse).toHaveBeenCalledWith(mockStatus);
            expect(result).toBe("json-error");
        });

        it("should throw if payload is invalid", async () => {
            await expect(ProcessingController.RegisterProcessingError(mockDbConnection as any, undefined))
                .rejects.toThrow("Invalid payload");
        });

        it("should throw if error message not processed", async () => {
            (ProcessingUseCases.RegisterProcessingError as jest.Mock).mockResolvedValue(undefined);
            await expect(ProcessingController.RegisterProcessingError(mockDbConnection as any, errorDTO))
                .rejects.toThrow("Error processing error message");
        });

        it("should throw on error", async () => {
            (ProcessingUseCases.RegisterProcessingError as jest.Mock).mockRejectedValue(new Error("fail"));
            await expect(ProcessingController.RegisterProcessingError(mockDbConnection as any, errorDTO))
                .rejects.toThrow("fail");
        });
    });
});