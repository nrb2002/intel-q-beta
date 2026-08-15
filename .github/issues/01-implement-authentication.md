Title: Implement Authentication (Sign up / Login)

Description:
Implement user sign up and login endpoints and basic session handling for Intel-Q. Users must be able to create an account, log in, and maintain a session to access queue management features.

Acceptance Criteria:
- POST `/api/auth/signup` creates a user for valid email/password and returns a session token.
- POST `/api/auth/login` authenticates valid credentials and returns a session token.
- Invalid credentials return appropriate 4xx responses.

Priority: P1
Labels: backend, auth, P1

Checklist:
- [ ] Implement signup handler
- [ ] Implement login handler
- [ ] Add server-side validation
- [ ] Add tests for signup and login
