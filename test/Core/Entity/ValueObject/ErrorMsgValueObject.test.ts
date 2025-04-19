import { ProcessingStatusEnum } from "../../../../src/Core/Entity/Enum/ProcessingStatusEnum";
import { ErrorMsgValueObject } from "../../../../src/Core/Entity/ValueObject/ErrorMsgValueObject";


describe('ErrorMsgValueObject', () => {
    // Setup common test values
    const mockIdVideo = 'vid123';
    const mockIdUser = 'user123';
    const mockStatus = ProcessingStatusEnum.ERROR;
    const mockTimestamp = new Date('2023-01-01T00:00:00Z');
    const mockErrorMsg = 'Test error message';
    
    let errorMsgValueObject: ErrorMsgValueObject;
    
    beforeEach(() => {
        errorMsgValueObject = new ErrorMsgValueObject(
            mockIdVideo, 
            mockIdUser, 
            mockStatus, 
            mockTimestamp, 
            mockErrorMsg
        );
    });

    it('should create an ErrorMsgValueObject with the correct values', () => {
        expect(errorMsgValueObject).toBeInstanceOf(ErrorMsgValueObject);
    });

    it('should return the correct idVideo value', () => {
        expect(errorMsgValueObject.getIdVideo()).toBe(mockIdVideo);
    });

    it('should return the correct idUser value', () => {
        expect(errorMsgValueObject.getIdUser()).toBe(mockIdUser);
    });

    it('should return the correct statusMsg value', () => {
        expect(errorMsgValueObject.getStatusMsg()).toBe(mockStatus);
    });

    it('should return the correct statusTimestamp value', () => {
        expect(errorMsgValueObject.getStatusTimestamp()).toBe(mockTimestamp);
    });

    it('should return the correct errorMsg value', () => {
        expect(errorMsgValueObject.getErrorMsg()).toBe(mockErrorMsg);
    });

    it('should convert to JSON with the correct property names', () => {
        const json = errorMsgValueObject.toJson();
        
        expect(json).toEqual({
            id_video: mockIdVideo,
            id_user: mockIdUser,
            status: mockStatus,
            status_time: mockTimestamp,
            error_message: mockErrorMsg
        });
    });

    it('should handle empty error message', () => {
        const emptyErrorObj = new ErrorMsgValueObject(
            mockIdVideo,
            mockIdUser,
            mockStatus,
            mockTimestamp,
            ''
        );
        
        expect(emptyErrorObj.getErrorMsg()).toBe('');
    });

    it('should handle different processing status', () => {
        const interruptedObj = new ErrorMsgValueObject(
            mockIdVideo,
            mockIdUser,
            ProcessingStatusEnum.INTERRUPTED,
            mockTimestamp,
            mockErrorMsg
        );
        
        expect(interruptedObj.getStatusMsg()).toBe(ProcessingStatusEnum.INTERRUPTED);
        expect(interruptedObj.toJson().status).toBe(ProcessingStatusEnum.INTERRUPTED);
    });
});