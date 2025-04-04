import { ProcessingResponse } from "../../Core/Types/Responses";

export class ProcessingAdapter {

    public static adaptProcessingJsonValidResponse (processingResponse: ProcessingResponse): string {
        return JSON.parse(JSON.stringify(processingResponse));
    }

    public static adaptProcessingJsonErrorResponse (errorMessage: string): string {
        return JSON.parse(JSON.stringify({ success: false, message: errorMessage }));
    }

    public static adaptProcessingJsonValidListResponse (processingList: ProcessingResponse[]): string {
        return JSON.parse(JSON.stringify(processingList));
    }

    
}