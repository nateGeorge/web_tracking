//
// @param {String} options.baseurl
var options = {};
options.baseurl = '/test_lso.html';
options.asseturi = '/assets'; // assets = .fla, .jar, etc
var _ec_baseurl = options.baseurl;
var _ec_asseturi = options.asseturi;


// stuff normally set during function call
var value = '12345'; // cookie value
var name = '_id'; // cookie name


// essentially the this.evercookie_lso function
var div = document.getElementById("swfcontainer"),
flashvars = {},
params = {},
attributes = {};

div = document.createElement("div");
div.setAttribute("id", "swfcontainer");
document.body.appendChild(div);

flashvars.everdata = name + "=" + value;
params.swliveconnect = "true";
attributes.id        = "myswf";
attributes.name      = "myswf";
swfobject.embedSWF(_ec_baseurl + _ec_asseturi + "/evercookie.swf", "swfcontainer", "1", "1", "9.0.0", false, flashvars, params, attributes);
