export interface OrderConfirmationData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items: Array<{
    product_title: string;
    variant_size?: string | null;
    swatch_name?: string | null;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  advance_paid: number;
  balance_due: number;
  payment_mode: string;
  estimated_delivery?: string | null;
}

export function generateOrderConfirmationHtml(order: OrderConfirmationData): string {
  const isPartialCod = order.payment_mode === "partial_cod" || order.balance_due > 0;
  const advanceFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(order.advance_paid);
  const balanceFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(order.balance_due);
  const totalFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(order.total);
  const subtotalFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(order.subtotal);
  const discountFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(order.discount);

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe4;">
          <strong style="color: #2D231E; font-size: 14px;">${item.product_title}</strong>
          <div style="font-size: 12px; color: #7A6960; margin-top: 2px;">
            ${item.variant_size ? `<span>Size: ${item.variant_size}</span>` : ""}
            ${item.swatch_name ? `<span style="margin-left: 8px;">Color: ${item.swatch_name}</span>` : ""}
            <span style="margin-left: 8px;">Qty: ${item.quantity}</span>
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe4; text-align: right; color: #2D231E; font-weight: 600; font-size: 14px;">
          ₹${item.total.toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Kusumika Order ${order.order_number} is Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2D231E; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF6F0; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #EFE6DE; box-shadow: 0 4px 20px rgba(78, 44, 33, 0.04);">
          <!-- Header Motif -->
          <tr>
            <td style="background-color: #5C181A; padding: 36px 32px; text-align: center;">
              <span style="display: inline-block; font-size: 28px; line-height: 1; margin-bottom: 8px;">🪷</span>
              <h1 style="margin: 0; color: #F5E6D3; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;">KUSUMIKA</h1>
              <p style="margin: 6px 0 0 0; color: #D4A373; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;">Soft like Silk, Feels like a Hug</p>
            </td>
          </tr>

          <!-- Congratulatory Intro -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <div style="display: inline-block; background-color: #F7EFE9; color: #B35434; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px;">
                Order Confirmed #${order.order_number}
              </div>
              <h2 style="margin: 0 0 12px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #2D231E; font-weight: 600;">
                Namaste, ${order.customer_name}
              </h2>
              <p style="margin: 0 0 16px 0; color: #5A4A42; font-size: 15px;">
                Thank you for welcoming Kusumika into your home. Your handcrafted heirloom textiles are now registered with our master artisan atelier.
              </p>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 32px;">
              <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #7A6960; border-bottom: 2px solid #F0EBE4; padding-bottom: 8px;">
                Your Artisanal Selection
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Price & Partial COD Summary -->
          <tr>
            <td style="padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF6F0; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 4px 0; color: #7A6960; font-size: 14px;">Subtotal</td>
                  <td style="padding: 4px 0; text-align: right; color: #2D231E; font-weight: 500; font-size: 14px;">${subtotalFormatted}</td>
                </tr>
                ${
                  order.discount > 0
                    ? `<tr>
                        <td style="padding: 4px 0; color: #2E5C38; font-size: 14px;">Coupon Savings</td>
                        <td style="padding: 4px 0; text-align: right; color: #2E5C38; font-weight: 600; font-size: 14px;">- ${discountFormatted}</td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 4px 0; color: #7A6960; font-size: 14px;">White-Glove Insured Delivery</td>
                  <td style="padding: 4px 0; text-align: right; color: #2E5C38; font-weight: 600; font-size: 14px;">
                    ${order.shipping_fee === 0 ? "Complimentary" : "₹" + order.shipping_fee}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 6px 0; border-top: 1px dashed #DCCFC5; font-size: 16px; font-weight: 600; color: #2D231E;">
                    Total Order Value
                  </td>
                  <td style="padding: 10px 0 6px 0; border-top: 1px dashed #DCCFC5; text-align: right; font-size: 18px; font-weight: 700; color: #5C181A;">
                    ${totalFormatted}
                  </td>
                </tr>

                ${
                  isPartialCod
                    ? `
                  <tr>
                    <td colspan="2" style="padding-top: 12px;">
                      <div style="background-color: #FFFFFF; border: 1px solid #E4D8CE; border-radius: 6px; padding: 12px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="font-size: 13px; color: #2E5C38; font-weight: 600;">Advance Paid Online (Razorpay)</td>
                            <td style="text-align: right; font-size: 13px; color: #2E5C38; font-weight: 700;">${advanceFormatted}</td>
                          </tr>
                          <tr>
                            <td style="padding-top: 4px; font-size: 13px; color: #B35434; font-weight: 600;">Doorstep Balance Due</td>
                            <td style="padding-top: 4px; text-align: right; font-size: 14px; color: #B35434; font-weight: 700;">${balanceFormatted}</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                `
                    : `
                  <tr>
                    <td colspan="2" style="padding-top: 8px;">
                      <span style="font-size: 13px; color: #2E5C38; font-weight: 600;">✓ Paid in Full Online via Razorpay</span>
                    </td>
                  </tr>
                `
                }
              </table>
            </td>
          </tr>

          <!-- White Glove Delivery & Inspection Promise -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #F8FBF8; border: 1px solid #D5E5D8; border-radius: 8px; padding: 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="28" valign="top" style="font-size: 18px; line-height: 1;">🌿</td>
                    <td style="padding-left: 10px;">
                      <strong style="color: #2E5C38; font-size: 13px; display: block; margin-bottom: 2px;">The Kusumika Doorstep Guarantee</strong>
                      <p style="margin: 0; color: #4A634E; font-size: 12px; line-height: 1.5;">
                        Examine the hand-feel, weave density, and fall of your organic linens in your natural home light before settling the doorstep balance. You may pay the delivery executive via Cash or dynamic UPI QR.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Shipping Details & Action Button -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="55%" valign="top">
                    <h4 style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #7A6960;">Shipping Destination</h4>
                    <p style="margin: 0; font-size: 13px; color: #2D231E; line-height: 1.4;">
                      ${order.customer_name}<br>
                      ${order.shipping_address.address_line1 || ""}${order.shipping_address.address_line2 ? ", " + order.shipping_address.address_line2 : ""}<br>
                      ${order.shipping_address.city || ""}, ${order.shipping_address.state || ""} - ${order.shipping_address.pincode || ""}
                    </p>
                  </td>
                  <td width="45%" valign="middle" align="right">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kusumika.com"}/track-order?orderId=${encodeURIComponent(order.order_number)}"
                       style="display: inline-block; background-color: #B35434; color: #FFFFFF; text-decoration: none; padding: 12px 20px; font-size: 13px; font-weight: 600; border-radius: 6px; letter-spacing: 0.04em;">
                      Track Loom Progress →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF6F0; padding: 24px 32px; border-top: 1px solid #EFE6DE; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #7A6960;">
                Have questions or need bespoke customization? Reply to this email or WhatsApp our Atelier Concierge at <strong>+91 98765 43210</strong>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #A89B93;">
                © ${new Date().getFullYear()} Kusumika Luxury Home Textiles. Handcrafted with reverence in India.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendOrderConfirmationEmail(order: OrderConfirmationData): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}> {
  const htmlContent = generateOrderConfirmationHtml(order);
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey && !resendApiKey.includes("resend_mock") && !resendApiKey.includes("your_resend_api_key")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Kusumika Atelier <orders@kusumika.com>",
          to: [order.customer_email],
          subject: `Order Confirmed #${order.order_number} - Kusumika Luxury Textiles`,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("[EmailService] Resend API error:", errorText);
        // Fall back gracefully so payment flow does not fail
        return { success: true, simulated: true, error: errorText };
      }

      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.warn("[EmailService] Error dispatching email via Resend:", err.message);
      return { success: true, simulated: true, error: err.message };
    }
  }

  // Development / Preview simulation
  console.log(`[EmailService] Simulated order confirmation dispatch:
  -------------------------------------------------------------
  To: ${order.customer_email} (${order.customer_name})
  Order: #${order.order_number}
  Total: ₹${order.total.toLocaleString("en-IN")} (Advance: ₹${order.advance_paid.toLocaleString("en-IN")}, Balance: ₹${order.balance_due.toLocaleString("en-IN")})
  Items: ${order.items.map((i) => `${i.product_title} (${i.quantity}x)`).join(", ")}
  Tracking: /track-order?orderId=${order.order_number}
  -------------------------------------------------------------`);

  return { success: true, simulated: true, messageId: `mock_email_${Date.now()}` };
}
