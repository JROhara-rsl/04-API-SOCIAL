import React from 'react'
import { Outlet } from 'react-router'
import Header from './header/Header'

const Layout = () => {
  return (
    <main>
        <Header />
        <Outlet />
    </main>
  )
}

export default Layout