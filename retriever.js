var page = require('webpage').create(),
	system = require('system'),
	addr;

if (system.args.length === 1) {
	console.log('Usage: retriever.js <URL>');
	phantom.exit();
}

addr = system.args[1];
page.open(addr, function(status){
	var title = page.evaluate(function() {
		return document.title;
	});
	console.log('Page title is ' + title);
});
