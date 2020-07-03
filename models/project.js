const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const projectSchema = mongoose.Schema({
  title: String,
  image: String,
  url: String,
  github: String,
  builtWith: Array,
  desc: String,
  date: Date
});

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
