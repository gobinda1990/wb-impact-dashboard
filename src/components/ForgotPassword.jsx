import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [hrmsCode, setHrmsCode] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    

    // Refs for auto-focus
    const hrmsRef = useRef(null);
    const pwdRef = useRef(null);
    const cpwdRef = useRef(null);
    const qsRef = useRef(null);
    const ansRef = useRef(null);

    const validate = () => {
        let newErrors = {};

        // HRMS Code Validation
        if (!hrmsCode) {
            alert("HRMS Code is required.");
            hrmsRef.current.focus();
        } else if (!/^[0-9]+$/.test(hrmsCode)) {
            alert("HRMS Code must contain only numbers.");
            hrmsRef.current.focus();
        } else if (hrmsCode.length !== 10) {
            alert("HRMS Code must be exactly 10 digits.");
            hrmsRef.current.focus();
        }

        // Security Question
        if (!question) {
            alert("Please select a security question.");
        }

        // Security Answer
        // if (!answer) {
        //     alert( "Security answer is required.");
        //     ansRef.current.focus();
        //      return false;
        // }

        // Password Validation
        if (!password) {
            alert("Password is required.");
            pwdRef.current.focus();
            return false;
        } else {
            if (password.length < 8) {
                alert("Password must be at least 8 characters.");
                pwdRef.current.focus();
                return false;
            }
            else if (!/[A-Z]/.test(password)) {
                alert("Must contain at least one uppercase letter.");
                pwdRef.current.focus();
                return false;
            }
            else if (!/[a-z]/.test(password)) {
                alert("Must contain at least one lowercase letter.");
                pwdRef.current.focus();
                return false;
            }
            else if (!/[0-9]/.test(password)) {
                // alert( "Must contain at least one number.";
                alert("Must contain at least one number.");
                pwdRef.current.focus();
                return false;
            }
            else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
                alert("Must contain one special character.");
                pwdRef.current.focus();
                return false;
            }

            //  if (newErrors.password) pwdRef.current.focus();
        }

        // Confirm Password Validation
        if (!confirmPassword) {
            alert("Confirm Password is required.");
            cpwdRef.current.focus();
            return false;
        } else if (confirmPassword !== password) {
            alert("Confirm Password do not match with Password.");
            cpwdRef.current.focus();
            return false;
        }

        // setErrors(newErrors);

        //return Object.keys(newErrors).length === 0;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            alert("Password reset successfully!");
             setMessage("✅Password reset successfully!");
            // API call here
            setHrmsCode("");
            setQuestion("");
            setAnswer("");
            setPassword("");
            setConfirmPassword("");
        }
    };

    return (
        // <div style={styles.container}>
        <div
            className="d-flex justify-content-center align-items-center bg-light"
            style={{
                height: "100vh",
                backgroundImage: `url("/images/ctd2.png")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div style={styles.card}>
                {message && <h6>{message}</h6>}
                <h3 style={{ textAlign: "center" }}>Forgot Password</h3>
 
                <form onSubmit={handleSubmit}>

                    {/* HRMS CODE */}
                    <label>HRMS Code</label>
                    <input
                        type="text"
                        value={hrmsCode}
                        ref={hrmsRef}
                        maxLength="10"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9]*$/.test(value)) setHrmsCode(value);
                        }}
                        style={styles.input}
                        placeholder="Enter 10-digit HRMS Code"
                        required
                    />
                    {errors.hrmsCode && <div style={styles.error}>{errors.hrmsCode}</div>}

                    {/* SECURITY QUESTION */}
                    <label>Security Question</label>
                    <select
                        style={styles.input}
                        value={question}
                        ref={qsRef}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    >
                        <option value="">-- Select Question --</option>
                        <option value="Q1">What is your favorite food?</option>
                        <option value="Q2">What is your birth city?</option>
                        <option value="Q3">What is your first school name?</option>
                        <option value="Q4">What is your pet name?</option>
                        <option value="Q5">What is your nickname?</option>

                    </select>
                    {errors.question && <div style={styles.error}>{errors.question}</div>}

                    {/* SECURITY ANSWER */}
                    <label>Security Answer</label>
                    <input
                        type="text"
                        value={answer}
                        ref={ansRef}
                        onChange={(e) => setAnswer(e.target.value)}
                        style={styles.input}
                        placeholder="Enter answer"
                        required
                    />
                    {errors.answer && <div style={styles.error}>{errors.answer}</div>}

                    {/* PASSWORD */}
                    <label>New Password</label>
                    <input
                        type="password"
                        value={password}
                        ref={pwdRef}
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
                        ref={cpwdRef}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        placeholder="Confirm password"
                        required
                    />
                    {errors.confirmPassword && (
                        <div style={styles.error}>{errors.confirmPassword}</div>
                    )}

                    {/* SUBMIT */}
                    <button type="submit" style={styles.btn}>Reset Password</button>
                    <div style={styles.successWrapper}>
                        {/* <span>Reset Password? </span> */}

                        <span
                            style={styles.loginLink}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </div>

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
        background: "#f0f2f5",
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
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    btn: {
        width: "100%",
        padding: "12px",
        background: "#007bff",
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
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    successWrapper: {
        marginTop: "15px",
        textAlign: "center",
        fontSize: "14px",
        color: "#333",
    },
    loginLink: {
        color: "#007bff",
        marginLeft: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        textDecoration: "underline",
    },
};

export default ForgotPassword;
