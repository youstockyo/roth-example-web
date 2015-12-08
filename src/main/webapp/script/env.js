

var Version =
{
	ROTH	 			: "0.1.5-SNAPSHOT",
	JQUERY	 			: "1.11.2",
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
		"local" : "script/roth-lib-js-env.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-env/" + Version.ROTH + "/roth-lib-js-env.js",
		"exclude" : true
	},
	{
		"local" : "external/script/roth-lib-js-framework.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-framework/" + Version.ROTH + "/roth-lib-js-framework.js",
		"dev" : false
	},
	{
		"local" : "external/script/roth-lib-js.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js/" + Version.ROTH + "/roth-lib-js.js",
		"dev" : true
	},
	{
		"local" : "external/script/roth-lib-js-template.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-template/" + Version.ROTH + "/roth-lib-js-template.js",
		"dev" : true
	},
	{
		"local" : "external/script/roth-lib-js-client.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client/" + Version.ROTH + "/roth-lib-js-client.js",
		"dev" : true
	},
	{
		"local" : "external/script/roth-lib-js-client-dev.js",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client-dev/" + Version.ROTH + "/roth-lib-js-client-dev.js",
		"dev" : true,
		"assets" :
		[
			{
				"local" : "external/view/component/select.html",
				"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client-dev/" + Version.ROTH + "/view/component/select.html"
			},
			{
				"local" : "external/view/layout/dev.html",
				"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client-dev/" + Version.ROTH + "/view/layout/dev.html"
			},
			{
				"local" : "external/view/page/dev/config.html",
				"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client-dev/" + Version.ROTH + "/view/page/dev/config.html"
			},
			{
				"local" : "external/view/page/dev/links.html",
				"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client-dev/" + Version.ROTH + "/view/page/dev/links.html"
			},
			{
				"local" : "external/view/page/dev/services.html",
				"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client-dev/" + Version.ROTH + "/view/page/dev/services.html"
			}
		]
	},
	{
		"local" : "external/style/dev.css",
		"source" : "http://dist.roth.cm/roth/lib/js/roth-lib-js-client-dev/" + Version.ROTH + "/style/dev.css",
		"dev" : true
	},
	{
		"local" : "script/client.js"
	},
	{
		"local" : "dev/config/override.js",
		"dev" : true
	}
]);

