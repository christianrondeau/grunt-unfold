'use strict';

var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));
var expect = chai.expect;

var unfoldCtor = require('../../tasks/unfold.js');

describe('unfold', function () {
	var sandbox, grunt, options, unfold;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		grunt = {
			file: {},
			log: {
				writeln: sandbox.spy(),
				warn: sandbox.spy()
			}
		};

		options = {
			root: '',
			types: {
				js: {
					template: '<script src="$PATH$"></script>'
				}
			}
		};

		unfold = unfoldCtor(grunt, options);
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('processFiles', function () {

		it('should process every file', function () {
			sandbox.stub(unfold, 'processFile');
			grunt.file.exists = sandbox.stub().returns(true);

			unfold.processFiles([
				{ src: ['file1.html'] },
				{ src: ['file2.html', 'file3.html'] }
			]);

			expect(unfold.processFile).to.have.callCount(3);
		});

	});

	describe('processFile', function () {

		beforeEach(function () {
			grunt.file.read = sandbox.stub().withArgs('filepath').returns('original content');
			grunt.file.write = sandbox.spy();
		});

		it('not write the file if it did not change', function () {
			sandbox.stub(unfold, 'processContent').returns('original content');

			unfold.processFile('filepath');

			expect(grunt.file.write).not.to.have.been.called;
		});

		it('overwrite the file if it was modified', function () {
			sandbox.stub(unfold, 'processContent').returns('new content');

			unfold.processFile('filepath');

			expect(grunt.file.write).to.have.been.calledWith('filepath', 'new content');
		});

	});

	describe('processContent', function () {

		it('should leave content with no sections untouched', function () {
			var content = '<html>\r\n<head>\r\nNothing interesting here...\r\n</head>\r\n</html>';
			sandbox.stub(unfold, 'processSection').returns(content);

			expect(unfold.processContent(content)).to.equal(content);
		});

		it('should replace sections with processed result (with tabs, single line, windows breaks)', function () {
			sandbox.stub(unfold, 'processSection').returns('!!REPLACED!!');

			var content = '<html>\r\n<head>\r\n\t<!-- unfold:js path/to/something.js --><!-- THIS WILL BE REMOVED --><!-- /unfold -->\r\n</head>\r\n</html>';
			var expected = '<html>\r\n<head>\r\n!!REPLACED!!\r\n</head>\r\n</html>';
			expect(unfold.processContent(content)).to.equal(expected);
		});

		it('should replace sections with processed result (with spaces, multiple lines, no spaces in comment, linux breaks)', function () {
			sandbox.stub(unfold, 'processSection').returns('!!REPLACED!!');

			var content = '<html>\n<head>\n  <!--unfold:js *.js-->\n  <script src="something.js"></script>\n  <!--/unfold-->\n</head>\n</html>';
			var expected = '<html>\n<head>\n!!REPLACED!!\n</head>\n</html>';
			expect(unfold.processContent(content)).to.equal(expected);
		});

	});

	describe('processSection', function () {

		it('should empty sections with no matches', function () {
			grunt.file.expand = sandbox.stub().returns([]);
			
			var content = '<!--unfold:js *.js-->\nPREVIOUS CONTENT\n<!--/unfold-->';
			var expected = '<!--unfold:js *.js-->\n<!--/unfold-->';

			expect(unfold.processSection(content)).to.equal(expected);
		});

		it('should replace previous scripts by filter result (with tabs)', function () {
			grunt.file.expand = sandbox.stub().returns(['scripts/script1.js', 'scripts/script2.js']);
			
			var content = '\t<!-- unfold:js scripts/*.js -->\r\n\t<script src="obsolete.js"></script>\r\n\t<!-- /unfold -->';
			var expected = '\t<!-- unfold:js scripts/*.js -->\r\n\t<script src="scripts/script1.js"></script>\r\n\t<script src="scripts/script2.js"></script>\r\n\t<!-- /unfold -->';

			expect(unfold.processSection(content)).to.equal(expected);
		});

		it('should use custom templates', function () {
			options.types['js'].template = 'PATH: $PATH$';
			grunt.file.expand = sandbox.stub().returns(['scripts/script1.js']);
			
			var content = '<!-- unfold:js scripts/*.js -->\n<!-- /unfold -->';
			var expected = '<!-- unfold:js scripts/*.js -->\nPATH: scripts/script1.js\n<!-- /unfold -->';

			expect(unfold.processSection(content)).to.equal(expected);
		});

		it('should support custom types', function () {
			options.types['img'] = {
				template: '<img src="$PATH$" />'
			};
			grunt.file.expand = sandbox.stub().returns(['images/sample.png']);
			
			var content = '<!-- unfold:img images/**/*.png -->\n<!-- /unfold -->';
			var expected = '<!-- unfold:img images/**/*.png -->\n<img src="images/sample.png" />\n<!-- /unfold -->';

			expect(unfold.processSection(content)).to.equal(expected);
		});

	});
});