import axios from "axios";
import { addDays } from "date-fns";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

describe('/api/users', () => {
  const auth = getAuth();
  let classId = '';
  const testEmail = 'test@email.com';
  const testPassword = 'test123';
  beforeAll(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    // create class
    const res = await axios.post('/api/classes', { name: 'testClass' });
    classId = res.data.id;
    await signOut(auth);
  });
  afterAll(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    // create a class to hold all the tests
    const res = await axios.delete(`/api/classes/${classId}`,);
    await signOut(auth);
  })
  beforeEach(async () => {
    const testEmail = 'test@email.com';
    const testPassword = 'test123';
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    globalThis.loggedIn = true;
  }, 60000);
  afterEach(async () => {
    signOut(auth);
  }, 60000);
  it('PATCH /api/users/me should update the current user', async () => {
    const res = await axios.patch('/api/users/me', { name: 'testName' });
    const user = auth.currentUser;
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: expect.any(String),
      userId: expect.stringMatching(user.uid),
      name: expect.stringMatching('testName'),
      photoUrl: expect.any(String),
      fcmToken: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  }, 60000);

  it('GET /api/users/me should return info about the current user', async () => {
    const res = await axios.get('/api/users/me');
    const user = auth.currentUser;
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: expect.any(String),
      userId: expect.stringMatching(user.uid),
      name: expect.any(String),
      photoUrl: expect.any(String),
      fcmToken: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  }, 60000);

  it('GET /api/users/me/tasks should return no tasks', async () => {
    const res = await axios.get('/api/users/me/tasks');
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      total: expect.any(Number),
      page: expect.any(Number),
      results: expect.any(Array)
    });
  });

  it('GET /api/users/me/tasks should return one task after creating', async () => {
    const newTask = {
      name: 'testTask',
      deliverDate: addDays(new Date(), 1),
      notes: '',
    };
    await axios.post(`/api/classes/${classId}/tasks`, newTask);
    const res = await axios.get('/api/users/me/tasks');
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      total: expect.any(Number),
      page: expect.any(Number),
      results: expect.any(Array)
    });
  })
});
