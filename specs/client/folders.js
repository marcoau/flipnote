describe('FoldersCtrl', function(){
  var $httpBackend, $rootScope, createController;

  beforeEach(module('app.folders'));

  beforeEach(inject(function($injector){
    var time = new Date();
    var folders = [{
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

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/folders').respond(folders);
    $httpBackend.when('GET', '/folders/a/notes').respond(folders[0]);

    $rootScope = $injector.get('$rootScope');

    var $controller = $injector.get('$controller');

    createController = function(){
      console.log($controller);
      return $controller('FoldersCtrl', {'$scope': $rootScope});
    };
  }));

  afterEach(function(){

  });

  it('should populate $rootScope.folders with folders with GET /folders', function(){
    $httpBackend.expectGET('/folders');
    var controller = createController();
    $httpBackend.flush();
    expect($rootScope.folders.length).to.equal(2);
  });
});
