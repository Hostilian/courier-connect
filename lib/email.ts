// Email sending utility
// Uses Resend for transactional emails (lazily imported to avoid build-time issues)

// Lazily initialize the Resend client only when the API key is present to avoid build-time errors
let _resend: any | null = null;
async function getResend(): Promise<any | null> {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  const mod = await import('resend');
  const Resend = mod.Resend as any;
  _resend = new Resend(key);
  return _resend;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  try {
  const client = await getResend();
    if (!client) {
      console.warn('Resend API key is missing; skipping verification email.');
      return { success: false, error: 'Email service not configured' };
    }
    const data = await client.emails.send({
      from: 'Courier Connect <noreply@hostilian.org>',
      to: email,
      subject: 'Verify your email - Courier Connect',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to Courier Connect!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Thanks for signing up as a courier! Please verify your email address to start accepting deliveries.
              </p>
              <a href="${verificationUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
                Verify Email Address
              </a>
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Or copy this link: <br>
                <span style="color: #667eea; word-break: break-all;">${verificationUrl}</span>
              </p>
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                This link expires in 24 hours.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #9ca3af;">
                If you didn't sign up for Courier Connect, you can safely ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courier/reset-password?token=${token}`;

  try {
  const client = await getResend();
    if (!client) {
      console.warn('Resend API key is missing; skipping password reset email.');
      return { success: false, error: 'Email service not configured' };
    }
    const data = await client.emails.send({
      from: 'Courier Connect <noreply@hostilian.org>',
      to: email,
      subject: 'Reset your password - Courier Connect',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Reset Your Password</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
                Reset Password
              </a>
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Or copy this link: <br>
                <span style="color: #667eea; word-break: break-all;">${resetUrl}</span>
              </p>
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                This link expires in 1 hour.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #9ca3af;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendDeliveryNotification(
  email: string,
  trackingId: string,
  status: string
) {
  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track?id=${trackingId}`;

  const statusMessages: Record<string, { subject: string; message: string }> = {
    accepted: {
      subject: 'Your delivery has been accepted',
      message: 'A courier has accepted your delivery and will pick it up soon.',
    },
    picked_up: {
      subject: 'Your package has been picked up',
      message: 'The courier has picked up your package and is on the way.',
    },
    delivered: {
      subject: 'Your package has been delivered',
      message: 'Your package has been successfully delivered!',
    },
  };

  const { subject, message } = statusMessages[status] || {
    subject: 'Delivery status update',
    message: 'Your delivery status has been updated.',
  };

  try {
  const client = await getResend();
    if (!client) {
      console.warn('Resend API key is missing; skipping delivery notification email.');
      return { success: false, error: 'Email service not configured' };
    }
    const data = await client.emails.send({
      from: 'Courier Connect <notifications@hostilian.org>',
      to: email,
      subject: `${subject} - ${trackingId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Delivery Update</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                ${message}
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 15px 0;">
                <strong>Tracking ID:</strong> ${trackingId}
              </p>
              <a href="${trackingUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
                Track Your Delivery
              </a>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #9ca3af;">
                Need help? Contact us at support@hostilian.org
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
