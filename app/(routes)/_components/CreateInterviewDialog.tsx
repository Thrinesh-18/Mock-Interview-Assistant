import React, { useContext, useState } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import JobDescription from './JobDescription'
import ResumeUpload from './ResumeUpload'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
function CreateInterviewDialog() {

  const [formData,setFormData] = useState<any>();
  const [file,setFiles] = useState<File|null>();
  const [loading,setLoading] = useState(false);
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const saveInterviewQuestion = useMutation(api.Interview.SaveInterviewQuestions);

const onHandleInputChange = (field:string,value:string) => {
  setFormData((prev:any) => ({
    ...prev,
    [field]:value
  }))
}


const onSubmit = async () => {
    setLoading(true);

    const formData_= new FormData();
    formData_.append("file", file??"");
    formData_.append("jobTitle", formData.jobTitle);
    formData_.append("jobDescription", formData.jobDescription);

    try {
      const res = await axios.post("/api/generate-interview-questions", formData_);
      console.log(res.data);
      //Save to Database
      //@ts-ignore
      const resp=await saveInterviewQuestion({
        questions:res.data,
        resumeUrl:res.data.resumeUrl ?? null,
        uid:userDetail?._id,
        jobTitle:formData.jobTitle ?? null,
        jobDescription:formData.jobDescription ?? null
      });
    } catch (e) {
      console.error("upload failed", e);
    } finally {
      setLoading(false);
    }
  }


  return (
    <Dialog>
      <DialogTrigger>
        <Button>+ Create Interview</Button>
      </DialogTrigger>
      <DialogContent className='min-w-3xl'>
        <DialogHeader>
          <DialogTitle>Please submit the following details</DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="account" className="w-full mt-5">
              <TabsList>
                <TabsTrigger value="resume-upload">Resume Upload</TabsTrigger>
                <TabsTrigger value="job-description">Job Description</TabsTrigger>
              </TabsList>
              <TabsContent value="resume-upload"><ResumeUpload setFiles={(file:File)=>setFiles(file)}/></TabsContent>
              <TabsContent value="job-description"><JobDescription onHandleInputChange={onHandleInputChange}  /></TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex gap-6'>
          <DialogClose>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={loading || !formData?.jobTitle || !formData?.jobDescription}>
            {loading&& <Loader2Icon className='animate-spin mr-2' />}
            Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateInterviewDialog