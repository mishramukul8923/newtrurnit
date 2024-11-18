import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';

export const POST = async (req) => {
  try {
    const { text, generatedContent, user_id, email } = await req.json();

    if (!text || !generatedContent) {
      return NextResponse.json(
        { error: 'Text and generatedContent are required' },
        { status: 400 }
      );
    }

    const db = await createConnection();

    const result = await db.collection('generator').insertOne({
      text,
      generatedContent,
      user_id,
      createdAt: new Date(),
    });

    const users = await db.collection('user').findOne({ email });
    if (!users) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let newPlan = 1;
    if (users.plan_id == -1) {
      newPlan = 1;
    } else if (users.plan_id == 0) {
      const humanizerCount = await db.collection('humanizer').find({ user_id }).count();
      const generatorCount = await db.collection('generator').find({ user_id }).count();

      if (humanizerCount >= 2) {
        newPlan = -2;
      } else if (generatorCount >= 2) {
        newPlan = -3;
      } else {
        newPlan = 0;
      }
    } else {
      const planTable = await db.collection('subscription').find({ user_id }).sort({ plan_expired: -1 }).toArray();
      if (planTable.length > 0) {
        const latestPlan = planTable[0];
        if (new Date(latestPlan.plan_expired) > new Date()) {
          newPlan = latestPlan.plan_id;
        }
      }
    }

    await db.collection('user').updateOne(
      { email },
      {
        $set: { plan_id: newPlan }
      }
    );

    result.plan_id = newPlan;
    return NextResponse.json(
      { message: 'Content saved successfully', data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
};
