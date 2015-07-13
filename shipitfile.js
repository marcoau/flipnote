module.exports = function (shipit) {
  shipit.initConfig({
    production: {
      servers: 'root@45.55.129.205'
    }
  });

  shipit.task('pwd', function () {
    return shipit.remote('pwd');
  });

  shipit.task('deploy', function() {
    // remote old build
    shipit.remote('rm -rf /opt/flipnote/release')
      .then(function() {
        // copy new build
        return shipit.remoteCopy('./dist', '/opt/flipnote')
      })
      .then(function() {
        // HACK: rename folder to release
        return shipit.remote('mv /opt/flipnote/dist /opt/flipnote/release');
      })
      .then(function() {
        // install npm modules
        return shipit.remote('cd /opt/flipnote/release && npm i');
      })
      .then(function() {
        // restart server
        return shipit.remote('pm2 restart flipnote');
      })
      .then(function(res){
        console.log('DEPLOY COMPLETE.');
      });
  });
};
