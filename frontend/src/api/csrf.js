import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CSRF_SECRET;

const base64UrlEncode = (source) => {
    // Encode in classical Base64
    let encoded = CryptoJS.enc.Base64.stringify(source);
    // Remove padding equal characters
    encoded = encoded.replace(/=+$/, '');
    // Replace characters according to Base64Url specifications
    encoded = encoded.replace(/\+/g, '-');
    encoded = encoded.replace(/\//g, '_');
    return encoded;
};

const getSecretKey = () => {
    if (!SECRET_KEY) {
        console.error("VITE_CSRF_SECRET is missing!");
        return '';
    }
    // Laravel APP_KEY is usually "base64:..." which means it's base64 encoded.
    // We need to decode it to get the actual binary key for HMAC to match backend.
    if (SECRET_KEY.startsWith('base64:')) {
        const rawBase64 = SECRET_KEY.substring(7);
        return CryptoJS.enc.Base64.parse(rawBase64);
    }
    return SECRET_KEY;
};

export const generateCsrfToken = (userUuid) => {
    if (!userUuid) return null;

    const payload = {
        user_id: userUuid,
        timestamp: Math.floor(Date.now() / 1000),
        nonce: CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex), // Random hex string
        version: 'v1'
    };

    // 1. Stringify Payload
    // Key order is determined by browser implementation of JSON.stringify, 
    // but usually consistent enough for simple objects. 
    // Ideally we should sort keys, but backend uses whatever string we send.
    // Backend: $jsonPayload = base64UrlDecode($encodedPayload);
    // Backend signs $jsonPayload. 
    // So as long as we sign what we send, it's fine.
    const jsonPayload = JSON.stringify(payload);

    // 2. Encode Payload
    const payloadWordArr = CryptoJS.enc.Utf8.parse(jsonPayload);
    const encodedPayload = base64UrlEncode(payloadWordArr);

    // 3. Sign the JSON Payload (NOT the encoded payload, based on VerifyCustomCsrfToken.php line 76 and 92)
    // $expectedSignature = hash_hmac('sha256', $jsonPayload, ...);
    // So we sign 'jsonPayload' string.
    const secret = getSecretKey();
    const signatureWordArr = CryptoJS.HmacSHA256(jsonPayload, secret);

    // 4. Encode Signature
    const encodedSignature = base64UrlEncode(signatureWordArr);

    return `${encodedPayload}.${encodedSignature}`;
};
