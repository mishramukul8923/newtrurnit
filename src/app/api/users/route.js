import createConnection from "../../lib/db";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/utils/sendEmail";
import { generateToken } from "@/utils/generateToken";
import { signIn, useSession, signOut } from 'next-auth/react'; // Import signIn from next-auth
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next"; // Correct import path for Next.js 13+





export const GET = async (req) => {
    try {
        const db = await createConnection(); // Ensure you're getting the db from your MongoDB connection

        const { searchParams } = new URL(req.url); // Get URL parameters
        const email = searchParams.get('email'); // Extract the email parameter

        let query = {};

        // If an email is provided, set the query filter
        if (email) {
            query.email = email;
        }

        // Use the find method to get users
        const user = await db.collection('user').find(query).toArray(); // Fetch users based on the query

        return NextResponse.json(user); // Return the result as JSON
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: error.message });
    }
};


export const POST = async (req) => {
    const db = await createConnection()
    const session = await getServerSession(authOptions);


    try {
        const data = await req.json();
        // console.log("Incoming request data:", data);

        // Check if the request is for social login
        if (session) {
            console.log("User logged in, handling social login...");
            return await handleSocialLogin(session.user);
        } else {
            console.log("No session found, handling registration...");
            return await handleRegistration(data);
        }
    } catch (error) {
        console.error("ERROR IS", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};


// // to update user
// export const PUT = async (req) => {
//     try {
//         const db = await createConnection();
//         const body = await req.json();
//         if (!body.email) {
//             return NextResponse.json(
//                 { error: "The 'email' field is required in the request body." },
//                 { status: 400 }
//             );
//         }
//         const { email, ...updateFields } = body;
//         if (!Object.keys(updateFields).length) {
//             return NextResponse.json(
//                 { error: "At least one key-value pair is required to update." },
//                 { status: 400 }
//             );
//         }
//         const result = await db.collection('user').findOneAndUpdate(
//             { email },
//             { $set: updateFields },
//             { returnDocument: 'after' }
//         );

//         // Handle case where user is not found
//         if (!result.value) {
//             return NextResponse.json(
//                 { error: "User not found with the provided email." },
//                 { status: 404 }
//             );
//         }

//         // Return the updated user
//         return NextResponse.json({
//             message: "User updated successfully.",
//             user: result.value,
//         });
//     } catch (error) {
//         // Catch and log any errors
//         console.error("Database query failed:", error);
//         return NextResponse.json(
//             { error: "An internal server error occurred." },
//             { status: 500 }
//         );
//     }
// };

export const PUT = async (req) => {
    try {
        const db = await createConnection();
        const body = await req.json();

        // Handle user update
        if (body.email) {
            const { email, ...updateFields } = body;

            // Validate update fields
            if (!Object.keys(updateFields).length) {
                return NextResponse.json(
                    { error: "At least one key-value pair is required to update." },
                    { status: 400 }
                );
            }

            const userUpdateResult = await db.collection('user').findOneAndUpdate(
                { email },
                { $set: updateFields },
                { returnDocument: 'after' }
            );

            // Check if user was found and updated
            if (!userUpdateResult.value) {
                return NextResponse.json(
                    { error: "User not found with the provided email." },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                message: "User updated successfully.",
                user: userUpdateResult.value,
            });
        }

        // Handle API key updates
        const { gptZeroApiKey, zeroGptApiKey, originalityApiKey, copyLeaksApiKey } = body;

        // Prepare API key data
        const apiKeyData = {
            ...(gptZeroApiKey && { gptZeroApiKey }),
            ...(zeroGptApiKey && { zeroGptApiKey }),
            ...(originalityApiKey && { originalityApiKey }),
            ...(copyLeaksApiKey && { copyLeaksApiKey }),
        };

        if (Object.keys(apiKeyData).length > 0) {
            const apiKeyUpdateResult = await db.collection('user').updateOne(
                {},
                { $set: apiKeyData },
                { upsert: true }
            );

            return NextResponse.json({
                message: "API keys updated successfully.",
                data: apiKeyUpdateResult,
            }, { status: 200 });
        }

        // Handle case where neither user nor API key updates were provided
        return NextResponse.json(
            { error: "No valid fields provided to update. Please include an 'email' or API keys." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json(
            { error: "An internal server error occurred." },
            { status: 500 }
        );
    }
};









/// Social login handler
const handleSocialLogin = async (user) => {
    console.log("Handling social login...");
    const { email, name } = user;
    const nameParts = name.split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ");

    const db = await createConnection(); // Get the MongoDB database instance

    try {
        // Check if the user already exists
        const existingUser = await db.collection('user').findOne({ email });

        if (existingUser) {
            console.log("User already exists. Logged in successfully.");
            return NextResponse.json({ message: "User already exists. Logged in successfully." }, { status: 200 });
        } else {
            // Insert the new user into the MongoDB collection
            const newUser = {
                firstname,
                lastname,
                email,
                password: null, // Set password to null for social users
                auth: false,    // Adjust as per your requirements
                social: true,   // Mark as social user
                temporary: false, // Adjust as per your requirements
                resetToken: null, // Additional fields as required
                resetTokenExpiration: null,
                subscription: false, // Adjust as per your requirements
                token: null // Additional field if needed
            };

            await db.collection('user').insertOne(newUser); // Insert the new user document
            console.log("User created successfully with social login.");
            return NextResponse.json({ message: "User created successfully with social login." }, { status: 201 });
        }
    } catch (error) {
        console.error("Error during social login:", error);
        return NextResponse.json({ error: "Social login failed" }, { status: 500 });
    }
};

// User registration handler
const handleRegistration = async (data) => {
    const { firstname, lastname, email, password, plan_id } = data;

    // Validate required fields
    if (!firstname || !lastname || !email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await createConnection();

    try {
        // Check if the user already exists
        const existingUser = await db.collection('user').findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        } else {
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert the new user into the MongoDB collection
            const newUser = {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                auth: false,      // Adjust as per your requirements
                social: false,    // Adjust as per your requirements
                temporary: true,  // Adjust as per your requirements
                resetToken: null, // Additional fields as required
                resetTokenExpiration: null,
                subscription: false, // Adjust as per your requirements
                token: null,         // Additional field if needed
                createdAt: new Date(),  // Set the createdAt timestamp to the current date and time
                updatedAt: new Date(),  // Set the updatedAt timestamp to the current date and time
                logins: [
                    {
                        loginTime: { type: Date, default: Date.now },
                        logoutTime: { type: Date },
                    },
                ],
                plan_id: plan_id

            };

            await db.collection('user').insertOne(newUser); // Insert the new user document

            // Generate verification token
            const token = generateToken(email);

            // Send verification email
            await sendVerificationEmail(email, token);

            return NextResponse.json({ message: "User created successfully" }, { status: 201 });
        }
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
};



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

//         const result = await db.collection('user').updateOne(
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

