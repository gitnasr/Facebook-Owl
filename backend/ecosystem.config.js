module.exports = {
  apps : [{
    app:"Facebook-Owl",
    script: 'dist/app.js',
    watch: '.'
  }],
  env:{
    NODE_ENV: 'production'
  }

};
