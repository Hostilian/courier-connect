import { IDeliveryRequest } from '@/models/DeliveryRequest';
import { IUser } from '@/models/User';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'noreply@courierconnect.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function sendEmail(options: { to: string | string[]; subject: string; html: string; }) {
  if (!process.env.RESEND_API_KEY || process.env.NODE_ENV === 'test') {
    console.log('RESEND_API_KEY not set or in test environment, skipping email.');
    return Promise.resolve({ id: 'test_email_id' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Courier Connect <${fromEmail}>`,
      ...options,
    });

    if (error) {
      console.error(`Resend error for subject "${options.subject}":`, error.message);
    }
    return data;
  } catch (error) {
    console.error('Generic error sending email:', error);
  }
}


// Email to customer when they create a new delivery request
export async function sendDeliveryConfirmationEmail(delivery: IDeliveryRequest) {
  const trackingUrl = `${appUrl}/track?id=${delivery.trackingId}`;
  
  await sendEmail({
      to: delivery.senderEmail,
      subject: `Your Courier Connect Delivery Confirmation (ID: ${delivery.trackingId})`,
      html: `
        <h1>Thank you for your delivery request!</h1>
        <p>Your delivery has been scheduled. You can track its progress using the link below.</p>
        <p><strong>Tracking ID:</strong> ${delivery.trackingId}</p>
        <p><strong>Status:</strong> ${delivery.status}</p>
        <p><strong>From:</strong> ${delivery.senderAddress}</p>
        <p><strong>To:</strong> ${delivery.receiverAddress}</p>
        <p><strong>Price:</strong> $${delivery.price.toFixed(2)}</p>
        <a href="${trackingUrl}">Track Your Delivery</a>
        <hr/>
        <p>Thank you for using Courier Connect.</p>
      `,
    });
}

// Email to customer when a courier accepts the delivery
export async function sendDeliveryAcceptedEmail(delivery: IDeliveryRequest, courier: IUser) {
    const trackingUrl = `${appUrl}/track?id=${delivery.trackingId}`;

    await sendEmail({
        to: delivery.senderEmail,
        subject: `A courier is on the way! (ID: ${delivery.trackingId})`,
        html: `
            <h1>Great news!</h1>
            <p>A courier, ${courier.name}, has accepted your delivery request and is on the way to pick it up.</p>
            <p>You can track the delivery in real-time using your tracking link:</p>
            <a href="${trackingUrl}">Track Your Delivery</a>
            <hr/>
            <p>Thank you for using Courier Connect.</p>
        `,
    });
}

// Email to customer when the package is delivered
export async function sendDeliveryCompletedEmail(delivery: IDeliveryRequest) {
    const trackingUrl = `${appUrl}/track?id=${delivery.trackingId}`;

    await sendEmail({
        to: [delivery.senderEmail, delivery.receiverEmail], // Notify both sender and receiver
        subject: `Your package has been delivered! (ID: ${delivery.trackingId})`,
        html: `
            <h1>Delivery Completed!</h1>
            <p>Your package from <strong>${delivery.senderAddress}</strong> to <strong>${delivery.receiverAddress}</strong> has been successfully delivered.</p>
            <p>View the final delivery details here:</p>
            <a href="${trackingUrl}">View Delivery Details</a>
            <p>Please consider rating your courier to help us improve our service.</p>
            <hr/>
            <p>Thank you for using Courier Connect.</p>
        `,
    });
}

// Email to courier when they register
export async function sendCourierWelcomeEmail(courier: IUser) {
    const loginUrl = `${appUrl}/courier/login`;
    await sendEmail({
        to: courier.email,
        subject: 'Welcome to Courier Connect!',
        html: `
            <h1>Welcome aboard, ${courier.name}!</h1>
            <p>Your Courier Connect account has been successfully created.</p>
            <p>You can now log in to your dashboard to find and accept available delivery jobs in your area.</p>
            <a href="${loginUrl}">Go to Your Dashboard</a>
            <hr/>
            <p>The Courier Connect Team</p>
        `,
    });
}

// Email to courier when they receive a new rating
export async function sendRatingReceivedEmail({
  to,
  name,
  rating,
  comment,
  trackingId,
}: {
  to: string;
  name: string;
  rating: number;
  comment?: string;
  trackingId: string;
}) {
  const loginUrl = `${appUrl}/courier/login`;
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  
  await sendEmail({
    to,
    subject: `You've Received a ${rating}-Star Rating!`,
    html: `
      <h1>You've Received a Rating!</h1>
      <p>Hello ${name},</p>
      <p>Good news! You've received a new rating for delivery <strong>${trackingId}</strong>.</p>
      <div style="font-size: 24px; color: #FFB400; margin: 15px 0;">
        ${stars} (${rating}/5)
      </div>
      ${comment ? `
        <div style="background-color: #F9FAFB; border-left: 4px solid #3B82F6; padding: 12px; margin: 15px 0;">
          <p style="margin: 0; font-style: italic;">"${comment}"</p>
        </div>
      ` : ''}
      <p>Positive ratings help improve your profile and increase your chances of getting more delivery requests.</p>
      <p>Thank you for being a valued courier partner!</p>
      <a href="${loginUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin-top: 15px;">View Your Ratings</a>
      <hr/>
      <p>The Courier Connect Team</p>
    `,
  });
}
