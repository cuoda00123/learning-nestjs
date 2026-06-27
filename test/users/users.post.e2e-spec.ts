import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { dropDatabase } from '../helpers/drop-database.helpers';
import { bootstrapNestApplication } from '../helpers/bootstrap-nest-application.helper';
import { ConfigService } from '@nestjs/config';
import { completeUser, missingEmail, missingFirstName, missingPassword } from './users.post.e2e-spec.sample-data';

describe('[Users] @Postn Endpoint', () => {
  let app: INestApplication<App>;
  let config: ConfigService;
  let httpServer: App;
  beforeEach(async () => {
    app = await bootstrapNestApplication();
    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  it('/users - Endpoint is public', () => {
    //console.log(completeUser);
    return request(httpServer).post('/users').send({});
  });
  it('/users - firstName is mandatory', () => {
    return request(httpServer).post('/users').send(missingFirstName).expect(400);
  });
  it('/users - email is mandatory', () => {
    return request(httpServer).post('/users').send(missingEmail).expect(400);
  });
  it('/users - password is mandatory', () => {
    return request(httpServer).post('/users').send(missingPassword).expect(400);
  });
  it('/users - Valid request successfully creates user', async () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.firstName).toBe(completeUser.firstName);
        expect(body.data.lastName).toEqual(completeUser.lastName);
        expect(body.data.email).toEqual(completeUser.email);
        // expect(body.data.password).toEqual(completeUser.password);
        console.log(body);
      });
  });
  it('/users - password is not returned in response', async () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.password).toBeUndefined();
      });
  });
  it('/users - googleId is not returned in response', async () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.googleId).toBeUndefined();
      });
  });
});
