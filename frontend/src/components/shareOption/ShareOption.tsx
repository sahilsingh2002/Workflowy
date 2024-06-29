
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
        <SelectValue placeholder="Select a Role"  />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>
          <SelectLabel>Roles</SelectLabel>
          <SelectItem value="owner" >owner</SelectItem>
          <SelectItem value="editor">editor</SelectItem>
          <SelectItem value="reader">reader</SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
