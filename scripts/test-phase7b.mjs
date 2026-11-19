import crypto from "crypto";

const BASE = "http://localhost:3000";
const RAZORPAY_WEBHOOK_SECRET = "ksm_razorpay_webhook_secret_live_2026";
const SHIPROCKET_WEBHOOK_SECRET = "ksm_shiprocket_webhook_secret_live_2026";

function computeHmacSha256(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

async function runPhase7bTests() {
  console.log("==================================================");
  console.log("PHASE 7B: PAYMENTS, WEBHOOKS & SECURITY VERIFICATION");
  console.log("==================================================\n");

  let allPassed = true;

  // ---------------------------------------------------------------------------
  // TEST 1: FORGED PAYMENT VERIFICATION & CLIENT isMock REMOVAL
  // ---------------------------------------------------------------------------
  console.log("--- TEST 1: FORGED PAYMENT & isMock REMOVAL ---");
  try {
    const forgedPayload = {
      razorpay_order_id: "order_spoofed_99999",
      razorpay_payment_id: "pay_forged_99999",
      razorpay_signature: "bad_signature_that_does_not_match_hmac",
      isMock: true, // Malicious client attempt to bypass verification
      orderNumber: "KSM-99999",
    };

    const res = await fetch(`${BASE}/api/checkout/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forgedPayload),
    });

    const data = await res.json();
    console.log(`Forged payment status: ${res.status}`);
    console.log(`Forged payment response:`, data);

    if (res.status === 400 && data.error?.includes("Cryptographic payment verification failed")) {
      console.log("✓ PASS: Forged payment was strictly rejected. Client isMock bypass is disabled.\n");
    } else {
      console.error("✗ FAIL: Forged payment was not properly rejected!\n");
      allPassed = false;
    }
  } catch (err) {
    console.error("✗ Error in Test 1:", err);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // TEST 2: TAMPERED FINANCIAL AMOUNTS RECOMPUTED ON SERVER
  // ---------------------------------------------------------------------------
  console.log("--- TEST 2: TAMPERED FINANCIAL AMOUNTS RECOMPUTATION ---");
  let preCreatedOrderNumber = "";
  let preCreatedRzpOrderId = "";

  try {
    // Marwar Lotus Double Bedsheet Set base price is ₹2,850 in catalog
    // Client attempts to tamper with prices, claiming total is ₹1 and advance is ₹1
    const tamperedPayload = {
      items: [
        {
          productId: "prod-1",
          variantSize: 'Double / Queen (84x100")',
          swatchName: "Terracotta Lotus",
          quantity: 1,
          price: 1, // Tampered unit price attempt
        },
      ],
      amount: 1, // Tampered gateway amount attempt
      subtotal: 1,
      total: 1,
      advancePaid: 1,
      customer: {
        name: "Security Audit Patron",
        email: "audit@kusumika.com",
        phone: "+91 9876543210",
      },
      shippingAddress: {
        address: "Haveli 7",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302001",
      },
      shippingMethod: "standard",
      paymentMode: "partial_cod",
    };

    const res = await fetch(`${BASE}/api/checkout/create-razorpay-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tamperedPayload),
    });

    const data = await res.json();
    console.log(`Create order status: ${res.status}`);
    console.log(`Created Order Number: ${data.orderNumber}`);
    console.log(`Calculated Subtotal: ₹${data.financials?.subtotal} (Expected: ₹2,850)`);
    console.log(`Calculated Total: ₹${data.financials?.total} (Expected: ₹2,850)`);
    console.log(`Calculated Advance: ₹${data.financials?.advancePaid} (Expected: ₹550 / ₹570 per formula)`);
    console.log(`Razorpay Gateway Amount in paise: ${data.amount}`);

    preCreatedOrderNumber = data.orderNumber;
    preCreatedRzpOrderId = data.id;

    if (
      res.status === 200 &&
      data.financials?.subtotal === 2850 &&
      data.amount > 100 // Gateway amount is significantly more than 100 paise (₹1)
    ) {
      console.log("✓ PASS: Tampered client amounts were completely ignored; server recalculated from official catalog.\n");
    } else {
      console.error("✗ FAIL: Server did not properly recompute catalog price!\n");
      allPassed = false;
    }
  } catch (err) {
    console.error("✗ Error in Test 2:", err);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // TEST 3: RAZORPAY WEBHOOK SIGNATURE VERIFICATION
  // ---------------------------------------------------------------------------
  console.log("--- TEST 3: RAZORPAY WEBHOOK SIGNATURE VERIFICATION ---");
  try {
    const rawPayload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: `pay_test_${Date.now()}`,
            amount: 57000,
            currency: "INR",
          },
        },
      },
    });

    // 3A: Missing signature
    const resNoSig = await fetch(`${BASE}/api/webhooks/razorpay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawPayload,
    });
    console.log(`Missing signature status: ${resNoSig.status}`);

    // 3B: Forged signature
    const resBadSig = await fetch(`${BASE}/api/webhooks/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "forged_sha256_signature_abc123",
      },
      body: rawPayload,
    });
    console.log(`Invalid signature status: ${resBadSig.status}`);

    if (resNoSig.status === 400 && resBadSig.status === 400) {
      console.log("✓ PASS: Webhook strictly rejected unsigned and forged requests.\n");
    } else {
      console.error("✗ FAIL: Webhook accepted unsigned or forged requests!\n");
      allPassed = false;
    }
  } catch (err) {
    console.error("✗ Error in Test 3:", err);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // TEST 4: WEBHOOK REPLAY & IDEMPOTENCY
  // ---------------------------------------------------------------------------
  console.log("--- TEST 4: WEBHOOK REPLAY & IDEMPOTENCY ---");
  try {
    const paymentId = `pay_idem_${Date.now()}`;
    const webhookPayloadObj = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: preCreatedRzpOrderId,
            amount: 57000,
            notes: {
              order_number: preCreatedOrderNumber,
            },
          },
        },
      },
    };

    const webhookBody = JSON.stringify(webhookPayloadObj);
    const validSignature = computeHmacSha256(webhookBody, RAZORPAY_WEBHOOK_SECRET);

    // Initial Webhook Event
    const res1 = await fetch(`${BASE}/api/webhooks/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validSignature,
      },
      body: webhookBody,
    });
    const data1 = await res1.json();
    console.log(`First Webhook delivery status: ${res1.status}, data:`, data1);

    // Replayed Webhook Event
    const res2 = await fetch(`${BASE}/api/webhooks/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validSignature,
      },
      body: webhookBody,
    });
    const data2 = await res2.json();
    console.log(`Replayed Webhook delivery status: ${res2.status}, data:`, data2);

    if (res1.status === 200 && res2.status === 200 && data2.idempotent === true) {
      console.log("✓ PASS: Webhook idempotency confirmed. Replayed event safely handled without duplicates.\n");
    } else {
      console.error("✗ FAIL: Replayed webhook was not handled idempotently!\n");
      allPassed = false;
    }
  } catch (err) {
    console.error("✗ Error in Test 4:", err);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // TEST 5: SHIPROCKET WEBHOOK SECRET AUTHENTICATION
  // ---------------------------------------------------------------------------
  console.log("--- TEST 5: SHIPROCKET SECRET-HEADER AUTHENTICATION ---");
  try {
    const shiprocketPayload = JSON.stringify({
      order_id: "KSM-84920",
      awb_code: "SR-BLUEDART-881920",
      current_status: "IN TRANSIT",
      location: "Jaipur Sorting Hub",
    });

    // 5A: Missing Secret Header
    const resNoSecret = await fetch(`${BASE}/api/webhooks/shiprocket`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: shiprocketPayload,
    });
    console.log(`Shiprocket without secret status: ${resNoSecret.status}`);

    // 5B: Wrong Secret Header
    const resWrongSecret = await fetch(`${BASE}/api/webhooks/shiprocket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shiprocket-secret": "wrong_secret_key_xyz",
      },
      body: shiprocketPayload,
    });
    console.log(`Shiprocket with wrong secret status: ${resWrongSecret.status}`);

    // 5C: Valid Secret Header
    const resValidSecret = await fetch(`${BASE}/api/webhooks/shiprocket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shiprocket-secret": SHIPROCKET_WEBHOOK_SECRET,
      },
      body: shiprocketPayload,
    });
    const validData = await resValidSecret.json();
    console.log(`Shiprocket with valid secret status: ${resValidSecret.status}, data:`, validData);

    if (resNoSecret.status === 401 && resWrongSecret.status === 401 && resValidSecret.status === 200) {
      console.log("✓ PASS: Shiprocket webhook secret-header authentication verified.\n");
    } else {
      console.error("✗ FAIL: Shiprocket webhook authentication check failed!\n");
      allPassed = false;
    }
  } catch (err) {
    console.error("✗ Error in Test 5:", err);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // TEST 6: RATE LIMITING ENFORCEMENT
  // ---------------------------------------------------------------------------
  console.log("--- TEST 6: RATE LIMITING ENFORCEMENT ---");
  try {
    // Send 35 rapid requests to /api/coupons/validate (limit is 30/min)
    console.log("Sending rapid burst requests to test rate limit threshold...");
    let blockedCount = 0;
    let lastStatus = 200;
    let retryAfterHeader = null;

    for (let i = 0; i < 35; i++) {
      const res = await fetch(`${BASE}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "FESTIVE500", subtotal: 3000 }),
      });
      lastStatus = res.status;
      if (res.status === 429) {
        blockedCount++;
        retryAfterHeader = res.headers.get("retry-after");
      }
    }

    console.log(`Rate limit test finished. Blocked requests (HTTP 429): ${blockedCount}`);
    console.log(`Retry-After Header received: ${retryAfterHeader}s`);

    if (blockedCount > 0 && retryAfterHeader !== null) {
      console.log("✓ PASS: Rate limiting active. Volumetric bursts blocked with HTTP 429 and Retry-After header.\n");
    } else {
      console.error("✗ FAIL: Rate limiter did not engage on rapid requests!\n");
      allPassed = false;
    }
  } catch (err) {
    console.error("✗ Error in Test 6:", err);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("==================================================");
  if (allPassed) {
    console.log("ALL PHASE 7B SECURITY TESTS PASSED SUCCESSFULLY! (6/6)");
  } else {
    console.error("SOME PHASE 7B TESTS FAILED. PLEASE REVIEW LOGS.");
  }
  console.log("==================================================");
}

runPhase7bTests();
