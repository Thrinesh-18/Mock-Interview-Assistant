"use client";
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MenuOptions = [
  {
    name:"Dashboard",
    path:"/dashboard"
  },
  {
    name:"Upgrade", 
    path:"/upgrade"
  },
  {
    name:"How it works",
    path:"/how-it-works"
  },
]


function AppHeader() {
  return (
     <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        {/* <h1 className="text-base font-bold md:text-2xl">Mock Interview Assistant</h1> */}
      </div>
      <div>
        <ul className="flex items-center gap-5">
        {MenuOptions.map((option,index)=>(
          <li key={option.path ?? index} className='text-lg'>
            <Link href={option.path}>
              <span className='block px-2 hover:scale-105 transition-all cursor-pointer'>
                {option.name}
              </span>
            </Link>
          </li>
        ))}
        </ul>
      </div>
      <UserButton/>
    </nav>
  )
}

export default AppHeader