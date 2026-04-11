import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { sign } from 'crypto'

function Header() {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Image src="/IntervueX.png" alt="logo" width={60} height={60} />
       <h1 className="text-base font-bold md:text-3xl text-gray-900">
  Intervue<span className="text-blue-700">X</span>
</h1>
      </div>
      <Link href={"/dashboard"}>
        <Button size={'lg'}>Get Started</Button>
      </Link>
    </nav>
  )
}

export default Header;