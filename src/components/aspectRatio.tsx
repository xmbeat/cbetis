import { ReactNode, useEffect, useRef, useState } from "react";

interface IAspectRatioProps {
    aspect: number;
    children?: ReactNode;
    width?: string;
    height?: string;
    maxHeight?: string;
    maxWidth?: string;
    forceAspect?: boolean;
}

export default function AspectRatio({ aspect = 16/9, children, width = '100%', height, maxHeight, maxWidth, forceAspect = false }: IAspectRatioProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerStyle, setContainerStyle] = useState<{ }>({});

    useEffect(() => {
        const updateDimensions = () => {
            if (!containerRef.current) return;
            const parent = containerRef.current.parentElement;
            if (!parent) return;
            const parentStyle = window.getComputedStyle(parent);

            let newWidth, newHeight;

            if (width) {
                let calculatedWidth;

                if (width.indexOf('px') > 0) {
                    calculatedWidth = Number(width.replace('px', ''));
                } else if (width.indexOf('%') > 0) {
                    const parentWidth = parent.getBoundingClientRect().width - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
                    calculatedWidth = parentWidth * parseFloat(width.replace('%', '')) / 100;
                } else if (width.indexOf('vw') > 0) {
                    calculatedWidth = window.innerWidth * Number(width.replace('vw', '')) / 100;
                } else {
                    calculatedWidth = Number(width);
                }

                newHeight = calculatedWidth / aspect;
                newWidth = calculatedWidth;

                if (maxHeight) {
                    let calculatedMaxHeight;

                    if (maxHeight.indexOf('px') > 0) {
                        calculatedMaxHeight = Number(maxHeight.replace('px', ''));
                    } else if (maxHeight.indexOf('%') > 0) {
                        if (!['fit-content', 'auto'].includes(parentStyle.height)) {
                            calculatedMaxHeight = parent.offsetHeight * Number(maxHeight.replace('%', '')) / 100;
                        }
                    } else if (maxHeight.indexOf('vh') > 0) {
                        calculatedMaxHeight = window.innerHeight * Number(maxHeight.replace('vh', '')) / 100;
                    }

                    if (calculatedMaxHeight !== undefined && newHeight > calculatedMaxHeight) {
                        newHeight = calculatedMaxHeight;
                        newWidth = newHeight * aspect;
                        
                    }
                }
                setContainerStyle({width:forceAspect?newWidth + 'px':width, height: newHeight + 'px'})

            } else if (height) {
                let calculatedHeight;

                if (height.indexOf('px') > 0) {
                    calculatedHeight = Number(height.replace('px', ''));
                } else if (height.indexOf('%') > 0) {
                    const parentHeight = parent.getBoundingClientRect().height - parseFloat(parentStyle.paddingTop) - parseFloat(parentStyle.paddingBottom);
                    calculatedHeight = parentHeight * parseFloat(height.replace('%', '')) / 100;
                } else if (height.indexOf('vh') > 0) {
                    calculatedHeight = window.innerHeight * Number(height.replace('vh', '')) / 100;
                } else {
                    calculatedHeight = Number(height);
                }

                newWidth = calculatedHeight * aspect;
                newHeight = calculatedHeight;

                if (maxWidth) {
                    let calculatedMaxWidth;

                    if (maxWidth.indexOf('px') > 0) {
                        calculatedMaxWidth = Number(maxWidth.replace('px', ''));
                    } else if (maxWidth.indexOf('%') > 0) {
                        calculatedMaxWidth = Number(parent.getBoundingClientRect().width) * Number(maxWidth.replace('%', '')) / 100;
                    } else if (maxWidth.indexOf('vw') > 0) {
                        calculatedMaxWidth = window.innerWidth * Number(maxWidth.replace('vw', '')) / 100;
                    }

                    if (calculatedMaxWidth !== undefined && newWidth > calculatedMaxWidth) {
                        newWidth = calculatedMaxWidth;
                        if (forceAspect){
                            newHeight = newWidth / aspect;
                        }
                    }
                }
                setContainerStyle({width:newWidth + 'px', height: forceAspect? newHeight + 'px': height})
            }

        };

        updateDimensions();

        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [aspect, width, height, maxHeight, maxWidth, forceAspect]);

    return <div className="relative" ref={containerRef} style={containerStyle}>{children}</div>;
}
