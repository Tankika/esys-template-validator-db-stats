const mongoose = require('mongoose');

const frameSchema = mongoose.Schema({
    html: String,
});

const blockTemplateSchema = mongoose.Schema({
    name: String,
    html: String
});

const templatesSchema = mongoose.Schema({
    name: String,
    frame: frameSchema,
    available_block_templates: [blockTemplateSchema]
});

module.exports = mongoose.model('templates', templatesSchema, 'templates');