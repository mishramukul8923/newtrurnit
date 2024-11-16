import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';

export async function POST(req) {
  let db;
  try {
    db = await createConnection(); // Connect to MongoDB
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  const collection = db.collection('subscription'); // "subscription" collection in MongoDB

  try {
    const data = await req.json();
    // Validate essential fields and add fallback for optional fields
    const subscriptionData = {
      userId: data?.userId || null,
      email: data?.email || null,
      totalAmount: data?.totalAmount,
      status: data?.status || 'active', // Default to 'active' if status is not provided
      startDate: data?.createdTimestamp ? new Date(data?.createdTimestamp) : null,
      currentPeriodStart: data?.createdTimestamp ? new Date(data?.currentPeriodStart) : null,
      currentPeriodEnd: data?.currentPeriodEnd ? new Date(data?.currentPeriodEnd) : null,
      paymentId: data?.paymentIntentId || null,
      billingInterval: data?.billingInterval || 'monthly', // Default to 'monthly'
      trialStart: data?.trialStart ? new Date(data?.trialStart) : null,
      trialEnd: data?.trialEnd ? new Date(data?.trialEnd) : null,
      price: data?.price,
      planType: data?.planType,
      plan_expired: data?.plan_expired,
      plan_id: data?.plan_id
    };

    console.log("save in  db : ", subscriptionData)

    // Validate required fields
    if (!subscriptionData?.userId || !subscriptionData?.email) {
      return NextResponse.json({ error: 'userId and email are required fields' }, { status: 400 });
    }

    // Save data to MongoDB
    const result = await collection.insertOne(subscriptionData);

    // Send success response with inserted data details
    return NextResponse.json({
      message: 'Subscription saved successfully!',
      subscriptionId: result.insertedId,
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

export async function GET(req) {
  let db;
  try {
    db = await createConnection(); // Connect to MongoDB
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  const userId = req.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  const collection = db.collection('subscription'); // "subscription" collection in MongoDB

  try {
    const subscriptions = await collection.find({ userId }).toArray();
    if (subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscriptions found for the provided user_id' }, { status: 404 });
    }
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error retrieving subscriptions:', error);
    return NextResponse.json({ error: 'Failed to retrieve subscriptions', details: error.message }, { status: 500 });
  }
}
