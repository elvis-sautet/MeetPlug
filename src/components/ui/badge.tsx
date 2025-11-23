import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "mp-inline-flex mp-items-center mp-rounded-full mp-border mp-px-2.5 mp-py-0.5 mp-text-xs mp-font-semibold mp-transition-colors focus:mp-outline-none focus:mp-ring-2 focus:mp-ring-ring focus:mp-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "mp-border-transparent mp-bg-primary mp-text-primary-foreground hover:mp-bg-primary/80",
        secondary:
          "mp-border-transparent mp-bg-secondary mp-text-secondary-foreground hover:mp-bg-secondary/80",
        destructive:
          "mp-border-transparent mp-bg-destructive mp-text-destructive-foreground hover:mp-bg-destructive/80",
        outline: "mp-text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
