"use client";
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({children}: any) {
  const {user}=useUser();
  const CreateUser=useMutation((api as any).users.CreateNewUser);
  const [userDetail,setUserDetail]=useState<any>();
  
  const CreateNewUser=async()=>{
    if(user){
      try {
        console.log("Creating user with:", user?.fullName, user?.primaryEmailAddress?.emailAddress);
        const result=await CreateUser({
          name:user?.fullName?? "",
          email:user?.primaryEmailAddress?.emailAddress?? "",
          imageUrl:user?.imageUrl?? ""
        });
        console.log("User created successfully:", result);
        setUserDetail(result);
        localStorage.setItem('userDetail', JSON.stringify(result));
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }

  // Load user from localStorage on mount
  useEffect(()=>{
    const saved = localStorage.getItem('userDetail');
    if (saved) {
      try {
        setUserDetail(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved user detail:", e);
      }
    }
  },[])

  useEffect(()=>{
    if(user) {
      CreateNewUser();
    }
  },[user])
  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider
