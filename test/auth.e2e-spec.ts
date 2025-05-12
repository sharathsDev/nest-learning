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

    it('signup new user', () => {
        const userName = 'Dell Doe';
        const userEmail = 'Delldoe@example.com';
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                name: userName,
                email: userEmail,
                password: "Delldoe123"
            })
            .expect(201)
            .then((response) => {
                const { id, name, email } = response.body;
                expect(id).toBeDefined();
                expect(name).toEqual(userName);
                expect(email).toEqual(userEmail);
            });
    });
});
