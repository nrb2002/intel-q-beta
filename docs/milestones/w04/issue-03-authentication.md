# Implementation Guide – Authentication

## Prerequisites

Postgres working

---

## Step 1

Install Auth.js

```bash
npm install next-auth
```

---

## Step 2

Create

```
src/auth.ts
```

Configure Auth.js.

---

## Step 3

Create authentication API route

```
app/api/auth/[...nextauth]/route.ts
```

---

## Step 4

Configure Credentials Provider.

---

## Step 5

Hash passwords using bcrypt.

---

## Step 6

Create Register page

```
/register
```

---

## Step 7

Create Login page

```
/login
```

---

## Step 8

Protect dashboard routes.

---

## Step 9

Add Logout button.

---

## Test Checklist

✓ Register

✓ Login

✓ Logout

✓ Session persists

✓ Unauthorized users redirected

---

## Definition of Done

Authentication is fully operational.