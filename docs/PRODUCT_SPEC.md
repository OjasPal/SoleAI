# SoleAI

## 1. Product

**SoleAI is an AI sales and order assistant for footwear brands.** It plugs into the channels where Indian D2C footwear actually sells (Shopify or WooCommerce store, WhatsApp, Instagram DMs) and handles the work between “customer shows interest” and “parcel delivered and kept.”

The one-line pitch: **“Turn DMs into orders, and cut COD returns.”**

We are **not** building a new e-commerce platform. The store, checkout, and payments stay on Shopify/WooCommerce. SoleAI is the intelligence and automation layer on top, which is also why we can build it fast.

## 2. Target Customer

**Primary buyer:** the founder or owner of a small, growing footwear brand.

- Roughly 50 to 500 orders a month (assumption to test)
- Sells through Instagram, WhatsApp, and a Shopify or similar store
- Runs ads on Meta, so they already pay for every click and feel every lost enquiry
- Has 1 to 3 staff, not a support team

**Who uses it daily:** the owner, plus whoever replies to DMs and packs orders.

**Not the target (for now):** large brands with in-house tech teams, and marketplace-only sellers on Amazon/Flipkart, who don’t control the customer conversation.

## 3. Customer Problems

Problems the **merchant** feels, ranked by money:

1. **Lost sales from slow replies.** Late-night DMs and ad clicks go cold.
2. **COD returns to origin (RTO).** Unconfirmed COD orders get refused or undelivered, and the brand pays shipping both ways.
3. **Size and fit uncertainty.** Footwear is a size-sensitive product, and wrong-size purchases create returns and exchanges.
4. **Repetitive questions.** Size availability, price, COD, delivery time, and return policy are answered by hand dozens of times a day.
5. **Messy order tracking.** Orders from DMs, website, and WhatsApp live in separate places.
6. **“Where is my order?” messages** consuming hours each week.
7. **Abandoned carts and cold leads** that nobody follows up on.

Problems the **shopper** feels: not knowing if their size is in stock, not trusting the fit, slow answers, and uncertainty about returns.

## 4. Customer Journey

1. **Entry:** the shopper arrives from a Meta ad, Instagram DM, WhatsApp click, or the website, where a chat widget greets them.
2. **Discovery:** the assistant asks 2 or 3 quick things (occasion, style, budget, size) and recommends products with images and live size availability.
3. **Confidence:** it answers fit questions, (“runs half a size small, go one up”), COD, delivery time, and returns, in English or Hinglish, from the brand’s own catalogue and policies.
4. **Decision:** it sends a direct checkout link or UPI/payment link for the exact product and size.
5. **Confirmation:** the order is confirmed on WhatsApp. For COD, the shopper gets a one-tap “confirm your order” message, which is where RTO gets reduced.
6. **After purchase:** shipping updates, order-status answers, and a simple exchange or return flow.
7. **Re-engagement:** abandoned-cart reminders, a review request, and restock or new-drop messages.
8. **Handoff:** if the assistant isn’t sure, or the customer is upset, it passes the chat to the owner with the full context, so the customer never repeats themselves.

## 5. Merchant Journey

**Onboarding (target: under 30 minutes):**

- Connect Shopify or upload a product CSV, and upload policies and FAQs
- Set brand tone and rules (discount limits, what the bot must never promise)
- Connect WhatsApp (and Instagram later)

**Daily use, the owner opens one dashboard:**

- **Needs You:** conversations the AI handed off, with context
- **Today’s numbers:** enquiries handled, response time, orders influenced by the AI, COD orders confirmed or cancelled
- **Unanswered questions:** gaps in the catalogue or policies, one tap to add an answer
- **Order view:** orders from all channels in one list with status

**Weekly:** a WhatsApp summary (“This week SoleAI handled 312 chats, captured 41 orders, confirmed 27 COD orders”). This report is what keeps them paying.

**Controls:** pause the bot, edit answers, update stock rules, and set discount permissions.

## 6. MVP Features

You asked for everything we think we need, so here it is, **tiered** so the list doesn’t become a six-month build.

**V1: the demo and first pilot (build this first):**

- Catalogue ingestion (CSV or Shopify) with live size and stock lookup as structured data
- AI shopping assistant (website chat widget) answering product, price, size, COD, delivery, and return questions, in English and Hinglish
- Size and fit guidance from the brand’s own size chart
- Product recommendations with images
- Lead and order-intent capture, plus checkout or payment link
- Human handoff with conversation context
- Merchant dashboard: conversations, “Needs You” queue, unanswered-questions log
- A fictional but realistic demo brand (30 to 50 products with sizes) to show prospects

**V2: after the first paid clients:**

- WhatsApp integration (the main channel, so this moves up fast)
- COD confirmation flow
- Order status lookup (“where is my order?”)
- Abandoned-cart recovery
- Exchange and return workflow
- Weekly WhatsApp report to the owner

**V3: only when customers ask for it:**

- Instagram DM automation
- Restock and new-drop broadcasts
- Review collection
- Customer analytics and size-return insights
- Multi-store and multi-brand accounts, billing, self-serve onboarding