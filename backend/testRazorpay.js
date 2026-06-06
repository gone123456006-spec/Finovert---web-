import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testRazorpayFlow() {
  console.log('🚀 Starting Razorpay Backend Integration Test...');

  try {
    // Step 1: Create a TaxFilingLead
    console.log('\n[1/3] Creating a mock Tax Filing Lead...');
    const leadRes = await fetch(`${API_URL}/tax-filings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pan: 'ABCDE1234F',
        email: 'test@finovert.com',
        incomeSources: ['Salary'],
        proceedConfirmed: true,
      }),
    });

    if (!leadRes.ok) {
      const err = await leadRes.text();
      throw new Error(`Failed to create lead: ${err}`);
    }
    const lead = await leadRes.json();
    const filingId = lead._id;
    console.log('✅ Lead created successfully. Filing ID:', filingId);

    // Step 2: Create Razorpay Order
    console.log('\n[2/3] Calling /api/payments/create-order...');
    const orderRes = await fetch(`${API_URL}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filingId }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(`Failed to create order: ${JSON.stringify(err)}`);
    }
    const order = await orderRes.json();
    console.log('✅ Razorpay order created successfully!');
    console.log('Order Details:', order);

    console.log('\n🎉 Backend Razorpay integration is working perfectly!');
    console.log('Note: Step 3 (Signature Verification) happens after the frontend payment modal is completed by the user.');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
  }
}

testRazorpayFlow();
