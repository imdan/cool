const projectRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Project = require('../models/project');
const User = require('../models/user');
const logger = require('../utils/logger');
const config = require('../utils/config');

projectRouter.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('user', { username: 1 });
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

  if (!body.title) {
    return res.status(400).end();
  }

  if (!req.token) {
    logger.error('Error: token invalid or missing');
    return res.status(400).json({ error: 'token invalid or missing' });
  }

  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(400).json({ error: 'token invalid or missing' });
  }

  try {
    const user = await User.findById(decodedToken.id);

    const project = new Project({
      title: body.title,
      image: body.image,
      url: body.url,
      github: body.github,
      builtWith: body.builtWith,
      desc: body.desc,
      date: new Date(),
      user: user._id
    });

    const savedProject = await project.save();
    user.projects = user.projects.concat(savedProject);
    await user.save();
    res.status(201).json({
      data: savedProject.toJSON(),
      success: true
    });
  } catch (err) {
    next(err);
  }
});

projectRouter.delete('/:id', async (req, res, next) => {
  const projectToDelete = await Project.findById(req.params.id);

  if (!projectToDelete) {
    return res.status(400).json({ error: 'project does not exist' });
  }

  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid or missing' });
  }

  const user = await User.findById(decodedToken.id);

  if (projectToDelete.user.toString() === user._id.toString()) {
    await Project.findByIdAndRemove(req.params.id);
  } else {
    return res.status(401).json({ error: 'unauthorized user' });
  }

  res.status(204).end();
});

projectRouter.put('/:id', async (req, res, next) => {
  const body = req.body;

  const projectToUpdate = await Project.findById(req.params.id);

  if (!projectToUpdate) {
    return res.status(400).json({ error: 'project does not exist' });
  }

  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid or missing' });
  }

  const project = {
    title: body.title,
    image: body.image,
    url: body.url,
    github: body.github,
    builtWith: body.builtWith,
    desc: body.desc,
    date: new Date()
  };
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    project,
    {
      new: true
    }
  );

  res.json(updatedProject);
});

module.exports = projectRouter;
