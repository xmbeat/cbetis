type FromToValue = Record<string, number | string>;

const cssTable: Record<string, number> = {
    'width': 0,
    'height': 1,
    'top': 1,
    'left': 0
}

interface NonInterpolatableCSSProperties {
    [propertyName: string]: boolean;
}

const nonInterpolatableCSS: NonInterpolatableCSSProperties = {
    display: true,
    position: true,
    float: true,
    clear: true,
    visibility: true,
    overflow: true,
    zIndex: true,
    boxShadow: true,
    transform: true,
    clipPath: true,
    perspective: true,
    mask: true,
    filter: true,
    backdropFilter: true,
    mixBlendMode: true,
    pointerEvents: true,
    userSelect: true,
    cursor: true,
    willChange: true,
    objectFit: true,
    objectPosition: true,
    direction: true,
    unicodeBidi: true,
    touchAction: true,
    isolation: true,
    shapeImageThreshold: true,
    scrollBehavior: true,
    scrollSnapType: true,
    scrollSnapAlign: true,
    scrollSnapStop: true,
    scrollPadding: true,
    scrollPaddingTop: true,
    scrollPaddingRight: true,
    scrollPaddingBottom: true,
    scrollPaddingLeft: true,
    scrollMargin: true,
    scrollMarginTop: true,
    scrollMarginRight: true,
    scrollMarginBottom: true,
    scrollMarginLeft: true,
    pageBreakBefore: true,
    pageBreakAfter: true,
    pageBreakInside: true,
    breakBefore: true,
    breakAfter: true,
    breakInside: true,
    counterIncrement: true,
    counterReset: true,
    orphans: true,
    widows: true,
};

export function interpolate(from: FromToValue, to: FromToValue, progress: number, size: { width: number, height: number }): FromToValue {
    const result: FromToValue = {};

    for (const key in from) {
        if (from.hasOwnProperty(key)) {
            const fromValue = from[key];
            const toValue = to[key];
            if (toValue == undefined) {
                result[key] = fromValue
                continue
            }
            if (nonInterpolatableCSS[key]) {
                result[key] = fromValue
                continue
            }
            if (typeof fromValue === 'number' && typeof toValue === 'number') {
                // Interpolación numérica
                const interpolatedNumeric = interpolateNumeric(fromValue, toValue, progress);
                result[key] = interpolatedNumeric;
            }
            else if (typeof fromValue === 'number' && typeof toValue === 'string') {
                if (toValue.endsWith('%')) {
                    const toNumeric = parseFloat(toValue)
                    if (fromValue === 0) {
                        result[key] = interpolateNumeric(fromValue, toNumeric, progress) + '%'
                    }
                    else {
                        const propToUse = cssTable[key] ?? 0;
                        const totalSize = propToUse === 0 ? size.width : size.height
                        result[key] = interpolateNumeric(fromValue, totalSize * toNumeric / 100, progress)
                    }
                }
            }
            else if (typeof fromValue === 'string' && typeof toValue == 'number') {
                if (fromValue.endsWith('%')) {
                    const fromNumeric = parseFloat(fromValue)
                    if (toValue === 0) {
                        result[key] = interpolateNumeric(fromNumeric, toValue, progress) + '%'
                    }
                    else {
                        const propToUse = cssTable[key] ?? 0
                        const totalSize = propToUse == 0 ? size.width : size.height
                        result[key] = interpolateNumeric(totalSize * fromNumeric / 100, toValue, progress)
                    }
                }
            }
            else if (typeof fromValue === 'string' && typeof toValue === 'string') {
                if (fromValue.startsWith('#') && toValue.startsWith('#')) {
                    // Interpolación de color RGBA
                    const fromColor = parseRGBA(fromValue);
                    const toColor = parseRGBA(toValue);
                    const interpolatedColor = interpolateRGBA(fromColor, toColor, progress);
                    result[key] = `#${interpolatedColor.map(val => val.toString(16).toUpperCase().padStart(2, '0')).join('')}`;
                } else if (fromValue.endsWith('%') && toValue.endsWith('%')) {
                    // Interpolación numérica con %
                    const fromNumeric = parseFloat(fromValue);
                    const toNumeric = parseFloat(toValue);
                    const interpolatedNumeric = interpolateNumeric(fromNumeric, toNumeric, progress);
                    result[key] = `${interpolatedNumeric}%`;
                } else if (fromValue.endsWith('vw') && toValue.endsWith('vw') ||
                    fromValue.endsWith('vh') && toValue.endsWith('vh') ||
                    fromValue.endsWith('em') && toValue.endsWith('em') ||
                    fromValue.endsWith('rem') && toValue.endsWith('rem')) {
                    // Interpolación numérica con unidades iguales
                    const fromNumeric = parseFloat(fromValue);
                    const toNumeric = parseFloat(toValue);
                    const interpolatedNumeric = interpolateNumeric(fromNumeric, toNumeric, progress);
                    result[key] = `${interpolatedNumeric}${fromValue.slice(-2)}`; // Conserva las unidades
                } else {
                    throw new Error('Interpolación no compatible para valores de string');
                }
            } else {
                result[key] = toValue || fromValue
            }
        }
    }

    for (const key in to) {
        if (to.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
            result[key] = to[key]
        }
    }

    return result;
}

export function parseRGBA(color: string): number[] {

    const rgba = [];
    if (color.startsWith('#')) {
        color = color.substring(1);
    }

    if (color.length == 3) {
        for (let i = 0; i < color.length; i++) {
            rgba.push(parseInt(color[i], 16) * 16)
        }
        rgba.push(255)
    }
    else if (color.length == 6 || color.length == 8) {
        for (let i = 0; i < color.length; i += 2) {
            rgba.push(parseInt(color.substring(i, i + 2), 16))
        }
        if (color.length == 6) {
            rgba.push(255)
        }
    }
    else {
        throw new Error('Unexpected color code');
    }
    return rgba;
}


export function interpolateRGBA(from: number[], to: number[], progress: number): number[] {
    // Interpolar cada componente del color
    return from.map((fromValue, index) => Math.round(fromValue + (to[index] - fromValue) * progress));
}

export function interpolateNumeric(from: number, to: number, progress: number): number {
    // Interpolación lineal entre dos números
    return from + (to - from) * progress;
}
