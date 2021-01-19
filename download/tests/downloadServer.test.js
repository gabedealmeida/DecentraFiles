const app = require('./serverTest');
const request = require('supertest');

describe('Retrieve Files Get Endpoint', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/?limit=10&offset=12');

    expect(res.statusCode).toEqual(200);
  });

  it('should return content in JSON', async () => {
    const res = await request(app).get('/?limit=10&offset=12');

    expect(res.header['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  it('should return three file objects', async () => {
    const res = await request(app).get('/?limit=10&offset=12');

    expect(res.body.length).toEqual(3);
  });

  it('should return a 500 status code', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(500);
  });

  it('should return an error object', async () => {
    const res = await request(app).get('/');

    expect(res.body).toHaveProperty('error');
  });
});

describe('Retrieve Total Number of Files Get Endpoint', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/totalnumberoffiles');

    expect(res.statusCode).toEqual(200);
  });

  it('should return content in JSON', async () => {
    const res = await request(app).get('/totalnumberoffiles');

    expect(res.header['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  it('should return a count object', async () => {
    const res = await request(app).get('/totalnumberoffiles');

    expect(res.body).toHaveProperty('count');
  });
});

describe('Retrieve a Tardigrade URL Get Endpoint', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/download?id=73');

    expect(res.statusCode).toEqual(200);
  });

  it('should return content in JSON', async () => {
    const res = await request(app).get('/download');

    expect(res.header['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  it('should return a url and file object', async () => {
    const res = await request(app).get('/download?id=73');

    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('file');
  });

  it('file object should contain the query parameter', async () => {
    const res = await request(app).get('/download?id=73');

    expect(res.body.file.id).toEqual(73);
  });

  it('should return a 500 status code', async () => {
    const res = await request(app).get('/download');

    expect(res.statusCode).toEqual(500);
  });

  it('should return an error object', async () => {
    const res = await request(app).get('/download');

    expect(res.body).toHaveProperty('error');
  });
});

describe('Retrieve All Metrics Get Endpoint', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/metrics');

    expect(res.statusCode).toEqual(200);
  });

  it('should return content in JSON', async () => {
    const res = await request(app).get('/metrics');

    expect(res.header['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  it('should return metrics object', async () => {
    const res = await request(app).get('/metrics');

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('total_download_count');
    expect(res.body).toHaveProperty('total_upload_count');
  });
});
