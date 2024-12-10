import { useState } from 'react'
import OtpInput from './components/OtpInput/main'

function App() {
  const [isOptInput, setIsOptInput] = useState(false)

  return (
   <OtpInput 
     inputLength={6}
     inputType="text"
     inputStyle={{width: '20px', height: '20px', fontSize: '15px', padding: '10px', textAlign: 'center'}}
     inputClass="otp-input"
   />
  )
}

export default App
