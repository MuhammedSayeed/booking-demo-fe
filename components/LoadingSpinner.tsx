import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

export function LoadingSpinner({
    size = "md",
    text = "Loading...",
    className = ""
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    const containerPadding = {
        sm: "py-8",
        md: "py-12",
        lg: "py-20"
    };

    return (
        <div className={`flex flex-col items-center justify-center ${containerPadding[size]} ${className}`}>
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-4`} />
            {text && (
                <p className="text-muted-foreground text-center">{text}</p>
            )}
        </div>
    );
} 