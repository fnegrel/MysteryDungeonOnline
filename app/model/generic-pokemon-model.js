const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ENUM_STAT = require("../model/type/enums").ENUM_STAT;
const ENUM_TYPE = require("../model/type/enums").ENUM_TYPE;
const ENUM_MOVE_LEARN_METHOD = require("../model/type/enums").ENUM_MOVE_LEARN_METHOD;


const AbilitySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String
    }
});

const FormsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String
    }
});

const Move_learn_methodSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_MOVE_LEARN_METHOD
    },
    url:{
        type:String
    }
});

const MoveSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String
    },
    level_learned_at:{
        type:Number,
        required:true
    },
    move_learn_method:Move_learn_methodSchema
});

const StatSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_STAT
    },
    url:{
        type:String
    }
});

const TypeSchema = new Schema({
    slot:{
        type:Number,
        required:true
    },
    type:{
        name:{
            type:String,
            enum: ENUM_TYPE,
            required:true
        },
        url:{
            type:String
        }
    }
});


const GenericPokemonSchema = new Schema({
    game_index:{
        type:Number,
        required:true
    },
    abilities:
    [{
        ability: AbilitySchema,
        is_hidden:{
            type:Boolean,
            required:true
        },
        slot:{
            type:Number,
            required:true
        }
    }],
    base_experience:{
        type:Number,
        required:true
    },
    forms:[FormsSchema],
    height:{
        type:Number,
        required:true
    },
    is_default:{
        type:Boolean,
        required:true
    },
    moves:[MoveSchema],
    name:{
        type:String,
        required:true
    },
    stats:[{
        base_stat:{
            type:Number,
            required:true
        },
        effort:{
            type: Number,
            required:true
        },
        stat:StatSchema
    }],
    types:[TypeSchema]
});

const GenericPokemonModel = mongoose.model("GenericPokemon", GenericPokemonSchema);

module.exports = GenericPokemonModel;
