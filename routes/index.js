const tvmazeRoutes = require('./marvel');

const constructorMethod = (app) => {
  app.use('/api', tvmazeRoutes);

  app.use('*', (req, res) => {
    res.json({error: 'Route no valid'});
  });
};

module.exports = constructorMethod;
