var chai = require('chai');
var sinon = require("sinon");
chai.use(require("sinon-chai"));
var expect = chai.expect;

var unfold = require('../../tasks/unfold.js');

describe('unfold', function() {
	beforeEach(function(){
	});
	
	it('should process every file', function() {
		sinon.spy(unfold, 'processFile');
		unfold.processFiles([1,2,3]);
		
		expect(unfold.processFile).to.have.callCount(3);
	});
});