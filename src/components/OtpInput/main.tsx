import React, { useEffect } from 'react';
import './main.css';

interface OtpInputProps {
  inputLength: number;  
  inputType: string;
  inputStyle: React.CSSProperties;
  inputClass: string;
  name: string;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ inputLength,inputType,inputStyle,inputClass, name="otpInput", onComplete  }) => {
  const [otp, setOtp] = React.useState(Array(inputLength).fill(''));
  const inputRef = React.useRef<(HTMLInputElement | null)[]>(Array(inputLength).fill(null));

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const changeInputFocus = (value: string, index: number) => {
    if(value && index < inputLength-1){
      inputRef.current[index+1]?.focus();
    }
     else if(index > 0 && !value) {
      inputRef.current[index-1]?.focus();
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    changeInputFocus(value, index);
    setOtp(newOtp);
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpStr = otp.join('');
    onComplete(otpStr);
  }


  return (
    <>
      <div className='Otpwrapper'>
      {otp.map((item, index) => (
        <input 
          key={index} 
          name={name} 
          value={item} 
          onChange={(e) => handleOnChange(e, index)}
          type={inputType} 
          style={inputStyle} 
          className={inputClass} 
          ref={(input) => (inputRef.current[index] = input)}
          />
      ))}
    </div>
      <button type="submit" className='submitBtn' onClick={onSubmit}>Submit</button>
    </>
  
  )
}

export default OtpInput;