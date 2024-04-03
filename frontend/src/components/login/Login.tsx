import {Link} from "react-router-dom"
import { useState } from "react"
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center h-screen pt-16 justify-center  ">
    <Card className="dark:bg-black w-[97%] sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
        <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder=""
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <div className="grid grid-flow-col grid-cols-2 gap-2">
            <Input id="password" className="col-span-2" type={showPassword?"text":"password"} />
            <Button onClick={()=>{setShowPassword(!showPassword)}}>{showPassword?<FaRegEye/>:<FaRegEyeSlash/>}</Button>

            </div>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
           <span className="flex gap-2 items-center">
            Login with Google <FaGoogle className="h-4 w-4 mt-1"/>
           </span>
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
    </div>
  )
}
