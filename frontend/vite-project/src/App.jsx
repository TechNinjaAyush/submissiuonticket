import { useState } from 'react'
import {Routes,Route} from "react-router-dom";
import StudentRegister from './Auth/StudentRegister';
import Home from './components/Home';
function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/studregister" element={<StudentRegister />}  />
     </Routes>
    </>
  )
}

export default App
