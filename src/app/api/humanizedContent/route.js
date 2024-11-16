import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';

export const POST = async (req) => {
  try {
    // Parse the request body
    const { text, humanizedContent, user_id, email } = await req.json();
    // console.log('Received data:', { text, humanizedContent, user_id, email });

    // Validate required fields
    if (!text || !humanizedContent) {
      console.error('Validation failed: Missing text or humanizedContent');
      return NextResponse.json(
        { error: 'Text and humanizedContent are required' },
        { status: 400 }
      );
    }

    // Establish database connection
    const db = await createConnection();

    // Insert content into the 'generator' collection
    const result = await db.collection('humanizer').insertOne({
      text,
      humanizedContent,
      user_id,
      createdAt: new Date(),
    });
    console.log('Inserted into humanizedContent:', result);

    // Fetch the user by email
    const users = await db.collection('user').findOne({ email });
    console.log('User fetched:', users);
    if (!users) {
      console.error('User not found with email:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine the new plan
    let newPlan = -1;
    if (users.plan_id == -1) {
      console.log('Plan ID is -1, no changes required.');
      newPlan = -1;
    } else if (users.plan_id == 0) {
      const humanizerCount = await db.collection('humanizer').find({ user_id }).count();
      const generatorCount = await db.collection('generator').find({ user_id }).count();
      console.log('Counts:', { humanizerCount, generatorCount });

      if (humanizerCount >= 2) {
        newPlan = -2;
      } else if (generatorCount >= 2) {
        newPlan = -3;
      } else {
        newPlan = 0;
      }
    } else {
      const planTable = await db.collection('subscription').find({ user_id }).sort({ plan_expired: -1 }).toArray();
      console.log('Subscription plans:', planTable);

      if (planTable.length > 0) {
        const latestPlan = planTable[0];
        if (new Date(latestPlan.plan_expired) > new Date()) {
          newPlan = latestPlan.plan_id;
        }
      }
    }

    // Update the user's plan_id
    const updateResult = await db.collection('user').updateOne(
      { email },
      { $set: { plan_id: newPlan } }
    );
    console.log('Update result:', updateResult);

    // Return a success response
    return NextResponse.json(
      {
        message: 'Content saved successfully',
        data: {
          insertedId: result.insertedId,
          plan_id: newPlan,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
};
