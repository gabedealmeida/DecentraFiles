const app = require('./serverTest');
const request = require('supertest');

describe('Upload File Post Endpoint', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).post(
      '/?fileName=tardigrade1.0&maxDownloads=12&expirationHours=1&fileType=Text'
    );

    expect(res.statusCode).toEqual(200);
  });

  it('should return content in JSON', async () => {
    const res = await request(app).post(
      '/?fileName=tardigrade1.0&maxDownloads=12&expirationHours=1&fileType=Text'
    );

    expect(res.header['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  it('should return file object', async () => {
    const res = await request(app).post(
      '/?fileName=tardigrade1.0&maxDownloads=12&expirationHours=1&fileType=Text'
    );

    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('download_count');
    expect(res.body).toHaveProperty('expiration');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('max_download_count');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('type');
  });

  it('file object should contain the query parameters', async () => {
    const res = await request(app).post(
      '/?fileName=tardigrade1.0&maxDownloads=12&expirationHours=1&fileType=Text'
    );

    expect(res.body.name).toEqual('tardigrade1.0');
  });

  it('should return a 500 status code', async () => {
    const res = await request(app).post('/');

    expect(res.statusCode).toEqual(500);
  });

  it('should return an error object', async () => {
    const res = await request(app).post('/');

    expect(res.body).toHaveProperty('error');
  });
});
