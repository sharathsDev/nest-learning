import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should signup new user', async () => {
        const userName = 'Will Doe';
        const userEmail = 'Willdoe@example.com';
        return await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                name: userName,
                email: userEmail,
                password: "Willdoe123"
            })
            .expect(201)
            .then((response) => {
                const { id, name, email } = response.body;
                expect(id).toBeDefined();
                expect(name).toEqual(userName);
                expect(email).toEqual(userEmail);
            });
    });

    it('should signin as existing user', async () => {
        const userName = 'Will Doe';
        const userEmail = 'Willdoe@example.com';
        const res = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                email: userEmail,
                password: "Willdoe123"
            })
            .expect(201)

        const cookie = res.get('Set-Cookie');
        expect(cookie).toBeDefined();
        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie!)
            .expect(200)

        expect(body.email).toEqual(userEmail);
        expect(body.name).toEqual(userName);
    });
});
