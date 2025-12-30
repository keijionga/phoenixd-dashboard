import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'glow-button bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-glow-md hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.3)]',
        outline:
          'border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20',
        secondary: 'bg-white/5 text-foreground backdrop-blur-sm hover:bg-white/10',
        ghost: 'hover:bg-white/5 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        lightning:
          'glow-button bg-gradient-to-r from-lightning to-bitcoin text-white shadow-lg hover:shadow-glow-lightning hover:scale-[1.02] active:scale-[0.98]',
        glass:
          'bg-white/5 border border-white/10 backdrop-blur-xl text-foreground hover:bg-white/10 hover:border-white/20 hover:shadow-glass',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
