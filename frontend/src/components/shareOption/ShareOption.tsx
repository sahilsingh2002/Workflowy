import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ShareOption() {
  return (
    <Select>
      <SelectTrigger  className="w-[180px]">
        <SelectValue value={"reader"} placeholder="Select a Role" onClick={(e)=>{e.stopPropagation()}} />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>
          <SelectLabel>Roles</SelectLabel>
          <SelectItem value="owner" onClick={(e)=>{e.stopPropagation()}}>owner</SelectItem>
          <SelectItem value="editor">editor</SelectItem>
          <SelectItem value="reader">reader</SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
