# Security Specification for Zanshin

## 1. Data Invariants
- A user document under `/users/{userId}` can only be read, created, or updated by the authenticated user whose `uid` matches the document key `{userId}`.
- Every user document MUST contain the fields: `uid`, `email`, `name`, and `progress`.
- The `uid` in the document MUST match the `request.auth.uid`.
- Timestamps `createdAt` and `updatedAt` must match the server's time (`request.time`) on create and update respectively.
- Users cannot access or modify any other user's training programs or history.

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads attempt to bypass security rules and MUST result in `PERMISSION_DENIED`.

1. **Spoofed UID Creation**: Authenticated user `user_A` tries to create a profile under `/users/user_B`.
2. **Missing Progress Object**: Creating a user document without the required `progress` object.
3. **Invalid Progress Types**: Setting `progress` field as a string instead of a map.
4. **Altering Immutable uid**: Attempting to update the `uid` of a document to a different value.
5. **No Authentication Read**: Unauthenticated request attempting to read `/users/user_A`.
6. **No Authentication Write**: Unauthenticated request attempting to write `/users/user_A`.
7. **Tampering with email**: Changing the profile's `email` field to match another user's email while using a spoofed UID.
8. **Forged Timestamps (Create)**: Creating a user document where `createdAt` is a hardcoded future date instead of `request.time`.
9. **Forged Timestamps (Update)**: Updating a user document where `updatedAt` is a hardcoded past date instead of `request.time`.
10. **Shadow Fields Injection**: Writing extra unapproved fields to the user document.
11. **Excessive Field Lengths**: Injecting a 2MB string into the user's `name` property.
12. **Unauthorized List Query**: Querying all users in the `users` collection without specifying an ownership constraint.

## 3. Evaluated Threat Matrix

| Threat | Prevention Strategy | Status |
|---|---|---|
| Identity Spoofing | Enforce `userId == request.auth.uid` and `incoming().uid == request.auth.uid` | PASS |
| State Shortcutting | Enforce schema validation in `isValidUser` | PASS |
| Resource Poisoning | Enforce max size limits on critical strings | PASS |
| Temporal Integrity | Enforce `createdAt == request.time` and `updatedAt == request.time` | PASS |
| Insecure Collection Listing | Default deny list operations on collection root | PASS |
