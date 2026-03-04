import { NextRequest } from "next/server";
import ImageKit from "imagekit";
import { Webhook } from "lucide-react";
import { a } from "motion/react-client";
import axios from "axios";


var imagekit = new ImageKit({
    publicKey : "public_QLXD9UQad/1vCcMjRvB7pq/Azds=",
    privateKey : "private_f28o6W8wkhaORCXWkiXcZaKHVbg=",
    urlEndpoint : "https://ik.imagekit.io/your_imagekit_id/"
});
export async function POST(request: NextRequest) {
    try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as File;
    const jobDescription = formData.get("jobDescription") as File;
if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: file.name,
            isPublished: true
        });
        const result=await axios.post("http://localhost:5678/webhook/resume-interview-question",{
            resumeUrl:uploadResponse.url
        });
        console.log(result.data);

        return new Response(JSON.stringify({ questions: result.data ,
            resumeUrl:uploadResponse.url
        }), { status: 200 });
    }
    else{
        // Call n8n Webhook

        const result=await axios.post("http://localhost:5678/webhook/resume-interview-question",{
            resumeUrl:null,
            jobTitle:jobTitle,
            jobDescription:jobDescription
        });
        console.log(result.data);

        return new Response(JSON.stringify({ questions: result.data ,
            resumeUrl:null
        }), { status: 200 });
    }

        
    } catch (e) {
        console.error("Error uploading file:", e);
        // return a response so we don't fall through to undefined
        return new Response("Upload failed", { status: 500 });
    }
}
