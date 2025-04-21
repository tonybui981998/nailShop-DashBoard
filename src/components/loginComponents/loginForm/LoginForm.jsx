import React, { useState } from "react";
import "./LoginForm.scss";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetLogin } from "../../redux/CounterSlice";
const LoginForm = () => {
  const dispatch = useDispatch();
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const [formData, setFormData] = useState({
    UserName: "",
    Password: "",
  });
  const validation = () => {
    if (!formData.UserName || !formData.Password) {
      toast.warn("Please enter all information");
      return false;
    } else {
      return true;
    }
  };
  const submit = () => {
    const check = validation();
    if (check === true) {
      setLoading(true);
      setTimeout(async () => {
        setLoading(false);
        const getRespond = await dispatch(fetLogin(formData));
        if (getRespond?.payload.data.status === "success") {
          navigate("/dash-board");
          return toast.success(getRespond?.payload.data.message);
        } else {
          return toast.error(getRespond?.payload.data.message);
        }
      }, 3000);
    }
  };
  return (
    <div className="loginForm">
      {loading && (
        <div className="overlay">
          <HashLoader
            color={"red"}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <div className="main-form">
        <div className="title">Login </div>
        <div className="line"></div>
        <div className="form-input">
          <div className="form">
            <label>User Name:</label>
            <br />
            <input
              value={formData.UserName}
              onChange={(event) =>
                setFormData({ ...formData, UserName: event.target.value })
              }
              type="text"
            />
          </div>
          <div className="form">
            <label>Password:</label>
            <br />
            <input
              value={formData.Password}
              onChange={(event) =>
                setFormData({ ...formData, Password: event.target.value })
              }
              type="password"
            />
          </div>
          <div className="button">
            <button onClick={() => submit()}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
