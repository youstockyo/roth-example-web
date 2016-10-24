

var Version =
{
	ROTH	 			: "0.2.0-SNAPSHOT",
	JQUERY	 			: "2.2.0",
	BOOTSTRAP	 		: "3.3.5"
};

setDependencies(
[
	{
		"local" : "external/style/roboto.css",
		"source" : "https://fonts.googleapis.com/css?family=Roboto:400,100,700"
	},
	{
		"local" : "external/script/jquery.min.js",
		"source" : "https://cdnjs.cloudflare.com/ajax/libs/jquery/" + Version.JQUERY + "/jquery.min.js"
	},
	{
		"local" : "external/script/jquery-ui.min.js",
		"source" : "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/" + Version.JQUERY + "/jquery-ui.min.js"
	},
	{
		"local" : "external/style/bootstrap.min.css",
		"source" : "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/" + Version.BOOTSTRAP + "/css/bootstrap.min.css",
		"assets" :
		[
			{
				"local" : "external/fonts/glyphicons-halflings-regular.eot",
				"source" : "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/" + Version.BOOTSTRAP + "/fonts/glyphicons-halflings-regular.eot"
			},
			{
				"local" : "external/fonts/glyphicons-halflings-regular.svg",
				"source" : "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/" + Version.BOOTSTRAP + "/fonts/glyphicons-halflings-regular.svg"
			},
			{
				"local" : "external/fonts/glyphicons-halflings-regular.ttf",
				"source" : "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/" + Version.BOOTSTRAP + "/fonts/glyphicons-halflings-regular.ttf"
			},
			{
				"local" : "external/fonts/glyphicons-halflings-regular.woff",
				"source" : "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/" + Version.BOOTSTRAP + "/fonts/glyphicons-halflings-regular.woff"
			},
			{
				"local" : "external/fonts/glyphicons-halflings-regular.woff2",
				"source" : "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/" + Version.BOOTSTRAP + "/fonts/glyphicons-halflings-regular.woff2"
			}
		]
	},
	{
		"local" : "external/script/bootstrap.min.js",
		"source" : "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/" + Version.BOOTSTRAP + "/js/bootstrap.min.js"
	},
	{
		"local" : "external/script/roth-lib-js-env.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-env/" + Version.ROTH + "/roth-lib-js-env.js",
		"exclude" : true
	},
	{
		"local" : "external/script/roth-lib-js-framework.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-framework/" + Version.ROTH + "/roth-lib-js-framework.js",
		"assets" :
		[
			{
				"local" : "dev/dev.html",
				"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-web/" + Version.ROTH + "/dev.html"
			}
		]
	},
	{
		"local" : "script/web.js"
	},
	{
		"local" : "style/style.css"
	},
	{
		"local" : "dev/config/override.js",
		"dev" : true
	}
]);

