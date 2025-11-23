import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "mp-flex mp-h-10 mp-w-full mp-rounded-md mp-border mp-border-input mp-bg-background mp-px-3 mp-py-2 mp-text-sm mp-ring-offset-background file:mp-border-0 file:mp-bg-transparent file:mp-text-sm file:mp-font-medium placeholder:mp-text-muted-foreground focus-visible:mp-outline-none focus-visible:mp-ring-2 focus-visible:mp-ring-ring focus-visible:mp-ring-offset-2 disabled:mp-cursor-not-allowed disabled:mp-opacity-50",
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
