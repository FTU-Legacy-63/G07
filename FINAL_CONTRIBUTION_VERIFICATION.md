# Final Individual Contribution Verification

CFA Quest — Ethics

Group 7

Repository G07

Team representative: Nguyễn Lê Phương Quỳnh

Instructor: Assoc. Prof. Dr. Phan Trần Trung Dũng

## Question 1

Quỳnh is responsible for the diagnostic rules and the engine, Hồng for the question bank, Trang for the rules that build each Arena, Minh for the Credit and Shop economy, and Khôi for the pixel art and the tutorial design.

### Quỳnh: diagnostic rules and the engine

Quỳnh wrote the rules that turn a player's answers into a diagnosis (SOLUTION_STRUCTURE.md, Section 5). Answers are counted in three separate ways. Pass or fail counts every correct answer, including answers helped by the Bùa Loại Trừ item. The ranking of weak clusters uses only first attempts made without an item, so an item cannot make a cluster look stronger than it is. The difficulty-weighted performance score appears only in the final summary. When two clusters tie, the engine compares the average difficulty of their wrong answers, then the average answer time, then the cluster code. The same answers therefore always produce the same result.

She then coded these rules in [src/cfa_quest_engine.js](https://github.com/FTU-Legacy-63/G07/blob/main/src/cfa_quest_engine.js):

- `diagnosticRecords()` selects the answers that count.
- `rankClusters()` does the ranking (lines 502–530).
- `finishRun()` picks W1, W2 and the Boss plan (lines 906–921).
- `conclude()` gives each cluster its label in the post-Boss summary.

Players see the outcome on every result screen as a one-line reason, for example "C2, C1 bằng tỷ lệ đúng (1/3 = 33.3%) … W1 = C2".

After the midterm she was the main coder, and from Week 7 the only one. The harder Week 7 rules, the action layer, the demo mode, the tools and the 20 tests in [test](https://github.com/FTU-Legacy-63/G07/tree/main/test/) are her work. The bug log lists her as the person who fixed all 23 bugs found in the v10 build, through the v11 rewrite of 15/09/2026. Before any code existed, she checked the formulas by hand in the Excel workbook in [W4](https://github.com/FTU-Legacy-63/G07/blob/main/W4/CFA_Quest_user_flow.xlsm).

### Hồng: the Ethics question bank

Hồng wrote the questions. Each question has a scenario, three options, the answer, an explanation, and a reason why each wrong option is tempting. She labelled every question with its cluster, module, sub-standard and difficulty. As the bank grew from 110 to 170 and then to 220 questions, she kept writing harder batches. Quỳnh reviewed the final set and merged it into [ethics_bank_220.json](https://github.com/FTU-Legacy-63/G07/blob/main/data/ethics_bank_220.json), which holds 44 questions per cluster.

Every question in the game comes from this file, and the game adapts on Hồng's labels:

- The generator draws questions by cluster, module and difficulty.
- Difficulty is the weight in the performance score.
- The explanation and the distractor reasons appear when a player reviews a wrong answer.

Hồng also reviewed 30 questions, six per cluster, against nine checks and found no content errors ([content-review-30.md](https://github.com/FTU-Legacy-63/G07/blob/main/W6/content-review-30.md)). Her drafts are on the team Drive and listed in her footprint. Her second output is the four demo scenarios in [demo-input.md](https://github.com/FTU-Legacy-63/G07/blob/main/W6/demo-input.md), which the automated tests now run, as described under Question 2.

### Trang: the rules that build each Arena

Trang wrote the rules for which questions go into each Arena (SOLUTION_STRUCTURE.md, Sections 2 and 4):

- **Arena 1** asks three questions from each of the five clusters, covering every module and all three difficulty levels.
- **Arena 2** asks ten questions from the weakest cluster, W1.
- **Arena 3** returns to two questions per cluster.
- **Arena 4** targets the next weakest cluster, W2, which cannot be the same as W1.
- **Boss** splits fifteen questions 7, 5 and 3 across the three weakest clusters.

No question repeats within a run. When fresh questions run out, the engine reuses a question already seen at the same difficulty, then drops one difficulty level, and it logs each case. Trang also set the checks used to validate the question bank.

These rules run every time a player enters an Arena, through `buildArena1()`, `drawMix()` and `buildArena()` in the engine. The W2 rule is the single line at 913 that excludes W1. Her bank checks are built into [validate_question_bank.html](https://github.com/FTU-Legacy-63/G07/blob/main/tools/validate_question_bank.html), which Quỳnh coded. When Quỳnh added the Week 7 difficulty quotas, Trang tested them. Her tests T-G01 to T-G15 in testing.md cover every generation rule, and Minh checked them. In the bug log, Trang verified the six bugs about drawing and ranking questions (BUG-V10-03, 04, 05, 14, 15 and 16).

### Minh: the Credit and Shop economy

Minh designed how players earn and spend Credit (SOLUTION_STRUCTURE.md, Section 8):

- A player starts with 3 Credit.
- Passing an Arena earns 2, 3 or 4 Credit at 70, 80 or 90 percent.
- Clearing Boss for the first time earns 5 more.
- The one item, Bùa Loại Trừ, costs 3 Credit and removes one wrong option. It cannot be used in Arena 1, and only once in any other Arena.

He also wrote the Shop warning that an answer helped by the item counts toward passing but not toward the diagnosis. The Week 5 ownership table lists him as the owner of the Credit and Shop code at that stage.

In the final game these rules appear as:

- the Credit tiers and item settings at the top of the engine;
- the functions `creditFor()` and `applyItem()`;
- the Shop screen and item box in `src/cfa_quest_v11.js`.

The Week 7 Boss gate (15 Credit) and World Quest were built on top of this economy. Minh wrote and ran tests T-S01 to T-S11, which cover every pass threshold and Credit tier, and Trang verified them. He verified seven bugs about Credit, items and scoring, and he checked Trang's T-G tests.

### Khôi: pixel art and tutorial design

Khôi drew the game's pixel art: the player character, the monsters and Boss, the arena floors, the world map, the transition scenes, the merchant and Shop, icons and frames. With Minh, he also planned how the tutorial teaches the rules: a short card or tip appears when each rule first matters, instead of one long page at the start.

His art is the 98 WebP files in [src/asset](https://github.com/FTU-Legacy-63/G07/tree/main/src/asset/). Quỳnh's scripts in [tools/asset_pipeline](https://github.com/FTU-Legacy-63/G07/tree/main/tools/asset_pipeline/) cut and compressed them from his originals, from about 183 MB down to about 6 MB. [README_ASSETS.md](https://github.com/FTU-Legacy-63/G07/blob/main/src/asset/README_ASSETS.md) maps each of his asset codes to the file the game uses. The tutorial lives in part 2 of `src/cfa_quest_v11.js`; Quỳnh later added the cards for the action layer. Khôi's own commit 81139f1 added tests T-I01 to T-I06, which check what the game does when a player tries something that is not allowed, such as confirming without choosing an answer. He verified seven interface bugs in the bug log.

## Question 2

We chose adaptive question generation: the loop that takes a player's wrong answers and builds the next Arena from them. It is the core of the product, and all five members worked on some part of it.

The work was divided along that loop:

- **Hồng's labels** are the raw material. A cluster can only be targeted if it has enough questions at each difficulty level, and every cluster has between 17 and 20 hard questions.
- **Trang** set the drawing rules.
- **Quỳnh** decided which answers count when clusters are ranked and how ties are broken.
- **The whole team** decided on 05–06/10/2026 to make the mix of easy, medium and hard questions harder in each round, after the instructor said the rounds felt equally difficult.
- **Quỳnh** implemented all of it in the engine. She added the difficulty quotas as a separate constraint, so the cluster each Arena targets did not change; only the mix of questions inside it did.
- **For the player**, Quỳnh coded the reason line on the result screen. The tutorial card that explains W1 comes from Khôi and Minh's tutorial plan.

We checked the feature in three ways.

1. **Rule by rule.** Trang's tests T-G01 to T-G15 check each rule separately, including both fallback levels. Minh verified them, so nobody signed off on their own test.

2. **Hand-worked results against the engine.** Hồng worked out the expected results of all four demo scenarios by hand. [build_scenarios.js](https://github.com/FTU-Legacy-63/G07/blob/main/tools/build_scenarios.js) turns her document into code, and [scenarios.test.js](https://github.com/FTU-Legacy-63/G07/blob/main/test/scenarios.test.js) plays each scenario through the engine. The test compares W1, W2, the Boss plan, Credit and every summary label with her numbers, and they match in all four scenarios.

3. **The real random generator.** [engine_seed7.test.js](https://github.com/FTU-Legacy-63/G07/blob/main/test/engine_seed7.test.js) runs the generator with a fixed seed and checks every question it draws and every result in the table above.

This evidence has limits. The T-G tests are recorded results, not code. The automated test of the random generator covers only one seed. The two fallback levels have been tested only through T-G13 and T-G14.
