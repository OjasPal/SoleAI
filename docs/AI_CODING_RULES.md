# AI CODING RULES

1. Inspect before editing. Summarize findings and your plan first, then implement.
2. Never rewrite the repository wholesale. Preserve every working feature. Edit incrementally. The app must run after this phase.
3. Components under ~250 lines. No duplicate components, conflicting styles or dead code.
4. No secrets in frontend code. Do not commit .env. Add .env.example.
5. No new dependencies or paid services except those explicitly allowed below. List anything added.
6. Label every simulated thing as simulated (Shopify, WhatsApp, Instagram, payments, orders, metrics). Never imply a real integration or real results.
7. Never claim a check passed unless you actually ran it. Say "not run" otherwise.
8. Finish with a report: files changed/added/deleted, dependencies added, commands to run, checks actually performed and their results, unresolved issues, assumptions.
