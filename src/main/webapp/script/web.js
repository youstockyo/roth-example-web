
var moduleDependencies =
{
	test : []
};

var web = new roth.lib.js.web.Web("index", moduleDependencies);

web.hash.defaultModule = "test";
web.hash.defaultPage = "index";

web.handler.feedbacker._default = function(element, field)
{
	if(field)
	{
		if(field.valid)
		{
			element.closest(".has-feedback").addClass("has-success").removeClass("has-error");
			element.siblings("i").addClass("glyphicon-ok").removeClass("glyphicon-remove");
			element.siblings(".message").hide();
		}
		else
		{
			element.closest(".has-feedback").addClass("has-error").removeClass("has-success");
			element.siblings("i").addClass("glyphicon-remove").removeClass("glyphicon-ok");
			element.siblings(".message").show();
		}
	}
	else
	{
		element.closest(".has-feedback").removeClass("has-error").removeClass("has-success");
		element.siblings("i").removeClass("glyphicon-remove").removeClass("glyphicon-ok");
		element.siblings(".message").hide();
	}
};