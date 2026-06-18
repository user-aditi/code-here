const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
    problemNumber: {
        type: Number,
        unique: true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:{
        type:[String],
        default:[],
        required:true
    },
    acceptanceRate: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    frequency: {
        type: Number,
        default: 0
    },
    totalSubmissions: {
        type: Number,
        default: 0
    },
    acceptedSubmissions: {
        type: Number,
        default: 0
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],

    startCode: [
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],

    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})


const Problem = mongoose.model('problem',problemSchema);

module.exports = Problem;


