
var client = new roth.lib.js.client.Client();
var template = new roth.lib.js.template.Template();

client.config.viewRenderer = template.render;
client.config.devAppPath = "external/";
client.config.devScript = "script/roth-js-client-dev.js";



