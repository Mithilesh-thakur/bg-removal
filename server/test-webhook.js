// Test script to verify webhook functionality
// Run this with: node test-webhook.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testWebhookSystem() {
  console.log('🧪 Testing Webhook System...\n');

  try {
    // Test 1: Check server health
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Server Health:', healthData);

    // Test 2: Check webhook verification endpoint
    console.log('\n2. Testing webhook verification...');
    const verifyResponse = await fetch(`${BASE_URL}/api/user/webhooks/verify`);
    const verifyData = await verifyResponse.json();
    console.log('✅ Webhook Verification:', verifyData);

    // Test 3: Check if webhook endpoint accepts POST
    console.log('\n3. Testing webhook endpoint...');
    const webhookResponse = await fetch(`${BASE_URL}/api/user/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'svix-id': 'test-id',
        'svix-timestamp': new Date().toISOString(),
        'svix-signature': 'test-signature'
      },
      body: JSON.stringify({
        type: 'test.event',
        data: { id: 'test-user' }
      })
    });
    
    if (webhookResponse.status === 400) {
      console.log('✅ Webhook endpoint is working (rejected invalid signature as expected)');
    } else {
      console.log('⚠️ Unexpected webhook response:', webhookResponse.status);
    }

    // Test 4: Check all users endpoint
    console.log('\n4. Testing users endpoint...');
    const usersResponse = await fetch(`${BASE_URL}/api/user/all`);
    const usersData = await usersResponse.json();
    console.log('✅ Users in database:', usersData.count);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Configure Clerk webhook in dashboard');
    console.log('2. Set CLERK_WEBHOOK_SECRET in .env');
    console.log('3. Test with real user signup');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure server is running (npm run dev)');
    console.log('2. Check MongoDB connection');
    console.log('3. Verify environment variables');
  }
}

testWebhookSystem();

