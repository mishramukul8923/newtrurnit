import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import createConnection from '@/app/lib/db';
import fs from 'fs'; // Import fs to check file existence

export async function POST(request) {
    const db = await createConnection();
    try {
        const { email } = await request.json();
        console.log("Removing profile picture for email:", email);

        if (!email) {
            return NextResponse.json({ success: false, error: "No email provided" });
        }

        // Retrieve the current image path from the database
        const user = await db.collection('user').findOne({ email });
        console.log("User retrieved:", user); // Debugging log

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" });
        }

        if (!user.image) {
            return NextResponse.json({ success: false, error: "No image to remove" });
        }

        const imagePath = path.join(process.cwd(), 'public', user.image);
        console.log("Image path to remove:", imagePath); // Debugging log

        // Check if the image file exists before trying to unlink it
        if (!fs.existsSync(imagePath)) {
            return NextResponse.json({ success: false, error: "Image file does not exist" });
        }

        // Delete the image file from the filesystem
        await unlink(imagePath);

        // Update the user's profile picture path in the database
        await db.collection('user').updateOne(
            { email },
            { $set: { image: null } } // Set image to null
        );

        return NextResponse.json({ response: "Profile picture removed successfully", success: true });

    } catch (error) {
        console.error('Error removing profile picture:', error);
        return NextResponse.json({ error: 'Failed to remove profile picture' }, { status: 500 });
    }
}
