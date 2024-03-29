import axios from 'axios';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
describe('/api/classes', () => {
  const auth = getAuth();
  beforeEach(async () => {
    const testEmail = 'test@email.com';
    const testPassword = 'test123';
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    globalThis.loggedIn = true;
  }, 60000);
  afterEach(async () => {
    signOut(auth);
  }, 60000);
  it('GET /api/classes should return no classes', async () => {
    const res = await axios.get('/api/classes');
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(0);
  }, 60000);

  const randomId = '6605cc4d2007414adc86ff27';

  let createdClass: any = {};
  it('POST /api/classes should create a new class', async () => {
    const newClass = { name: 'testClass' };
    const user = auth.currentUser;
    const res = await axios.post('/api/classes', newClass);
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      id: expect.any(String),
      name: expect.stringMatching(newClass.name),
      code: expect.any(String),
      createdBy: expect.stringMatching(user.uid),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    createdClass = res.data;
  }, 60000);

  it('GET /api/classes should have the created class', async () => {
    const res = await axios.get('/api/classes');
    const user = auth.currentUser;
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(1);
    expect(res.data[0]).toMatchObject({
      id: expect.stringMatching(createdClass.id),
      name: expect.stringMatching(createdClass.name),
      code: expect.stringMatching(createdClass.code),
      createdBy: expect.stringMatching(user.uid),
      createdAt: expect.stringMatching(createdClass.createdAt),
      updatedAt: expect.stringMatching(createdClass.updatedAt),
    });
  }, 60000);

  it('GET /api/classes/:id should return the class', async () => {
    const res = await axios.get(`/api/classes/${createdClass.id}`);
    const user = auth.currentUser;
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: expect.stringMatching(createdClass.id),
      name: expect.stringMatching(createdClass.name),
      code: expect.stringMatching(createdClass.code),
      createdBy: expect.stringMatching(user.uid),
      students: expect.any(Array),
      createdAt: expect.stringMatching(createdClass.createdAt),
      updatedAt: expect.stringMatching(createdClass.updatedAt),
    });
  }, 60000);

  it('GET /api/classes/:id should return error if the class does not exist', async () => {
    const res = await axios.get(`/api/classes/${randomId}`);
    expect(res.status).toBe(404);
  }, 60000);

  it('PATCH /api/classes/:id should update the class', async () => {
    const res = await axios.patch(`/api/classes/${createdClass.id}`, {
      name: 'newName',
    });
    const user = auth.currentUser;
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: expect.stringMatching(createdClass.id),
      name: expect.stringMatching('newName'),
      code: expect.stringMatching(createdClass.code),
      createdBy: expect.stringMatching(user.uid),
      createdAt: expect.stringMatching(createdClass.createdAt),
      updatedAt: expect.any(String),
    });
  }, 60000);

  it('PATCH /api/classes/:id should error out if the class does not exist', async () => {
    const res = await axios.patch(`/api/classes/${randomId}`, {
      name: 'newName',
    });
    expect(res.status).toBe(404);
  }, 60000);

  it('PATCH /api/classes/:id should error out if the user is not authorized', async () => {
    await signOut(auth);
    const altTestEmail = 'alt_test@email.com';
    const altTestPassword = 'test123';
    await signInWithEmailAndPassword(auth, altTestEmail, altTestPassword);
    const res = await axios.patch(`/api/classes/${createdClass.id}`, {
      name: 'newName',
    });
    expect(res.status).toBe(401);
  }, 60000);

  it('DELETE /api/classes/:id should error out if the user is not authorized', async () => {
    await signOut(auth);
    const altTestEmail = 'alt_test@email.com';
    const altTestPassword = 'test123';
    await signInWithEmailAndPassword(auth, altTestEmail, altTestPassword);
    const deleteRes = await axios.delete(`/api/classes/${createdClass.id}`);
    expect(deleteRes.status).toBe(401);
  }, 60000);

  it('DELETE /api/classes/:id should delete the class', async () => {
    const deleteRes = await axios.delete(`/api/classes/${createdClass.id}`);
    expect(deleteRes.status).toBe(200);
    const fetchRes = await axios.get('/api/classes');
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.data).toHaveLength(0);
  }, 60000);

  it('DELETE /api/classes/:id should error out if the class does not exist', async () => {
    const res = await axios.delete(`/api/classes/${randomId}`);
    expect(res.status).toBe(404);
  }, 60000);
});
