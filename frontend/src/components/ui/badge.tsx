import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/5 text-foreground backdrop-blur-sm',
        secondary: 'border-white/10 bg-white/5 text-muted-foreground backdrop-blur-sm',
        destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
        outline: 'border-white/20 bg-transparent text-foreground',
        success:
          'border-success/20 bg-success/10 text-success shadow-[0_0_10px_hsl(var(--success)/0.2)]',
        warning:
          'border-warning/20 bg-warning/10 text-warning shadow-[0_0_10px_hsl(var(--warning)/0.2)]',
        lightning:
          'border-lightning/20 bg-lightning/10 text-lightning shadow-[0_0_10px_hsl(var(--lightning)/0.2)]',
        bitcoin:
          'border-bitcoin/20 bg-bitcoin/10 text-bitcoin shadow-[0_0_10px_hsl(var(--bitcoin)/0.2)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
