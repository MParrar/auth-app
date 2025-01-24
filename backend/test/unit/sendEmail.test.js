
jest.mock('mailersend', () => {
    return {
      MailerSend: jest.fn().mockImplementation(() => {
        return {
          email: {
            send: jest.fn().mockResolvedValueOnce(true).mockRejectedValueOnce(new Error('Failed to send email'))
          }
        };
      }),
      EmailParams: jest.fn().mockImplementation(() => {
        return {
          setFrom: jest.fn().mockReturnThis(),
          setTo: jest.fn().mockReturnThis(),
          setReplyTo: jest.fn().mockReturnThis(),
          setSubject: jest.fn().mockReturnThis(),
          setText: jest.fn().mockReturnThis(),
        };
      }),
      Sender: jest.fn(),
      Recipient: jest.fn()
    };
  });
  
  const { sendEmail } = require('../../src/services/emailServices');
  const dotenv = require('dotenv');

  dotenv.config();
  
  describe('sendEmail', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create a MailerSend instance with the correct API key', async () => {
      const { MailerSend } = require('mailersend');
      await sendEmail('test@example.com', 'Test Subject', 'Test Body');
      expect(MailerSend).toHaveBeenCalledWith({
        apiKey: process.env.API_KEY_EMAIL,
      });
    });
  
    it('should set up email parameters correctly', async () => {
      const { EmailParams, Sender, Recipient } = require('mailersend');
      await sendEmail('test@example.com', 'Test Subject', 'Test Body');
  
      expect(Sender).toHaveBeenCalledWith(`noreply@${process.env.EMAIL_SENDER}`, 'noreply');
      expect(Recipient).toHaveBeenCalledWith('test@example.com');
      expect(EmailParams).toHaveBeenCalled();
    });
     
  });
  