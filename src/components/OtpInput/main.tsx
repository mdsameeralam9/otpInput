import React, { useEffect } from "react";
import "./main.css";

interface OtpInputProps {
  inputLength: number;
  inputType: string;
  inputStyle: React.CSSProperties;
  inputClass: string;
  namePrefix: string; // Changed to namePrefix to avoid collision
  showResendButton: boolean;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({
  showResendButton,
  inputLength,
  inputType,
  inputStyle,
  inputClass,
  namePrefix = "otpInput", // Changed to namePrefix with default value
  onComplete,
}) => {
  const [otp, setOtp] = React.useState(Array(inputLength).fill(""));
  const [isTimerStart, setIsTimerStart] = React.useState(false);
  const inputRef = React.useRef<(HTMLInputElement | null)[]>(Array(inputLength).fill(null));

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const changeInputFocus = (value: string, index: number) => {
    if (value && index < inputLength - 1) {
      inputRef.current[index + 1]?.focus();
    } else if (index > 0 && value.length === 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newOtp = [...otp];
    
    // Validate that the input is a digit
    if (/^\d$/.test(value)) {
      newOtp[index] = value;
    } else if (value.length === 0) {
      newOtp[index] = "";
    }
    
    changeInputFocus(value, index);
    setOtp(newOtp);

    // Check if OTP is complete
    if (newOtp.every(item => item !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <>
      <div className="Otpwrapper">
        {otp.map((item, index) => (
          <input
            key={index}
            name={`${namePrefix}-${index}`} // Unique name for each input
            value={item}
            onChange={(e) => handleOnChange(e, index)}
            type={inputType}
            style={inputStyle}
            className={`_input ${inputClass}`}
            ref={(input) => (inputRef.current[index] = input)}
          />
        ))}
      </div>

      {showResendButton && (
        <ResendOtp
          isTimerStart={isTimerStart}
          setIsTimerStart={setIsTimerStart}
        />
      )}
    </>
  );
};

export default OtpInput;

export const ResendOtp = ({ style = {}, isTimerStart, setIsTimerStart }: { style: React.CSSProperties, isTimerStart: boolean, setIsTimerStart: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="resendOtpwrapper" style={style}>
      <Timer isTimerStart={isTimerStart} setIsTimerStart={setIsTimerStart} />
      <ResendButton isTimerStart={isTimerStart} setIsTimerStart={setIsTimerStart} />
    </div>
  );
};

const Timer = ({ setIsTimerStart, isTimerStart }: { setIsTimerStart: React.Dispatch<React.SetStateAction<boolean>>, isTimerStart: boolean }) => {
  const [time, setTime] = React.useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerStart) {
      timer = setTimeout(() => {
        if (time > 0) {
          setTime(time - 1);
        } else {
          setIsTimerStart(false); // Stop the timer when it reaches 0
        }
      }, 1000);
    } else {
      setTime(60); // Reset the timer when it stops
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerStart, time]);

  return (
    <div className="timer">
      <span>00:{time.toString().padStart(2, '0')}</span> {/* Ensure time is always two digits */}
    </div>
  );
};

const ResendButton = ({ setIsTimerStart, isTimerStart }: { setIsTimerStart: React.Dispatch<React.SetStateAction<boolean>>, isTimerStart: boolean }) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#0077B6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  };

  return (
    <div className="resendButtonWrapper"> {/* Changed class name to avoid collision */}
      <button
        onClick={() => {
          setIsTimerStart(true); // Start the timer
        }}
        className="resendBtn"
        type="button"
        style={buttonStyle}
        disabled={isTimerStart} // Disable the button when the timer is running
      >
        Resend OTP
      </button>
    </div>
  );
};
