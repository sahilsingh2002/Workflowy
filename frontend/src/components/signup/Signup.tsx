import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AxeIcon } from "lucide-react";
import './signup.css'
interface ErrorResponse {
  status: boolean;
  status_code: number;
  error: string;
}
interface SuccessResponse {
  status: boolean;
  status_code: number;
  data: string;
}

type AxiosResponse<T> = {
  status: number;
  data: T;
};

export function Signup() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isUnique, setIsUnique] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [isValid, setIsValid] = useState("Not a Valid username");

  const handleValid=(username:string)=>{
    if (username.length < 3) {
      setIsValid("Username must be at least 3 characters.");
      setValidUsername(false);
    } else if (username.length > 20) {
      setIsValid("Username must be at most 20 characters.");
      setValidUsername(false);
    } else if (username.toLowerCase() === "admin" || username.toLowerCase() === "root") {
      setIsValid("Username cannot be 'admin' or 'root'.");
      setValidUsername(false);
    } else if (!/^[a-z0-9_-]+$/.test(username)) {
      setIsValid("Username can only contain lowercase letters, numbers, underscores, and hyphens.");
      setValidUsername(false);
    } else if (/^\d+$/.test(username)) {
      setIsValid("Username cannot consist entirely of numbers.");
      setValidUsername(false);
    } else {
      setIsValid("");
      setValidUsername(true);
    }
    
    
    // Add more constraints as needed
    
    
  }
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    
    if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout);
    
    
    if(validUsername){
    setUsernameCheckTimeout(
      setTimeout(() => {
        
        
        
            setIsUnique(true);
        //   });

        console.log("here");
      }, 3000)
      );
    }
 }, [username, validUsername]);

 const signup_user = async()=>{
  const user = {
    name:name,
    email:email,
    username:username,
    password:password
  }
 
    const sendreqConfig = {
    method:"POST",
    url:'/api/signup',
    data:user
  }
  try{
    const result = await axios(sendreqConfig);
    console.log(result);

  }
  catch(err){
    console.log(err);
  }
  }
 
  return (
    
       <div className="flex justify-center items-center min-h-screen">
      <Card className="dark:bg-black w-full sm:max-w-md">
        <CardHeader>
          <AxeIcon/>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
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
                className={`${!validUsername && username.length>0 && "border-red-500"}`}
                onChange={(e)=>{
                  setUsername(e.target.value);
                  handleValid(e.target.value);
                  
                }}
                required
              />
              <div>
                {isValid}
              </div>
                
            </div>
            
            
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Max Robinson" required onChange={(e)=>{setName(e.target.value)}} />
              </div>
             
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e)=>{setEmail(e.target.value)}} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="grid grid-flow-col grid-cols-2 gap-2">
              <Input id="password" className="col-span-2" type={showPassword?"text":"password"} onChange={(e)=>{setPassword(e.target.value)}} />
              <Button variant={!showPassword?"ghost":"default"} onClick={()=>{setShowPassword(!showPassword)}}>{showPassword?<FaRegEye/>:<FaRegEyeSlash/>}</Button>

              </div>
            </div>
            <Button type="submit" className="w-full" onClick={signup_user}>
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
   
  )
}