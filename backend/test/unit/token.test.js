const jwt = require('jsonwebtoken');
const { generateToken } = require('../../src/utils/token');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('jsonwebtoken');

describe('generateToken', () => {
    const mockUserId = 1;
    const mockRole = 'admin';
    const mockSessionToken = 'session123';
    const mockSecret = 'test_secret';

    beforeAll(() => {
        process.env.JWT_SECRET = mockSecret;
    });

    it('should generate a valid token with the correct payload', () => {
        jwt.sign.mockReturnValue('mockedToken');

        const token = generateToken(mockUserId, mockRole, mockSessionToken);

        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: mockUserId, role: mockRole, sessionToken: mockSessionToken },
            mockSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        expect(token).toBe('mockedToken');
    });

    it('should throw an error if JWT_SECRET is not defined', () => {
        delete process.env.JWT_SECRET;

        expect(() => generateToken(mockUserId, mockRole, mockSessionToken)).toThrow();
    });
});
