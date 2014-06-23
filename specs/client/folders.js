describe('FoldersCtrl', function(){
  var $httpBackend, $rootScope, createController, testFolders;

  beforeEach(module('app.folders'));

  beforeEach(inject(function($injector){
    var time = new Date();
    testFolders = [{
        _id: 'a',
        name: 'Angular',
        notes: [{
          _id: 'a1',
          title: 'Angular 101',
          text_front: 'Hello',
          text_back: 'world',
          tags: ['coding', 'JS'],
          last_update: time - 1000000
        },
        {
          _id: 'a2',
          title: 'Angular 202',
          text_front: 'Bye',
          text_back: 'earth',
          tags: ['coding'],
          last_update: time
        }],
        last_update: time
      },
      {
        _id: 'b',
        name: 'Backbone',
        notes: [{
          _id: 'b1',
          title: 'Backbone 101',
          text_front: 'I have',
          text_back: 'back bone',
          tags: ['JS'],
          last_update: time - 3000000
        },
        {
          _id: 'b2',
          title: 'Backbone 202',
          text_front: 'You have',
          text_back: 'no bone',
          tags: [],
          last_update: time - 5000000
        }],
        last_update: time - 3000000
      }];

      testNewFolder = [{
        _id: 'c',
        name: 'Ember',
        notes: [],
        last_update: new Date()
      }];

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/folders').respond(testFolders);
    //hard-coded folder _id; to be changed?
    $httpBackend.when('GET', '/folders/a/notes').respond(testFolders[0]);
    $httpBackend.when('POST', '/folders', {name: 'Ember'}).respond(testFolders[0]);
    $httpBackend.when('DELETE', '/folders/b').respond('deleteNote success');

    $rootScope = $injector.get('$rootScope');

    var $controller = $injector.get('$controller');

    createController = function(){
      return $controller('FoldersCtrl', {'$scope': $rootScope});
    };
  }));

  afterEach(function(){
    //essential for launching next test after one is finished
    // $httpBackend.verifyNoOutstandingExpectation();
    // $httpBackend.verifyNoOutstandingRequest();
  });

  it('should populate $rootScope.folders with folders with GET /folders', function(){
    //essential for flushing pending http requests
    var controller = createController();

    $httpBackend.expectGET('/folders');
    $httpBackend.flush();
    expect($rootScope.folders.length).to.equal(2);
  });

  it('should make the latest-updated folder the active folder', function(){
    //essential for flushing pending http requests
    var controller = createController();
    $httpBackend.expectGET('/folders');
    $httpBackend.flush();
    expect($rootScope.activeFolder.name).to.equal('Angular');
  });

  it('should toggle updating status to reflect completion of calls', function(){
    //essential for flushing pending http requests
    var controller = createController();
    $httpBackend.expectGET('/folders');
    expect($rootScope.updating).to.equal(true);
    $httpBackend.flush();
    expect($rootScope.updating).to.equal(false);
  });

  xit('should make an new folder with correct name when required', function(){
    //essential for flushing pending http requests
    var controller = createController();
    $httpBackend.expectGET('/folders');
    $httpBackend.flush();

    $httpBackend.expectPOST('/folders', {name: 'Ember'});
    expect($rootScope.updating).to.equal(true);
    $httpBackend.flush();

    expect($rootScope.updating).to.equal(false);
    expect($rootScope.folders.length).to.equal(1);
    expect($rootScope.activeFolder.name).to.equal('Ember');
  });

  it('should keep the active attribute of each folder correct', function(){
    //essential for flushing pending http requests
    var controller = createController();
    $httpBackend.expectGET('/folders');
    $httpBackend.flush();
    expect($rootScope.activeFolder.active).to.equal(true);
    expect($rootScope.folders[1].active).to.equal(false);
  });

  xit('should remove the correct folder from $rootScope.folder on delete', function(){
    //essential for flushing pending http requests
    var controller = createController();
    $httpBackend.expectGET('/folders');
    // $httpBackend.flush();

    $httpBackend.expectDELETE('/folders/b');
    $httpBackend.flush();

    expect($rootScope.folders.length).to.equal(1);
    expect($rootScope.folders[0].name).to.equal('Backbone');
  });
});
