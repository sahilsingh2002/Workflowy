import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import axios from "axios";


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

type Inputs = {
  username: string
  password: string
}

export function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = ({username,password}) =>login_user(username,password);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const login_user = async(username:string, password:string)=>{
    try{
      const result = await axios({
        method: 'post',
        url: '/api/login',
        data: {
          username,
          password,
        }
      });
      console.log(result.data);
      navigate("/home");
    }
    catch(err){
      
      console.log("error",err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center h-screen justify-center pt-16 lg:overflow-auto overflow-y-scroll">
      <Card className="dark:bg-black w-full sm:max-w-md overflow-auto">
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
                {...register("username")}
              />
            </div>
            <div className="grid gap-2">
              
                <Label className="inline-block" htmlFor="password">Password</Label>
             
              <div className="grid grid-flow-col grid-cols-2 gap-2">
                <Input id="password" className="col-span-2" type={showPassword ? "text" : "password"} {...register("password")} />
                <Button variant={!showPassword?"ghost":"default"} onClick={(e) => { e.preventDefault();
                   setShowPassword(!showPassword) }}>{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</Button>
              </div>
                <Link to="/" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              <span className="flex gap-2 items-center">
                Login with Google 
              </span>
                <FaGoogle className="h-4 w-4 mx-3" />
            </Button>
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
