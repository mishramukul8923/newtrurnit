// import { NextResponse } from "next/server";
// import createConnection from "@/app/lib/db";

// export async function POST(req) {
//     try {
//         const db = await createConnection();

//         // Parse the request body
//         const { gptZeroApiKey, zeroGptApiKey, originalityApiKey, copyLeaksApiKey } = await req.json();

//         // Validate required data
//         if (!gptZeroApiKey || !zeroGptApiKey || !originalityApiKey || !copyLeaksApiKey) {
//             return NextResponse.json(
//                 { error: "All API keys are required." },
//                 { status: 400 }
//             );
//         }

//         // Insert API keys into the 'apiKeys' collection
//         const result = await db.collection('apiKeys').insertOne({
//             gptZeroApiKey,
//             zeroGptApiKey,
//             originalityApiKey,
//             copyLeaksApiKey,
//             createdAt: new Date(),
//         });

//         // Respond with success and the saved data
//         return NextResponse.json({ message: "API keys saved successfully", data: result }, { status: 200 });
//     } catch (error) {
//         console.error("Error handling request:", error);
//         return NextResponse.json({ error: "Failed to save API keys" }, { status: 500 });
//     }
// }


// import { NextResponse } from "next/server";
// import createConnection from "@/app/lib/db";

// export async function POST(req) {
//     try {
//         const db = await createConnection();

//         // Parse the request body
//         const { gptZeroApiKey, zeroGptApiKey, originalityApiKey, copyLeaksApiKey } = await req.json();

//         // Filter out undefined or empty fields
//         const apiKeyData = {
//             ...(gptZeroApiKey && { gptZeroApiKey }),
//             ...(zeroGptApiKey && { zeroGptApiKey }),
//             ...(originalityApiKey && { originalityApiKey }),
//             ...(copyLeaksApiKey && { copyLeaksApiKey }),
//         };

//         // Check if there's at least one API key provided
//         if (Object.keys(apiKeyData).length === 0) {
//             return NextResponse.json(
//                 { error: "Please provide at least one API key." },
//                 { status: 400 }
//             );
//         }

//         // Insert API keys into the 'apiKeys' collection
//         const result = await db.collection('apiKeys').insertOne({
//             ...apiKeyData,
//             createdAt: new Date(),
//         });

//         // Respond with success and the saved data
//         return NextResponse.json({ message: "API keys saved successfully", data: result }, { status: 200 });
//     } catch (error) {
//         console.error("Error handling request:", error);
//         return NextResponse.json({ error: "Failed to save API keys" }, { status: 500 });
//     }
// }


// import { NextResponse } from "next/server";
// import createConnection from "@/app/lib/db";

// export async function GET() {
//     try {
//         const db = await createConnection();
//         const apiKeys = await db.collection('apiKeys').findOne({});
//         return NextResponse.json(apiKeys || {});
//     } catch (error) {
//         console.error("Error fetching API keys:", error);
//         return NextResponse.json({ error: "Failed to load API keys" }, { status: 500 });
//     }
// }

// export async function PUT(req) {
//     try {
//         const db = await createConnection();
//         const { gptZeroApiKey, zeroGptApiKey, originalityApiKey, copyLeaksApiKey } = await req.json();

//         const apiKeyData = {
//             ...(gptZeroApiKey && { gptZeroApiKey }),
//             ...(zeroGptApiKey && { zeroGptApiKey }),
//             ...(originalityApiKey && { originalityApiKey }),
//             ...(copyLeaksApiKey && { copyLeaksApiKey }),
//         };

//         if (Object.keys(apiKeyData).length === 0) {
//             return NextResponse.json(
//                 { error: "Please provide at least one API key." },
//                 { status: 400 }
//             );
//         }

//         const result = await db.collection('apiKeys').updateOne(
//             {},
//             { $set: apiKeyData },
//             { upsert: true }
//         );

//         return NextResponse.json({ message: "API keys updated successfully", data: result }, { status: 200 });
//     } catch (error) {
//         console.error("Error updating API keys:", error);
//         return NextResponse.json({ error: "Failed to update API keys" }, { status: 500 });
//     }
// }
