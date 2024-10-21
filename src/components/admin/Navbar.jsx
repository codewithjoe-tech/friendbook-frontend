import React from 'react'
import { NavLink } from 'react-router-dom'
import { ModeToggle } from '../common/ThemeDrop'

const Navbar = () => {
  return (
    <>
      <section className='navbar w-[80%] mx-auto h-20'>
        <nav className="w-full h-full flex justify-between items-center">
          <div className="logo">
            <h1 className="text-2xl">Admin Panel</h1>
          </div>
          <div className="nav-links w-[25%] hidden md:block">
            <ul className="flex justify-around items-center">
              <li>
                <NavLink
                  to={'/admin/home'}
                  className={({ isActive }) =>
                    isActive ? 'border-b-2 border-blue-500' : ''
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/admin/staffs'}
                  className={({ isActive }) =>
                    isActive ? 'border-b-2 border-blue-500' : ''
                  }
                >
                  Staffs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/admin/reported'}
                  className={({ isActive }) =>
                    isActive ? 'border-b-2 border-blue-500' : ''
                  }
                >
                  Reported
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="theme items-center">
            <ModeToggle border={true} />
          </div>
        </nav>
      </section>
    </>
  )
}

export default Navbar
