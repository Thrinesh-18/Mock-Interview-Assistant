import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { Webhook } from "lucide-react";
import { a } from "motion/react-client";
import axios from "axios";
import { aj } from "@/utils/arcjet";
import { auth, currentUser } from "@clerk/nextjs/server";


var imagekit = new ImageKit({
    publicKey : "public_QLXD9UQad/1vCcMjRvB7pq/Azds=",
    privateKey : "private_f28o6W8wkhaORCXWkiXcZaKHVbg=",
    urlEndpoint : "https://ik.imagekit.io/your_imagekit_id/"
});
export async function POST(request: NextRequest) {
    try {
    const user=await currentUser();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as File;
    const jobDescription = formData.get("jobDescription") as File;
    const {has}=await auth();
    const decision = await aj.protect(request, { userId:user?.primaryEmailAddress?.emailAddress?? "", requested: 5 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);
    const isSubscribedUser=has({ plan: 'pro' });

    
//@ts-ignore
    if(decision.reason.remaining==0&&!isSubscribedUser){
        return NextResponse.json({
            status:429,
            result:"You have exceeded the maximum number of requests. Please try again after 24 hours."
         })
        }


if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: file.name,
            isPublished: true
        });
        const result=await axios.post("https://n8n-production-2a44.up.railway.app/webhook/resume-interview-question",{
            resumeUrl:uploadResponse.url
        });
        console.log(result.data);

        return new Response(JSON.stringify({ questions: result.data ,
            resumeUrl:uploadResponse.url
        }), { status: 200 });
    }
    else{
        // Call n8n Webhook

        const result=await axios.post("https://n8n-production-2a44.up.railway.app/webhook/resume-interview-question",{
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
