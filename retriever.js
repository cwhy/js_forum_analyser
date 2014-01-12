var start_url = "http://bbs.tianya.cn/post-333-404298-1.shtml";
var jQuery = 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js';
console.log('Start evaluating ' + start_url);
var first_page = require('webpage').create();
var last_page = 0;
var comment_info = [];

function log_ci(c_i){
	for(var j = 0; j < c_i.length; j++){
		console.log('Floor no.: ' + c_i[j][0]);
		console.log('Content: ' + c_i[j][1]);
		console.log('Author: ' + c_i[j][2]);
		console.log('Device: ' + c_i[j][3]);
		console.log('Time: ' + c_i[j][4]);
		comment_info.push(c_i[j]);
	}
}

function save_to_file(){
	var fs = require('fs');
	try {
		fs.write("./result.txt", comment_info.map(function(v){ return v.join(', ')}).join('\n'), 'w');
	} catch(e) {
		console.log(e);
	}
	phantom.exit();
}

// find the last page no.
first_page.open(start_url, function(status){
	if(status === 'success') {
		first_page.includeJs(jQuery, function() {
			var n = first_page.evaluate(function() {
				return $(".atl-pages form a:nth-last-child(4)").html();
			});
			// page title
			var page_title = first_page.evaluate(function() {
				return $("#post_head span.s_title span").html();
			});
			// main post author
			var lz = first_page.evaluate(function() {
				return $("#post_head .atl-info a").html();
			});
			last_page = parseInt(n);
			for(var i = 2; i <= last_page; i++) {
				var url = start_url.substring(0, start_url.length-7) + i + '.shtml';
				retrieve_page(url, log_ci);
				if (i >= last_page){
					save_to_file();
				}
			}
			console.log('Page title is ' + page_title);
			console.log('Post author is ' + lz);
		});
	}
});


function retrieve_page(url,log_ci) {
	console.log('Retrieving info from: ' + url);
	var page = require('webpage').create();
	page.open(url, function(status){
		page.includeJs(jQuery, function() {
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
			log_ci(c_i);
		});
	});
}
