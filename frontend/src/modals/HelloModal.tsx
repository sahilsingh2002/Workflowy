import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from "axios";
import { Form, FormItem } from "../ui/form";
import { Value } from "@radix-ui/react-select";

type Inputs = {
  difficulty: string;
  duration: string;
};

export function Challenge() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async(data) => {
    console.log(data);
    // const sendReqConfig = {
    //   method:"POST",
    //   url:'',
    //   data:data,
    // }
    // try {
    //   const result = await axios(sendReqConfig);
    //   console.log(result);
      
    // } catch (error) {
    //   console.log(error);
    // }

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="p-10 text-4xl my-10 font-serif"
        >
          Challenge Now!!
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Challenge Someone!</DialogTitle>
            <DialogDescription>
              Please give more information about the Level of Challenge you want
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit">Challenge!</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
