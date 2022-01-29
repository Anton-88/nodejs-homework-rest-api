import { jest } from '@jest/globals';
import { login } from './index';
import authService from '../../services/auth';
import { HttpCode } from '../../lib/constants';

describe('Unit test signUp', () => {
    let req, res, next;
    beforeEach(() => {
        req = { body: { email: 'test@gmail.com', password: '12345678' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn(data => data) };
        next = jest.fn();
    });

    test('Login with valid credentials', async () => {
        authService.getUser = jest.fn(async () => ({
            email: 'test@gmail.com',
            subscription: 'starter',
            id: 'dfdf1232sdsd',
        }));

        authService.getToken = jest.fn(async data => data);
        authService.setToken = jest.fn(async data => data);

        await login(req, res, next);

        expect(authService.getUser).toHaveBeenCalledWith(
            req.body.email,
            req.body.password,
        );
        expect(res.status).toHaveBeenCalledWith(HttpCode.OK);
        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                code: expect.any(Number),
                data: {
                    token: expect.anything(),
                    user: { email: expect.any(String), subscription: expect.any(String) },
                },
                status: expect.any(String),
            }),
        );
    });

    test('Login with invalid credentials', async () => {
        authService.getUser = jest.fn(async () => false);

        await login(req, res, next);

        expect(authService.getUser).toHaveBeenCalledWith(
            req.body.email,
            req.body.password,
        );
        expect(res.status).toHaveBeenCalledWith(HttpCode.UNAUTHORIZED);
    });

    test('DB error at log in', async () => {
        const testError = new Error('Database Error');
        authService.getUser = jest.fn(async () => {
            throw testError;
        });
        await login(req, res, next);
        expect(authService.getUser).toHaveBeenCalledWith(
            req.body.email,
            req.body.password,
        );
        expect(next).toHaveBeenCalledWith(testError);
    });
});