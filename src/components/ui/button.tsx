import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "mp-inline-flex mp-items-center mp-justify-center mp-whitespace-nowrap mp-rounded-md mp-text-sm mp-font-medium mp-ring-offset-background mp-transition-colors focus-visible:mp-outline-none focus-visible:mp-ring-2 focus-visible:mp-ring-ring focus-visible:mp-ring-offset-2 disabled:mp-pointer-events-none disabled:mp-opacity-50",
  {
    variants: {
      variant: {
        default: "mp-bg-primary mp-text-primary-foreground hover:mp-bg-primary/90",
        destructive:
          "mp-bg-destructive mp-text-destructive-foreground hover:mp-bg-destructive/90",
        outline:
          "mp-border mp-border-input mp-bg-background hover:mp-bg-accent hover:mp-text-accent-foreground",
        secondary:
          "mp-bg-secondary mp-text-secondary-foreground hover:mp-bg-secondary/80",
        ghost: "hover:mp-bg-accent hover:mp-text-accent-foreground",
        link: "mp-text-primary mp-underline-offset-4 hover:mp-underline",
      },
      size: {
        default: "mp-h-10 mp-px-4 mp-py-2",
        sm: "mp-h-9 mp-rounded-md mp-px-3",
        lg: "mp-h-11 mp-rounded-md mp-px-8",
        icon: "mp-h-10 mp-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
