const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ENUM_STAT = require("../model/type/enums").ENUM_STAT;
const ENUM_NATURE = require("../model/type/enums").ENUM_NATURE;
const ENUM_TYPE = require("../model/type/enums").ENUM_TYPE;


const PokemonSchema = new Schema({
    level:{
        type: Number,
        required:true
    },
    iv:[IvSchema],
    ev:[EvSchema],
    stats:[StatSchema],
    gender:{
        type:String,
        required:true
    },
    shiny:{
        type:Boolean,
        required:true
    },
    happiness:{
        type:Number,
        required:true
    },
    nature:{
        type:String,
        required:true,
        enum:ENUM_NATURE
    },
    name:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    types:[TypeSchema],
    ability:AbilitySchema
});


const AbilitySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String
    }
});

const StatSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_STAT
    },
    value:{
        type:Number,
        required:true
    }
});

const IvSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_STAT
    },
    value:{
        type:Number,
        required:true
    }
});

const EvSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum: ENUM_STAT
    },
    value:{
        type:Number,
        required:true
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

const pokemonModel = mongoose.model("player", PokemonSchema);

module.exports = pokemonModel;