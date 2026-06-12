require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const User = require('./models/User'); // Assuming User model exists
const main = require('./config/db');

async function seed() {
    try {
        await main();
        console.log("DB connected for seeding");

        // Find a user to assign as problemCreator
        let creator = await User.findOne({ role: 'admin' });
        if (!creator) {
            creator = await User.findOne();
        }

        if (!creator) {
            console.log("No users found to assign as problem creator. Please create an admin user first.");
            process.exit(1);
        }

        const newProblems = [
            {
                title: "Two Sum",
                description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
                difficulty: "easy",
                tags: "array",
                problemCreator: creator._id,
                visibleTestCases: [
                    {
                        input: "[2,7,11,15]\n9",
                        output: "[0,1]",
                        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
                    },
                    {
                        input: "[3,2,4]\n6",
                        output: "[1,2]",
                        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
                    }
                ],
                hiddenTestCases: [
                    {
                        input: "[3,3]\n6",
                        output: "[0,1]"
                    }
                ],
                startCode: [
                    { language: "JavaScript", initialCode: "function twoSum(nums, target) {\n    // Write your code here\n}" },
                    { language: "C++", initialCode: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n}" },
                    { language: "Java", initialCode: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}" }
                ],
                referenceSolution: [
                    { language: "JavaScript", completeCode: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}" }
                ]
            },
            {
                title: "Reverse Linked List",
                description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                difficulty: "easy",
                tags: "linkedList",
                problemCreator: creator._id,
                visibleTestCases: [
                    {
                        input: "[1,2,3,4,5]",
                        output: "[5,4,3,2,1]",
                        explanation: "The list is reversed."
                    }
                ],
                hiddenTestCases: [
                    {
                        input: "[1,2]",
                        output: "[2,1]"
                    }
                ],
                startCode: [
                    { language: "JavaScript", initialCode: "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction reverseList(head) {\n    \n}" },
                    { language: "C++", initialCode: "ListNode* reverseList(ListNode* head) {\n    \n}" },
                    { language: "Java", initialCode: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}" }
                ],
                referenceSolution: [
                    { language: "JavaScript", completeCode: "function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr !== null) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}" }
                ]
            },
            {
                title: "Climbing Stairs",
                description: "You are climbing a staircase. It takes n steps to reach the top.\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
                difficulty: "easy",
                tags: "dp",
                problemCreator: creator._id,
                visibleTestCases: [
                    {
                        input: "2",
                        output: "2",
                        explanation: "There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps"
                    },
                    {
                        input: "3",
                        output: "3",
                        explanation: "There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step"
                    }
                ],
                hiddenTestCases: [
                    {
                        input: "4",
                        output: "5"
                    }
                ],
                startCode: [
                    { language: "JavaScript", initialCode: "function climbStairs(n) {\n    \n}" },
                    { language: "C++", initialCode: "int climbStairs(int n) {\n    \n}" },
                    { language: "Java", initialCode: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}" }
                ],
                referenceSolution: [
                    { language: "JavaScript", completeCode: "function climbStairs(n) {\n    if (n <= 2) return n;\n    let first = 1;\n    let second = 2;\n    for (let i = 3; i <= n; i++) {\n        let third = first + second;\n        first = second;\n        second = third;\n    }\n    return second;\n}" }
                ]
            }
        ];

        for (const probData of newProblems) {
            const existing = await Problem.findOne({ title: probData.title });
            if (!existing) {
                await Problem.create(probData);
                console.log(`Added problem: ${probData.title}`);
            } else {
                console.log(`Problem already exists: ${probData.title}`);
            }
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
