import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Upgrade() {
  return (
     <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}
     className='flex flex-col items-center justify-between'>
      <h1 className='text-4xl text-center font-bold mt-24'>Simple pricing for advanced people</h1>
        <p className='text-center text-lg text-gray-600 mt-4'>Unlock the full potential of our AI Interview Assistant with our Pro Plan. Experience unlimited access to personalized interview questions, in-depth feedback, and priority support to help you ace your next interview.</p>
      <h2 className='text-3xl font-bold mt-10 mb-10'>Upgrade to Pro Plan</h2>
      <PricingTable />
    </div>
  )
}

export default Upgrade