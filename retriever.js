var url_eva = "http://bbs.tianya.cn/post-333-404298-1.shtml" ;
console.log('Start evaluating \"' + url_eva + '\"');

var page = require('webpage').create();

page.open(url_eva, function(status){
	if ( status === "success" ) {
		page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
			var page_title = page.evaluate(function() {
				return $("#post_head span.s_title span").html();
			});
			var lz = page.evaluate(function() {
				return $("#post_head .atl-info a").html();
			});
			var c_i = page.evaluate(function() {
				var info = [];
				for(i=1;i<=6;i++){
					 info.push([
						 i,
						 $("#"+i+" .bbs-content").text().trim(),
						 $("#"+i+" .atl-head .atl-info a").text()
						 ]);
				}
				return info;
			});
			console.log('Page title is ' + page_title);
			console.log('LZ is ' + lz);
			for(i=0;i<=5;i++){
				
				console.log(c_i[i][0] +"th floor: "+ c_i[i][1] + "--" + c_i[i][2]);
			}
			phantom.exit();
		});
		console.log('Analyse finished!');
	}else{
		console.log('Website retrieval failed');
	}
});
