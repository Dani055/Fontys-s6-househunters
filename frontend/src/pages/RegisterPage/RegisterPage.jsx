import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../../components/forms/RegisterForm/RegisterForm";

function RegisterPage(props) {
  return (
    <div className="container my-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-lg-9 col-xl-7">
          <div
            className="card shadow-2-strong card-registration"
            style={{ borderRadius: 15 + "px" }}
          >
            <div className="card-body bg-light p-4 p-md-5">
              <h4 className="mb-4 pb-2 pb-md-0 mb-md-5">Create an account in HouseHunters</h4>
              <RegisterForm/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
