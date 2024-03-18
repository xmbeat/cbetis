type FromToValue = Record<string, number | string>;

export function interpolate(from: FromToValue, to: FromToValue, progress: number): FromToValue {
    const result: FromToValue = {};

    for (const key in from) {
        if (from.hasOwnProperty(key)) {
            const fromValue = from[key];
            const toValue = to[key];

            if (typeof fromValue === 'string' && typeof toValue === 'string') {
                if (fromValue.startsWith('#') && toValue.startsWith('#')) {
                    // Interpolación de color RGBA
                    const fromColor = parseRGBA(fromValue);
                    const toColor = parseRGBA(toValue);
                    const interpolatedColor = interpolateRGBA(fromColor, toColor, progress);
                    result[key] = `#${interpolatedColor.map(val=>val.toString(16).toUpperCase().padStart(2, '0')).join('')}`;
                } else if (fromValue.endsWith('%') && toValue.endsWith('%')) {
                    // Interpolación numérica con %
                    const fromNumeric = parseFloat(fromValue);
                    const toNumeric = parseFloat(toValue);
                    const interpolatedNumeric = interpolateNumeric(fromNumeric, toNumeric, progress);
                    result[key] = `${interpolatedNumeric}%`;
                } else {
                    throw new Error('Interpolación no compatible para valores de string');
                }
            } else if (typeof fromValue === 'number' && typeof toValue === 'number') {
                // Interpolación numérica
                const interpolatedNumeric = interpolateNumeric(fromValue, toValue, progress);
                result[key] = interpolatedNumeric;
            } else {
                result[key] = toValue || fromValue
            }
        }
    }

    return result;
}

export function parseRGBA(color: string): number[] {

    const rgba = [];
    if (color.startsWith('#')){
        color = color.substring(1);
    }
    
    if (color.length == 3){
        for(let i = 0; i < color.length; i++){
            rgba.push(parseInt(color[i], 16) * 16)
        }
        rgba.push(255)
    }
    else if (color.length == 6 || color.length == 8){
        for (let i =0;i < color.length; i+=2){
            rgba.push(parseInt(color.substring(i, i+2), 16))
        }
        if (color.length == 6){
            rgba.push(255)
        }
    }
    else{
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
