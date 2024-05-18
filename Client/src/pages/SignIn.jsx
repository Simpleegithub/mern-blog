/* eslint-disable */

import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart,signInFailure,signInSuccess } from "../redux/users/Userslice";
import { useDispatch, useSelector } from "react-redux";


function SignIn() {
  const [formdata, setformdata] = useState({});
   
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {loading,error:errorMessage}=useSelector((state)=>state.user);

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata.email || !formdata.password) {
      return dispatch(signInFailure('Please fill out all fields'));
    }
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      console.log(data,'from line 36')
      if (data.success === false) {
        // return setErrorMessage(data.message);
        dispatch(signInFailure(data.message))
      }
    //   setloading(false)
                      ;
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate("/");

      }
    } catch (err) {
    //   setErrorMessage(err.message);
    //   setloading(false);
     dispatch(signInFailure(err.message))
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="  flex p-3  max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side   */}
        <div className=" flex-1">
          <Link to="/" className="font-bold dark:text-whit text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
              Sahand's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can Sign in with your email and password
            or with Google{" "}
          </p>
        </div>
        {/* // right  */}
        <div className=" flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
         

            <div>
              <Label>Your email</Label>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Your password</Label>
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  (<Spinner size="sm" />
                  <span>Loading....</span>)
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
