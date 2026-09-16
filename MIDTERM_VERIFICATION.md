# Midterm Verification Explained: CFA Quest
## Group: 7
## Product: CFA Quest
## Date: 26/09/2026
## Repository: G07
## Team representative: Nguyễn Lê Phương Quỳnh
## Intrustor: Associate Professor Dr. Phan Trần Trung Dũng

## Part A

### Question 1: What is the biggest issue?

The product exists to answer one question: after a learner practises a weak cluster in a Trap, do they do better on that cluster at Boss than they did at the start? The answer appears in the post-Boss summary table, O4.

The issue is **bad data**. A learner who fails an arena has to replay it, and every replay draws new questions from the same cluster. Each cluster has only 22 questions, just enough for a run with no failures. Once the new questions run out, the engine reuses questions the learner has already seen, along with their answers. Boss then measures memory, not progress, yet O4 still counts those repeated questions as if they were new.

### Question 2: Why does it matter?

Checking progress is the reason the product exists. The team's own document says that without this step, the product is just a nicely packaged question set. The answer lists four consequences:

1. **Misleading labels.** A learner can be told "Đã cải thiện" (improved) just because they remember old questions. This breaks the claim boundary the team set for itself.
2. **Failing a Trap is normal, not rare.** Trap questions come from the learner's weakest cluster, but the Trap still requires 7/10. A learner who gets about half of that cluster right passes only about 1 time in 6. One failed Trap I is enough to use up the whole cluster, because 3 + 10 + 10 = 23, which is more than 22. From then on, the cluster's 2 Crossroads questions and up to 7 Boss questions are all repeats.
3. **The "first attempt only" rule is not enough.** The team decided the baseline counts only first attempts, because a first attempt is when the learner has not yet seen the answers. But after a failed Trap, even the first attempt at Crossroads and Boss already contains old questions. So the baseline gets contaminated too.
4. **The team's own sample run has this problem.** The sample fails Arena 1 once, so cluster C2 is drawn 3 + 3 + 10 + 2 + 5 = 23 times. At least one Boss question for C2 must be a repeat. The expected O4 still labels C2 "Đã cải thiện" with no warning.

### Question 3: What has the team done so far?

This lists only what already exists in the repo:

- The baseline and performance score count only the first attempt of each arena.
- The risk that "repeated questions can let remembered answers affect the result" is written down in assumption D3 and in error paths E4 and E5.
- In the demo, a repeated question gets shuffled options, a "Câu đã gặp" (already seen) tag and a notice. The repeat is also written to the log under O4.
- The O4 table already works in the demo.
- The team worked through one run by hand, built the Excel file and wrote 16 test cases.

The answer is also honest about what is still missing:

- No one has measured how often repeated questions appear.
- O4 does not yet treat a repeated question differently from a new one.
- No test case covers replaying an arena.
- All 16 test cases still say "Chờ code" (waiting for code).

### Question 4: What will the team do next?

The approach is to set the decision rule first, then measure, then let the numbers decide.

1. **Measure.** Write a script that lets the computer play thousands of runs for several types of learners. Count how often W1 and W2 get repeated questions at Crossroads and Boss, and which O4 label they receive.
2. **Decide with a rule set in advance.** If repeated questions show up in more than 10% of runs, change the rule so that a replay uses the same question set, with the options reshuffled. Each cluster then never needs more than 22 questions, and Crossroads and Boss always get new questions.
3. **Update the documents first, then the code.** Update the replay rule, the question budget and the related assumptions, then change the `startArena()` function to match. If the rule is not changed, O4 must not give an improvement label to any cluster that had repeated questions.
4. **Test.** Add three test cases: fail Trap I and replay it, fail Arena 1 twice, and replay several times without the baseline changing. Then run all 19 tests on the build.

The trade-off the team accepts: replaying the same questions makes an arena easier to pass. But passing an arena is only a game rule, not a measure of learning. Replays are also already excluded from the diagnosis, so this is acceptable.

## Part B: Each member's contribution

The table keeps the task split the team already agreed on. Each row answers three things: what the person produced, where it is used, and what they can redo in front of the instructor.

- **Quỳnh:** wrote all the logic and formulas. Can recompute the O4 table by hand, change one cell in Excel to show W1 changing, and explain why 3 + 10 + 10 is more than 22.
- **Hồng:** wrote the 110 questions. Can explain why each correct answer is right and why each wrong option is tempting, and can run the question bank checker.
- **Trang:** set the question-drawing rules for each arena. Can explain which questions Trap I must contain, and why only 22 − 3 − 10 = 9 questions are left after Arena 1 and one Trap, so a replay forces repeats.
- **Minh:** designed the Credit and item system. Can calculate the Credit earned at each score level and explain why the elimination item removes only one option.
- **Khôi:** built the interface. Can click through the demo to show the error messages, and explain what "--" means and why the table shows 4/5 instead of a percentage.

The last column matters most. The instructor can ask any member to do exactly what is written there, so each member should rehearse beforehand.
