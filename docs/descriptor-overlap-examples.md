# Descriptor Overlap Examples

This note explains why overlapping labels between new `descriptors` entries and older seed entries can cause real matching problems, even when the UI looks fine.

It is meant as a practical implementation note for seed curation.

---

## Core Problem

If two pictogram entries share the same Chinese label or synonym, the matcher may score them equally.

When that happens, the current matcher usually keeps the earlier candidate it encounters.

That means:

- the new concept may appear in the UI
- but text input may still resolve to the old concept
- so the new concept is not truly reachable as a stable matching target

This is not a crash.

It is a **silent behavior conflict**.

---

## Why It Happens

Current matching stages:

- `exact = 400`
- `synonym = 300`
- `lexicon-synonym = 200`
- `partial = 100`

`DOMAIN_MATCH_BONUS = +40` only helps **within the same stage**, and only when the lexicon entry has a category match.

So if two pictograms both match as:

- exact
- or both synonym

and nothing else separates them, the earlier one wins.

---

## Example 1: `左边`

Old entry:

- `p_left`
- meaning: body left side / medical location
- category: `medical`

New descriptor entry:

- `d_left`
- meaning: directional word `左`
- category: `descriptors`

If both contain:

- `左边`

then input `左边` produces:

- `p_left` -> exact `400`
- `d_left` -> exact `400`

Tie result:

- earlier array entry wins
- usually `p_left`

Practical consequence:

- UI shows a new descriptor concept
- but text input `左边` still resolves to the old medical concept

So the new descriptor is not truly active for that phrase.

---

## Example 2: `右边`

Old entry:

- `p_right`
- medical side / body location

New entry:

- `d_right`
- directional descriptor

If both contain `右边`:

- `p_right` -> exact `400`
- `d_right` -> exact `400`

Result:

- tie
- old entry wins

Consequence:

- the descriptor board looks complete
- but `右边` still behaves like the old medical concept

---

## Example 3: `外面`

Old entry:

- `p_outside`
- place / outside environment

New entry:

- `d_outside`
- descriptor / relational word `外`

If both contain `外面`:

- `p_outside` -> exact `400`
- `d_outside` -> exact `400`

Result:

- old place concept usually wins

Why this matters:

- `外面` as a place is not the same as `外` as a relational descriptor
- one is more like “outside / outdoors”
- the other is more like “outside of / on the outside”

So this overlap can blur the line between:

- place meaning
- relational meaning

---

## Example 4: `很多`

Old entry:

- `p_many`
- quickchat or core-expression style concept

New entry:

- `d_many`
- descriptor concept `多`

If both use `很多` as a synonym:

- `p_many` -> synonym `300`
- `d_many` -> synonym `300`

Result:

- tie
- earlier entry wins

Consequence:

- the new descriptor concept cannot reliably own the phrase
- future “descriptor composition” work becomes unstable

---

## Example 5: `慢一点`

Old entry:

- `r_speak_slowly`
- repair / clarify meaning: “please speak more slowly”

New descriptor entry:

- `d_slow`
- descriptor meaning: “slow”

If both use `慢一点`:

- repair expression and descriptor word compete for the same input

But these are not the same communicative function:

- repair: slow down your speech
- descriptor: describe movement, speed, or pacing

Without stronger context interpretation, this overlap creates unstable behavior.

---

## What Users Experience

This kind of overlap causes confusing problems such as:

- “I added a new descriptor, but the system still chooses the old pictogram.”
- “The new board looks populated, but those words do not behave like descriptor words.”
- “The same phrase sometimes feels like it belongs to the wrong board.”

These are hard to notice because:

- nothing crashes
- the UI still renders
- tests may stay green unless the exact phrase is covered

---

## Preferred V1 Fix

For V1, the safest fix is:

- let the new descriptor keep the shortest stable non-conflicting label
- remove overlapping exact labels or high-risk synonyms
- keep older established phrases attached to the older concept until a better context layer exists

Examples:

- keep `d_left = 左`, do not compete for `左边`
- keep `d_right = 右`, do not compete for `右边`
- keep `d_outside = 外`, do not compete for `外面`
- keep `d_many = 多`, do not compete for `很多`
- keep `d_slow = 慢`, do not compete for `慢一点`

This gives cleaner boundaries:

- short descriptor words go to descriptor concepts
- older longer phrases keep their current stable targets

---

## Bottom Line

Overlapping seed labels do not always cause a visible bug.

But they do cause:

- unstable matching
- hidden concept conflicts
- new boards that look richer than they really are

So the practical seed rule is:

**avoid overlapping exact labels and high-risk synonyms unless you also add an explicit tie-break rule.**
