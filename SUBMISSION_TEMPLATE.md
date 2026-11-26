# Submission: [Your Name]

## Time Spent

Total time: **4h 30min** (approximate)

## Ticket Triage

### Tickets I Addressed

List the ticket numbers you worked on, in the order you addressed them:

1. **CFG-148**: I've removed the condition which caused the app crash on deselecting "Include Packaging", added the resize handler cleanup (missing),
   commented out lefthook blockers (marked as TODO), improved validation logic and state updates (removed state setters from useEffects), removed unnecessary useCallbacks,
   added default values for quick add (assumption that quickAdd should add default product), added errror msg instad of codes(I guess that's part of CFG-151)

2. **CFG-142**: mian blocker was comparing date timestamp to requestId(passed as response.timestamp), I've fix updates in usePriceCalculation hooks, changed confusing key naming for api return value, corrected types
3. **CFG-145**: added event listener for crtl+enter keys to quickAdd - needed to move some funcs up (no problem if they were imported)
4. **CFG-152**: checked all affected areas found in audit, added modal focus fix and improved compliance with accessibility
5. **CFG-154**: fixed quantity discount in accordance with info from ticket, not from CONTEXT.md (mentioned 10% instead of 15%):Marketing page + public docs say "50+ items get 15% off"

### Tickets I Deprioritized

List tickets you intentionally skipped and why:

| Ticket  | Reason                                                                                                |
| ------- | ----------------------------------------------------------------------------------------------------- |
| CFG-143 | didn't have time to check sustained use ;)                                                            |
| CFG-144 | it's older than 145 and seemed depraceted and not in line with client request                         |
| CFG-146 | I've dind't have time to get into drafts, also they were not critical for demo                        |
| CFG-147 | I've dind't have time to investigate, should be priority after demo, also not confirmed as prod issue |
| CFG-149 | nice to have I forgot about, although it's a quick fix                                                |
| CFG-150 | let's focus demo on desktop version, after it shouldn't take long to fix                              |
| CFG-151 | I've added presenting error.message instead of error.code but didn't test it due to time limitation   |
| CFG-153 | as per ticket - main feature, not for this sprint probably                                            |
| CFG-155 | would need to confirm dark mode styling with UX                                                       |
| CFG-156 | quick fix, but not important for demo (client wouldn't see console warnings)                          |
| CFG-157 | should be confirmed with UX                                                                           |
| CFG-158 | seems like currentConfig was already wrapped in useMemo                                               |

### Tickets That Need Clarification

List any tickets where you couldn't proceed due to ambiguity:

| Ticket  | Question                                                  |
| ------- | --------------------------------------------------------- |
| CFG-158 | is it still valid and also product is a props from parent |

### Tickets With a Misleading Priority Label

Our board labels aren't always right. List tickets where you disagreed with the label (e.g. a Low that's actually High, a High that's actually Low, a Medium that's actually Unclear) and explain why. If you didn't disagree with any, say so.

| Ticket  | Label on board | Your read    | Why                                         |
| ------- | -------------- | ------------ | ------------------------------------------- |
| CFG-XXX | e.g. ⚪ Low    | e.g. 🟠 High | [What in the description changed your read] |

### Tickets Where You Stopped to Ask Instead of Implementing

If a ticket was ambiguous enough that the right move was to escalate / ask PM / gather more context rather than ship a fix, list it here. We value this signal — picking one interpretation blindly and shipping it can cost more than stopping to ask.

| Ticket  | Who would you ask                                                                               | What you'd ask                                    |
| ------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| CFG-XXX | e.g. PM / Finance                                                                               | [The specific question + why you can't answer it] |
| CFG-144 | what's the difference between quick add and add to cart? what's the exact purpose of quick add? |

| CFG-154 | discount in CONTEXT: Quantity Discounts - Tiered pricing at certain quantities
1-9 items: No discount
10-49 items: 5% off
50+ items: 10% off

- discount in TICKETS (and marketing and public docs: 50+ items get 15% off" ) |

---

## Technical Write-Up

### Critical Issues Found

Describe the most important bugs you identified:

#### Issue 1: [Price not updating]

**Ticket(s):** CFG-142

**What was the bug?**

root cause was comparing actual date to reuqestId (counter values) passed as 'timestap'
**How did you find it?**

I've added consol.logs to investigate which functions are called in order and why some func/comparisons never run, then I've checked what's blocking conditions when they should be met
**How did you fix it?**

I've fixed an error in api, beacause the key-value pair returned was confusing and caused the error in the first place, then I've corrected ref checks and updates to prevent unnecessary updates,
I also improved the custom hook and deps in fetchprice useEffect to fire it on any change in price and always return correct calculation (had to disable eslint for that)

**Why this approach?**
I decided it's best to change part of mocked API, in real life I'd ask my backend colleague to check the response and then decide if requests should be check against timestamp or counter based id,
[Any alternatives you considered]
change in usePriceCalculation instead of api modification (I wasn't sure if I'm allowed to modify api.ts)
---

#### Issue 2: [Crash when deselecting "include packaging" with gift wrap applied]

**Ticket(s):** CFG-142

**What was the bug?**
if (option && option.type === 'select') or lack of proper cleanup in handleAddOnToggle

**How did you find it?**
I've found this comment: // Clean up any dependent add-ons whose requirement is no longer met.
but I didn't find similar function in toggle handler,
**How did you fix it?**
it should be a shared function for all addOns, removing the condition type === 'select' was a quick fix and didn't require repeating the code
**Why this approach?**
as above - quick working solution to avoid crash on demo
---

### Other Changes Made

Brief description of any other modifications:

- I've simplified validation,
- commented out URL-related parts as TODO for later
- removed blockers for lefhook pre-commit checks
- decided on types that shoul be required not optional

---

## Code Quality Notes

### Things I Noticed But Didn't Fix

List any issues you noticed but intentionally left:

| Issue       | Why I Left It                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| [Typing]    | I'd double check types and required/optional values                                                  |
| [preview]   | it didn't work, but I didn't have time to investigate and also not in tickets                        |
| [gift wrap] | Requires include_packaging - should be written more user-friendly                                    |
| [url share] | when opening url share modal, the link is not visible until I click 'copy link' - confusing for user |

### Potential Improvements for the Future

If you had more time, what would you improve?

1. I'd improve the component structure
2. price recalculation and validation UX
3. add updating drafts option
4. draft saved should show also date

---

## Questions for the Team

Questions you would ask in a real scenario:

1. Should validation work with each config update or only on addToCart action?
2. Should QucikAd add default config?
3. Seemed like Custom dropdown options were navigable with arrow keys?
4. Someone plz clarify discounting ;_;
5. can we start with proper refactor
6. why there was a ticket to remove QuickAdd when client actually wanted it, very confusing,
7. should dark mode be automatic or on switch?
8. "hey UX friend, could you let me know how you want dark mode to look like?"
9. do we have an error message for each error code?

---

## Assumptions Made

List any assumptions you made to proceed:

1. Validation working on each config update
2. QuickAdd adds default config to cart

---

## Self-Assessment

### What went well?

Investigating root causes for main issues, prioritizing tickets, making assumptions to avoid blocking work

### What was challenging?

Getting around the huge monolithic component, searching for dependencies and related functions, satisfying lefthook demands to proceed with commits (when time is pressuring), watching time and skipping some improvements that could be applied "quickly"

### What would you do differently with more time?

With more time I'd sure have better organized approach to reading into the codebase, I'd devote more time to fully understand Marcus way of thinking - this would help me with debugging and fixes, I'd also add some more type-checks
and quick improvements like feedback for client when loading, and take proper care of error handling and display

---

## AI Assistance Notes (optional)

If you used AI tools (Copilot, Claude, Cursor, ChatGPT, etc.), we'd love a short note on how. **We don't score the fact that you used AI — we score the quality of your reasoning and verification.**

Useful things to share:

- What kinds of prompts you sent (paraphrase is fine, no need to paste logs)
  - checking and adding guards against race conditions
  - typing errors
  - help with investigating custom hook
  - initial help with lefthook errors
  - debugging (e.g. I've missed a return and didn't notice it)
  - help with compliance changes
- Where the AI helped and where you overrode it
  - it helped with showing my mistakes, like typos or overlooked return
  - helped with focus styles
  - function return type
  - reminded me of adding void operator to async function were I didn't need to wait
- Anything the AI suggested that you rejected — and why
  - AI suggested a complicated solution to correct focus on modals - I rejected it becuase I already had a lastFocusedElement ref that I could use for both modals
- Anything you verified manually that the AI got wrong
  - I didn't discuss more complicated matters than above

---

## Additional Notes

Anything else you want us to know:

Writing submission template was most difficult it added + 1.5h for me to finish retracing my steps and thinking ;)
