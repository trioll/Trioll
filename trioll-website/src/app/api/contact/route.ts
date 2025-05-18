import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    // In a production environment, you would use a proper email service like Nodemailer, SendGrid, etc.
    // This is a placeholder to show the intended email configuration
    
    console.log('Contact form submission:');
    console.log(`From: ${name} <${email}>`);
    console.log(`To: info@trioll.com`);
    console.log(`BCC: yoavlester@gmail.com, freddiecaplin@gmail.com`);
    console.log(`Message: ${message}`);
    
    // Example configuration for email sending (commented out as it requires actual credentials)
    /*
    const transporter = nodemailer.createTransport({
      host: 'your-smtp-server.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: 'info@trioll.com',
      bcc: ['yoavlester@gmail.com', 'freddiecaplin@gmail.com'],
      subject: `TRIOLL Contact Form: Message from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
