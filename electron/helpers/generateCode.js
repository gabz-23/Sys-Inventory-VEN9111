import { customAlphabet } from 'nanoid';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateCode = ({ tag }) => {
    const customCode = customAlphabet(alphabet, 5);
    return `${tag}-${customCode(5)}`.trim();
};

export const generateUniqueSerial = (originalSerial, maxLength = 30) => {
    const random = customAlphabet(alphabet, 5);
    if (!originalSerial) {
        return `SN-${random(5)}-${random(5)}`;
    }
    const suffix = `-${random(5)}`;
    const maxBaseLength = maxLength - suffix.length;
    const base = originalSerial.substring(0, maxBaseLength);
    return `${base}${suffix}`;
};
