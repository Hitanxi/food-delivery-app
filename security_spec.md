# Security Specification for Gusto Food Delivery

## Data Invariants
1. Orders must belong to an authenticated user and point to a valid restaurant.
2. User profiles can only be modified by the owner.
3. Restaurants and menu items are read-only for public but managed by admins.
4. An order's status can only be moved through logical transitions (e.g., preparing -> delivering).

## The Dirty Dozen (Test Payloads)
1. **Identity Spoofing**: Attempt to update another user's bio.
2. **Loyalty Point Hack**: Try to increment own loyalty points by 1 million.
3. **Price Manipulation**: Create an order with items priced at $0.01.
4. **Status Shortcut**: Move order status from 'pending' directly to 'delivered'.
5. **Ghost Restaurant**: Create a menu item for a restaurant ID that doesn't exist.
6. **Shadow Field**: Add `isAdmin: true` to a user profile update.
7. **Resource Poisoning**: Use a 10KB string as a restaurant ID.
8. **Owner Change**: Try to update `userId` on an existing order.
9. **Zero-Trust Bypass**: Attempt to read private user addresses without authentication.
10. **Terminal State Edit**: Try to change the items in an order that is already 'delivered'.
11. **PII Blanket Leak**: Attempt to list all users' private bio info.
12. **Timestamp Fraud**: Set `createdAt` to a future date in an order request.
