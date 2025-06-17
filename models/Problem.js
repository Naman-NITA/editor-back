const mongoose = require("mongoose")

const testCaseSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  input: {
    nums: [Number],
    target: Number,
    s: String,
    // Add more input types as needed for different problems
  },
  expected: mongoose.Schema.Types.Mixed, // Changed from [Number] to Mixed to handle any type
  inputText: {
    type: String,
    required: true,
  },
  outputText: {
    type: String,
    required: true,
  },
})

const exampleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  inputText: {
    type: String,
    required: true,
  },
  outputText: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
})

const problemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    category: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    videoId: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    examples: [exampleSchema],
    constraints: [String],
    followUp: {
      type: String,
      default: "",
    },
    starterCode: {
      type: String,
      required: true,
    },
    starterFunctionName: {
      type: String,
      required: true,
    },
    testCases: [testCaseSchema],
    handlerFunction: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Problem = mongoose.model("Problem", problemSchema)
module.exports = Problem
