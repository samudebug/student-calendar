import axios from 'axios';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

describe('/api/notifications', () => {
  const auth = getAuth();
  let classId = '';
  const testEmail = 'test@email.com';
  const testPassword = 'test123';
  const randomId = '6605cc4d2007414adc86ff27';
  beforeAll(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    const res = await axios.post('/api/classes', { name: 'testClass' });
    classId = res.data.id;
    await signOut(auth);
  }, 10000);
  afterAll(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    // delete the class
    await axios.delete(`/api/classes/${classId}`);
    await signOut(auth);
  });

  beforeEach(async () => {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    globalThis.loggedIn = true;
  });

  afterEach(async () => {
    await signOut(auth);
  });

  it('GET /api/notifications should return no notifications', async () => {
    const res = await axios.get('/api/notifications');
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(0);
  });

  it('POST /api/notifications should create a notification', async () => {
    const newNotification = {
      title: 'test title',
      body: 'test body',
      classId,
      data: JSON.stringify({ test: 'data' }),
    };
    const res = await axios.post('/api/notifications', newNotification, {
      headers: {
        'x-api-key': Buffer.from(process.env.API_KEY.trim()).toString('base64'),
      },
    });
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      id: expect.any(String),
      title: expect.stringMatching(newNotification.title),
      body: expect.stringMatching(newNotification.body),
      classId: expect.stringMatching(classId),
      data: expect.stringMatching(newNotification.data),
    });
  });

  it('POST /api/notifications should not work if the class does not exist', async () => {
    const newNotification = {
      title: 'test title',
      body: 'test body',
      classId: randomId,
      data: JSON.stringify({ test: 'data' }),
    };
    const res = await axios.post('/api/notifications', newNotification, {
      headers: {
        'x-api-key': Buffer.from(process.env.API_KEY.trim()).toString('base64'),
      },
    });
    expect(res.status).toBe(404);
  });

  it('GET /api/notifications should have one notification', async () => {
    const res = await axios.get('/api/notifications');
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(1);
  });
});
