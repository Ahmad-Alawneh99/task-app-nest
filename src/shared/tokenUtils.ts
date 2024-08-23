import * as jwt from 'jsonwebtoken';
// @TODO: make these more secret
export const signToken = (payload): string => {
	return jwt.sign(payload, 'tempKey');
};

export const verifyToken = (token) => {
	return jwt.verify(token, 'tempKey');
};
