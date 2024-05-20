const mongoose = require('mongoose');
const model = mongoose.model;

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
  },
  {
    versionKey: false,
});

module.exports = model("roles", roleSchema)