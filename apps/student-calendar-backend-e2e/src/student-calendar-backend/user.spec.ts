import axios from "axios";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

describe('/api/users', () => {
  const auth = getAuth();
  beforeEach(async () => {
    const testEmail = 'test@email.com';
    const testPassword = 'test123';
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    globalThis.loggedIn = true;
  });
  afterEach(async () => {
    signOut(auth);
  });
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
  });

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
  });


});
