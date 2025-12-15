
// import { useState, useEffect, useRef } from "react";

// import { authClient, dashboardClient } from "../services/apiClient";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaUser, FaLock, FaSyncAlt } from "react-icons/fa";


// export default function SignupUser() {

//   /**
//    * @typedef {Object} Designation
//    * @property {string} desig_cd
//    * @property {string} designation
//    */

//   const [designation, setDesignations] = useState([]);
//   const navigate = useNavigate();
//   const [captcha, setCaptcha] = useState("");
//   const [userCaptcha, setUserCaptcha] = useState("");
//   const [captchaError, setCaptchaError] = useState("");
//    const canvasRef = useRef(null);
//    const [captchaInput, setCaptchaInput] = useState("");


//   const [formData, setFormData] = useState({
//     hrms_code: "",
//     usr_ID: "",
//     full_name: "",
//     gender: "",
//     email: "",
//     phone_no: "",
//     //  usr_level_cd: "",
//     desig_cd: "",
//     gpf_no: "",
//     dt_of_join: "",
//     dt_of_birth: "",
//     pan_no: "",

//     passwd: "",
//     repasswd: "",
//     hint_qs_cd: "",
//     hint_ans: "",
//   });

//   useEffect(() => {


//     fetchDesig();
//     generateCaptcha(); // generate captcha initially
//   }, []);

//   const fetchDesig = async () => {
//     try {

//       const response2 = await dashboardClient.get("/auth/designation_details");

//       setDesignations(response2.data.data);
//       console.log("Designation Data:", response2.data.data);
//     } catch (err) {
//       console.error("Error fetching desig:", err.message);
//     }
//   };


//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const showDatePicker = () => {
//     const input = document.getElementsByName("dt_of_join")[0];
//     input.type = "date";
//     input.max = new Date().toISOString().split("T")[0];
//   };

//   const showBirthDatePicker = () => {
//     const input = document.getElementsByName("dt_of_birth")[0];
//     input.type = "date";
//     input.max = new Date().toISOString().split("T")[0];
//   };
//   // const generateCaptcha = () => {
//   //   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   //   let result = "";
//   //   for (let i = 0; i < 5; i++) {
//   //     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   //   }
//   //   setCaptcha(result);
//   // };
//   const generateCaptcha = () => {
//     const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
//     setCaptcha(newCaptcha);
//    // setCaptcha(result);

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.font = "bold 26px 'Roboto'";
//     ctx.fillStyle = "#333";
//     ctx.fillText(newCaptcha, 20, 30);

//     // Add random noise lines
//     for (let i = 0; i < 3; i++) {
//       ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
//       ctx.beginPath();
//       ctx.moveTo(Math.random() * 150, Math.random() * 40);
//       ctx.lineTo(Math.random() * 150, Math.random() * 40);
//       ctx.stroke();
//     }
//   };

//   const handleSubmit = async e => {

//     e.preventDefault();
//    // if (userCaptcha !== captcha) {
//    //alert(canvasRef.value);
//    //alert("yyy"+captcha)
//    if(captchaInput!=captcha){
//       setCaptchaError("CAPTCHA does not match");
//       generateCaptcha(); // refresh captcha
//       // setUserCaptcha("");
//       setCaptchaInput("");
//       return;
//     } else {
//       setCaptchaError("");
//     }
//     console.log(formData);


//     //     if(formData.hrms_code=="" || formData.hrms_code.length==0){
//     alert("in submit");

//     //     }

//     try {
//       const response = await axios.post(
//         "http://10.153.36.161:8082/api/auth/signup", formData,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (response.status === 201) {

//         alert("Signup Successful");
//         console.log(response.data.data);
//         navigate("/");

//       }
//     } catch (error) {
//       console.error(error);

//     }
//   };

//   return (
//     <>

//       <div className="signup-container" style={{
//         // height: "100vh",
//         backgroundImage: `url("/images/ctd2.png")`,
//         backgroundSize: "cover",
//         backgroundPosition: "relative",
//         backgroundRepeat: "no-repeat", padding: "0px"
//       }} >
//         <br /><br />
//         <form onSubmit={handleSubmit}>
//           <div className="card signup-card animate__fadeIn" style={{ margin: "auto", width: "60%", borderStyle: "none" }}>
//             <br />
//             <h3 className="text-center mb-4 signup-title" >Sign Up for New User</h3>
//             <span style={{ margin: "auto" }}><img src="/images/bangla.png" style={{ width: "150px", height: "150px" }} /></span>
//             <div className="row" style={{ margin: "auto", padding: "50px" }}>

//               {/* HRMS Code */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">HRMS Code</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="text" maxLength={10}
//                   className="form-control"
//                   value={formData.hrms_code}
//                   onChange={(e) => handleChange("hrms_code", e.target.value)}
//                   required
//                 />
//               </div>

//               {/* User ID */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">User ID</label><span style={{ color: "red" }}>*</span>
//                 <input style={{}}
//                   type="text" readOnly
//                   className="form-control"
//                   value={formData.hrms_code}
//                   onChange={(e) => handleChange("hrms_code", e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Full Name */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Full Name</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={formData.full_name}
//                   onChange={(e) => handleChange("full_name", e.target.value)}
//                   required
//                 />
//               </div>
//               {/* Gender */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Gender</label><span style={{ color: "red" }}>*</span>
//                 <select
//                   className="form-select"
//                   value={formData.gender}
//                   onChange={(e) => handleChange("gender", e.target.value)}
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="M">Male</option>
//                   <option value="F">Female</option>
//                   <option value="O">Others</option>
//                 </select>
//               </div>

//               {/* Email */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Email</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="email"
//                   className="form-control"
//                   value={formData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Phone */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Phone Number</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="text" maxLength={10}
//                   className="form-control"
//                   value={formData.phone_no}
//                   onChange={(e) => handleChange("phone_no", e.target.value)}
//                   required
//                   pattern="\d{10}"
//                   title="Phone number must be exactly 10 digits"
//                 />
//               </div>

//               {/* User Level */}
//               {/* <div className="col-md-6 mb-3">
//           <label className="form-label">User Level</label>
//           <select
//             className="form-select"
//             value={formData.usr_level_cd}
//             onChange={(e) => handleChange("usr_level_cd", e.target.value)}
//             required
//           >
//             <option value="">Select User Level</option>
//             <option value="R1">Super Admin</option>
//             <option value="R2">Circle Approver</option>
//             <option value="R3">Charge Approver</option>
//             <option value="R4">Office Approver</option>
//             <option value="R5">User</option>
//           </select>
//         </div> */}

//               {/* Designation */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Designation</label><span style={{ color: "red" }}>*</span>
//                 <select
//                   className="form-select"
//                   value={formData.desig_cd}
//                   onChange={(e) => handleChange("desig_cd", e.target.value)}
//                   required
//                 >
//                   <option value="">Select Designation</option>

//                   {designation.map((d) => (
//                     <option key={d.desig_cd} value={d.desig_cd}>
//                       {d.designation}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* BO ID */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">BO ID</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={formData.bo_id}
//                   onChange={(e) => handleChange("bo_id", e.target.value)}
//                 />
//               </div>


//               {/* GPF */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">GPF Number</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={formData.gpf_no}
//                   onChange={(e) => handleChange("gpf_no", e.target.value)}
//                 />
//               </div>
//               {/* PAN */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">PAN Number</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="text" maxLength={10}
//                   className="form-control"
//                   value={formData.pan_no}
//                   onChange={(e) => handleChange("pan_no", e.target.value.toUpperCase())}
//                   required
//                   pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
//                   title="Enter valid PAN (e.g., ABCDE1234F)"
//                 />
//               </div>

//               {/* Date of Joining */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Date of Joining</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   name="dt_of_join"
//                   type="text"
//                   className="form-control"
//                   placeholder="Select Date of Joining"
//                   value={formData.dt_of_join}
//                   onFocus={showDatePicker}   // 👈 CALLING HERE
//                   onChange={(e) => handleChange("dt_of_join", e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Date of Joining */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Date of Birth</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   name="dt_of_birth"
//                   type="text"
//                   className="form-control"
//                   placeholder="Select Date of Birth"
//                   value={formData.dt_of_birth}
//                   onFocus={showBirthDatePicker}   // 👈 call function
//                   onChange={(e) => handleChange("dt_of_birth", e.target.value)}
//                   required
//                 />
//               </div>




//               {/* Password */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Password</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="password"
//                   className="form-control"
//                   value={formData.passwd}
//                   onChange={(e) => handleChange("passwd", e.target.value)}
//                   required
//                   pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$"
//                   title="Password must be at least 8 characters, include 1 uppercase letter and 1 special character"
//                 />
//               </div>

//               {/* RePassword */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Confirm Password</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="password"
//                   className="form-control"
//                   value={formData.repasswd}
//                   onChange={(e) => handleChange("repasswd", e.target.value)}
//                   required
//                 />
//                 {/* Error message */}
//                 {formData.repasswd &&
//                   formData.passwd !== formData.repasswd && (
//                     <small style={{ color: "red" }}>Passwords do not match</small>
//                   )}
//               </div>


//               {/* Hint Question */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Hint Question</label><span style={{ color: "red" }}>*</span>
//                 <select
//                   className="form-select"
//                   value={formData.hint_qs_cd}
//                   onChange={(e) => handleChange("hint_qs_cd", e.target.value)}
//                   required
//                 >
//                   <option value="">Select Question</option>
//                   <option value="Q1">What is your favorite food?</option>
//                   <option value="Q2">What is your birth city?</option>
//                   <option value="Q3">What is your first school name?</option>
//                   <option value="Q4">What is your pet name?</option>
//                 </select>
//               </div>

//               {/* Hint Answer */}
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Hint Answer</label><span style={{ color: "red" }}>*</span>
//                 <input
//                   type="text"
//                   className="form-control"

//                   value={formData.hint_ans}
//                   onChange={(e) => handleChange("hint_ans", e.target.value)}
//                   required
//                 />
//               </div>

//             </div>

//             {/* Captcha */}
//             {/* <div style={{ margin: "auto", backgroundColor: "lightgrey", width: "50%", borderRadius: "8px", padding: "10px" }}>
//               <div className="col-md-6 mb-3" style={{ margin: "auto" }}>
//                 <label className="form-label fw-bold">
//                   Enter CAPTCHA <span className="text-danger">*</span>
//                 </label>

//                 <div className="d-flex align-items-center gap-2 mb-2">
//                   <span
//                     className="px-3 py-2 rounded fw-bold"
//                     style={{
//                       backgroundColor: "#f0f0f0",
//                       fontSize: "18px",
//                       letterSpacing: "3px",
//                       border: "1px solid #ccc",
//                       display: "inline-block"
//                     }}
//                   >
//                     {captcha}
//                   </span>

//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary btn-sm"
//                     style={{ padding: "6px 10px" }}
//                     onClick={generateCaptcha}
//                   >
//                     ↻
//                   </button>


//                   <input
//                     type="text"
//                     className="form-control"
//                     style={{ width: "160px", height: "70px" }}
//                     placeholder="Type CAPTCHA here"
//                     value={userCaptcha}
//                     onChange={(e) => setUserCaptcha(e.target.value)}
//                     required
//                   />

//                   {captchaError && (
//                     <small className="text-danger">{captchaError}</small>
//                   )}
//                 </div>
//               </div>
//             </div> */}

//             {/* **************Priyanka Pal********** */}

//              {/* CAPTCHA */}
//                       <div className="mb-3 text-center">
//                         <div className="d-flex justify-content-center align-items-center">
//                         <canvas
//                           ref={canvasRef}
//                           width="150"
//                           height="40"
//                           style={{
//                             border: "1px solid #ccc",
//                             borderRadius: "5px",
//                             marginBottom: "8px",
//                           }}
//                         />
//                          <button
//                             type="button"
//                             className="btn btn-outline-secondary btn-sm d-flex align-items-center"
//                             onClick={generateCaptcha}
//                             title="Refresh CAPTCHA"
//                           >
//                             <FaSyncAlt />
//                           </button>
//                         </div>
//                         <div className="d-flex justify-content-center align-items-center">
//                           <input
//                             type="text"
//                             className="form-control me-2"
//                             placeholder="Enter CAPTCHA"
//                             style={{ width: "23%" }}
//                             value={captchaInput}
//                             onChange={(e) => setCaptchaInput(e.target.value)}
//                             required
//                           />
//                           {captchaError && (
//                     <small className="text-danger">{captchaError}</small>
//                   )}

//                         </div>
//                       </div>

//             {/* Submit Button */}
//             <button type="submit"

//               className="btn btn-primary signup-btn mt-3"
//               style={{ width: "200px", margin: "auto" }}
//             >
//               Sign Up
//             </button> <br />

//             <div style={{ margin: "auto" }}> Already a User ? <span style={{ color: "blue" }} onClick={() => navigate("/login")}><a href="#" style={{ textDecoration: "none" }}>Login</a></span></div>
//             <br />
//           </div>
//         </form>
//       </div>


//     </>
//   );
// }


import { useState, useEffect, useRef } from "react";

import { authClient, dashboardClient } from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaSyncAlt } from "react-icons/fa";


export default function SignupUser() {

  /**
   * @typedef {Object} Designation
   * @property {string} desig_cd
   * @property {string} designation
   */

  const [designation, setDesignations] = useState([]);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const canvasRef = useRef(null);
  const [captchaInput, setCaptchaInput] = useState("");


  const [formData, setFormData] = useState({
    hrms_code: "",
    usr_ID: "",
    full_name: "",
    gender: "",
    email: "",
    phone_no: "",
    //  usr_level_cd: "",
    desig_cd: "",
    gpf_no: "",
    dt_of_join: "",
    dt_of_birth: "",
    pan_no: "",

    passwd: "",
    repasswd: "",
    hint_qs_cd: "",
    hint_ans: "",
  });

  useEffect(() => {


    fetchDesig();
    generateCaptcha(); // generate captcha initially
  }, []);

  const fetchDesig = async () => {
    try {

      const response2 = await dashboardClient.get("/auth/designation_details");

      setDesignations(response2.data.data);
      console.log("Designation Data:", response2.data.data);
    } catch (err) {
      console.error("Error fetching desig:", err.message);
    }
  };


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const showDatePicker = () => {
    const input = document.getElementsByName("dt_of_join")[0];
    input.type = "date";
    input.max = new Date().toISOString().split("T")[0];
  };

  const showBirthDatePicker = () => {
    const input = document.getElementsByName("dt_of_birth")[0];
    input.type = "date";
    input.max = new Date().toISOString().split("T")[0];
  };
  // const generateCaptcha = () => {
  //   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   let result = "";
  //   for (let i = 0; i < 5; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * characters.length));
  //   }
  //   setCaptcha(result);
  // };
  const generateCaptcha = () => {
    const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(newCaptcha);
    // setCaptcha(result);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 26px 'Roboto'";
    ctx.fillStyle = "#333";
    ctx.fillText(newCaptcha, 20, 30);

    // Add random noise lines
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 150, Math.random() * 40);
      ctx.lineTo(Math.random() * 150, Math.random() * 40);
      ctx.stroke();
    }
  };

  const handleSubmit = async e => {

    e.preventDefault();
    // if (userCaptcha !== captcha) {
    //alert(canvasRef.value);
    //alert("yyy"+captcha)
    if (captchaInput != captcha) {
      setCaptchaError("CAPTCHA does not match");
      generateCaptcha(); // refresh captcha
      // setUserCaptcha("");
      setCaptchaInput("");
      return;
    } else {
      setCaptchaError("");
    }
    console.log(formData);


    //     if(formData.hrms_code=="" || formData.hrms_code.length==0){
    alert("in submit");

    //     }

    try {
      const response = await axios.post(
        "http://10.153.36.161:8082/api/auth/signup", formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {

        alert("Signup Successful");
        console.log(response.data.data);
        navigate("/");

      }
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <>

      <div className="signup-container" style={{
        // height: "100vh",
        backgroundImage: `url("/images/ctd2.png")`,
        backgroundSize: "cover",
        backgroundPosition: "relative",
        backgroundRepeat: "no-repeat", padding: "0px"
      }} >
        <br /><br />
        <form onSubmit={handleSubmit}>
          <div className="card signup-card animate__fadeIn" style={{ margin: "auto", width: "60%", borderStyle: "none" }}>
            <br />
            <h3 className="text-center mb-4 signup-title" >Sign Up for New User</h3>
            <span style={{ margin: "auto" }}><img src="/images/bangla.png" style={{ width: "150px", height: "150px" }} /></span>
            <div className="row" style={{ margin: "auto", padding: "50px" }}>

              {/* HRMS Code */}
              <div className="col-md-6 mb-3">
                <label className="form-label">HRMS Code</label><span style={{ color: "red" }}>*</span>
                <input
                  type="text" maxLength={10}
                  className="form-control"
                  value={formData.hrms_code}
                  // onChange={(e) => handleChange("hrms_code", e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Allow only numeric input (0–9)
                    if (/^\d*$/.test(value)) {
                      handleChange("hrms_code", value);
                    }
                  }}
                  required
                />
              </div>

              {/* User ID */}
              <div className="col-md-6 mb-3">
                <label className="form-label">User ID</label><span style={{ color: "red" }}>*</span>
                <input style={{}}
                  type="text" readOnly
                  className="form-control"
                  value={formData.hrms_code}
                  maxLength={10}
                  onChange={(e) => handleChange("hrms_code", e.target.value)}
                  required
                />
              </div>

              {/* Full Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label><span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  className="form-control"
                  value={formData.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  required
                />
              </div>
              {/* Gender */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Gender</label><span style={{ color: "red" }}>*</span>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Others</option>
                </select>
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label><span style={{ color: "red" }}>*</span>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label><span style={{ color: "red" }}>*</span>
                <input
                  type="text" maxLength={10}
                  className="form-control"
                  value={formData.phone_no}
                  onChange={(e) => handleChange("phone_no", e.target.value)}
                  required
                  pattern="\d{10}"
                  title="Phone number must be exactly 10 digits"
                />
              </div>

              {/* User Level */}
              {/* <div className="col-md-6 mb-3">
          <label className="form-label">User Level</label>
          <select
            className="form-select"
            value={formData.usr_level_cd}
            onChange={(e) => handleChange("usr_level_cd", e.target.value)}
            required
          >
            <option value="">Select User Level</option>
            <option value="R1">Super Admin</option>
            <option value="R2">Circle Approver</option>
            <option value="R3">Charge Approver</option>
            <option value="R4">Office Approver</option>
            <option value="R5">User</option>
          </select>
        </div> */}

              {/* Designation */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Designation</label><span style={{ color: "red" }}>*</span>
                <select
                  className="form-select"
                  value={formData.desig_cd}
                  onChange={(e) => handleChange("desig_cd", e.target.value)}
                  required
                >
                  <option value="">Select Designation</option>

                  {designation.map((d) => (
                    <option key={d.desig_cd} value={d.desig_cd}>
                      {d.designation}
                    </option>
                  ))}
                </select>
              </div>

              {/* BO ID */}
              <div className="col-md-6 mb-3">
                <label className="form-label">BO ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.bo_id}
                  onChange={(e) => handleChange("bo_id", e.target.value)}
                />
              </div>


              {/* GPF */}
              <div className="col-md-6 mb-3">
                <label className="form-label">GPF Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.gpf_no}
                  onChange={(e) => handleChange("gpf_no", e.target.value)}
                />
              </div>
              {/* PAN */}
              <div className="col-md-6 mb-3">
                <label className="form-label">PAN Number</label><span style={{ color: "red" }}>*</span>
                <input
                  type="text" maxLength={10}
                  className="form-control"
                  value={formData.pan_no}
                  onChange={(e) => handleChange("pan_no", e.target.value.toUpperCase())}
                  required
                  pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                  title="Enter valid PAN (e.g., ABCDE1234F)"
                />
              </div>

              {/* Date of Joining */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Date of Joining</label><span style={{ color: "red" }}>*</span>
                <input
                  name="dt_of_join"
                  type="text"
                  className="form-control"
                  placeholder="Select Date of Joining"
                  value={formData.dt_of_join}
                  onFocus={showDatePicker}   // 👈 CALLING HERE
                  onChange={(e) => handleChange("dt_of_join", e.target.value)}
                  required
                />
              </div>

              {/* Date of Joining */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Date of Birth</label><span style={{ color: "red" }}>*</span>
                <input
                  name="dt_of_birth"
                  type="text"
                  className="form-control"
                  placeholder="Select Date of Birth"
                  value={formData.dt_of_birth}
                  onFocus={showBirthDatePicker}   // 👈 call function
                  onChange={(e) => handleChange("dt_of_birth", e.target.value)}
                  required
                />
              </div>




              {/* Password */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Password</label><span style={{ color: "red" }}>*</span>
                <input
                  type="password"
                  className="form-control"
                  value={formData.passwd}
                  onChange={(e) => handleChange("passwd", e.target.value)}
                  required
                  pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$"
                  title="Password must be at least 8 characters, include 1 uppercase letter and 1 special character"
                />
              </div>

              {/* RePassword */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirm Password</label><span style={{ color: "red" }}>*</span>
                <input
                  type="password"
                  className="form-control"
                  value={formData.repasswd}
                  onChange={(e) => handleChange("repasswd", e.target.value)}
                  required
                />
                {/* Error message */}
                {formData.repasswd &&
                  formData.passwd !== formData.repasswd && (
                    <small style={{ color: "red" }}>Passwords do not match</small>
                  )}
              </div>


              {/* Hint Question */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Hint Question</label><span style={{ color: "red" }}>*</span>
                <select
                  className="form-select"
                  value={formData.hint_qs_cd}
                  onChange={(e) => handleChange("hint_qs_cd", e.target.value)}
                  required
                >
                  <option value="">Select Question</option>
                  <option value="Q1">What is your favorite food?</option>
                  <option value="Q2">What is your birth city?</option>
                  <option value="Q3">What is your first school name?</option>
                  <option value="Q4">What is your pet name?</option>
                  <option value="Q5">What is your nickname?</option>
                </select>
              </div>

              {/* Hint Answer */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Hint Answer</label><span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  className="form-control"

                  value={formData.hint_ans}
                  onChange={(e) => handleChange("hint_ans", e.target.value)}
                  required
                />
              </div>

            </div>

            {/* Captcha */}
            {/* <div style={{ margin: "auto", backgroundColor: "lightgrey", width: "50%", borderRadius: "8px", padding: "10px" }}>
              <div className="col-md-6 mb-3" style={{ margin: "auto" }}>
                <label className="form-label fw-bold">
                  Enter CAPTCHA <span className="text-danger">*</span>
                </label>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <span
                    className="px-3 py-2 rounded fw-bold"
                    style={{
                      backgroundColor: "#f0f0f0",
                      fontSize: "18px",
                      letterSpacing: "3px",
                      border: "1px solid #ccc",
                      display: "inline-block"
                    }}
                  >
                    {captcha}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    style={{ padding: "6px 10px" }}
                    onClick={generateCaptcha}
                  >
                    ↻
                  </button>


                  <input
                    type="text"
                    className="form-control"
                    style={{ width: "160px", height: "70px" }}
                    placeholder="Type CAPTCHA here"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    required
                  />

                  {captchaError && (
                    <small className="text-danger">{captchaError}</small>
                  )}
                </div>
              </div>
            </div> */}

            {/* **************Priyanka Pal********** */}

            {/* CAPTCHA */}
            <div className="mb-3 text-center">
              <div className="d-flex justify-content-center align-items-center">
                <canvas
                  ref={canvasRef}
                  width="150"
                  height="40"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginBottom: "8px",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                  onClick={generateCaptcha}
                  title="Refresh CAPTCHA"
                >
                  <FaSyncAlt />
                </button>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Enter CAPTCHA"
                  style={{ width: "23%" }}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
                {captchaError && (
                  <small className="text-danger">{captchaError}</small>
                )}

              </div>
            </div>

            {/* Submit Button */}
            <button type="submit"

              className="btn btn-primary signup-btn mt-3"
              style={{ width: "200px", margin: "auto" }}
            >
              Sign Up
            </button> <br />

            <div style={{ margin: "auto" }}> Already a User ? <span style={{ color: "blue" }} onClick={() => navigate("/login")}><a href="#" style={{ textDecoration: "none" }}>Login</a></span></div>
            <br />
          </div>
        </form>
      </div>


    </>
  );
}

