import { UserValueObject } from '../../../../src/Core/Entity/ValueObject/UserValueObject';

describe('UserValueObject', () => {
    // Mock data
    const mockUserId = 'user123';
    const mockEmail = 'test@example.com';
    const mockUserDTO = {
        id_usuario: mockUserId,
        email: mockEmail
    };

    it('should create a UserValueObject with provided values', () => {
        const userVO = new UserValueObject(mockUserId, mockEmail);
        
        expect(userVO.getUserId()).toBe(mockUserId);
        expect(userVO.getEmail()).toBe(mockEmail);
    });

    it('should correctly convert to DTO', () => {
        const userVO = new UserValueObject(mockUserId, mockEmail);
        const dto = userVO.toDTO();
        
        expect(dto).toEqual({
            id_usuario: mockUserId,
            email: mockEmail
        });
    });

    it('should create UserValueObject from DTO', () => {
        const userVO = UserValueObject.fromDTO(mockUserDTO);
        
        expect(userVO).toBeInstanceOf(UserValueObject);
        expect(userVO.getUserId()).toBe(mockUserId);
        expect(userVO.getEmail()).toBe(mockEmail);
    });

    it('should handle empty values', () => {
        const userVO = new UserValueObject('', '');
        
        expect(userVO.getUserId()).toBe('');
        expect(userVO.getEmail()).toBe('');
    });

    it('should handle different email formats', () => {
        const emails = ['user.name@domain.com', 'user-name@domain.co.uk', 'user123@subdomain.domain.org'];
        
        emails.forEach(email => {
            const userVO = new UserValueObject(mockUserId, email);
            expect(userVO.getEmail()).toBe(email);
        });
    });
});