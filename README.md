# BrewBoard – ZeroQueue Canteen Hack

A responsive campus canteen ordering demo built with HTML5, CSS3 and vanilla JavaScript.

## Features
- Responsive student menu with category filters and search
- Item customization, quantity controls and dynamic pricing
- Cart management and simulated UPI QR checkout
- Sequential pickup tokens and digital receipt
- Live preparing / ready pickup board
- Kitchen staff console with one-tap ready status
- Text-to-speech ready-token announcement
- Demo student wallet with add-credit control
- Lunch pickup-slot booking
- LocalStorage persistence and basic service-worker caching

## Run in Visual Studio Code
1. Extract `BrewBoard_ZeroQueue.zip`.
2. Open Visual Studio Code.
3. Select **File → Open Folder** and choose `BrewBoard_ZeroQueue`.
4. Install the **Live Server** extension (Ritwick Dey) if it is not installed.
5. Right-click `index.html` and select **Open with Live Server**.
6. The site opens in your browser. Test it by adding an item, customizing it, opening the cart and completing the simulated payment.
7. Use **Staff console** in the footer to mark an order ready. Open **Pickup display** to see the token move.

You can also run a local server from the project folder:
```bash
python -m http.server 5500
```
Then open `http://localhost:5500`.

## Demo walkthrough
1. Select **Cold Coffee** (₹40).
2. Choose **Extra ice cream** (+₹15).
3. Add it to your order and open the cart.
4. Continue to checkout and click **Pay now**. The demo wallet is charged; no real UPI payment occurs.
5. A sequential token is generated (the initial counter starts at #35).
6. Open the staff console and click **Mark ready** for that token.
7. Open the pickup display and see it move from **Now preparing** to **Ready for pickup**. If browser speech is supported, the token is announced.

## Important implementation notes
- This is a front-end mini-project prototype. It does not connect to a real payment provider, campus ID system, or shared backend.
- Data is stored in the current browser's LocalStorage. Multiple devices do not synchronize.
- The QR code uses the QRCode.js CDN library; an internet connection is needed to load that library. The simulated Pay Now flow remains available if the CDN fails.
- Service-worker caching requires serving the project over localhost or HTTPS. It cannot be fully tested by opening the HTML file directly.
- Browser storage can be cleared by the user; use a real backend/database for production deployment.

## Suggested future upgrades
- Node.js/Express API with a database for cross-device real-time order sync
- Authentication and staff roles
- Real payment gateway integration with server-side verification
- Inventory management and order analytics
- Push notifications for pickup-ready alerts
