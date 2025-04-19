import { ProcessingAdapter } from "../../../src/Application/Presenter/ProcessingAdapter";
import { ProcessingResponse } from "../../../src/Core/Types/Responses";
import { ProcessingStatusEnum } from "../../../src/Core/Entity/Enum/ProcessingStatusEnum";

const mockProcessingResponse: ProcessingResponse = {
    id_processing: "proc1",
    video: {
        id_video: "vid1",
        title: "Test Video",
        description: "A test video",
        filename: "test.mp4",
        file_size: 1234,
        full_path: "/tmp/test.mp4",
        duration: 60,
        framerate: 30,
    },
    user: {
        id_usuario: "user1",
        email: "user@example.com",
    },
    config: {
        output_format: "mp4",
        resolution: "1080p",
        interval: 10,
    },
    status: ProcessingStatusEnum.NOT_STARTED,
    percentage: 0,
    log: "Started\nProcessing",
    error_count: 0,
    success: true,
    message: "Processing created",
    error_message: undefined,
};

describe("ProcessingAdapter", () => {
    describe("adaptProcessingJsonValidResponse", () => {
        it("should return a valid JSON object for a processing response", () => {
            const result = ProcessingAdapter.adaptProcessingJsonValidResponse(mockProcessingResponse);
            expect(result).toEqual(mockProcessingResponse);
        });
    });

    describe("adaptProcessingJsonErrorResponse", () => {
        it("should return a JSON object with success false and error message", () => {
            const errorMsg = "Something went wrong";
            const result = ProcessingAdapter.adaptProcessingJsonErrorResponse(errorMsg);
            expect(result).toEqual({ success: false, message: errorMsg });
        });
    });

    describe("adaptProcessingJsonValidListResponse", () => {
        it("should return a valid JSON array for a list of processing responses", () => {
            const list = [mockProcessingResponse, { ...mockProcessingResponse, id_processing: "proc2" }];
            const result = ProcessingAdapter.adaptProcessingJsonValidListResponse(list);
            expect(result).toEqual(list);
        });
    });

    describe("adaptProcessingHtmlListResponse", () => {
        it("should return HTML string for a list of processing responses", () => {
            const list = [
                { ...mockProcessingResponse, id_processing: "proc1" },
                { ...mockProcessingResponse, id_processing: "proc2" }
            ];
            const html = ProcessingAdapter.adaptProcessingHtmlListResponse(list);
            expect(typeof html).toBe("string");
            expect(html).toContain("proc1");
            expect(html).toContain("proc2");
            expect(html).toContain("<hr");
        });
    });

    describe("adaptProcessingHtmlResponse", () => {
        it("should return HTML string with correct status color for ERROR", () => {
            const resp = { ...mockProcessingResponse, status: ProcessingStatusEnum.ERROR };
            const html = ProcessingAdapter.adaptProcessingHtmlResponse(resp);
            expect(html).toContain('color: red');
            expect(html).toContain("ERROR");
        });

        it("should return HTML string with correct status color for INTERRUPTED", () => {
            const resp = { ...mockProcessingResponse, status: ProcessingStatusEnum.INTERRUPTED };
            const html = ProcessingAdapter.adaptProcessingHtmlResponse(resp);
            expect(html).toContain('color: red');
            expect(html).toContain("INTERRUPTED");
        });

        it("should return HTML string with correct status color for PROCESSING", () => {
            const resp = { ...mockProcessingResponse, status: ProcessingStatusEnum.PROCESSING };
            const html = ProcessingAdapter.adaptProcessingHtmlResponse(resp);
            expect(html).toContain('color: green');
            expect(html).toContain("PROCESSING");
        });

        it("should return HTML string with correct status color for COMPLETED", () => {
            const resp = { ...mockProcessingResponse, status: ProcessingStatusEnum.COMPLETED };
            const html = ProcessingAdapter.adaptProcessingHtmlResponse(resp);
            expect(html).toContain('color: blue');
            expect(html).toContain("COMPLETED");
        });

        it("should return HTML string with default status color for NOT_STARTED", () => {
            const resp = { ...mockProcessingResponse, status: ProcessingStatusEnum.NOT_STARTED };
            const html = ProcessingAdapter.adaptProcessingHtmlResponse(resp);
            expect(html).toContain('color: black');
            expect(html).toContain("NOT_STARTED");
        });

        it("should replace newlines in log with <br>", () => {
            const resp = { ...mockProcessingResponse, log: "Line1\nLine2" };
            const html = ProcessingAdapter.adaptProcessingHtmlResponse(resp);
            expect(html).toContain("Line1<br>Line2");
        });
    });
});