import React from 'react'
import { Link } from 'react-router-dom'


function NavBar() {
  return (
    <div>



        <h1>Header</h1>
        <Link to="/note">Go to Note Page</Link> <br /><br />
        <hr class="border-blue-300"></hr>
      

    </div>
  )
}

export default NavBar
