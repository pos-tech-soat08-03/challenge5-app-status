import { ProcessingResponse } from "../../Core/Types/Responses";

export class ProcessingAdapter {

    public static adaptProcessingValidResponse (processingResponse: ProcessingResponse): string {
        return JSON.stringify(processingResponse);
    }

    public static adaptProcessingErrorResponse (errorMessage: string): string {
        return JSON.stringify({ success: false, message: errorMessage });
    }

    public static adaptProcessingValidListResponse (processingList: ProcessingResponse[]): string {
        return JSON.stringify(processingList);
    }
}