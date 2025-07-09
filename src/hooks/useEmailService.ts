
export function useEmailService() {
  async function sendWelcomeEmail(email: string, name: string) {
    // Mock email sending - in production, integrate with email service
    console.log(`Sending welcome email to ${email} (${name})`);
    return Promise.resolve();
  }
  return { sendWelcomeEmail };
}
