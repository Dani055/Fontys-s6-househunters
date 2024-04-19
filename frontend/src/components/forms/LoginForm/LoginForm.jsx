import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkLoginKey, loginUserCall } from "../../../service/userService";
import { toast } from 'react-toastify';
import { UserContext } from "../../../UserProvider";
function LoginForm(props) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const { loggedUser, setLoggedUser } = useContext(UserContext)


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await loginUserCall(formState);
      window.sessionStorage.setItem("tkn", res.token);
      const userRes = await checkLoginKey()
      setLoggedUser(userRes.user);
      navigate("/");
    }
    catch (err) {
      toast.error("Incorrect username or password");
    }
  }

  const handleFormChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-floating mb-3 text-start">
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          onChange={handleFormChange}
          placeholder="name@example.com"
        />
        <label htmlFor="floatingInput"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person me-1" viewBox="0 0 16 16">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
        </svg>Email</label>
      </div>

      <div className="form-floating mb-3 text-start">
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          onChange={handleFormChange}
          placeholder="Password"
        />
        <label htmlFor="floatingPassword">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key me-1" viewBox="0 0 16 16">
            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>Password</label>
      </div>

      <p className="small mb-4 pb-lg-2">
        <a href="#!">Forgot password?</a>
      </p>

      <button className="btn btn-outline-dark px-3" type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right me-2" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
          <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
        </svg>
        Login
      </button>
    </form>
  );
}

export default LoginForm;
