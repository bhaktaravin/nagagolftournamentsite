import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
                    // Variants
                    variant === "primary" && "bg-[#1a472a] text-white hover:bg-[#2d5a3d] focus:ring-[#1a472a]",
                    variant === "secondary" && "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
                    variant === "danger" && "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
                    variant === "ghost" && "bg-transparent text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800",
                    // Sizes
                    size === "sm" && "px-3 py-1.5 text-sm",
                    size === "md" && "px-4 py-2 text-base",
                    size === "lg" && "px-6 py-3 text-lg",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
