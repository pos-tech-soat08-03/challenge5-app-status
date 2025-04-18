import { EmailServiceMock } from "../../../src/Infrastructure/Services/EmailServiceMock";

describe('EmailServiceMock', () => {
    let emailService: EmailServiceMock;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        emailService = new EmailServiceMock();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(); // Mock console.log to prevent actual logging during tests
    });

    afterEach(() => {
        consoleSpy.mockRestore(); // Restore original console.log behavior
    });

    it('should log the email details and return true when sendEmail is called', async () => {
        const to = 'test@example.com';
        const subject = 'Test Subject';
        const body = 'Test Body';

        const result = await emailService.sendEmail(to, subject, body);

        expect(result).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith(
            `Email enviado para ${to} com o assunto ${subject} e o corpo ${body}`
        );
    });

    it('should handle different email details correctly', async () => {
        const to = 'another@example.com';
        const subject = 'Another Subject';
        const body = 'Another Body Content';

        const result = await emailService.sendEmail(to, subject, body);

        expect(result).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith(
            `Email enviado para ${to} com o assunto ${subject} e o corpo ${body}`
        );
    });
});