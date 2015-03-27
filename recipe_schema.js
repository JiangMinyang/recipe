var mongoose = require(mongoose);
var Schema = mongoose.Schema;
var recipeSchema = new Schema({
	tag          : [String],
	title        : String,
	ingredients  : [{qty     : Number, units : String, ingredient : String}],
	time         : Number,
	instructions : String
});

exports.recipeSchema = recipeSchema;

