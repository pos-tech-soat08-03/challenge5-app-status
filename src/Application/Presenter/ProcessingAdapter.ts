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

    public static adaptProcessingHtmlListResponse(processingList: ProcessingResponse[]): string {
        return processingList
            .map((processingResponse) => this.adaptProcessingHtmlResponse(processingResponse))
            .join('<hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">');
    }

    public static adaptProcessingHtmlResponse(processingResponse: ProcessingResponse): string {
        let statusColor: string;
        if (processingResponse.status === "ERROR" || processingResponse.status === "INTERRUPTED") {
            statusColor = "red";
        } else if (processingResponse.status === "PROCESSING") {
            statusColor = "green";
        } else if (processingResponse.status === "COMPLETED") {
            statusColor = "blue";
        }
        else {
            statusColor = "black";
        }

        return `
            <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.2; margin: 0; padding: 0;">
            <p style="margin: 4px 0;"><strong>ID: ${processingResponse.id_processing}</strong></p>
            <p style="margin: 4px 0;"><strong>Video:</strong> ${processingResponse.video?.title}, ${processingResponse.video?.description}, ${processingResponse.video?.filename}</p>
            <p style="margin: 4px 0;"><strong>User:</strong> ID: ${processingResponse.user?.id_usuario}, ${processingResponse.user?.email}</p>
            <p style="margin: 4px 0;"><strong>Config:</strong> Output Format: ${processingResponse.config?.output_format}, Resolution: ${processingResponse.config?.resolution}, Interval: ${processingResponse.config?.interval} seconds</p>
            <p style="margin: 4px 0; color: ${statusColor};"><strong>Status:</strong> ${processingResponse.status}, Error Count: ${processingResponse.error_count}, Percentage ${processingResponse.percentage}%</p>
            <p style="margin: 4px 0;"><strong>Log:</strong> ${processingResponse.log?.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }
    
}