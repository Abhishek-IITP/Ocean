"use client";
import { cn } from "@/lib/utils";
import { Children, cloneElement, ReactElement } from "react";
import { Button } from "./button"; // Adjust the path if ButtonProps is defined elsewhere

interface ButtonGroupProps {
    className?: string;
    children?: ReactElement<React.ComponentProps<typeof Button>>[];
}

export function ButtonGroup({ className, children }: ButtonGroupProps) {
    const totalButtons = Children.count(children);
    return (
        <div className={cn("flex items-center justify-center space-x-2", " p-4 rounded-md",className)}>
            {children?.map((child, index) => {
                const isFirstItem = index === 0;
                const isLastItem = index === totalButtons - 1;


                return cloneElement(child,{
                    className: cn(
                        {
                            "rounded-l-none": !isFirstItem,
                            "rounded-r-none": !isLastItem,
                            "border-l-0": !isFirstItem,
                        },child.props.className)
                })

})}

        </div>
        
    );
}