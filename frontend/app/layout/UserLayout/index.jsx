import React from 'react'
import NavBarComponent from "@/app/Components/Navbar";


function UserLayout({children}) {
  return (
    <div>
       <NavBarComponent/>
        {children}
        
        </div>
  )
}

export default UserLayout