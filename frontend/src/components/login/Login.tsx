import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import {changeUser} from '../../redux/slices/userSlice'
import socket from "@/socket/Scoket";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "sonner";
import { ErrorMessage } from "@hookform/error-message"
import { initiateSocketConnection } from "@/socket/Socket";



type Inputs = {
  username: string
  password: string
  multipleErrorInput: string
}

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = ({username,password}) =>login_user(username,password);

  const [showPassword, setShowPassword] = useState(false);

  const login_user = async(username:string, password:string)=>{
    try{
      const result = await axios({
        method: 'post',
        url: '/api/login',
        data: {
          username,
          password,
        },
        withCredentials: true // This enables sending cookies with cross-origin requests

      });
      dispatch(changeUser(result.data.data));
      console.log(result);
      toast.success(`Welcome! ${result.data.data.username}`);

      navigate("/home");
     
    }
    catch(err){
      toast.error("Invalid Credentials");
      
      console.log("error",err);
    }

  }
  

  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center w-full min-h-screen items-center">
      <Card className="dark:bg-[#1C2025] border-black border w-full sm:max-w-md overflow-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username & password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder=""
                required
                className="dark:bg-[#101315] border-0"
                {...register("username")}
              />
            </div>
            <div className="grid gap-2">
              
                <Label className="inline-block" htmlFor="password">Password</Label>
             
              <div className="grid grid-flow-col grid-cols-2 gap-2">
                <Input id="password" className="dark:bg-[#101315] border-0 col-span-2" type={showPassword ? "text" : "password"} {...register("password")} />
                <Button variant={!showPassword?"ghost":"default"} onClick={(e) => { e.preventDefault();
                   setShowPassword(!showPassword) }}>{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</Button>
              </div>
                <Link to="/" className="ml-auto inline-block text-sm underline">
                  Forgot your password?jkljkl
                </Link>
            </div>
            <ErrorMessage
        errors={errors}
        name="multipleErrorInput"
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => (
            <p key={type}>{message}</p>
          ))
        }
      />
            <Button type="submit" className=" dark:hover:bg-[#0b0c0e] dark:bg-[#22272b]  dark:text-[#9EADAC] w-full">
              Login
            </Button>
            {/* <Button variant="outline" className="w-full">
              <span className="flex gap-2 items-center">
                Login with Google 
              </span>
                <FaGoogle className="h-4 w-4 mx-3" />
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
