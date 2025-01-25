import React, { useState } from "react";
import Navbar from "../ui/Shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const Signup = () => {
  const [input, setInput] = useState({
   fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: ""
  });
 const navigate = useNavigate()
  const changeEventHandeler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    
    if (input.file) {
        formData.append("file", input.file);
    }

    try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });

        // Remove unnecessary await
        console.log(res.data.success);

        if (res && res.data && res.data.success) {
            navigate("/login");
            toast.success(res.data.message);
        } else {
            toast.error("Registration failed");
        }
    } catch (error) {
        console.log("Error during registration:", error.response ? error.response.data : error);
        if (error.response && error.response.data) {
            toast.error(error.response.data.message || "Registration failed");
        } else {
            toast.error("An error occurred during registration.");
        }
    }
};

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-xl p-5 my-10 gap-3"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="">
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname} // Make sure to update `input.name`
              name="fullname" // Changed from "fullname" to "name"
              onChange={changeEventHandeler}
              placeholder="Enter your full name"
            />
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandeler}
              placeholder="Enter your email_Id"
            />
            <Label>Phone number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandeler}
              placeholder="8080070070"
            />
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandeler}
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <RadioGroup
              className="flex items-center justify-between gap-4 my-4"
              defaultValue="student"
            >
              <div className="flex items-center space-x-2">
                <Input
                  value="student"
                  type="radio"
                  name="role"
                  checked={input.role === "student"}
                  onChange={changeEventHandeler}
                  className="cursor-pointer"
                />
                <Label className="m-2" htmlFor="r1">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  value="recruter"
                  type="radio"
                  name="role"
                  checked={input.role === "recruter"}
                  onChange={changeEventHandeler}
                  className="cursor-pointer"
                />
                <Label className="m-2">RecruterProfile</Label>
              </div>
            </RadioGroup>
            <div>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>
          <Button type="submit" className="w-full my-5">
            SignUp
          </Button>
          <div className="p-3">
            <h3>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
