export async function sendOtp(phoneOrEmail: string): Promise<void> {
  console.log('sendOtp', phoneOrEmail);
}

export async function verifyOtp(code: string): Promise<boolean> {
  console.log('verifyOtp', code);
  return false;
}
