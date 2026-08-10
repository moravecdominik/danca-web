const encoder = new TextEncoder();

function hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

async function verifyStripeSignature(payload, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.substring(3));

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = timestampPart.substring(2);

  // Stripe standardně používá toleranci 5 minut.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(signedPayload)
  );

  const expectedSignature = hex(signature);

  return signatures.some((candidate) =>
    safeEqual(candidate, expectedSignature)
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const signatureHeader = request.headers.get("stripe-signature");

    // DŮLEŽITÉ: Stripe podpis se musí ověřovat nad původním raw body.
    const rawBody = await request.text();

    const validSignature = await verifyStripeSignature(
      rawBody,
      signatureHeader,
      env.STRIPE_WEBHOOK_SECRET
    );

    if (!validSignature) {
      return new Response("Invalid Stripe signature", {
        status: 400,
      });
    }

    const event = JSON.parse(rawBody);

    // Zajímá nás pouze dokončený Checkout.
    if (event.type !== "checkout.session.completed") {
      return new Response("Event ignored", {
        status: 200,
      });
    }

    const session = event.data.object;

    const customerEmail =
      session?.customer_details?.email ||
      session?.customer_email;

    if (!customerEmail) {
      console.error("Stripe event neobsahuje e-mail zákazníka.");

      return new Response("Customer email missing", {
        status: 400,
      });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Daniela Fitness <onboarding@resend.dev>",
        to: [customerEmail],
        subject: "Tvůj tréninkový plán je tady 💪",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#2f241f;line-height:1.6">
            <h1 style="font-size:28px;margin-bottom:20px">
              Děkuji za objednávku 🤎
            </h1>

            <p>
              Tvoje platba proběhla úspěšně a tréninkový plán je připravený.
            </p>

            <p>
              V příloze tohoto e-mailu najdeš testovací verzi
              <strong>Fitness výzvy na 6 týdnů</strong>.
            </p>

            <p>
              Přeji hodně energie a radosti z tréninku.<br>
              <strong>Daniela</strong>
            </p>
          </div>
        `,
        attachments: [
          {
            filename: "fitness-vyzva-test.pdf",
            path: "https://danca-web.pages.dev/assets/test-plan.pdf"
          }
        ]
      }),
    });

    const resendResult = await resendResponse.text();

    if (!resendResponse.ok) {
      console.error("Resend error:", resendResult);

     return new Response(`Resend error: ${resendResult}`, {
  status: 500,
});
    }

    console.log(
      `Tréninkový plán odeslán na ${customerEmail}`
    );

    return new Response("Webhook processed", {
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return new Response("Webhook processing error", {
      status: 500,
    });
  }
}
