import { ProcessingStatusEnum } from "../../../../src/Core/Entity/Enum/ProcessingStatusEnum";
import { StatusMsgValueObject } from "../../../../src/Core/Entity/ValueObject/StatusMsgValueObject";


describe('StatusMsgValueObject', () => {
    // Setup test data
    const mockIdVideo = 'vid123';
    const mockIdUser = 'user123';
    const mockStatusMsg = ProcessingStatusEnum.PROCESSING;
    const mockStatusTimestamp = new Date('2023-01-01T12:00:00Z');
    const mockPercentage = 50;
    const mockMessage = 'Processing in progress';
    
    let statusMsg: StatusMsgValueObject;
    
    beforeEach(() => {
        statusMsg = new StatusMsgValueObject(
            mockIdVideo,
            mockIdUser,
            mockStatusMsg,
            mockStatusTimestamp,
            mockPercentage,
            mockMessage
        );
    });

    it('should create a StatusMsgValueObject with correct values', () => {
        expect(statusMsg.getIdVideo()).toBe(mockIdVideo);
        expect(statusMsg.getIdUser()).toBe(mockIdUser);
        expect(statusMsg.getStatusMsg()).toBe(mockStatusMsg);
        expect(statusMsg.getStatusTimestamp()).toBe(mockStatusTimestamp);
        expect(statusMsg.getProcessingPercentage()).toBe(mockPercentage);
        expect(statusMsg.getMessage()).toBe(mockMessage);
    });

    it('should return the correct video ID', () => {
        expect(statusMsg.getIdVideo()).toBe(mockIdVideo);
    });

    it('should return the correct user ID', () => {
        expect(statusMsg.getIdUser()).toBe(mockIdUser);
    });

    it('should return the correct status', () => {
        expect(statusMsg.getStatusMsg()).toBe(mockStatusMsg);
    });

    it('should return the correct timestamp', () => {
        expect(statusMsg.getStatusTimestamp()).toEqual(mockStatusTimestamp);
    });

    it('should return the correct processing percentage', () => {
        expect(statusMsg.getProcessingPercentage()).toBe(mockPercentage);
    });

    it('should return the correct message', () => {
        expect(statusMsg.getMessage()).toBe(mockMessage);
    });

    it('should convert to JSON correctly', () => {
        const jsonObj = statusMsg.toJson();
        
        expect(jsonObj).toEqual({
            idVideo: mockIdVideo,
            idUser: mockIdUser,
            statusMsg: mockStatusMsg,
            statusTimestamp: mockStatusTimestamp,
            processingPercentage: mockPercentage,
            message: mockMessage
        });
    });

    it('should handle different processing statuses', () => {
        const completedStatus = new StatusMsgValueObject(
            mockIdVideo,
            mockIdUser,
            ProcessingStatusEnum.COMPLETED,
            mockStatusTimestamp,
            100,
            'Processing completed'
        );
        
        expect(completedStatus.getStatusMsg()).toBe(ProcessingStatusEnum.COMPLETED);
        expect(completedStatus.getProcessingPercentage()).toBe(100);
    });

    it('should handle empty message', () => {
        const emptyMsgStatus = new StatusMsgValueObject(
            mockIdVideo,
            mockIdUser,
            ProcessingStatusEnum.NOT_STARTED,
            mockStatusTimestamp,
            0,
            ''
        );
        
        expect(emptyMsgStatus.getMessage()).toBe('');
    });
});