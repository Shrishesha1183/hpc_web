// Don't use the Node.js SDK in browser code
// import { v2 as cloudinary } from 'cloudinary';
// 
// cloudinary.config({
// 	cloud_name: "dwylpovis",
// 	api_key: "637121691823265",
// 	api_secret: "oOorJqDT1ssvGdknK7CXkHbWckc"
// });

// Store your cloud name as a constant
const CLOUDINARY_CLOUD_NAME = "dwylpovis";
const CLOUDINARY_UPLOAD_PRESET = "college_dept";

export const uploadImage = async (file: File): Promise<string> => {
	try {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: 'POST',
				body: formData
			}
		);

		if (!response.ok) {
			throw new Error('Image upload failed');
		}

		const data = await response.json();
		return data.secure_url;
	} catch (error) {
		console.error('Error uploading image:', error);
		throw error;
	}
};