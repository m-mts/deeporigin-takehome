interface JSONPayload {
    url: string;
    method: string;
    headers?: Record<string, string>[];
    body?: string;
}

export default function validateJSON(input: string): boolean {
    let json: JSONPayload;

    if (!input.trim()) return true;

    try {
        json = JSON.parse(input);
    } catch (e) {
        throw new Error("Invalid JSON format.");
    }

    if (typeof json !== 'object' || json === null) {
        throw new Error("JSON must be a non-null object.");
    }

    if (typeof json.url !== 'string' || !isValidURL(json.url)) {
        throw new Error("Invalid URL format.");
    }

    if (typeof json.method !== 'string' || !isValidHTTPMethod(json.method)) {
        throw new Error("Invalid HTTP method. Allowed methods are: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS.");
    }

    if (json.headers !== undefined) {
        if (!Array.isArray(json.headers)) {
            throw new Error("Headers must be an array.");
        }

        if (!json.headers.every(isValidHeader)) {
            throw new Error("Each header must be a key-value pair where both key and value are strings.");
        }
    }

    if (json.body !== undefined && typeof json.body !== 'string') {
        throw new Error("Body must be a multiline string.");
    }

    return true;
}

function isValidURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

const validMethods = new Set<string>([ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS' ]);
function isValidHTTPMethod(method: string): boolean {
    return validMethods.has(method.toUpperCase());
}

function isValidHeader(header: Record<string, string>): boolean {
    if (typeof header !== 'object' || Object.keys(header).length !== 1) {
        return false;
    }

    const key = Object.keys(header)[ 0 ];
    const value = header[ key ];

    return typeof key === 'string' && typeof value === 'string';
}
