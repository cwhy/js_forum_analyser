var start_url = "http://bbs.tianya.cn/post-333-404298-1.shtml";
var jQuery = 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js';
console.log('Start evaluating ' + start_url);
var first_page = require('webpage').create();

var last_page = 0;

// find the last page no.
first_page.open(start_url, function(status){
	if(status === 'success') {
		first_page.includeJs(jQuery, function() {
			var n = first_page.evaluate(function() {
				return $(".atl-pages form a:nth-last-child(4)").html();
			});
			last_page = parseInt(n);
			for(var i = 1; i <= last_page; i++) {
				var url = start_url.substring(0, start_url.length-7) + i + '.shtml';
				retrieve_page(url);
			}
		});
	}
});

var retrieve_page = function(url) {
	console.log('Retrieving info from: ' + url);
	var page = require('webpage').create();
	page.open(url, function(status){
		page.includeJs(jQuery, function() {
			// page title
			var page_title = page.evaluate(function() {
				return $("#post_head span.s_title span").html();
			});
			// main post author
			var lz = page.evaluate(function() {
				return $("#post_head .atl-info a").html();
			});
			// comment information
			var c_i = page.evaluate(function() {
				var info = [];
				var first_post = parseInt($("div.atl-item").first().attr('id'));
				console.log(first_post);
				if (!first_post){
					first_post = 1;
				}
				var last_post = parseInt($("div.atl-item").last().attr('id'));
				for(var i = first_post; i <= last_post; i++) {
					var content = $("#"+i+" .bbs-content").text().trim();
					var author = $("#"+i+" .atl-head .atl-info").children('span').eq(0).children().eq(0).text();
					var device;
					if(device == null){
						device = 'no info';
					}
					var raw_time = $("#"+i+" .atl-head .atl-info").children('span:last-child').text();
					var time = raw_time.substr(3);
					info.push([
						i,
						content,
						author,
						device,
						time
					]);
				}
				return info;
			});
			console.log('Page title is ' + page_title);
			console.log('Post author is ' + lz);
			for(var i = 0; i < c_i.length; i++){
				console.log('Floor no.: ' + c_i[i][0]);
				console.log('Content: ' + c_i[i][1]);
				console.log('Author: ' + c_i[i][2]);
				console.log('Device: ' + c_i[i][3]);
				console.log('Time: ' + c_i[i][4]);
			}
		});
	});
}
