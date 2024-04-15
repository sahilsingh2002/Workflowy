import { useState, useEffect } from "react"
import { Link,useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useDispatch } from "react-redux";
import {changeUser} from '../../redux/slices/userSlice'
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
import { useForm, SubmitHandler } from "react-hook-form"



export function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  type Inputs = {
    username: string
    name: string
    password: string
    email: string
  }
  
  const [showPassword, setShowPassword] = useState(false);

  const [isUnique, setIsUnique] = useState(false);
  const [username, setUsername] = useState("");
  
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
    
    
    
    
  }
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    console.log("here");
    
    if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout);
    
    
    if(validUsername){
    setUsernameCheckTimeout(
      setTimeout(async() => {
        const sendreqConfig = {
          method:"POST",
          data:{
            username:username,
          },
          url:"/api/username"

        }
        try{
          const result = await axios(sendreqConfig); 
          console.log(result);
          setIsUnique(true);
          setIsValid(result?.data?.message);
      
        }
        catch(err){
            const error = err;
            setIsUnique(false);
          console.log(error);
        }  
      }, 3000)
      );
    }
 }, [username, validUsername,dispatch]);

 interface Datas{
  name:string
  username:string
  password:string
  email:string
 }

 const signup_user = async(data:Datas)=>{
  const user = {
    name:data.name,
    email:data.email,
    username:data.username,
    password:data.password,
    
  }
 
    const sendreqConfig = {
    method:"POST",
    url:'/api/signup',
    data:user
  }
  try{
    const result = await axios(sendreqConfig);
    console.log(result);
    dispatch(changeUser(user));
    // navigate("/home");
    

  }
  catch(err){
      const error = err.response.data;
    console.log(error);
  }
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid: isFormValid }
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {signup_user(data);}
 
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
         <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder=""
                className={`${!validUsername && username.length>0 && "border-red-500"}`}
                {...register("username")}
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
                <Input id="name" placeholder="Max Robinson" required {...register("name")} />
              </div>
             
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="grid grid-flow-col grid-cols-2 gap-2">
              <Input id="password" className="col-span-2" type={showPassword?"text":"password"} {...register("password")}/>
              <Button variant={!showPassword?"ghost":"default"} onClick={(e)=>{e.preventDefault();setShowPassword(!showPassword)}}>{showPassword?<FaRegEye/>:<FaRegEyeSlash/>}</Button>

              </div>
            </div>
            <Button type="submit" className="w-full" disabled={!isFormValid || !isUnique}>
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
      </form>
        </CardContent>
      </Card>
    </div>
   
  )
}