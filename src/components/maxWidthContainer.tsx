import { ReactNode } from "react";

interface MaxWidthContainerProps {
    children?: ReactNode;
    className?: string;
}

export default function MaxWidthContainer({ children, className }: MaxWidthContainerProps) {
    // Combina las clases de CSS proporcionadas con las clases predeterminadas
    const containerClassName = `relative max-w-[1200px] px-[--px-content] ${className || ''}`;

    return <div className={containerClassName}>
        {children}
    </div>;
}
