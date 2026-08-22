# **SOLUTION STRUCTURE**

## **1\. Product Direction**

The product is a gamified CFA Level 1 practice platform designed to make repeated multiple-choice question practice more engaging while maintaining its learning value.

The core purpose is to help users:

* practice CFA Level 1 questions;  
* evaluate their performance;  
* identify weak topics;  
* understand incorrect answers;  
* decide what to practice next.

Gamification is used as a supporting engagement layer rather than the main purpose of the product.

## **2\. Core User Flow**

**User → Select Topic → Answer CFA Questions → Check Correctness → Receive Explanation → Performance Analysis → Identify Weak Areas → Recommend Next Practice → Continue Practice**

The learning loop remains the core process, while game mechanics are added around it to encourage continued practice.

## **3\. Initial Required Information**

### **Question Information**

* Question content  
* Multiple-choice answers  
* Correct answer  
* Topic classification  
* Answer explanation

### **User Performance Information**

* Number of questions attempted  
* Correct and incorrect answers  
* Overall Accuracy  
* Topic Accuracy  
* Weakest Areas

### **Engagement Information**

* Player progress  
* Points or rewards generated from practice  
* Supporting gamification status

Not every game-related element needs to appear in the MVP.

## **4\. Core Process Type**

The product uses a repeated practice and performance-evaluation cycle.

**Question Set → User Answers → Quiz Engine → Correctness Check → Performance Calculation → Topic-Level Feedback → Weak Area Identification → Next Practice**

## **5\. MVP Flow**

The first implementation can demonstrate one complete practice cycle:

1. **Topic Selection:** user selects a CFA Level 1 topic.  
2. **Practice:** user completes a set of multiple-choice questions.  
3. **Checking:** the system evaluates whether each answer is correct or incorrect.  
4. **Learning Support:** explanations are provided for incorrect answers.  
5. **Performance Analysis:** the system calculates Overall Accuracy and Topic Accuracy.  
6. **Weak Area Identification:** the system identifies the user's weakest topic.  
7. **Recommendation:** the user is shown what should be practiced next.  
8. **Continue:** the user can begin another practice session.

## **6\. Target Product Direction**

The full product can gradually expand across different CFA Level 1 topics, including:

* Financial Statement Analysis  
* Corporate Issuers / Corporate Finance  
* Equity Investments  
* Fixed Income  
* Derivatives  
* Economics  
* Quantitative Methods  
* Portfolio Management

Each topic can contain multiple practice sessions and contribute to the user's overall performance profile.

The product can also include supporting game mechanics to make repeated practice less monotonous.

## **7\. Product Interface**

The current concept can be organized into three main areas:

* **Practice**  
  Topic selection and CFA multiple-choice questions.  
* **Progress / Game**  
  Player progress, points, rewards, and supporting gamification features.  
* **Results / Analytics**  
  Overall Accuracy, Topic Accuracy, Weakest Areas, incorrect questions, explanations, and recommended next practice.

## **8\. MVP Scope**

Recommended first working scope:

* a limited number of CFA Level 1 topics;  
* a manageable question bank;  
* multiple-choice question practice;  
* automatic correctness checking;  
* answer explanations;  
* Overall Accuracy;  
* Topic Accuracy;  
* Weakest Area identification;  
* next-practice recommendation;  
* simple gamification mechanics.

The purpose is to prove the complete chain:

**Question → Answer → Evaluation → Learning Feedback → Weak Area Identification → Continued Practice**

## **9\. Target Scope**

After the MVP works, expansion may include:

* additional CFA Level 1 topics;  
* larger question banks;  
* more detailed performance analytics;  
* practice history;  
* personalized topic recommendations;  
* additional player rewards;  
* points and progression systems;  
* shop and inventory features;  
* special game mechanics.

## **10\. Fallback Scope**

If implementation becomes too complex:

* one or two CFA topics;  
* a small question bank;  
* standard multiple-choice practice;  
* automatic correctness checking;  
* short answer explanations;  
* Overall Accuracy;  
* basic Topic Accuracy;  
* one simple result page;  
* minimal gamification.

## **11\. Out of Scope for MVP**

* full coverage of the entire CFA Level 1 curriculum;  
* teaching CFA Level 1 knowledge from the beginning;  
* highly complex RPG systems;  
* complex shop and inventory systems;  
* extensive special mechanics;  
* advanced personalized learning algorithms;  
* replacing CFA study materials or formal CFA preparation resources.

## **12\. Initial Rule Hypothesis**

The product is currently based on two hypotheses:

### **Engagement Hypothesis**

Repeated CFA multiple-choice practice may become monotonous and reduce users' willingness to continue practicing.

Gamification should therefore encourage continued practice without distracting users from CFA knowledge.

### **Learning Hypothesis**

Topic-level performance feedback may provide more learning value than a simple total score.

The system should therefore use user answers to generate:

* Overall Accuracy;  
* Topic Accuracy;  
* Weakest Areas;  
* incorrect-answer explanations;  
* next-practice recommendations.

These hypotheses still need to be validated through user observation and testing.

## **13\. Responsibility by Output**

### **Quỳnh — Project Lead \+ Game Structure Developer**

**Output:** Product structure and solution chain

* define the overall product flow;  
* connect Week 1 problem findings to the Week 2 solution;  
* ensure that gamification supports the CFA learning loop;  
* coordinate dependencies among different product components.

### **Hồng — CFA Question Bank \+ Quiz Engine Developer**

**Output:** CFA Question Bank \+ Quiz Engine

* organize questions by CFA topic;  
* define correct answers and explanations;  
* develop the answer-checking logic;  
* provide the data required for Overall Accuracy, Topic Accuracy, and Weakest Areas.

### **Trang — Special Mechanics Developer**

**Output:** Engagement Mechanics

* design supporting mechanics that reduce the monotony of repeated practice;  
* determine where special mechanics should appear in the practice flow;  
* ensure that engagement mechanics do not disrupt the core learning process.

### **Minh — Player Points \+ Shop \+ Inventory Developer**

**Output:** Reward and Progression System

* design the player points system;  
* define reward-related features;  
* develop shop and inventory concepts where feasible;  
* distinguish learning outputs from game rewards.

### **Khôi — Frontend/UI \+ Result Analytics \+ QA Lead**

**Output:** User Interface \+ Result Analytics

* design the practice and result interfaces;  
* display Overall Accuracy, Topic Accuracy, and Weakest Areas;  
* present incorrect-answer explanations clearly;  
* support testing and quality assurance of the complete user flow.

