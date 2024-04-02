import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Navbar from '../navbar/Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Signup() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isUnique, setIsUnique] = useState(false);
  const [username, setUsername] = useState("");
  // const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
//   useEffect(() => {
//     if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout);
//     setUsernameCheckTimeout(
//       setTimeout(() => {
//         // Simulate API call
//         // Replace this wih your actual API call
//         fetch(`/api/check-username?username=${username}`)
//           .then((response) => response.json())
//           .then((data) => {
//             setIsUnique(!data.isTaken);
//           });
//       }, 3000)
//     );
//  }, [username]);
  return (
    <div className="flex flex-col ">
      <Navbar/>
    <Card className="dark:bg-black w-full sm:max-w-md mx-auto">
      
      <CardHeader>
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
              onChange={(e)=>{
                setUsername(e.target.value);
              }}
              required

            />
            {!isUnique && <div>
              The username is already taken
            </div>
              }
          </div>
          
          
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Max Robinson" required />
            </div>
           
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="grid grid-flow-col grid-cols-2 gap-2">
            <Input id="password" className="col-span-2" type={showPassword?"text":"password"} />
            <Button onClick={()=>{setShowPassword(!showPassword)}}>{showPassword?<FaRegEye/>:<FaRegEyeSlash/>}</Button>

            </div>
          </div>
          <Button type="submit" className="w-full">
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