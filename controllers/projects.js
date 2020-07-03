const projectRouter = require('express').Router();
const Project = require('../models/project');
const logger = require('../utils/logger');

projectRouter.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({});
    res.json({
      data: projects,
      success: true
    });
  } catch (err) {
    next(err);
  }
});

projectRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const project = new Project({
    title: body.title,
    image: body.image,
    url: body.url,
    github: body.github,
    builtWith: body.builtWith,
    desc: body.desc,
    date: new Date()
  });

  //   project
  //     .save()
  //     .then(savedBlog => {
  //       res.status(201).json(savedBlog.toJSON());
  //     })
  //     .catch(err => {
  //       next(err);
  //     });

  try {
    const savedProject = await project.save();
    res.status(201).json({
      data: savedProject.toJSON(),
      success: true
    });
  } catch (err) {
    next(err);
  }
});

module.exports = projectRouter;
