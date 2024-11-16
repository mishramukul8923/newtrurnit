import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique names
import createConnection from '@/app/lib/db';

export async function POST(request) {
    const db = await createConnection();
    
    try {
        const data = await request.formData();
        const file = data.get('file');
        const email = data.get('email'); // Assume email is sent along with the file

        // Validate that the file and email are provided
        if (!file || !email) {
            return NextResponse.json({ success: false, error: "No file or email provided" });
        }

        // Validate file size (limit to 5MB for example)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ success: false, error: "File is too large" });
        }

        // Validate file type (allow only images)
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: "Invalid file type" });
        }

        // Convert the file to a buffer
        const bufferData = await file.arrayBuffer();
        const buffer = Buffer.from(bufferData);
        
        // Generate a unique file name
        const randomName = `${uuidv4()}-${file.name}`;

        // Define the upload directory and file path
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadDir, randomName);
        const relativeFilePath = `/uploads/${randomName}`; // Relative path to save in the database

        // Ensure the uploads directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
            console.error('Error creating directory:', mkdirError);
            return NextResponse.json({ success: false, error: "Error creating upload directory" });
        }

        // Write the file to the server
        try {
            await writeFile(filePath, buffer);
        } catch (writeError) {
            console.error('Error writing file:', writeError);
            return NextResponse.json({ success: false, error: "Error uploading file" });
        }

        // Update the user's profile picture path in the database
        try {
            const updateResult = await db.collection('user').updateOne(
                { email }, // Filter to find the specific user by email
                { $set: { image: relativeFilePath } } // Set the new image path
            );
            
            if (updateResult.modifiedCount === 0) {
                return NextResponse.json({ success: false, error: "User not found or image path not updated" });
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({ success: false, error: "Database update failed" });
        }

        return NextResponse.json({ response: "File uploaded and path saved successfully", success: true });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'File upload or database update failed' }, { status: 500 });
    }
}
