import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm/LoginForm";


function Login(props) {
  return (
    <div className="container my-5">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card bg-light" style={{ borderRadius: 1 + "rem" }}>
            <div className="card-body p-4 text-center">
              <div className="mb-5 py-2">
                <h3 className="fw-bold mb-2 text-uppercase">Login</h3>
                <p className="mb-4">Please enter your credentials!</p>
                <LoginForm/>
              </div>

              <div>
                <p className="mb-0">
                  Don't have an account?
                  <Link to="/register" className="fw-bold ms-2">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
