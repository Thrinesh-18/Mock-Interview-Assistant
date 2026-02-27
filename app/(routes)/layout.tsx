import React from 'react'
import AppHeader from './_components/AppHeader'

function DashBoardLayout({children}:any) {
  return (
    <div>
      <AppHeader />
      {children}</div>
  )
}

export default DashBoardLayout