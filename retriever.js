var page = require('webpage').create(),
	system = require('system'),
	addr;

if (system.args.length === 1) {
	console.log('Usage: retriever.js <URL>');
	phantom.exit();
}

addr = system.args[1];
page.open(addr, function(status){
	page.includeJs('http://http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
		var title = page.evaluate(function() {
			return document.title;
		});
		console.log('Page title is ' + title);
	});
});
