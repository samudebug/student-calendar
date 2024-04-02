import axios from 'axios';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDays } from 'date-fns';

describe('/api/classes/:id/tasks', () => {
  const auth = getAuth();
  let classId = '';
  const testEmail = 'test@email.com';
  const testPassword = 'test123';
  const randomId = '6605cc4d2007414adc86ff27';
  let createdTask: any = {};
  beforeAll(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    // create a class to hold all the tests
    const res = await axios.post('/api/classes', { name: 'testClass' });
    classId = res.data.id;
    await signOut(auth);
  }, 60000);
  afterAll(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    // create a class to hold all the tests
    const res = await axios.delete(`/api/classes/${classId}`, );
    await signOut(auth);
  })
  beforeEach(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);

    globalThis.loggedIn = true;
  }, 60000);
  afterEach(async () => {
    signOut(auth);
  });

  it('GET /api/classes/:id/tasks should return no tasks', async () => {
    const res = await axios.get(`/api/classes/${classId}/tasks`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(0);
  }, 60000);

  it('GET /api/classes/:id/tasks should error out if the class does not exist', async () => {
    const res = await axios.get(`/api/classes/${randomId}/tasks`);
    expect(res.status).toBe(404);
  }, 60000);

  it('GET /api/classes/:id/tasks should error out if the student is not in the class', async () => {
    await signOut(auth);
    const altTestEmail = 'alt_test@email.com';
    const altTestPassword = 'test123';
    await signInWithEmailAndPassword(auth, altTestEmail, altTestPassword);
    const res = await axios.get(`/api/classes/${classId}/tasks`);
    expect(res.status).toBe(401);
  }, 60000);

  it('POST /api/classes/:id/tasks should create the task', async () => {
    const newTask = {
      name: 'testTask',
      deliverDate: addDays(new Date(), 1),
      notes: '',
    };
    const res = await axios.post(`/api/classes/${classId}/tasks`, newTask);
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      id: expect.any(String),
      name: expect.stringMatching(newTask.name),
      deliverDate: expect.any(String),
      notes: expect.stringMatching(newTask.notes),
      createdBy: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    createdTask = res.data;
  }, 60000);

  it('POST /api/classes/:id/tasks should error out if the class does not exist', async () => {
    const newTask = {
      name: 'testTask',
      deliverDate: addDays(new Date(), 1),
      notes: '',
    };
    const res = await axios.post(`/api/classes/${randomId}/tasks`, newTask);
    expect(res.status).toBe(404);
  }, 60000);

  it('POST /api/classes/:id/tasks should error out if the student is not in the class', async () => {
    await signOut(auth);
    const altTestEmail = 'alt_test@email.com';
    const altTestPassword = 'test123';
    await signInWithEmailAndPassword(auth, altTestEmail, altTestPassword);
    const newTask = {
      name: 'testTask',
      deliverDate: addDays(new Date(), 1),
      notes: '',
    };
    const res = await axios.post(`/api/classes/${classId}/tasks`, newTask);
    expect(res.status).toBe(401);
  }, 60000);

  it('GET /api/classes/:id/tasks should return one task', async () => {
    const res = await axios.get(`/api/classes/${classId}/tasks`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(1);
  }, 60000);

  it('GET /api/classes/:id/tasks/:id should return the new task', async () => {
    const res = await axios.get(
      `/api/classes/${classId}/tasks/${createdTask.id}`
    );
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: expect.stringMatching(createdTask.id),
      name: expect.stringMatching(createdTask.name),
      notes: expect.stringMatching(createdTask.notes),
      deliverDate: expect.stringMatching(createdTask.deliverDate),
      createdBy: expect.stringMatching(createdTask.createdBy),
      createdAt: expect.stringMatching(createdTask.createdAt),
      updatedAt: expect.stringMatching(createdTask.updatedAt),
      student: expect.anything(),
    });
  }, 60000);

  it('GET /api/classes/:id/tasks/:id should error out if the task does not exist', async () => {
    const res = await axios.get(`/api/classe/${classId}/tasks/${randomId}`);
    expect(res.status).toBe(404);
  }, 60000);

  it('PATCH /api/classes/:id/tasks/:id should update the task', async () => {
    const res = await axios.patch(
      `/api/classes/${classId}/tasks/${createdTask.id}`,
      { name: 'newName' }
    );
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: expect.stringMatching(createdTask.id),
      name: expect.stringMatching('newName'),
      notes: expect.stringMatching(createdTask.notes),
      deliverDate: expect.stringMatching(createdTask.deliverDate),
      createdBy: expect.stringMatching(createdTask.createdBy),
      createdAt: expect.stringMatching(createdTask.createdAt),
      updatedAt: expect.any(String),
    });
  }, 60000);

  it('PATCH /api/classes/:id/tasks/:id should error out if the task does not exist', async () => {
    const res = await axios.patch(
      `/api/classes/${classId}/tasks/${randomId}`,
      { name: 'newName' }
    );
    expect(res.status).toBe(404);
  }, 60000);

  it('PATCH /api/classes/:id/tasks/:id should error out if the user updating the task is not the creator', async () => {
    await signOut(auth);
    const altTestEmail = 'alt_test@email.com';
    const altTestPassword = 'test123';
    await signInWithEmailAndPassword(auth, altTestEmail, altTestPassword);
    const res = await axios.patch(
      `/api/classes/${classId}/tasks/${createdTask.id}`,
      { name: 'newName' }
    );
    expect(res.status).toBe(401);
  }, 60000);

  it('DELETE /api/classes/:id/tasks/:id should error out if the user deleting the task is not the creator', async () => {
    await signOut(auth);
    const altTestEmail = 'alt_test@email.com';
    const altTestPassword = 'test123';
    await signInWithEmailAndPassword(auth, altTestEmail, altTestPassword);
    const res = await axios.delete(
      `/api/classes/${classId}/tasks/${createdTask.id}`
    );
    expect(res.status).toBe(401);
  }, 60000);

  it('DELETE /api/classes/:id/tasks/:id should error out if the task does not exist', async () => {
    const res = await axios.delete(
      `/api/classes/${classId}/tasks/${randomId}`
    );
    expect(res.status).toBe(404);
  }, 60000);

  it('DELETE /api/classes/:id/tasks/:id should delete the task', async () => {
    const deleteRes = await axios.delete(`/api/classes/${classId}/tasks/${createdTask.id}`);
    expect(deleteRes.status).toBe(200);
    const fetchRes = await axios.get(`/api/classes/${classId}/tasks`);
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.data).toHaveLength(0);

  }, 60000)
});
