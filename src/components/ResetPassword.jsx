import React, { useState, useEffect, useRef } from "react";
//  ************Priyanka Pal*************

const ResetPassword = () => {
  const [hrmsCode, setHrmsCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldpassword, setOldpassword] = useState("");

  // const [captcha, setCaptcha] = useState("");
  //  const [captchaInput, setCaptchaInput] = useState("");

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  //   // Generate captcha
  //   const generateCaptcha = () => {
  //     setCaptcha(Math.random().toString(36).substring(2, 7).toUpperCase());
  //   };

  //   useEffect(() => {
  //     generateCaptcha();
  //   }, []);

  const validate = () => {
    //alert("alert :"+oldpassword);
    let newErrors = {};
    //let newErrors1 = {};

    // HRMS Code Validation
    // if (!hrmsCode) {
    //   newErrors.hrmsCode = "HRMS Code is required.";
    // } else if (!/^[0-9]+$/.test(hrmsCode)) {
    //   newErrors.hrmsCode = "HRMS Code must contain only numbers.";
    // }

    // Old Password Validation
    // if (!oldpassword) {
    //   // alert("alert :"+oldpassword);
    //    alert( "Password is required.");
    //    return;
    // } else {

    //   if (oldpassword.length < 8) {
    //     // alert("alert :"+oldpassword.length);
    //     alert( "Password must be at least 8 characters.");
    //      return;
    //   }
    //   if (!/[A-Z]/.test(oldpassword)) {
    //      alert( "Must contain at least one uppercase letter.");
    //       return;
    //   }
    //   if (!/[a-z]/.test(oldpassword)) {
    //     ("Must contain at least one lowercase letter.");
    //      return;
    //   }
    //   if (!/[0-9]/.test(oldpassword)) {
    //      alert( "Must contain at least one number.");
    //       return;
    //   }
    //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(oldpassword)) {
    //      alert( "Must contain one special character.");
    //       return;
    //   }
    // }



    // Password Validation
    if (!password) {
      alert("New Password is required.");
      passwordRef.current.focus();
      return false;
    } else {
      if (password.length < 8) {
        alert("New Password must be at least 8 characters.");
        passwordRef.current.focus();
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        alert("New Password Must contain at least one uppercase letter.");
        passwordRef.current.focus();
        return false;
      }
      if (!/[a-z]/.test(password)) {
        alert("New Password Must contain at least one lowercase letter.");
        passwordRef.current.focus();
        return false;
      }
      if (!/[0-9]/.test(password)) {
        alert("New Password Must contain at least one number.");
        passwordRef.current.focus();
        return false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        alert("New Password Must contain one special character.");
        passwordRef.current.focus();
        return false;
      }
    }

    // Confirm Password
    if (!confirmPassword) {
      alert("Confirm Password is required.");
      confirmPasswordRef.current.focus();
      return false;
    } else if (confirmPassword !== password) {
      alert("Confirm Password do not match.");
      confirmPasswordRef.current.focus();
      return false;
    }
    return true;
  }

  //     // Captcha
  //     if (!captchaInput) {
  //       newErrors.captcha = "Captcha is required.";
  //     } else if (captchaInput !== captcha) {
  //       newErrors.captcha = "Captcha does not match.";
  //     }

  //     setErrors(newErrors);

  //     return Object.keys(newErrors).length === 0; // valid if no errors
  //   };

  const handleSubmit = (e) => {
    //   alert("hi");
    e.preventDefault();
    setSuccess("");
    

    if (validate() === true) {

      // API CALL placeholder
      setSuccess("Password successfully reset!");
      setPassword("");
      setConfirmPassword("");
      setOldpassword("");

    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>

        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>

          {/* HRMS CODE */}
          {/* <label>HRMS Code</label>
          <input
            type="text"
            value={hrmsCode}
            onChange={(e) => setHrmsCode(e.target.value)}
            style={styles.input}
            placeholder="Enter HRMS Code"
          />
          {errors.hrmsCode && <div style={styles.error}>{errors.hrmsCode}</div>} */}

          {/* OLD PASSWORD */}
          <label>Old Password</label>
          <input
            type="password"
            value={oldpassword}
            onChange={(e) => setOldpassword(e.target.value)}
            style={styles.input}
            placeholder="Enter old password"
            required
          />
          {errors.oldpassword && <div style={styles.error}>{errors.oldpassword}</div>}

          {/* NEW PASSWORD */}
          <label>New Password</label>
          <input
            type="password"
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter new password"
            required
          />
          {errors.password && <div style={styles.error}>{errors.password}</div>}

          {/* CONFIRM PASSWORD */}
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            ref={confirmPasswordRef}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            placeholder="Confirm password"
            required
          />
          {errors.confirmPassword && (
            <div style={styles.error}>{errors.confirmPassword}</div>
          )}

          {/* CAPTCHA */}
          {/* <div style={styles.captchaBox}>
            <span style={styles.captchaText}>{captcha}</span>
             <button type="button" onClick={generateCaptcha} style={styles.refreshBtn}>
               <i className="fa fa-sync"></i>
            </button>
           </div>
          <input 
//             type="text"
//             style={styles.input}
//             placeholder="Enter captcha"
//             value={captchaInput}
//             onChange={(e) => setCaptchaInput(e.target.value)}
//           />
//           {errors.captcha && <div style={styles.error}>{errors.captcha}</div>}*/}

          <button type="submit" style={styles.btn}>
            <i className="fa fa-key"></i> Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f2f6",
  },
  card: {
    width: "380px",
    padding: "25px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  captchaBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  captchaText: {
    fontSize: "22px",
    padding: "8px 14px",
    background: "#eee",
    borderRadius: "6px",
    fontWeight: "bold",
    letterSpacing: "3px",
  },
  refreshBtn: {
    marginLeft: "8px",
    padding: "8px 10px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "16px",
  },
  error: {
    background: "#ffdddd",
    padding: "8px",
    borderRadius: "6px",
    color: "#cc0000",
    marginBottom: "8px",
    fontSize: "14px",
  },
  success: {
    background: "#ddffdd",
    padding: "10px",
    borderRadius: "6px",
    color: "#008000",
    marginBottom: "10px",
  },
  //   profileBg : {
  // //   min-height: 100vh;
  //   background: linear-gradient("180deg", "#002147 0%", "#004b8d 40%", "#f8f9fa 100%"),
  // //   background-attachment: fixed;
  // //   padding-bottom: 60px;
  //  },
};
//  }
export default ResetPassword;
