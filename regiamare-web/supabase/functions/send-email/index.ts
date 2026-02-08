// Supabase Edge Function para enviar emails de valoración
// Deploy: supabase functions deploy send-email --no-verify-jwt

interface EmailRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    propertyType: string;
    message: string;
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Parse request body
        const { name, email, phone, address, propertyType, message }: EmailRequest = await req.json();

        // Validate required fields
        if (!name || !email || !phone || !address || !propertyType) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Get Resend API key from environment
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
        if (!RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY not configured');
        }

        // Prepare email content
        const emailHtml = `
      <h2>Nueva Solicitud de Valoración de Propiedad</h2>
      <p>Has recibido una nueva solicitud de valoración:</p>
      
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Nombre:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${email}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Teléfono:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Dirección:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${address}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Tipo de Propiedad:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${propertyType}</td>
        </tr>
        ${message ? `
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Mensaje:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${message}</td>
        </tr>
        ` : ''}
      </table>
      
      <p style="margin-top: 20px; color: #6c757d; font-size: 14px;">
        Este email fue enviado desde el formulario de valoración de Regiamare Properties.
      </p>
    `;

        const emailText = `
Nueva Solicitud de Valoración de Propiedad

Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
Dirección de la propiedad: ${address}
Tipo de propiedad: ${propertyType}
${message ? `\nMensaje:\n${message}` : ''}

---
Este email fue enviado desde el formulario de valoración de Regiamare Properties.
    `.trim();

        // Send email using Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: ['joselynelvira99@gmail.com'],
                reply_to: email,
                subject: `Nueva Solicitud de Valoración - ${name}`,
                html: emailHtml,
                text: emailText,
            }),
        });

        if (!resendResponse.ok) {
            const error = await resendResponse.text();
            console.error('Resend API error:', error);
            throw new Error(`Failed to send email: ${error}`);
        }

        const data = await resendResponse.json();
        console.log('Email sent successfully:', data);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Email sent successfully',
                id: data.id
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Error in send-email function:', error);
        return new Response(
            JSON.stringify({
                error: error.message || 'Internal server error',
                success: false
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});
