import * as React from "react"
import { cn } from "../../utils/cn"


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-holographic-silver bg-dark-matter px-3 py-2 text-sm text-holographic-silver ring-offset-dark-matter file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-holographic-silver/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
