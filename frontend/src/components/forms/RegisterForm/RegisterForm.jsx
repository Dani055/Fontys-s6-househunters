import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUserCall } from "../../../service/userService";
import { toast } from 'react-toastify';

function RegisterForm(props) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ firstName: "", lastName: "", address: "", phone: "", email: "", username: "", password: "", acceptedTermsAndConditions: false });


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await registerUserCall(formState);
      toast.success(res.message);
      navigate("/login")
    } catch (err) {
      toast.error(err);
    }
  }

  const handleFormChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              onChange={handleFormChange}
              id="firstName"
              name="firstName"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">First name*</label>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              onChange={handleFormChange}
              id="lastName"
              name="lastName"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Last name*</label>
          </div>
        </div>
      </div>

      <div className="row border-bottom mb-4">
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              onChange={handleFormChange}
              id="address"
              name="address"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Address</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input
              type="tel"
              className="form-control"
              onChange={handleFormChange}
              id="phone"
              name="phone"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Phone number</label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              onChange={handleFormChange}
              id="email"
              name="email"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-1" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
            </svg>Email*</label>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              onChange={handleFormChange}
              id="username"
              name="username"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person me-1" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
            </svg>Username*</label>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 mb-2">
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              onChange={handleFormChange}
              id="password"
              name="password"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key me-1" viewBox="0 0 16 16">
              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>Password*</label>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <p className="text-danger">* Fields are required</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-5 form-check mt-4">
          <input className="form-check-input" type="checkbox" value='' data-testid="terms-checkbox" onChange={(e) => { setFormState({ ...formState, acceptedTermsAndConditions: e.target.checked }); }} />
          <label className="form-check-label">I accept the <Link to='/privacy' target='_blank'>terms and conditions</Link>.</label>
        </div>
      </div>
      <div className="row mt-3 justify-content-center">
        <div className="col-md-4">
          <button disabled={!formState.acceptedTermsAndConditions} className="btn btn-outline-dark px-5 w-100" type="submit">
            Register
          </button>
        </div>

      </div>

      <div className="row justify-content-center mt-4">
        <div className="col-md-6 text-center">
          Already have an account?
          <Link to="/login" className="fw-bold ms-2">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;
