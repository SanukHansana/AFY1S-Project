//frontend/src/pages/HomePage.jsx
import React from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import NavBar from '../Components/NavBar'
import Footer from '../Components/Footer'



function HomePage() {

  const showAlert = () => {
  Swal.fire({
      title: 'Success!',
      text: 'You clicked the button',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }




  return (
    <div>
      <div>
        <NavBar />
      </div>

      <h1 className="text-red-500 p-4">Home Page</h1>
      <button onClick={() => toast.error("Congrats")}>Clickme</button> <br /><br />
      
      <button onClick={showAlert}>Show Alert</button>


      <div>
        <Footer />
      </div>

    </div>
  )
}

export default HomePage
