REASONING.md

1. Problem Understanding

The application is a café rewards counter used by staff to manage members, record purchases, award points, redeem points, and keep the member's live points balance correct.

The core workflow is:

Staff authenticate.

Staff create or search for a member.

Staff record a purchase.

The system calculates points using the member's current tier.

Lifetime spending is updated.

The member's tier is recalculated.

The live points balance is updated.

The purchase is recorded in transaction history.

Earned points are recorded in a point ledger so that individual point batches can expire.

If the purchase causes a tier change, an outbox notification event is created.

Staff can redeem points.

The oldest available points are consumed first.

A clock endpoint can trigger expiration of points that are 90 days old.

The application was implemented as a MERN full-stack product.

2. Technology Choice

Frontend

React

Vite

React Router

Axios

Tailwind CSS

React was selected because the counter UI is composed of reusable views and components such as the dashboard, member details, purchase flow, and redemption flow.

Backend

Node.js

Express.js

Mongoose

JWT

bcryptjs

cookie-parser

CORS

Express provides a simple REST API layer while Mongoose provides schema validation and MongoDB persistence.

Database

MongoDB Atlas is used as the real persistent database.

3. Application Architecture

The application follows a client/server architecture:

React Client
     |
     | REST API / HTTP
     v
Express Server
     |
     v
MongoDB Atlas

Authentication is handled by the backend using JWTs stored in HttpOnly cookies.

The backend is responsible for all reward calculations and balance changes so that the frontend cannot decide how many points a member should receive.

4. Database Design

User

Stores staff authentication information.

Important fields:

name

email

password hash

refresh token hash

Member

Stores the current state of a café member.

Important fields:

name

phone

points

tier

totalSpend

The phone number is indexed and unique because staff need to look members up by phone number.

Transaction

Stores purchase and redemption history.

Important fields:

member

type

amount

points

description

timestamps

A purchase stores positive earned points. A redemption stores negative points.

PointLedger

The point ledger stores individual earned point batches.

Important fields:

member

points

remainingPoints

source

expiresAt

This was introduced because storing only the current balance would not be enough to determine which points should expire.

OutboxEvent

Stores integration events that can later be consumed by a Notification Service.

Important fields:

type

member

payload

processed

timestamps

5. Reward Calculation

Reward rules are centralized in:

server/src/services/rewards.service.js

This keeps tier and earning logic separate from HTTP controllers.

A purchase calculates points using the member's tier before that purchase. After the purchase, lifetime spending is updated and the tier is recalculated.

This prevents a purchase that crosses a threshold from accidentally receiving the newly upgraded tier's rate unless the supplied reward rules explicitly require that behavior.

The Platinum rule from the twist is represented separately from the existing tier rules so that backward-compatible behavior can be maintained.

6. Backward Compatibility

The Platinum twist requires existing members to remain unchanged unless they now qualify for the new tier.

The implementation therefore:

preserves the existing member balance;

recalculates the tier after a purchase;

does not rewrite historical transactions;

only changes the tier when the member's lifetime spending qualifies for a different tier.

The reward configuration is centralized so that the exact assessment-supplied Bronze/Silver/Gold rules can be maintained without changing controller logic.

7. Point Expiration

Points expire if unused for 90 days.

Each purchase creates a PointLedger entry containing an expiresAt date.

The expiration process:

Finds ledger entries whose expiresAt is less than or equal to the supplied clock time.

Checks the remaining points.

Removes those points from the member's live balance.

Marks the ledger points as no longer available.

Records an expiration transaction.

The POST /clock endpoint accepts an optional timestamp. This makes expiration deterministic during evaluation instead of requiring the evaluator to wait 90 real days.

8. Redemption Strategy

Redemption uses the point ledger and consumes the oldest expiring points first.

For example:

Batch A -> 100 points -> expires earlier
Batch B -> 100 points -> expires later

If the member redeems 50 points, 50 points are consumed from Batch A first.

This FIFO-by-expiration approach reduces unnecessary point expiration and gives deterministic redemption behavior.

9. Tier Upgrade Notifications

When a purchase changes the member's tier:

oldTier !== newTier

an outbox event with type:

TIER_UPGRADED

is created.

The event contains the member information and the old/new tier.

The outbox pattern avoids making the purchase operation dependent on a live external Notification Service. A Notification Service can consume these events later.

The evaluator can inspect the generated events through:

GET /outbox

10. Search, Pagination and Sorting

The member list can become large, so the API supports:

search

pagination

sorting

Search is performed against member name and phone number.

Pagination uses page and limit parameters.

Sorting is controlled through sortBy and order.

This keeps the UI responsive and avoids returning the complete member collection on every request.

11. Authentication and Security

The application uses:

bcrypt for password hashing;

JWT access tokens;

JWT refresh tokens;

HttpOnly cookies;

protected backend routes;

CORS configured for the frontend origin.

The frontend does not store JWT tokens in localStorage.

The refresh token is stored as a hash in MongoDB rather than storing the raw refresh token.

12. Testing and Debugging

Backend startup

The backend was tested using:

cd server
npm run dev

Successful startup produced:

MongoDB connected: ...
Server running on port 5000

Codespaces networking issue

During development, the frontend initially attempted to access:

http://localhost:5000

from a browser while the backend was running inside GitHub Codespaces.

The backend port was therefore forwarded through Codespaces and the frontend API base URL was changed to the forwarded backend URL.

CORS issue

The browser initially reported:

No 'Access-Control-Allow-Origin' header is present

A curl request showed that the Codespaces proxy was returning a 302 authentication redirect for the private port.

The backend port was made public.

After that, the response reached Express and returned:

401 Authentication required

with the correct CORS headers.

A second CORS issue was caused by a trailing slash in CLIENT_URL.

Incorrect:

https://...-5173.app.github.dev/

Correct:

https://...-5173.app.github.dev

The exact origin then matched the browser origin.

Authentication redirect loop

An authentication refresh loop was identified in the Axios interceptor.

The application initially attempted to refresh the access token whenever /auth/me returned 401. Since /auth/me is expected to return 401 when no user is logged in, this could cause repeated redirects.

The interceptor was changed so that /auth/me does not trigger the refresh flow. Protected-route navigation handles unauthenticated users instead.

13. Verification Scenarios

The following scenarios should be tested before submission:

Registration

Register a new staff user.

Verify the account is persisted in MongoDB.

Login

Login with valid credentials.

Verify authenticated requests work.

Verify invalid credentials are rejected.

Member creation

Create a member.

Verify the member persists after refreshing the page.

Search

Search using part of a member's phone number.

Search using part of a member's name.

Pagination

Create enough members to exceed one page.

Navigate between pages.

Sorting

Sort by supported member fields in ascending and descending order.

Purchase

Verify:

transaction is created;

lifetime spending increases;

correct points are earned;

live balance increases;

ledger entry is created.

Tier upgrade

Make a purchase that crosses a tier threshold and verify:

tier changes;

points remain correct;

an outbox event is created.

Redemption

Verify:

insufficient points are rejected;

live balance decreases;

redemption transaction is created;

oldest point batches are consumed first.

Expiration

Create points, move the clock beyond their expiry date, and call:

POST /clock

Verify:

expired points are removed from the live balance;

ledger points are no longer available;

expiration transaction is recorded.

14. Design Trade-offs

The current implementation favors a straightforward architecture suitable for a short timed build.

The member document keeps the current live balance for fast reads, while PointLedger preserves enough information to handle expiration and redemption correctly.

The outbox is stored in MongoDB rather than calling an external service synchronously, which keeps the core purchase operation independent from external notification availability.

15. Final Outcome

The resulting application provides a usable café rewards counter with:

persistent members;

authentication;

search;

pagination;

sorting;

purchase processing;

tier-based rewards;

Platinum support;

redemption;

point expiration;

deterministic clock testing;

tier-upgrade notifications through an outbox.

The frontend provides the staff-facing UI while the backend remains the source of truth for reward calculations and balances.