var roth = roth || {};
roth.lib = roth.lib || {};
roth.lib.js = roth.lib.js || {};
roth.lib.js.version = "0.1.5-SNAPSHOT";

var Type = Type ||
{
	UNDEFINED 	: "undefined",
	NULL		: "null",
	BOOLEAN		: "boolean",
	NUMBER		: "number",
	STRING		: "string",
	ARRAY		: "array",
	FUNCTION	: "function",
	DATE		: "date",
	ERROR		: "error",
	REGEXP		: "regexp",
	OBJECT		: "object"
};

var typeOf = typeOf || function(value)
{
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};

var isType = isType || function(value)
{
	var type = typeOf(value);
	for(var i = 1; i < arguments.length; i++)
	{
		if(type == arguments[i])
		{
			return true;
		}
	}
	return false;
};

var isUndefined = isUndefined || function(value)
{
	return value === undefined;
};

var isDefined = isDefined || function(value)
{
	return !isUndefined(value);
};

var isNull = isNull || function(value)
{
	return value === null;
};

var isSet = isSet || function(value)
{
	return !isUndefined(value) && !isNull(value);
};

var isValid = isValid || function(value)
{
	return isSet(value) && value !== "";
};

var isValidString = isValidString || function(value)
{
	return isValid(value) && isString(value);
};

var isInvalid = isInvalid || function(value)
{
	return !isValid(value);
};

var isEmpty = isEmpty || function(value)
{
	var empty = !isSet(value);
	if(!empty)
	{
		if(isString(value))
		{
			empty = !isValidString(value);
		}
		else if(isArray(value))
		{
			empty = value.length == 0;
		}
		else if(isObject(value))
		{
			empty = Object.keys(value).length == 0;
		}
	}
	return empty;
};

var isNotEmpty = isNotEmpty || function(value)
{
	return !isEmpty(value);
}

var isTrue = isTrue || function(value)
{
	return value === true || value === "true";
};

var isFalse = isFalse || function(value)
{
	return value === false || value === "false";;
};

var isBoolean = isBoolean || function(value)
{
	return isType(value, Type.BOOLEAN);
};

var isNumber = isNumber || function(value)
{
	return isType(value, Type.NUMBER);
};

var isString = isString || function(value)
{
	return isType(value, Type.STRING);
};

var isArray = isArray || function(value)
{
	return isType(value, Type.ARRAY);
};

var isFunction = isFunction || function(value)
{
	return isType(value, Type.FUNCTION);
};

var isDate = isDate || function(value)
{
	return isType(value, Type.DATE);
};

var isError = isError || function(value)
{
	return isType(value, Type.ERROR);
};

var isRegexp = isRegexp || function(value)
{
	return isType(value, Type.REGEXP);
};

var isObject = isObject || function(value)
{
	return isType(value, Type.OBJECT);
};

var inArray = inArray || function(value, array)
{
	var contains = false;
	if(isArray(array))
	{
		contains = array.indexOf(value) > -1;
	}
	return contains;
};

var inMap = inMap || function(value, map)
{
	var array = [];
	for(var key in map)
	{
		array.push(map[key]);
	}
	return inArray(value, array);
};

var forEach = forEach || function(object, callback)
{
	if(isFunction(callback))
	{
		if(isArray(object))
		{
			for(var i in object)
			{
				var loop =
				{
					index 	: i,
					length 	: object.length,
					first	: i == 0,
					last	: i == object.length - 1
				};
				callback(object[i], i, loop);
			}
		}
		else if(isObject(object))
		{
			var keys = Object.keys(object);
			for(var i in keys)
			{
				var key = keys[i];
				var loop =
				{
					index 	: i,
					length 	: keys.length,
					first	: i == 0,
					last	: i == keys.length - 1
				};
				callback(object[key], key, loop);
			}
		}
	}
};




var CookieUtil = CookieUtil || (function()
{
	
	return {
		get : function(key)
		{
			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		},
		set : function(key, value, end, path, domain, secure)
		{
			if(!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { return false; }
			var expires = "";
			if(end)
			{
				switch(end.constructor)
				{
					case Number:
						expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end;
						break;
					case String:
						expires = "; expires=" + end;
						break;
					case Date:
						expires = "; expires=" + end.toUTCString();
						break;
				}
			}
			document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + expires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
			return true;
		},
		remove : function(key, path, domain)
		{
			if(!key || !this.has(key)) { return false; }
			document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( domain ? "; domain=" + domain : "") + ( path ? "; path=" + path : "");
			return true;
		},
		has : function(key)
		{
			return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		}
	};
	
})();




var CurrencyUtil = CurrencyUtil || (function()
{
	
	return {
		
		formatInput : function(value)
		{
			return this.format(value, null, null)
		},
		
		formatText : function(value)
		{
			return this.format(value, "$", ",")
		},
		
		format : function(value, symbol, seperator)
		{
			if(isNumber(value))
			{
				value = value / 100;
				var formattedValue = isValidString(symbol) ? symbol : "";
				formattedValue += isValidString(seperator) ? parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, seperator) : parseFloat(value).toFixed(2);
				return formattedValue;
			}
			else
			{
				return "";
			}
		},
		
		parse : function(value)
		{
			var parsedValue = null;
			if(isValidString(value))
			{
				try
				{
					value = parseFloat(value.replace(/[^0-9.]/g, ""));
					if(!isNaN(value))
					{
						parsedValue = Math.floor(value * 100);
					}
				}
				catch(e)
				{
					
				}
			}
			return parsedValue;
		}
		
	};
	
})();




var DateUtil = DateUtil || (function()
{
	var defaultPattern = "yyyy-MM-dd HH:mm:ss z";
	var defaultLang = "en";
	
	var formatRegExp = (function()
	{
		var builder = "";
		builder += "''|'|";
		builder += "yyyy|yy|";
		builder += "MMMM|MMM|MM|M|";
		builder += "dd|d|";
		builder += "EEEE|EEE|u|";
		builder += "HH|H|";
		builder += "kk|k|";
		builder += "KK|K|";
		builder += "hh|h|";
		builder += "mm|m|";
		builder += "ss|s|";
		builder += "SSS|SS|S|";
		builder += "a|";
		builder += "zzz|zz|z|";
		builder += "Z|X|";
		return new RegExp(builder, "g");
	})();
	
	return {
		
		label :
		{
			"en" :
			{
				"longMonths" : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				"shortMonths" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				"longDays" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				"shortDays" : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			},
			"es" :
			{
				"longMonths" : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
				"shortMonths" : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
				"longDays" : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
				"shortDays" : ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
			}
		},
		
		get : function(year, month, day, hour, minutes, seconds, milliseconds)
		{
			month = !isNaN(month) ? month - 1 : 0;
			return new Date(year, month, day, hour, minutes, seconds, milliseconds);
		},
		
		format : function(pattern, date, lang)
		{
			var self = this;
			pattern = isValidString(pattern) ? pattern : defaultPattern;
			if(!isNaN(date))
			{
				date = new Date(date);
			}
			else if(!isDate(date))
			{
				date = new Date();
			}
			lang = isSet(this.label[lang]) ? lang : defaultLang;
			var escape = false;
			var formattedDate = pattern.replace(formatRegExp, function(match, capture)
			{
				switch(match)
				{
					case "''":
					{
						return "'";
					}
					case "'":
					{
						escape = !escape;
						return "";
					}
					default:
					{
						if(escape)
						{
							return match;
						}
					}
				}
				var replacement = "";
				switch(match)
				{
					case "yyyy":
					{
						replacement = new String(date.getFullYear());
						break;
					}
					case "yy":
					{
						replacement = new String(date.getFullYear()).slice(-2);
						break;
					}
					case "MMMM":
					{
						replacement = self.label[lang].longMonths[date.getMonth()];
						break;
					}
					case "MMM":
					{
						replacement = self.label[lang].shortMonths[date.getMonth()];
						break;
					}
					case "MM":
					case "M":
					{
						replacement = StringUtil.padNumber(date.getMonth() + 1, match.length);
						break;
					}
					case "dd":
					case "d":
					{
						replacement = StringUtil.padNumber(date.getDate(), match.length);
						break;
					}
					case "EEEE":
					{
						replacement = self.label[lang].longDays[date.getDay()];
						break;
					}
					case "EEE":
					{
						replacement = self.label[lang].shortDays[date.getDay()];
						break;
					}
					case "u":
					{
						replacement = new String(date.getDay() + 1);
						break;
					}
					case "HH":
					case "H":
					{
						replacement = StringUtil.padNumber(date.getHours(), match.length);
						break;
					}
					case "kk":
					case "k":
					{
						replacement = StringUtil.padNumber(date.getHours() + 1, match.length);
						break;
					}
					case "KK":
					case "K":
					{
						replacement = StringUtil.padNumber(date.getHours() % 12 - 1, match.length);
						break;
					}
					case "hh":
					case "h":
					{
						replacement = StringUtil.padNumber(date.getHours() % 12 || 12, match.length);
						break;
					}
					case "mm":
					case "m":
					{
						replacement = StringUtil.padNumber(date.getMinutes(), match.length);
						break;
					}
					case "ss":
					case "s":
					{
						replacement = StringUtil.padNumber(date.getSeconds(), match.length);
						break;
					}
					case "SSS":
					case "SS":
					case "S":
					{
						replacement = StringUtil.padNumber(date.getMilliseconds(), match.length);
						break;
					}
					case "a":
					{
						replacement = date.getHours() < 12 ? "AM" : "PM";
						break;
					}
					case "zzz":
					case "zz":
					case "z":
					{
						var matcher = /\((\w*)\)/.exec(date.toString());
						if(!isNull(matcher))
						{
							replacement = matcher[1];
						}
						break;
					}
					case "Z":
					case "X":
					{
						var offsetMinutes = date.getTimezoneOffset();
						var sign = offsetMinutes <= 0 ? "+" : "-";
						var offsetHours = Math.abs(offsetMinutes / 60);
						var hours = Math.floor(offsetHours);
						var minutes = Math.round((offsetHours - hours) * 60);
						replacement = sign + StringUtil.padNumber(hours, 2) + StringUtil.padNumber(minutes, 2);
						break;
					}
				}
				return replacement;
			});
			return formattedDate;
		},
		
		getParser : function(pattern, lang)
		{
			var self = this;
			pattern = isValidString(pattern) ? pattern : defaultPattern;
			lang = isSet(this.label[lang]) ? lang : defaultLang;
			var groups = [];
			var escape = false;
			var builder = pattern.replace(formatRegExp, function(match, capture)
			{
				switch(match)
				{
					case "''":
					{
						return "'";
					}
					case "'":
					{
						escape = !escape;
						return "";
					}
					default:
					{
						if(escape)
						{
							return match;
						}
					}
				}
				var replacement = "";
				switch(match)
				{
					case "yyyy":
					{
						replacement = "([0-9]{4})";
						break;
					}
					case "yy":
					{
						replacement = "([0-9]{2})";
						break;
					}
					case "MMMM":
					{
						replacement = "(" + self.label[lang].longMonths.join("|") + ")";
						break;
					}
					case "MMM":
					{
						replacement = "(" + self.label[lang].shortMonths.join("|") + ")";
						break;
					}
					case "MM":
					{
						replacement = "([0][1-9]|[1][0-2])";
						break;
					}
					case "M":
					{
						replacement = "([0][1-9]|[1][0-2]|[1-9])";
						break;
					}
					case "dd":
					{
						replacement = "([0][1-9]|[1-2][0-9]|[3][0-1])";
						break;
					}
					case "d":
					{
						replacement = "([0][1-9]|[1-2][0-9]|[3][0-1]|[1-9])";
						break;
					}
					case "EEEE":
					{
						replacement = "(" + self.label[lang].longDays.join("|") + ")";
						break;
					}
					case "EEE":
					{
						replacement = "(" + self.label[lang].shortDays.join("|") + ")";
						break;
					}
					case "u":
					{
						replacement = "([1-7])";
						break;
					}
					case "HH":
					{
						replacement = "([0-1][0-9]|[2][0-3])";
						break;
					}
					case "H":
					{
						replacement = "([0-1][0-9]|[2][0-3]|[0-9])";
						break;
					}
					case "kk":
					{
						replacement = "([0][1-9]|[1][0-9]|[2][0-4])";
						break;
					}
					case "k":
					{
						replacement = "([0][1-9]|[1][0-9]|[2][0-4]|[0-9])";
						break;
					}
					case "KK":
					{
						replacement = "([0][0-9]|[1][0-1])";
						break;
					}
					case "K":
					{
						replacement = "([0][0-9]|[1][0-1]|[0-9])";
						break;
					}
					case "hh":
					{
						replacement = "([0][1-9]|[0-1][0-2])";
						break;
					}
					case "h":
					{
						replacement = "([0][1-9]|[0-1][0-2]|[1-9])";
						break;
					}
					case "mm":
					{
						replacement = "([0-5][0-9])";
						break;
					}
					case "m":
					{
						replacement = "([0-5][0-9]|[0-9])";
						break;
					}
					case "ss":
					{
						replacement = "([0-5][0-9])";
						break;
					}
					case "s":
					{
						replacement = "([0-5][0-9]|[0-9])";
						break;
					}
					case "SSS":
					{
						replacement = "([0-9]{3})";
						break;
					}
					case "SS":
					{
						replacement = "([0-9]{2,3})";
						break;
					}
					case "S":
					{
						replacement = "([0-9]{1,3})";
						break;
					}
					case "a":
					{
						replacement = "(AM|PM)";
						break;
					}
					default:
					{
						match = null;
						break;
					}
				}
				if(match)
				{
					groups.push(match)
				}
				return replacement;
			});
			return {
				regExp : new RegExp(builder, "i"),
				groups : groups
			}
		},
		
		isValid : function(pattern, value, lang)
		{
			var parser = this.getParser(pattern, lang);
			return parser.regExp.test(value);
		},
		
		parse : function(pattern, value, lang)
		{
			var self = this;
			lang = isSet(this.label[lang]) ? lang : defaultLang;
			var parser = this.getParser(pattern, lang);
			var date = null;
			var matcher = parser.regExp.exec(value);
			if(matcher)
			{
				var defaultDate = new Date();
				var year = defaultDate.getYear();
				var month = defaultDate.getMonth();
				var day = 1;
				var hours = 0;
				var minutes = 0;
				var seconds = 0;
				var milliseconds = 0;
				var pm = false;
				for(var i in parser.groups)
				{
					var group = parser.groups[i];
					var capture = matcher[new Number(i) + 1];
					switch(group)
					{
						case "yyyy":
						{
							year = new Number(capture);
							break;
						}
						case "yy":
						{
							year = new Number(capture) + 2000;
							break;
						}
						case "MMMM":
						{
							capture = capture.charAt(0).toUpperCase() + capture.slice(1).toLowerCase();
							var index = self.label[lang].longMonths.indexOf(capture);
							if(index > -1)
							{
								month = index;
							}
							break;
						}
						case "MMM":
						{
							capture = capture.charAt(0).toUpperCase() + capture.slice(1).toLowerCase();
							var index = self.label[lang].shortMonths.indexOf(capture);
							if(index > -1)
							{
								month = index;
							}
							break;
						}
						case "MM":
						case "M":
						{
							month = new Number(capture) - 1;
							break;
						}
						case "dd":
						case "d":
						{
							day = new Number(capture);
							break;
						}
						case "EEEE":
						case "EEE":
						case "u":
						{
							// ignore weekday
							break;
						}
						case "HH":
						case "H":
						{
							hours = new Number(capture);
							break;
						}
						case "kk":
						case "k":
						{
							hours = new Number(capture) - 1;
							break;
						}
						case "KK":
						case "K":
						{
							hours = new Number(capture) + 1;
							break;
						}
						case "hh":
						case "h":
						{
							hours = new Number(capture);
							break;
						}
						case "mm":
						case "m":
						{
							minutes = new Number(capture);
							break;
						}
						case "ss":
						case "s":
						{
							seconds = new Number(capture);
							break;
						}
						case "SSS":
						case "SS":
						case "S":
						{
							milliseconds = new Number(capture);
							break;
						}
						case "a":
						{
							pm = "PM" == capture.toUpperCase();
							break;
						}
					}
				}
				if(pm)
				{
					hours += 12;
					if(hours == 24)
					{
						hours = 0;
					}
				}
				date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
			}
			return date;
		}
		
	};
	
})();




var IdUtil = IdUtil || (function()
{
	var defaultLength = 10;
	var defaultKey = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	return {
		
		generate : function(length, key)
		{
			length = isNumber(length) ? length : defaultLength;
			key = isValidString(key) ? key : defaultKey;
			var value = "";
			for(var i = 0; i < length; i++)
			{
				value += key.charAt(Math.floor(Math.random() * key.length));
			}
			return value;
		}
		
	};
	
})();




var NumberUtil = NumberUtil || (function()
{
	
	return {
		
		formatInt : function(value)
		{
			var parsedValue = parseInt(value);
			return !isNaN(parsedValue) ? parsedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
		},
		
		formatDecimal : function(value)
		{
			var parsedValue = parseFloat(value);
			return !isNaN(parsedValue) ? parsedValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
		},
		
		formatPercent : function(value, decimal)
		{
			var parsedValue = parseFloat(value);
			return !isNaN(parsedValue) ? (parsedValue * 100).toFixed(decimal) : "";
		}
		
	}
	
})();




var ObjectUtil = ObjectUtil || (function()
{
	
	return {
		
		parse : function(value)
		{
			var object = null;
			try
			{
				if(isObject(value))
				{
					object = value;
				}
				else
				{
					eval("object = " + value);
				}
			}
			catch(e)
			{
				
			}
			return isObject(object) ? object : {};
		},
		
		getValue : function(object, path)
		{
			var paths = path.split(".");
			for(var i in paths)
			{
				if(object[paths[i]])
				{
					object = object[paths[i]];
				}
				else
				{
					object = null;
					break;
				}
			}
			return object;
		}
		
	};
	
})();




var StringUtil = StringUtil || (function()
{
	
	return {
		
		padNumber : function(value, length)
		{
			return this.pad(new String(value), length, "0", true);
		},
		
		padLeft : function(value, length, character)
		{
			if(character)
			return this.pad(value, length, character, true);
		},
		
		padRight : function(value, length, character)
		{
			return this.pad(value, length, character, false);
		},
		
		pad : function(value, length, character, left)
		{
			if(value.length < length)
			{
				character = isValidString(character) ? character.substring(0, 1) : " ";
				var pad = new Array(length + 1 - value.length).join(character);
				return left ? pad + value : value + pad;
			}
			else
			{
				return value;
			}
		},
		
		repeat : function(value, length)
		{
			var repeated = "";
			for(var i = 0; i < length; i++)
			{
				repeated += value;
			}
			return repeated;
		},
		
		equals : function(value1, value2, caseInsensitive)
		{
			caseInsensitive = isSet(caseInsensitive) ? caseInsensitive : true;
			var equals = false;
			if(value1 && value2)
			{
				equals = new String(value1).match(new RegExp("^" + new String(value2) + "$", caseInsensitive ? "i" : "")) !== null;
			}
			return equals;
		},
		
		capitalize : function(value)
		{
			return value.charAt(0).toUpperCase() + value.slice(1);
		}
	};
	
})();



var roth = roth || {};
roth.lib = roth.lib || {};
roth.lib.js = roth.lib.js || {};
roth.lib.js.template = roth.lib.js.template || {};
roth.lib.js.template.version = "0.1.5-SNAPSHOT";

roth.lib.js.template.Template = roth.lib.js.template.Template || function(config)
{
	var self = this;
	
	var Config =
	{
		openUnescapedExpression 	: "{{{",
		openEscapedExpression 		: "{{",
		openStatement 				: "{%",
		closeUnescapedExpression	: "}}}",
		closeEscapedExpression		: "}}",
		closeStatement				: "%}",
		dataVar						: "$_d",
		escapeVar					: "$_e",
		issetVar					: "$_i",
		argVar						: "$_a",
		tempVar						: "$_t",
		sourceVar					: "$_s"
	};
	
	var escapeRegExp = function(value)
	{
		return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	
	var syntaxRegExp = (function()
	{
		config = typeof config === "object" ? config : {};
		for(var name in Config)
		{
			if(config[name] === undefined || config[name] === null || config[name] == "")
			{
				config[name] = Config[name];
			}
		}
		var builder = "";
		builder += "\\\\r\\\\n|";
		builder += "\\\\n|";
		builder += "\\r\\n|";
		builder += "\\n|";
		builder += "\\\\\"|";
		builder += "\\\"|";
		builder += escapeRegExp(config.openUnescapedExpression) + "|";
		builder += escapeRegExp(config.openEscapedExpression) + "|";
		builder += escapeRegExp(config.openStatement) + "|";
		builder += escapeRegExp(config.closeUnescapedExpression) + "|";
		builder += escapeRegExp(config.closeEscapedExpression) + "|";
		builder += escapeRegExp(config.closeStatement) + "|";
		//builder += "defined\\((.+?)\\)";
		return new RegExp(builder, "g");
	})();
	
	this.parse = function(source, data)
	{
		var escape = true;
		var parsedSource = "";
		if(typeof data === "object")
		{
			for(var name in data)
			{
				parsedSource += "var " + name + " = " + config.dataVar + "[\"" + name + "\"];\n";
			}
		}
		parsedSource += "var " + config.escapeVar + " = function(" + config.argVar + ") { return " + config.argVar + ".replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\"); };\n";
		parsedSource += "var " + config.issetVar + " = function(" + config.argVar + ") { return "  + config.argVar + " !== undefined && " + config.argVar + " !== null };\n";
		parsedSource += "var " + config.tempVar + ";\nvar " + config.sourceVar + "=\"\";\n" + config.sourceVar + "+=\"";
		parsedSource += source.replace(syntaxRegExp, function(match, capture)
		{
			var replacement = "";
			switch(match)
			{
				case "\\r\\n":
				case "\\n":
				{
					replacement = escape ? "\\\\n" : "\\n";
					break;
				}
				case "\r\n":
				case "\n":
				{
					replacement = escape ? "\\n" : "\n";
					break;
				}
				case "\\\"":
				{
					replacement = escape ? "\\\\\\\"" : "\\\"";
					break;
				}
				case "\"":
				{
					replacement = escape ? "\\\"" : "\"";
					break;
				}
				case config.openUnescapedExpression:
				{
					replacement = "\"; try{" + config.tempVar + "=";
					escape = false;
					break;
				}
				case config.openEscapedExpression:
				{
					replacement = "\"; try{" + config.tempVar + "=";
					escape = false;
					break;
				}
				case config.openStatement:
				{
					replacement = "\";";
					escape = false;
					break;
				}
				case config.closeUnescapedExpression:
				{
					replacement = "; " + config.sourceVar + "+=(" + config.issetVar + "(" + config.tempVar + ")) ? new String(" + config.tempVar + ") : \"\";}catch(e){}; " + config.sourceVar + "+=\"";
					escape = true;
					break;
				}
				case config.closeEscapedExpression:
				{
					replacement = "; " + config.sourceVar + "+=(" + config.issetVar + "(" + config.tempVar + ")) ? " + config.escapeVar + "(new String(" + config.tempVar + ")) : \"\";}catch(e){}; " + config.sourceVar + "+=\"";
					escape = true;
					break;
				}
				case config.closeStatement:
				{
					replacement = config.sourceVar + "+=\"";
					escape = true;
					break;
				}
				default:
				{
					/*
					if(match.indexOf("defined") == 0)
					{
						replacement = "typeof " + capture + " !== " + "\"undefined\"";
					}
					*/
					break;
				}
			}
			return replacement;
		});
		parsedSource += "\";\nreturn " + config.sourceVar + ";";
		return parsedSource;
	};
	
	this.renderParsed = function(parsedSource, data)
	{
		return new Function(config.dataVar, parsedSource)(data);
	};
	
	this.render = function(source, data)
	{
		return self.renderParsed(self.parse(source, data), data);
	};
	
};



var roth = roth || {};
roth.lib = roth.lib || {};
roth.lib.js = roth.lib.js || {};
roth.lib.js.client = roth.lib.js.client || {};
roth.lib.js.client.version = "0.1.5-SNAPSHOT";

roth.lib.js.client.Client = roth.lib.js.client.Client || function()
{
	var self = this;
	var inited = false;
	
	this.config = new roth.lib.js.client.Config();
	this.hash = new roth.lib.js.client.Hash();
	this.endpoint = new roth.lib.js.client.Endpoint();
	this.queue = new roth.lib.js.client.Queue();
	this.dev = null;
	
	this.text = {};
	this.layout = {};
	this.page = {};
	this.context = {};
	
	this.init = function()
	{
		this.checkJquery();
		this.checkDev();
		window.addEventListener("hashchange", function()
		{
			self.load();
		},
		false);
		document.addEventListener("DOMContentLoaded", function()
		{
			if(!inited)
			{
				inited = true;
				self.loadConfig(function()
				{
					self.initConsole();
					self.initJquery();
					self.initConfig();
					self.initDev();
					self.load();
				});
			}
		});
	};
	
	this.checkJquery = function()
	{
		if(!isSet(jQuery))
		{
			document.write('<script src="' + this.config.jgetJqueryScript() + '"></script>');
		}
	};
	
	this.checkDev = function()
	{
		if(isDev())
		{
			if(typeof roth.lib.js.template == "undefined" || typeof roth.lib.js.template.Template == "undefined")
			{
				document.write('<script src="' + this.config.getDevTemplateScript() + '"></script>');
			}
			if(typeof roth.lib.js.client.dev == "undefined" || typeof roth.lib.js.client.dev.Dev == "undefined")
			{
				document.write('<link href="' + this.config.getDevStyle() + '" rel="stylesheet" type="text/css" />');
				document.write('<script src="' + this.config.getDevScript() + '"></script>');
			}
		}
	};
	
	this.loadConfig = function(init)
	{
		var configId = IdUtil.generate();
		this.queue.config(configId, function()
		{
			self.loadResource(self.config.getConfigDataPath(), "json",
			function(data)
			{
				if(isObject(data))
				{
					if(isObject(data.endpoint))
					{
						$.extend(true, self.config.endpoint, data.endpoint);
					}
					if(isObject(data.text))
					{
						$.extend(true, self.config.text, data.text);
					}
					if(isObject(data.layout))
					{
						$.extend(true, self.config.layout, data.layout);
					}
					if(isObject(data.module))
					{
						$.extend(true, self.config.module, data.module);
					}
					if(isObject(data.section))
					{
						$.extend(true, self.config.section, data.section);
					}
					if(isObject(data.component))
					{
						$.extend(true, self.config.component, data.component);
					}
				}
				self.queue.complete(configId);
			},
			function(errors)
			{
				self.queue.complete(configId);
			});
		});
		if(isDev())
		{
			var devConfigId = IdUtil.generate();
			this.queue.config(devConfigId, function()
			{
				self.loadResource(self.config.getDevConfigDataPath(), "json",
				function(data)
				{
					if(isObject(data))
					{
						self.config.dev = data;
					}
					self.queue.complete(devConfigId);
				},
				function(errors)
				{
					self.queue.complete(devConfigId);
				});
			});
		}
		var initId = IdUtil.generate();
		this.queue.callback(initId, function()
		{
			self.queue.complete(initId);
			init();
		});
		this.queue.execute();
	};
	
	this.initConsole = function()
	{
		var console = window.console;
		if(console && !isDev() && !isDebug())
		{
			for(var method in console)
			{
				if(isFunction(console[method]) && Object.prototype.hasOwnProperty.call(console, method))
				{
					console[method] = function(){};
				}
			}
		}
		else
		{
			console.json = function(object)
			{
				console.log(JSON.stringify(object, null, 4));
			};
		}
	};
	
	this.initJquery = function()
	{
		jQuery.expr[":"].notInitedValue = function(node, index, match)
		{
			return !isSet($(node).prop("inited-value"));
		};
		jQuery.expr[":"].include = function(node, index, match)
		{
			var element = $(node);
			return element.is(":enabled") && (element.is(":visible") || isTrue(element.attr(self.config.fieldIncludeAttribute)));
		};
	};
	
	this.initConfig = function()
	{
		this.hash.defaultModule = this.config.defaultModule;
		this.hash.defaultPage = this.config.defaultPage;
		this.hash.langStorage = this.config.langStorage;
		this.endpoint.currentStorage = this.config.endpointCurrentStorage;
		this.endpoint.availableStorage = this.config.endpointAvailableStorage;
		if(!isSet(this.config.endpoint[getEnvironment()]) && isHyperTextProtocol())
		{
			var endpoint = "https://";
			endpoint += window.location.host;
			endpoint += window.location.pathname.slice(0, window.location.pathname.lastIndexOf("/") + 1);
			this.config.endpoint[getEnvironment()] = [endpoint];
		}
	};
	
	this.initDev = function()
	{
		if(isDev())
		{
			this.dev = new roth.lib.js.client.dev.Dev(this.config);
		}
	};
	
	this.load = function()
	{
		if(this.isLoadable())
		{
			this.hide();
			this.queueEndpoints();
			//this.queueText();
			if(this.hash.isNewLayout())
			{
				this.queueLayoutInit();
				this.queueLayout();
				this.queueLayoutReady();
			}
			this.queuePageInit();
			this.queuePage();
			this.queuePageReady();
			this.queueSections();
			this.queueComponents();
			this.queueTranslation();
			this.queueFields();
			this.queueShow();
			this.queue.execute();
		}
	};
	
	this.isLoadable = function()
	{
		var loadable = this.hash.isValid();
		if(loadable)
		{
			var module = this.hash.getModule();
			var page = this.hash.getPage();
			var layout = this.config.getLayout(module, page);
			this.hash.setLayout(layout);
			if(!(isSet(this.hash.lang) && this.config.isValidLang(this.hash.lang)))
			{
				var lang = localStorage.getItem(this.hash.langStorage);
				if(this.config.isValidLang(lang))
				{
					this.hash.setLang(lang);
				}
				else
				{
					if(window.navigator.language)
					{
						lang = window.navigator.language;
					}
					else if(window.navigator.browserLanguage)
					{
						lang = window.navigator.browserLanguage;
					}
					if(isSet(lang) && lang.length >= 2)
					{
						lang = lang.substring(0, 2);
					}
					lang = this.config.isValidLang(lang) ? lang : this.config.defultLang;
					this.hash.setLang(lang);
					localStorage.setItem(this.hash.langStorage, lang);
				}
			}
			var changeParams = this.config.getChangeParams(module, page);
			if(isNotEmpty(changeParams))
			{
				/*
				var changed = false;
				var loadedParam = this.hash.cloneLoadedParam();
				for(var name in this.hash.param)
				{
					changed = param.change.indexOf(name) > -1;
					if(!changed)
					{
						changed = this.hash.param[name] == loadedParam[name];
						if(!changed)
						{
							break;
						}
						else
						{
							delete loadedParam[name];
						}
					}
					else
					{
						delete loadedParam[name];
					}
				}
				if(changed)
				{
					changed = Object.keys(loadedParam).length == 0;
				}
				if(changed)
				{
					if(isFunction(this.layout.change))
					{
						this.layout.change(this.layout.init);
					}
					if(isFunction(this.page.change))
					{
						this.page.change(this.page.init);
					}
					loadable = false;
				}
				*/
			}
			var params = this.config.getParams(module, page);
			if(isNotEmpty(params))
			{
				var errorParamsRedirector = this.config.getErrorParamsRedirector(module, page);
				if(isFunction(errorParamsRedirector))
				{
					/*
					if(loadable && isNotEmpty(param.required))
					{
						for(var i = 0; i < param.required.length; i++)
						{
							if(!this.hash.hasParam(param.required[i]))
							{
								errorParamsRedirector();
								loadable = false;
								break;
							}
						}
					}
					if(loadable && isNotEmpty(param.any))
					{
						var found = false;
						for(var i = 0; i < param.any.length; i++)
						{
							if(self.hash.hasParam(param.any[i]))
							{
								found = true;
								break;
							}
						}
						if(!found)
						{
							errorParamsRedirector();
							loadable = false;
						}
					}
					*/
				}
			}
		}
		return loadable;
	};
	
	this.getLayoutElement = function()
	{
		return $("#" + this.config.layoutId);
	};
	
	this.getPageElement = function()
	{
		return $("#" + this.config.pageId);
	};
	
	this.hide = function()
	{
		this.hash.log();
		this.hash.loadedParam();
		var layout = this.hash.layout;
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var layoutElement = this.getLayoutElement();
		var pageElement = this.getPageElement();
		if(isSet(this.hash.loaded.value) && isSet(this.hash.loaded.layout) && this.hash.isNewLayout())
		{
			layoutElement.hide();
			pageElement.hide();
			pageElement.empty();
			layoutElement.empty();
		}
		else if(isSet(this.hash.loaded.value) && isSet(this.hash.loaded.page))
		{
			pageElement.hide();
			pageElement.empty();
		}
		else
		{
			layoutElement.hide();
			pageElement.hide();
		}
		if(this.hash.isNewLayout())
		{
			this.layout = {};
		}
		this.page = {};
	};
	
	this.queueEndpoints = function()
	{
		var endpoints = sessionStorage.getItem(this.config.endpointAvailableStorage);
		var id = IdUtil.generate();
		this.queue.endpoints(id, function()
		{
			self.loadEndpoints(endpoints, id);
		});
	};
	
	this.loadEndpoints = function(endpoints, id)
	{
		if(isMock())
		{
			self.endpoint.clear();
			self.queue.complete(id);
		}
		else if(!isSet(endpoints))
		{
			self.callEndpointList(self.config.endpoint[getEnvironment()],
			function()
			{
				self.queue.complete(id);
			},
			function()
			{
				console.info("error");
			});
		}
		else
		{
			self.queue.complete(id);
		}
	};
	
	this.callEndpointList = function(endpoints, success, error)
	{
		if(isArray(endpoints) && endpoints.length > 0)
		{
			var endpoint = endpoints.shift();
			$.ajax(
			{
				type		: "POST",
				url			: this.config.getEndpointListUrl(endpoint),
				contentType	: "text/plain",
				dataType	: "json",
				cache		: false,
				success		: function(response)
				{
					if(isLocal())
					{
						self.endpoint.set([endpoint]);
						success();
					}
					else if(isArray(response.endpoints))
					{
						self.endpoint.set(response.endpoints);
						success();
					}
					else
					{
						self.loadEndpoint(endpoints, success, error);
					}
				},
				complete	: function(jqXHR, textStatus)
				{
					if("success" != textStatus)
					{
						self.callEndpointList(endpoints, success, error);
					}
				}
			});
		}
		else
		{
			error();
		}
	};
	
	this.queueLayoutInit = function()
	{
		var id = IdUtil.generate();
		this.queue.init(id, function()
		{
			self.loadLayoutInit(id);
		});
	};
	
	this.loadLayoutInit = function(id)
	{
		var init = this.config.getLayoutInit(this.hash.layout);
		if(isObject(init))
		{
			var request = isObject(init.request) ? init.request : this.hash.param;
			var success = function(data)
			{
				if(isFunction(init.success))
				{
					init.success(data);
				}
				self.layout.init = data || {};
				self.queue.complete(id);
			};
			var error = function(errors)
			{
				if(isFunction(init.error))
				{
					init.error(errors);
				}
				self.layout.init = {};
				self.queue.complete(id);
			};
			this.service(init.service, init.method, request, success, error);
		}
		else
		{
			self.queue.complete(id);
		}
	};
	
	this.queuePageInit = function()
	{
		var id = IdUtil.generate();
		this.queue.init(id, function()
		{
			self.loadPageInit(id);
		});
	};
	
	this.loadPageInit = function(id)
	{
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var init = this.config.getPageInit(module, page);
		if(isObject(init))
		{
			var request = isObject(init.request) ? init.request : this.hash.param;
			var success = function(data)
			{
				if(isFunction(init.success))
				{
					init.success(data);
				}
				self.page.init = data || {};
				self.queue.complete(id);
			};
			var error = function(errors)
			{
				if(isFunction(init.error))
				{
					init.error(errors);
				}
				self.page.init = {};
				self.queue.complete(id);
			};
			this.service(init.service, init.method, request, success, error);
		}
		else
		{
			self.queue.complete(id);
		}
	};
	
	this.loadResource = function(path, dataType, success, error)
	{
		$.ajax(
		{
			type		: "GET",
			url			: path,
			dataType	: dataType,
			cache		: false,
			ifModified	: false,
			success		: success,
			error		: error
		});
	};
	
	this.queueText = function()
	{
		if(this.hash.isNewLang())
		{
			var id = IdUtil.generate();
			this.queue.text(id, function()
			{
				self.loadText(id);
			});
		}
	};
	
	this.loadText = function(id)
	{
		var success = function(text)
		{
			self.text = text;
			self.queue.complete(id);
		};
		var error = function(jqXHR, textStatus, errorThrown)
		{
			self.text = {};
			self.queue.complete(id);
		};
		this.loadTextResource(this.hash.lang, success, error);
	};
	
	this.loadTextResource = function(lang, success, error)
	{
		this.loadResource(this.config.getTextPath(lang), "json", success, error);
	};
	
	this.queueLayout = function()
	{
		var id = IdUtil.generate();
		this.queue.layout(id, function()
		{
			self.loadLayout(id);
		});
	};
	
	this.loadLayout = function(id)
	{
		var layout = this.hash.layout;
		if(isValidString(layout))
		{
			var success = function(html)
			{
				var layoutRenderer = self.config.getLayoutRenderer(layout);
				if(isFunction(layoutRenderer))
				{
					html = layoutRenderer(html,
					{
						data : self.layout.init,
						config : self.config,
						hash : self.hash,
						text : self.text,
						layout	: self.layout,
						page : self.page,
						context : self.context
					});
				}
				self.getLayoutElement().html(html);
				self.hash.loadedLayout(layout);
				self.queue.complete(id);
			};
			var error = function(jqXHR, textStatus, errorThrown)
			{
				self.getLayoutElement().html("<div id=\"" + self.config.pageId + "\"></div");
				self.hash.loadedLayout(layout);
				self.queue.complete(id);
			};
			this.loadLayoutResource(layout, success, error);
		}
		else
		{
			this.getLayoutElement().html("<div id=\"" + this.config.pageId + "\"></div");
			this.hash.loadedLayout(layout);
		}
	};
	
	this.loadLayoutResource = function(layout, success, error)
	{
		this.loadResource(this.config.getLayoutPath(layout), "text", success, error);
	};
	
	this.queuePage = function()
	{
		var id = IdUtil.generate();
		this.queue.page(id, function()
		{
			self.loadPage(id);
		});
	};
	
	this.loadPage = function(id)
	{
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var success = function(html)
		{
			var pageRenderer = self.config.getPageRenderer(module, page);
			if(isFunction(pageRenderer))
			{
				html = pageRenderer(html,
				{
					data : self.page.init,
					config : self.config,
					hash : self.hash,
					text : self.text,
					layout	: self.layout,
					page : self.page,
					context : self.context
				});
			}
			self.getPageElement().html(html);
			self.hash.loadedModule(module);
			self.hash.loadedPage(page);
			self.hash.loadedValue();
			self.queue.complete(id);
		};
		var error = function(jqXHR, textStatus, errorThrown)
		{
			var errorPageRedirector = self.config.getErrorPageRedirector();
			if(isFunction(errorPageRedirector))
			{
				errorPageRedirector();
			}
		};
		this.loadPageResource(module, page, success, error);
	};
	
	this.loadPageResource = function(module, page, success, error)
	{
		this.loadResource(this.config.getPagePath(module, page), "text", success, error);
	};
	
	this.queueSections = function()
	{
		var id = IdUtil.generate();
		this.queue.sections(id, function()
		{
			$("[" + self.config.sectionAttribute + "]").each(function()
			{
				var element = $(this);
				var section = element.attr(self.config.sectionAttribute);
				self.queueSection(element, section);
			});
			self.queue.complete(id);
		});
	};
	
	this.loadSections = function()
	{
		$("[" + this.config.sectionAttribute + "]").each(function()
		{
			var element = $(this);
			var section = element.attr(self.config.sectionAttribute);
			self.loadSection(element, section);
		});
	};
	
	this.queueSection = function(element, section)
	{
		var id = IdUtil.generate();
		this.queue.section(id, function()
		{
			self.loadSection(element, section, id);
		});
	};
	
	this.loadSection = function(element, section, id)
	{
		var section = isValidString(section) ? section : element.attr(this.config.sectionAttribute);
		var success = function(html)
		{
			var sectionRenderer = self.config.getSectionRenderer();
			if(isFunction(sectionRenderer))
			{
				html = sectionRenderer(html,
				{
					data : self.page.init,
					config : self.config,
					hash : self.hash,
					text : self.text,
					layout	: self.layout,
					page : self.page,
					context : self.context
				});
			}
			element.html(html);
			if(!self.config.isFieldKeep(element))
			{
				element.removeAttr(self.config.sectionAttribute);
			}
			if(isSet(id))
			{
				self.queue.complete(id);
			}
		};
		var error = function(jqXHR, textStatus, errorThrown)
		{
			element.html("");
			element.removeAttr(self.config.sectionAttribute);
			if(isSet(id))
			{
				self.queue.complete(id);
			}
		};
		this.loadSectionResource(section, success, error);
	};
	
	this.loadSectionResource = function(section, success, error)
	{
		this.loadResource(this.config.getSectionPath(section), "text", success, error);
	};
	
	this.queueComponents = function(element, data)
	{
		if(!isSet(element))
		{
			element = this.hash.isNewLayout() ? this.getLayoutElement() : this.getPageElement();
		}
		if(!isSet(data))
		{
			data = {};
		}
		var id = IdUtil.generate();
		this.queue.components(id, function()
		{
			element.find("[" + self.config.componentAttribute + "]").each(function()
			{
				var fieldElement = $(this);
				var component = fieldElement.attr(self.config.componentAttribute);
				self.queueComponent(fieldElement, component, data);
			});
			self.queue.complete(id);
		});
	};
	
	this.loadComponents = function(element, data)
	{
		if(!isSet(element))
		{
			element = this.hash.isNewLayout() ? this.getLayoutElement() : this.getPageElement();
		}
		if(!isSet(data))
		{
			data = {};
		}
		element.find("[" + this.config.componentAttribute + "]").each(function()
		{
			var fieldElement = $(this);
			var component = fieldElement.attr(self.config.componentAttribute);
			self.loadComponent(fieldElement, component, data);
		});
	};

	this.queueComponent = function(element, component, data, callback)
	{
		var id = IdUtil.generate();
		this.queue.component(id, function()
		{
			self.loadComponent(element, component, data, callback, id);
		});
	};
	
	this.loadComponent = function(element, component, data, callback, id)
	{
		var success = function(html)
		{
			var componentRenderer = self.config.getComponentRenderer();
			if(isFunction(componentRenderer))
			{
				html = componentRenderer(html,
				{
					data : data,
					config : self.config,
					hash : self.hash,
					text : self.text,
					layout	: self.layout,
					page : self.page,
					context : self.context
				});
			}
			element.html(html);
			if(!self.config.isFieldKeep(element))
			{
				element.removeAttr(self.config.componentAttribute);
			}
			if(isFunction(callback))
			{
				callback();
			}
			self.queue.complete(id);
		};
		var error = function(jqXHR, textStatus, errorThrown)
		{
			element.html("");
			self.queue.complete(id);
		};
		this.loadComponentResource(component, success, error);
	};
	
	this.loadComponentResource = function(component, success, error)
	{
		this.loadResource(this.config.getComponentPath(component), "text", success, error);
	};
	
	this.queueTranslation = function()
	{
		var id = IdUtil.generate();
		this.queue.translation(id, function()
		{
			self.loadTranslation();
			self.queue.complete(id);
		});
	};
	
	this.loadTranslation = function()
	{
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var translated = this.config.isTranslated(module, page);
		if(translated)
		{
			$("[" + self.config.textAttribute + "] > [" + self.config.langAttribute + "]").each(function()
			{
				var element = $(this);
				var lang = element.attr(self.config.langAttribute);
				if(lang == self.hash.lang)
				{
					element.show();
				}
				else
				{
					element.hide();
				}
			});
			$("select[" + self.config.textAttribute + "]").each(function()
			{
				var element = $(this);
				element.find("option").each(function()
				{
					var optionElement = $(this);
					if(optionElement.css("display") != "none")
					{
						optionElement.prop("selected", true);
						return false;
					}
				});
			});
			$("[" + self.config.textAttribute + "]:not([" + self.config.textAttribute + "]:has(> [" + self.config.langAttribute + "='" + self.hash.lang + "']))").each(function()
			{
				var element = $(this);
				var path = element.attr(self.config.textAttribute);
				if(path != "true")
				{
					var value = ObjectUtil.getValue(self.text, path);
					value = isSet(value) ? value : "";
					element.append("<span lang=\"" + self.hash.lang + "\">" + value + "</span>");
				}
			});
			$("[" + self.config.textAttrAttribute + "]").each(function()
			{
				var element = $(this);
				var attrString = element.attr(self.config.textAttrAttribute);
				if(isValidString(attrString))
				{
					var attrs = attrString.split(",");
					for(var i in attrs)
					{
						var attr = attrs[i];
						if(isValidString(attr))
						{
							var path = "true";
							var attrParts = attr.split(":");
							if(attrParts.length == 2)
							{
								attr = attrParts[0];
								path = attrParts[1];
							}
							var value = element.attr("data-" + attr + "-" + self.hash.lang);
							if(!isValidString(value) && path != "true")
							{
								var value = ObjectUtil.getValue(self.text, path);
								value = isSet(value) ? value : "";
							}
							element.attr(attr, value);
						}
					}
				}
			});
		}
		self.hash.loadedLang();
	};
	
	this.queueFields = function()
	{
		var id = IdUtil.generate();
		this.queue.fields(id, function()
		{
			self.loadFields();
			self.queue.complete(id);
		});
	};
	
	this.loadFields = function()
	{
		// select value
		$("select[value]:notInitedValue, select[placeholder]:notInitedValue").each(function()
		{
			var element = $(this);
			var selected = false;
			var value = element.attr("value");
			if(value)
			{
				var option = element.find("option[value='" + value + "']");
				if(option.length > 0)
				{
					option.first().prop("selected", true);
					selected = true;
				}
			}
			var placeholder = element.attr("placeholder");
			if(placeholder)
			{
				var color = element.css("color");
				element.prepend("<option" + (!selected ? " selected=\"selected\"" : "") + " value=\"\" style=\"display:none;\">" + placeholder + "</option>");
				var change = function()
				{
					if(element.val() == "")
					{
						element.css("color", "#999");
						element.find("option, optgroup").css("color", color);
					}
					else
					{
						element.css("color", color);
					}
				};
				element.change(change);
				change();
			}
			element.prop("inited-value", "true");
		});
		// radio group value
		$("[" + self.config.fieldRadioValueAttribute + "]:notInitedValue").each(function()
		{
			var element = $(this);
			var value = element.attr(self.config.fieldRadioValueAttribute);
			var radio = element.find("input[type=radio][value='" + value + "']");
			if(radio.length > 0)
			{
				radio.first().prop("checked", true);
			}
			else
			{
				element.find("input[type=radio]").first().prop("checked", true);
			}
			element.prop("inited-value", "true");
		});
		// checkbox value
		$("input[type=checkbox][" + self.config.fieldCheckboxValueAttribute + "]:notInitedValue").each(function()
		{
			var element = $(this);
			var value = element.attr(self.config.fieldCheckboxValueAttribute);
			if(isSet(value) && value.toLowerCase() == "true")
			{
				element.prop("checked", true);
			}
			element.prop("inited-value", "true");
		});
	};
	
	this.queueLayoutReady = function()
	{
		var id = IdUtil.generate();
		this.queue.ready(id, function()
		{
			self.loadLayoutReady();
			self.queue.complete(id);
		});
	};
	
	this.loadLayoutReady = function()
	{
		if(isFunction(self.layout.ready))
		{
			self.layout.ready(self.layout.init);
		}
	};
	
	this.queuePageReady = function()
	{
		var id = IdUtil.generate();
		this.queue.ready(id, function()
		{
			self.loadPageReady();
			self.queue.complete(id);
		});
	};
	
	this.loadPageReady = function()
	{
		if(isFunction(self.page.ready))
		{
			self.page.ready(self.page.init);
		}
	};
	
	this.queueShow = function()
	{
		var id = IdUtil.generate();
		this.queue.show(id, function()
		{
			self.show();
			self.queue.complete(id);
		});
	};
	
	this.show = function()
	{
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var layoutElement = self.getLayoutElement();
		var pageElement = self.getPageElement();
		if(layoutElement.is(":hidden"))
		{
			pageElement.show();
			layoutElement.show();
		}
		else
		{
			pageElement.show();
		}
		self.hash.state = null;
	};
	
	this.queueCallback = function(callback)
	{
		var id = IdUtil.generate();
		this.queue.callback(id, function()
		{
			if(isFunction(callback))
			{
				callback();
			}
			self.queue.complete(id);
		});
	};
	
	this.findGroupElements = function(element, active)
	{
		active = isSet(active) ? active : true;
		var selector = "";
		selector += "input[name][type=hidden]" + (active ? ":enabled" : "") + ", ";
		selector += "input[name][type!=hidden][type!=radio][" + this.config.fieldRequiredAttribute + "]" + (active ? ":include" : "") + ", ";
		selector += "select[name][" + this.config.fieldRequiredAttribute + "]" + (active ? ":include" : "") + ", ";
		selector += "textarea[name][" + this.config.fieldRequiredAttribute + "]" + (active ? ":include" : "") + ", ";
		selector += "[" + this.config.fieldRadioGroupAttribute + "][" + this.config.fieldRequiredAttribute + "]:has(input[name][type=radio]" + (active ? ":include" : "") + ") ";
		return element.find(selector);
	}
	
	this.createRequest = function(element)
	{
		var elementRegExp = new RegExp("^(\\w+)(?:\\[|$)");
		var indexRegExp = new RegExp("\\[(\\d+)?\\]", "g");
		var valid = true;
		var request = this.hash.cloneParam();
		this.findGroupElements(element).each(function()
		{
			var field = self.validate($(this));
			if(!field.valid)
			{
				valid = false;
			}
			if(isValidString(field.name) && isValid(field.value))
			{
				var tempObject = request;
				var names = field.name.split(".");
				for(var i in names)
				{
					var lastElement = (i == names.length - 1);
					var elementMatcher = elementRegExp.exec(names[i]);
					if(elementMatcher)
					{
						var elementName = elementMatcher[1];
						var indexes = [];
						var indexMatcher;
						while((indexMatcher = indexRegExp.exec(names[i])) !== null)
						{
							var index = indexMatcher[1];
							indexes.push(index ? parseInt(index) : -1);
						}
						if(indexes.length > 0)
						{
							var tempElement = tempObject[elementName];
							if(!isArray(tempElement))
							{
								tempElement = [];
								tempObject[elementName] = tempElement;
							}
							tempObject = tempElement;
							for(var j in indexes)
							{
								var index = indexes[j];
								var lastIndex = (j == indexes.length - 1);
								if(!lastIndex)
								{
									var tempElement = tempObject[index];
									if(!isArray(tempElement))
									{
										tempElement = [];
										tempObject[index] = tempElement;
									}
									tempObject = tempElement;
								}
								else
								{
									var tempElement = null;
									if(index >= 0)
									{
										if(lastElement)
										{
											tempElement = field.value
											tempObject[index] = tempElement;
										}
										else if(isSet(tempObject[index]))
										{
											tempElement = tempObject[index];
										}
										else
										{
											tempElement = {};
											tempObject[index] = tempElement;
										}
									}
									else
									{
										tempElement = lastElement ? field.value : {};
										tempObject.push(tempElement);
									}
									tempObject = tempElement;
								}
							}
						}
						else
						{
							if(!lastElement)
							{
								var tempElement = tempObject[elementName];
								if(!isObject(tempElement))
								{
									tempElement = {};
									tempObject[elementName] = tempElement;
								}
								tempObject = tempElement;
							}
							else
							{
								tempObject[elementName] = field.value;
							}
						}
					}
				}
			}
		});
		//console.json(request);
		return { request : request, valid : valid };
	};
	
	this.update = function(element)
	{
		element = this.getJqueryElement(element);
		var field = this.validate(element);
		if(field.valid && field.name)
		{
			var updateValue = element.attr(this.config.fieldUpdateValueAttribute);
			if(field.value != updateValue)
			{
				var request = this.hash.cloneParam();
				request.name = field.name;
				request.value = field.value;
				this.submit(element, request, function()
				{
					element.attr(self.config.fieldUpdateValueAttribute, field.value);
				},
				function()
				{
					element.val(element.attr(self.config.fieldUpdateValueAttribute));
				});
			}
		}
	};
	
	this.submit = function(element, request, success, error)
	{
		element = this.getJqueryElement(element);
		var disabler = this.config.getDisabler(element);
		var submitGroup = element.attr(this.config.fieldSubmitGroupAttribute);
		var prerequest = element.attr(this.config.fieldPrerequestAttribute);
		var presubmit = element.attr(this.config.fieldPresubmitAttribute);
		var service = element.attr(this.config.fieldServiceAttribute);
		var method = element.attr(this.config.fieldMethodAttribute);
		var successAttr = element.attr(this.config.fieldSuccessAttribute);
		var errorAttr = element.attr(this.config.fieldErrorAttribute);
		disabler(element, true);
		if(isValidString(prerequest))
		{
			if(new Function("element", "return " + prerequest)(element) === false)
			{
				disabler(element, false);
				return;
			}
		}
		var valid = true;
		if(!isObject(request))
		{
			submitGroup = isValidString(submitGroup) ? submitGroup : method;
			var result = this.createRequest($("[" + this.config.fieldGroupAttribute + "='" + submitGroup + "']"));
			valid = result.valid;
			request = result.request;
		}
		if(valid)
		{
			request = $.extend(request, ObjectUtil.parse(element.attr(this.config.fieldRequestAttribute)));
			if(isValidString(presubmit))
			{
				if(new Function("request", "element", "return " + presubmit)(request, element) === false)
				{
					disabler(element, false);
					return;
				}
			}
			if(isValidString(service) && isValidString(method))
			{
				this.service(service, method, request, function(data)
				{
					disabler(element, false);
					if(isFunction(success))
					{
						success(data, request, element);
					}
					if(isValidString(successAttr))
					{
						new Function("data", "request", "element", successAttr)(data, request, element);
					}
				},
				function(errors)
				{
					disabler(element, false);
					if(isFunction(error))
					{
						error(errors, request, element);
					}
					if(isValidString(errorAttr))
					{
						new Function("errors", "request", "element", errorAttr)(errors, request, element);
					}
				});
			}
		}
		else
		{
			disabler(element, false);
		}
	};
	
	this.getJqueryElement = function(element, selector)
	{
		if(element instanceof jQuery)
		{
			return element;
		}
		else if(element.nodeType)
		{
			return $(element);
		}
		else if(isString(element))
		{
			if(isString(selector))
			{
				return $(selector.replace("{name}", element));
			}
			else
			{
				return $(element);
			}
		}
		else
		{
			return element;
		}
	};
	
	this.filter = function(element)
	{
		element = this.getJqueryElement(element);
		var field = {};
		field.element = element;
		field.tag = element.prop("tagName").toLowerCase();
		field.type = null;
		field.name = element.attr(this.config.fieldRadioGroupAttribute);
		field.filter = element.attr(this.config.fieldFilterAttribute);
		field.formValue = null;
		field.value = null;
		if(field.name)
		{
			field.formValue = element.find("input[type=radio][name='" + field.name + "']:include:checked").val();
			field.value = field.formValue;
		}
		else
		{
			field.name = element.attr("name");
			field.type = element.attr("type");
			if(field.type == "checkbox")
			{
				field.value = element.is(":checked");
			}
			else if(field.type == "file")
			{
				field.value = element.attr(this.config.fieldFileValueAttribute);
			}
			else
			{
				field.formValue = element.val();
				field.value = field.formValue;
				if(isValidString(field.value))
				{
					field.value = field.value.trim();
					if(isValidString(field.filter))
					{
						field.filter = field.filter.trim();
						var builder = "";
						for(var name in this.config.filterer)
						{
							builder += "var " + name + " = $_filterer[\"" + name + "\"];\n";
						}
						builder += "return " + field.filter + ";"
						field.value = new Function("field", "value", "$_filterer", builder)(field, field.value, this.config.filterer);
					}
				}
			}
		}
		return field;
	};
	
	this.validateGroup = function(element)
	{
		var validGroup = true;
		this.findGroupElements(element).each(function()
		{
			var field = self.validate($(this));
			if(!field.valid)
			{
				validGroup = false;
			}
		});
		return validGroup;
	};
	
	this.validate = function(element)
	{
		element = this.getJqueryElement(element);
		var field = this.filter(element);
		field.visible = element.is(":visible");
		field.required =  StringUtil.equals(element.attr(this.config.fieldRequiredAttribute), "true");
		field.defined = isNotEmpty(field.value);
		field.valid = !(field.required && !field.defined) ? true : false;
		field.validate = element.attr(this.config.fieldValidateAttribute);
		if(field.visible && field.valid)
		{
			if(isValidString(field.validate))
			{
				field.validate = field.validate.trim();
				var builder = "";
				for(var name in this.config.validator)
				{
					builder += "var " + name + " = $_validator[\"" + name + "\"];\n";
				}
				builder += "return " + field.validate + ";"
				field.valid = new Function("field", "value", "$_validator", builder)(field, field.value, this.config.validator);
			}
		}
		if(field.visible)
		{
			this.feedback(element, field);
		}
		return field;
	};
	
	this.file = function(element, callback)
	{
		element = this.getJqueryElement(element);
		var files = element[0].files;
		if(files.length > 0)
		{
			var file = files[0];
			if(file)
			{
				var reader  = new FileReader();
				reader.onload = function(event)
				{
					element.attr(self.config.fieldFileValueAttribute, reader.result);
					if(isFunction(callback))
					{
						callback(reader.result);
					}
				};
				reader.readAsDataURL(file);
			}
		}
	};
	
	this.feedback = function(element, field)
	{
		element = this.getJqueryElement(element);
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var feedbacker = this.config.getFeedbacker(element, module, page);
		if(isFunction(feedbacker))
		{
			feedbacker(element, field);
		}
	};
	
	this.resetGroups = function()
	{
		$("[" + this.config.fieldGroupAttribute + "]").each(function()
		{
			self.resetGroup($(this));
		});
	};
	
	this.resetGroup = function(element)
	{
		element = this.getJqueryElement(element, "[" + this.config.fieldGroupAttribute + "='{name}']");
		this.findGroupElements(element, false).each(function()
		{
			self.reset($(this));
		});
	};
	
	this.reset = function(element)
	{
		this.feedback(element);
	};
	
	this.clearGroup = function(element)
	{
		element = this.getJqueryElement(element, "[" + this.config.fieldGroupAttribute + "='{name}']");
		this.findGroupElements(element, false).each(function()
		{
			self.clear($(this));
		});
	};
	
	this.clear = function(element)
	{
		this.feedback(element);
		var tag = element.prop("tagName").toLowerCase();
		var type = element.attr("type");
		element.val("");
		if(type == "file")
		{
			element.attr(this.config.fieldFileValueAttribute, "");
		}
	};
	
	this.service = function(service, method, request, success, error)
	{
		if(isMock())
		{
			this.serviceFile(service, method, request, success, error);
		}
		else
		{
			var url = this.endpoint.current() + this.config.getServicePath(service, method);
			this.serviceCall(url, request, success, error);
		}
	};
	
	this.serviceFile = function(service, method, request, success, error)
	{
		var scenarios = this.config.getDevServiceResponseScenarios(service, method);
		if(scenarios.length > 0)
		{
			this.dev.select(service + "/" + method, scenarios, function(scenario)
			{
				var url = self.config.getDevServiceResponsePath(service, method, scenario);
				self.serviceCall(url, request, success, error);
			});
		}
		else
		{
			var url = self.config.getDevServiceResponsePath(service, method);
			self.serviceCall(url, request, success, error);
		}
	};
	
	this.serviceCall = function(url, request, success, error)
	{
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		if(url.substring(0, 4) == "http")
		{
			var sessionId = localStorage.getItem(this.config.devSessionId);
			if(isSet(sessionId))
			{
				url += ";" + this.config.devSessionId + "=" + encodeURIComponent(sessionId);
			}
			var csrfToken = localStorage.getItem(this.config.csrfTokenStorage);
			if(isSet(csrfToken))
			{
				url += "?" + this.config.csrfTokenParam + "=" + encodeURIComponent(csrfToken);
			}
		}
		console.info(" REQUEST : " + url, request);
		var errored = false;
		$.ajax(
		{
			type		: "POST",
			url			: url,
			data		: JSON.stringify(request),
			contentType	: "text/plain",
			dataType	: "json",
			cache		: false,
			success		: function(response, textStatus, jqXHR)
			{
				if(isSet(response.dev))
				{
					if(isSet(response.dev[self.config.devSessionId]))
					{
						localStorage.setItem(self.config.devSessionId, response.dev[self.config.devSessionId]);
					}
					if(isSet(response.dev[self.config.devCsrfToken]))
					{
						localStorage.setItem(self.config.csrfTokenStorage, response.dev[self.config.devCsrfToken]);
					}
				}
				var csrfTokenHeader = jqXHR.getResponseHeader(self.config.csrfTokenHeader);
				if(isSet(csrfTokenHeader))
				{
					localStorage.setItem(self.config.csrfTokenStorage, csrfTokenHeader);
				}
				if(isSet(response.errors) && response.errors.length > 0)
				{
					console.info("RESPONSE : " + url, response.errors);
					forEach(response.errors, function(error)
					{
						switch(error.type)
						{
							case "SERVICE_AJAX_NOT_AUTHENTICATED":
							case "SERVICE_CSRF_TOKEN_INVALID":
							{
								var redirector = self.config.getErrorAuthRedirector(module, page);
								if(isFunction(redirector))
								{
									self.queue.stop();
									redirector();
								}
								break;
							}
						}
					});
					error(response.errors);
				}
				else
				{
					console.info("RESPONSE : " + url, response);
					success(response);
				}
			},
			error		: function(jqXHR, textStatus, errorThrow)
			{
				if(!errored)
				{
					console.info("RESPONSE : " + url, "connection error");
					errored = true;
					error();
				}
			},
			complete	: function(jqXHR, textStatus)
			{
				if("success" != textStatus && !errored)
				{
					console.info("RESPONSE : " + url, "connection error");
					errored = true;
					error();
				}
			}
		});
	};
	
};




roth.lib.js.client.Config = roth.lib.js.client.Config || function()
{
	this.versionToken					= "{version}";
	
	this.jqueryScript					= "https://cdnjs.cloudflare.com/ajax/libs/jquery/" + this.versionToken + "/jquery.min.js";
	this.jqueryVersion					= "1.11.2";
	
	this.devTemplateScript				= "http://dist.roth.cm/roth/js/roth-lib-js-template/" + this.versionToken + "/roth-lib-js-template.js";
	this.devAppPath						= "http://dist.roth.cm/roth/js/roth-lib-js-client-dev/" + this.versionToken + "/";
	this.devScript						= "roth-lib-js-client-dev.js";
	this.devStyle						= "style/dev.css";
	this.devDataPath					= "dev/"
	this.devConfigData					= "dev";
	this.devConfigExtension				= ".json";
	this.devViewPath					= "view/";
	this.devViewExtension				= ".html";
	this.devLayoutPath					= "layout/";
	this.devLayout						= "dev";
	this.devComponentPath				= "component/";
	this.devSelectsComponent			= "selects";
	this.devSelectComponent				= "select";
	this.devPagePath					= "page/";
	this.devModule						= "dev";
	this.devLinksPage					= "links";
	this.devServicesPage				= "services";
	this.devConfigPage					= "config";
	this.devServicePath					= "service/";
	this.devServiceRequest				= "request";
	this.devServiceResponse				= "response";
	this.devServiceExtension			= ".json";
	this.devSessionId					= "jsessionid";
	this.devCsrfToken					= "csrfToken";
	
	this.defaultLang					= "en";
	this.defaultModule					= "index";
	this.defaultPage					= "index";
	
	this.endpointCurrentStorage			= "endpointCurrent";
	this.endpointAvailableStorage		= "endpointAvailable";
	this.endpointListPath				= "service/endpoint/list"
	
	this.langStorage					= "lang";
	this.langAttribute					= "lang";
	
	this.configData						= "config";
	this.configExtension				= ".json";
	
	this.textPath						= "text/";
	this.textExtension					= ".json";
	this.textAttribute					= "data-text";
	this.textAttrAttribute				= "data-text-attr";
	
	this.viewPath						= "view/";
	this.viewExtension					= ".html";
	this.viewRenderer					= null;
	
	this.layoutPath						= "layout/";
	this.layoutExtension				= null;
	this.layoutId						= "layout";
	this.layoutRenderer					= null;
	
	this.pagePath						= "page/";
	this.pageExtension					= null;
	this.pageId							= "page";
	this.pageRenderer					= null;
	
	this.sectionPath					= "section/";
	this.sectionExtension				= null;
	this.sectionAttribute				= "data-section";
	this.sectionRenderer				= null;
	
	this.componentPath					= "component/";
	this.componentExtension				= null;
	this.componentAttribute				= "data-component";
	this.componentRenderer				= null;
	
	this.errorEndpointRedirector		= null;
	this.errorParamsRedirector			= null;
	this.errorPageRedirector			= null;
	this.errorAuthRedirector			= null;
	
	this.fieldFeedbacker				= null;
	this.fieldGroupAttribute			= "data-group";
	this.fieldRequiredAttribute			= "data-required";
	this.fieldIncludeAttribute			= "data-include";
	this.fieldFilterAttribute			= "data-filter";
	this.fieldValidateAttribute			= "data-validate";
	this.fieldFeedbackAttribute			= "data-feedback";
	this.fieldSubmitGroupAttribute		= "data-submit-group";
	this.fieldDisableAttribute			= "data-disable";
	this.fieldPrerequestAttribute		= "data-prerequest";
	this.fieldPresubmitAttribute		= "data-presubmit";
	this.fieldServiceAttribute			= "data-service";
	this.fieldMethodAttribute			= "data-method";
	this.fieldSuccessAttribute			= "data-success";
	this.fieldErrorAttribute			= "data-error";
	this.fieldRequestAttribute			= "data-request";
	this.fieldUpdateValueAttribute		= "data-update-value";
	this.fieldKeepAttribute				= "data-keep";
	this.fieldEditableAttribute			= "data-editable";
	this.fieldNameAttribute				= "data-name";
	this.fieldKeyAttribute				= "data-key";
	this.fieldEditorAttribute			= "data-editor";
	this.fieldTypeAttribute				= "data-type";
	this.fieldRadioGroupAttribute		= "data-radio-group";
	this.fieldRadioValueAttribute		= "data-radio-value";
	this.fieldCheckboxValueAttribute	= "data-checkbox-value";
	this.fieldFileValueAttribute		= "data-file-value";
	
	this.servicePath					= "service/";
	this.csrfTokenParam					= "csrfToken";
	this.csrfTokenStorage				= "csrfToken";
	this.csrfTokenHeader				= "X-Csrf-Token";
	
	this.endpoint 						= {};
	this.text 							= {};
	this.layout 						= {};
	this.module 						= {};
	this.section 						= {};
	this.component 						= {};
	this.dev							= {};
	
	// registries
	this.renderer						= {};
	this.redirector						= {};
	this.filterer 						= {};
	this.validator 						= {};
	this.feedbacker 					= {};
	this.disabler						= {};
	
	this.getConfigDataPath = function()
	{
		var path = "";
		path += this.configData;
		path += this.configExtension;
		return path;
	};
	
	this.getDevConfigDataPath = function()
	{
		var path = "";
		path += this.devDataPath;
		path += this.devConfigData;
		path += this.devConfigExtension;
		return path;
	};
	
	this.isValidLang = function(lang)
	{
		return isSet(this.text[lang]);
	};
	
	this.getTextPath = function(lang)
	{
		var path = "";
		path += this.textPath;
		path += this.text[lang];
		path += this.textExtension;
		return path;
	};
	
	this.getLayoutPath = function(layout)
	{
		var path = this.getLayoutConfig(layout, "path");
		if(!isSet(path))
		{
			path = "";
			path += this.viewPath;
			path += this.layoutPath;
			path += layout;
			path += this.getLayoutExtension();
		}
		return path;
	};
	
	this.getPagePath = function(module, page)
	{
		var path =  this.getPageConfig(module, page, "path");
		if(!isSet(path))
		{
			path = "";
			path += this.viewPath;
			path += this.pagePath;
			path += module;
			path += "/";
			path += page;
			path += this.getPageExtension();
		}
		return path;
	};
	
	this.getSectionPath = function(section)
	{
		var path = "";
		path += this.viewPath;
		path += this.sectionPath;
		path += section;
		path += this.getSectionExtension();
		return path;
	};
	
	this.getComponentPath = function(component)
	{
		var path = "";
		path += this.viewPath;
		path += this.componentPath;
		path += component;
		path += this.getComponentExtension();
		return path;
	};
	
	this.getLayoutExtension = function()
	{
		return isSet(this.layoutExtension) ? this.layoutExtension : this.viewExtension;
	};
	
	this.getPageExtension = function()
	{
		return isSet(this.pageExtension) ? this.pageExtension : this.viewExtension;
	};
	
	this.getSectionExtension = function()
	{
		return isSet(this.sectionExtension) ? this.sectionExtension : this.viewExtension;
	};
	
	this.getComponentExtension = function()
	{
		return isSet(this.componentExtension) ? this.componentExtension : this.viewExtension;
	};
	
	this.getPageConfig = function(module, page, config)
	{
		var value = undefined;
		if(isSet(this.module[module]))
		{
			if(isDefined(this.module[module].page) && isDefined(this.module[module].page[page]) && isDefined(this.module[module].page[page][config]))
			{
				value = this.module[module].page[page][config];
			}
			else if(isDefined(this.module[module][config]))
			{
				value = this.module[module][config];
			}
		}
		return value;
	};
	
	this.getLayoutConfig = function(layout, config)
	{
		var value = undefined;
		if(isDefined(this.layout[layout]) && isDefined(this.layout[layout][config]))
		{
			value = this.layout[layout][config];
		}
		return value;
	};
	
	this.getLayout = function(module, page)
	{
		var layout = this.getPageConfig(module, page, "layout");
		return isValidString(layout) ? layout : module;
	};
	
	this.getErrorParamsRedirector = function(module, page)
	{
		var redirector = this.getPageConfig(module, page, "errorParamsRedirector");
		if(!isSet(redirector))
		{
			redirector = this.errorParamsRedirector;
		}
		return isString(redirector) ? this.redirector[redirector] : redirector;
	};
	
	this.getErrorPageRedirector = function(module, page)
	{
		var redirector = this.getPageConfig(module, page, "errorPageRedirector");
		if(!isSet(redirector))
		{
			redirector = this.errorPageRedirector;
		}
		return isString(redirector) ? this.redirector[redirector] : redirector;
	};
	
	this.getErrorAuthRedirector = function(module, page)
	{
		var redirector = this.getPageConfig(module, page, "errorAuthRedirector");
		if(!isSet(redirector))
		{
			redirector = this.errorPageRedirector;
		}
		return isString(redirector) ? this.redirector[redirector] : redirector;
	};
	
	this.getParams = function(module, page)
	{
		var params = this.getPageConfig(module, page, "params");
		return isArray(params) ? params : [];
	};
	
	this.getChangeParams = function(module, page)
	{
		var changeParams = this.getPageConfig(module, page, "changeParams");
		return isArray(changeParams) ? changeParams : [];
	};
	
	this.getLayoutRenderer = function(layout)
	{
		var renderer = this.getLayoutConfig(layout, "renderer");
		if(isUndefined(renderer))
		{
			renderer = isSet(this.layoutRenderer) ? this.layoutRenderer : this.viewRenderer;
		}
		return isString(renderer) ? this.renderer[renderer] : renderer;
	};
	
	this.getPageRenderer = function(module, page)
	{
		var renderer = this.getPageConfig(module, page, "renderer");
		if(isUndefined(renderer))
		{
			renderer = isSet(this.pageRenderer) ? this.pageRenderer : this.viewRenderer;
		}
		return isString(renderer) ? this.renderer[renderer] : renderer;
	};
	
	this.getSectionRenderer = function()
	{
		var renderer = isSet(this.sectionRenderer) ? this.sectionRenderer : this.viewRenderer;
		return isString(renderer) ? this.renderer[renderer] : renderer;
	};
	
	this.getComponentRenderer = function()
	{
		var renderer = isSet(this.componentRenderer) ? this.componentRenderer : this.viewRenderer;
		return isString(renderer) ? this.renderer[renderer] : renderer;
	};
	
	this.getLayoutInit = function(layout)
	{
		var init = this.getLayoutConfig(layout, "init");
		if(!isFalse(init))
		{
			if(!isObject(init))
			{
				init = {};
				init.service = this.getLayoutConfig(layout, "service");
				if(!isValidString(init.service))
				{
					init.service = layout;
				}
				init.method = "init" + StringUtil.capitalize(layout);
			}
		}
		return init;
	};
	
	this.getPageInit = function(module, page)
	{
		var init = this.getPageConfig(module, page, "init");
		if(!isFalse(init))
		{
			if(!isObject(init))
			{
				init = {};
				init.service = this.getPageConfig(module, page, "service");
				if(!isValidString(init.service))
				{
					init.service = module;
				}
				init.method = "init" + StringUtil.capitalize(page);
			}
		}
		return init;
	};
	
	this.getFeedbacker = function(element, module, page)
	{
		var feedbacker = element.attr(this.fieldFeedbackAttribute);
		if(!isValidString(feedbacker))
		{
			feedbacker = this.getPageConfig(module, page, "feedbacker");
			if(!isValidString(feedbacker) && !isFunction(feedbacker))
			{
				feedbacker = this.fieldFeedbacker;
			}
		}
		return isString(feedbacker) ? this.feedbacker[feedbacker] : feedbacker;
	};
	
	this.getDisabler = function(element)
	{
		var disable = element.attr(this.fieldDisableAttribute);
		var disabler = this.disabler[disable];
		return isFunction(disabler) ? disabler : function(){};
	};
	
	this.getServicePath = function(service, method)
	{
		var path = "";
		path += this.servicePath;
		path += service;
		if(isSet(method))
		{
			path += "/";
			path += method;
		}
		return path;
	};
	
	this.getDevServicePath = function(service, method)
	{
		var path = "";
		path += this.devDataPath;
		path += this.devServicePath;
		path += service;
		path += "/";
		path += method;
		path += "/";
		return path;
	};
	
	this.getDevServiceRequestPath = function(service, method, scenario)
	{
		var path = "";
		path += this.getDevServicePath(service, method);
		path += method;
		path += "-";
		path += this.devServiceRequest;
		if(scenario)
		{
			path += "-";
			path += scenario;
		}
		path += this.devServiceExtension;
		return path;
	};
	
	this.getDevServiceResponsePath = function(service, method, scenario)
	{
		var path = "";
		path += this.getDevServicePath(service, method);
		path += method;
		path += "-";
		path += this.devServiceResponse;
		if(scenario)
		{
			path += "-";
			path += scenario;
		}
		path += this.devServiceExtension;
		return path;
	};
	
	this.getDevServiceRequestScenarios = function(service, method)
	{
		var scenarios = [];
		if(isObject(this.dev.service) && isObject(this.dev.service[service]) && isObject(this.dev.service[service][method]) && isArray(this.dev.service[service][method].request))
		{
			scenarios = this.dev.service[service][method].request;
		}
		return scenarios;
	};
	
	this.getDevServiceResponseScenarios = function(service, method)
	{
		var scenarios = [];
		if(isObject(this.dev.service) && isObject(this.dev.service[service]) && isObject(this.dev.service[service][method]) && isArray(this.dev.service[service][method].response))
		{
			scenarios = this.dev.service[service][method].response;
		}
		return scenarios;
	};
	
	this.getEndpointListUrl = function(endpoint)
	{
		var url = endpoint;
		url += this.endpointListPath;
		return url;
	};
	
	this.getVersionRegExp = function()
	{
		return new RegExp(this.versionToken);
	}
	
	this.getJqueryScript = function()
	{
		return this.jqueryScript.replace(this.getVersionRegExp(), this.jqueryVersion);
	};
	
	this.getBootstrapStyle = function()
	{
		return this.bootstrapStyle.replace(this.getVersionRegExp(), this.bootstrapVersion);
	};
	
	this.getBootstrapScript = function()
	{
		return this.bootstrapScript.replace(this.getVersionRegExp(), this.bootstrapVersion);
	};
	
	this.getDevTemplateScript = function()
	{
		return this.devTemplateScript.replace(this.getVersionRegExp(), roth.lib.js.client.version);
	};
	
	this.getDevAppPath = function()
	{
		return this.devAppPath.replace(this.getVersionRegExp(), roth.lib.js.client.version);
	};
	
	this.getDevScript = function()
	{
		return this.getDevAppPath() + this.devScript;
	};
	
	this.getDevStyle = function()
	{
		return this.getDevAppPath() + this.devStyle;
	};
	
	this.getDevLayoutPath = function()
	{
		return this.getDevAppPath() + this.devViewPath + this.devLayoutPath + this.devLayout + this.devViewExtension;
	};
	
	this.getDevModulePath = function()
	{
		return this.getDevAppPath() + this.devViewPath + this.devPagePath + this.devModule + "/";
	};
	
	this.getDevLinksPath = function()
	{
		return this.getDevModulePath() + this.devLinksPage + this.devViewExtension;
	};
	
	this.getDevServicesPath = function()
	{
		return this.getDevModulePath() + this.devServicesPage + this.devViewExtension;
	};
	
	this.getDevConfigPath = function()
	{
		return this.getDevModulePath() + this.devConfigPage + this.devViewExtension;
	};
	
	this.getDevSelectsPath = function()
	{
		return this.getDevAppPath() + this.devViewPath + this.devComponentPath + this.devSelectsComponent + this.devViewExtension;
	};
	
	this.getDevSelectPath = function()
	{
		return this.getDevAppPath() + this.devViewPath + this.devComponentPath + this.devSelectComponent + this.devViewExtension;
	};
	
	this.isFieldKeep = function(element)
	{
		var keep = element.attr(this.fieldKeepAttribute);
		return "true" == keep;
	};
	
	this.isTranslated = function(module, page)
	{
		var translated = this.getPageConfig(module, page, "translated");
		return isBoolean(translated) ? translated : false;
	};
	
	this.filterer.replace = function(value, regExp, replacement)
	{
		replacement = isSet(replacement) ? replacement : "";
		return value.replace(regExp, replacement);
	};
	
	this.filterer.number = function(value)
	{
		return value.replace(/[^0-9]/g, "");
	};
	
	this.filterer.decimal = function(value)
	{
		return value.replace(/[^0-9.]/g, "");
	};
	
	this.filterer.int = function(value)
	{
		if(value)
		{
			value = value.replace(/[^0-9.]/g, "");
			if(!isNaN(value))
			{
				value = parseInt(value);
			}
			if(!isNaN(value))
			{
				return value;
			}
		}
		return null;
	};
	
	this.filterer.float = function(value)
	{
		if(value)
		{
			value = value.replace(/[^0-9.]/g, "");
			if(!isNaN(value))
			{
				value = parseFloat(value);
			}
			if(!isNaN(value))
			{
				return value;
			}
		}
		return null;
	};
	
	this.filterer.currency = function(value)
	{
		return CurrencyUtil.parse(value);
	};
	
	this.validator.test = function(value, regExp)
	{
		return regexp.test(value);
	};
	
	this.validator.email = function(value)
	{
		return (/^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]+$/).test(value);
	};
	
	this.validator.phone = function(value)
	{
		return (/^[0-9]{10}$/).test(value);
	};
	
	this.validator.zip = function(value)
	{
		return (/^[0-9]{5}$/).test(value);
	};
	
	this.validator.number = function(value)
	{
		return (/^[0-9]+(\.[0-9]{1,2})?$/).test(value);
	};
	
	this.validator.confirm = function(value, id)
	{
		var value2 = $("#" + id).val();
		return value == value2;
	};
	
	this.validator.date = function(value, pattern)
	{
		return DateUtil.isValid(pattern, value);
	};
	
};




roth.lib.js.client.Hash = roth.lib.js.client.Hash || function()
{
	var State =
	{
		NEXT 	: "next",
		REPLACE : "replace",
		BACK 	: "back"
	};
	
	this.value = null;
	this.lang = null;
	this.layout = null;
	this.module = null;
	this.page = null;
	this.param = {};
	
	this.defaultModule = "index";
	this.defaultPage = "index";	
	this.langStorage = "lang";
	this.state = null;
	this.loaded = {};
	
	this.newValue = false;
	this.newLang = false;
	this.newLayout = false;
	this.newModule = false;
	this.newPage = false;
	
	this.hasParam = function(name)
	{
		return isSet(this.param[name]);
	};
	
	this.getParam = function(name, defaultValue)
	{
		var value = this.param[name];
		return isValidString(value) ? value : defaultValue;
	};
	
	this.getParamSize = function()
	{
		return Object.keys(this.param).length;
	};
	
	this.isParamEmpty = function()
	{
		return this.getParamSize() == 0;
	};
	
	this.getModule = function()
	{
		return isSet(this.module) ? this.module : this.defaultModule;
	};
	
	this.getPage = function()
	{
		return isSet(this.page) ? this.page : this.defaultPage;
	};
	
	this.setValue = function(value)
	{
		this.value = value;
		this.newValue = this.value != this.loaded.value;
	};
	
	this.setLang = function(lang)
	{
		this.lang = lang;
		this.newLang = this.lang != this.loaded.lang;
	};
	
	this.setLayout = function(layout)
	{
		this.layout = layout;
		this.newLayout = this.layout != this.loaded.layout;
	};
	
	this.setModule = function(module)
	{
		this.module = module;
		this.newModule = this.module != this.loaded.module;
	};
	
	this.setPage = function(page)
	{
		this.page = page;
		this.newPage = this.newModule || this.page != this.loaded.page;
	};
	
	this.isNewValue = function()
	{
		return this.newValu;
	}
	
	this.isNewLang = function()
	{
		return this.newLang;
	}
	
	this.isNewLayout = function()
	{
		return this.newLayout;
	}
	
	this.isNewModule = function()
	{
		return this.newModule;
	}
	
	this.isNewPage = function()
	{
		return this.newPage;
	}
	
	this.isNext = function()
	{
		return this.state == State.NEXT;
	};
	
	this.isBack = function()
	{
		return this.state == State.BACK;
	};
	
	this.isReplace = function()
	{
		return this.state == State.REPLACE || isNull(this.state);
	};
	
	this.changeLang = function(lang)
	{
		this.setLang(lang);
		this.reload();
	};
	
	this.back = function()
	{
		this.state = State.BACK;
		window.history.back();
	};
	
	this.next = function(module, page, param)
	{
		this.state = State.NEXT;
		if(!isValidString(page))
		{
			window.location.assign(module);
		}
		else
		{
			window.location.assign(this.build(module, page, param));
		}
	};
	
	this.replace = function(module, page, param)
	{
		this.state = State.REPLACE;
		if(!isValidString(page))
		{
			window.location.replace(module);
		}
		else
		{
			window.location.replace(this.build(module, page, param));
		}
	};
	
	this.refresh = function()
	{
		this.state = State.REPLACE;
		window.location.replace(this.build(this.module, this.page, this.param));
	};
	
	this.reload = function()
	{
		window.location.reload();
	};
	
	this.build = function(module, page, param)
	{
		var hash = "#";
		if(isValidString(module))
		{
			hash += "/" + module + "/";
			if(isValidString(page))
			{
				hash += page + "/";
				param = isObject(param) ? param : this.param;
				for(var name in param)
				{
					hash += encodeURIComponent(name) + "/" + encodeURIComponent(param[name]) + "/";
				}
			}
		}
		return hash;
	};
	
	this.isValid = function()
	{
		var hash = "#/";
		var lang = null;
		var i = 1;
		var values = window.location.hash.split("/");
		if(isValid(values[i]))
		{
			if(values[i].length == 2)
			{
				this.lang = null;
				lang = values[i];
				hash += values[i] + "/";
				i++;
			}
		}
		if(isValid(values[i]))
		{
			this.setModule(values[i]);
			hash += values[i] + "/";
			i++;
		}
		if(isValid(values[i]))
		{
			this.setPage(values[i]);
			hash += values[i] + "/";
			i++;
		}
		this.param = {};
		var name = null;
		for(i; i < values.length; i++)
		{
			if(isValid(values[i]))
			{
				if(name === null)
				{
					name = values[i];
				}
				else
				{
					this.param[name] = decodeURIComponent(values[i]);
					hash += name + "/";
					hash += values[i] + "/";
					name = null;
				}
			}
		}
		var blankHash = window.location.hash == "" || window.location.hash == "#";
		if(!blankHash && window.location.hash != hash)
		{
			window.location.replace(hash);
			return false;
		}
		else if(isSet(lang))
		{
			localStorage.setItem(this.langStorage, lang);
			this.refresh();
			return false;
		}
		else
		{
			this.setValue(window.location.hash);
			this.newLang = false;
			return true;
		}
	};
	
	this.loadedParam = function()
	{
		this.loaded.param = this.param;
	};
	
	this.loadedValue = function(value)
	{
		this.loaded.value = isSet(value) ? value : this.value;
	};
	
	this.loadedLang = function(lang)
	{
		this.loaded.lang = isSet(lang) ? lang : this.lang;
	};
	
	this.loadedLayout = function(layout)
	{
		this.loaded.layout = layout;
	};
	
	this.loadedModule = function(module)
	{
		this.loaded.module = module;
	};
	
	this.loadedPage = function(page)
	{
		this.loaded.page = page;
	};
	
	this.log = function()
	{
		console.groupEnd();
		var group = "";
		group += this.lang + " / ";
		group += this.getModule() + " / ";
		group += this.getPage() + " / ";
		console.group(group + JSON.stringify(this.param));
	};
	
	this.cloneParam = function()
	{
		return $.extend({}, this.param);;
	}
	
	this.cloneLoadedParam = function()
	{
		return isSet(this.loaded.param) ? $.extend({}, this.loaded.param) : {};
	}
	
};




roth.lib.js.client.Endpoint = roth.lib.js.client.Endpoint || function()
{
	this.currentStorage = null;
	this.availableStorage = null;
	
	this.set = function(endpoints)
	{
		if(isArray(endpoints) && endpoints.length > 0)
		{
			sessionStorage.setItem(this.currentStorage, endpoints.shift());
			sessionStorage.setItem(this.availableStorage, JSON.stringify(endpoints));
			/*
			if(endpoints.length > 0)
			{
				sessionStorage.setItem(this.availableStorage, JSON.stringify(endpoints));
			}
			else
			{
				sessionStorage.removeItem(this.availableStorage);
			}
			*/
			return true;
		}
		else
		{
			return false;
		}
	};
	
	this.next = function()
	{
		sessionStorage.removeItem(this.currentStorage);
		return this.set(this.available());
	};
	
	this.clear = function()
	{
		sessionStorage.removeItem(this.currentStorage);
		sessionStorage.removeItem(this.availableStorage);
	};
	
	this.available = function()
	{
		var available = sessionStorage.getItem(this.availableStorage);
		return isValidString ? JSON.parse(available) : [];
	};
	
	this.current = function()
	{
		var current = sessionStorage.getItem(this.currentStorage);
		return current;
	};
	
};




roth.lib.js.client.Queue = roth.lib.js.client.Queue || function()
{
	var Event =
	{
		CONFIG			: "config",
		ENDPOINTS		: "endpoints",
		INIT			: "init",
		TEXT			: "text",
		LAYOUT			: "layout",
		PAGE			: "page",
		SECTIONS		: "sections",
		SECTION			: "section",
		COMPONENTS		: "components",
		COMPONENT		: "component",
		TRANSLATION		: "translation",
		FIELDS			: "fields",
		READY			: "ready",
		SHOW			: "show",
		CALLBACK		: "callback"
	};
	
	var Order = {};
	Order[Event.CONFIG] 		= [];
	Order[Event.ENDPOINTS] 		= [Event.CONFIG];
	Order[Event.TEXT] 			= [Event.CONFIG];
	Order[Event.INIT] 			= [Event.ENDPOINTS];
	Order[Event.LAYOUT] 		= [Event.TEXT, Event.INIT];
	Order[Event.PAGE] 			= [Event.LAYOUT];
	Order[Event.SECTIONS] 		= [Event.PAGE];
	Order[Event.SECTION] 		= [Event.SECTIONS];
	Order[Event.COMPONENTS] 	= [Event.PAGE];
	Order[Event.COMPONENT] 		= [Event.COMPONENTS];
	Order[Event.TRANSLATION] 	= [Event.SECTION, Event.COMPONENT, Event.TEXT];
	Order[Event.FIELDS] 		= [Event.TRANSLATION];
	Order[Event.READY] 			= [Event.INIT, Event.FIELDS];
	Order[Event.SHOW] 			= [Event.READY];
	Order[Event.CALLBACK] 		= [Event.SHOW];
	
	this.task = {};
	
	this.config = function(id, callback)
	{
		this.add(id, Event.CONFIG, callback);
	};
	
	this.endpoints = function(id, callback)
	{
		this.add(id, Event.ENDPOINTS, callback);
	};
	
	this.init = function(id, callback)
	{
		this.add(id, Event.INIT, callback);
	};
	
	this.text = function(id, callback)
	{
		this.add(id, Event.TEXT, callback);
	};
	
	this.layout = function(id, callback)
	{
		this.add(id, Event.LAYOUT, callback);
	};
	
	this.page = function(id, callback)
	{
		this.add(id, Event.PAGE, callback);
	};
	
	this.sections = function(id, callback)
	{
		this.add(id, Event.SECTIONS, callback);
	};
	
	this.section = function(id, callback)
	{
		this.add(id, Event.SECTION, callback);
	};
	
	this.components = function(id, callback)
	{
		this.add(id, Event.COMPONENTS, callback);
	};
	
	this.component = function(id, callback)
	{
		this.add(id, Event.COMPONENT, callback);
	};
	
	this.translation = function(id, callback)
	{
		this.add(id, Event.TRANSLATION, callback);
	};
	
	this.fields = function(id, callback)
	{
		this.add(id, Event.FIELDS, callback);
	};
	
	this.ready = function(id, callback)
	{
		this.add(id, Event.READY, callback);
	};
	
	this.show = function(id, callback)
	{
		this.add(id, Event.SHOW, callback);
	};
	
	this.callback = function(id, callback)
	{
		this.add(id, Event.CALLBACK, callback);
	};
	
	this.add = function(id, event, callback)
	{
		if(isFunction(callback))
		{
			this.task[id] =
			{
				event 		: event,
				callback 	: callback,
				started 	: false
			};
		}
	};
	
	this.complete = function(id)
	{
		if(isSet(id))
		{
			if(isSet(this.task[id]))
			{
				//console.log(id + " - completing " + this.task[id].event);
				delete this.task[id];
			}
			this.execute();
		}
	};
	
	this.execute = function()
	{
		for(var id in this.task)
		{
			var task = this.task[id];
			if(isSet(task) && task.started == false)
			{
				if(this.isTaskReady(task))
				{
					//console.log(id + " -   starting " + task.event);
					task.started = true;
					task.callback();
				}
			}
		}
	};
	
	this.isTaskReady = function(task)
	{
		for(var id in this.task)
		{
			if(this.hasEvent(this.task[id].event, Order[task.event]))
			{
				return false;
			}
		}
		return true;
	};
	
	this.hasEvent = function(event, order)
	{
		if(isSet(order) && order.length > 0)
		{
			if(order.indexOf(event) != -1)
			{
				return true;
			}
			for(var i in order)
			{
				if(this.hasEvent(event, Order[order[i]]))
				{
					return true;
				}
			}
		}
		return false;
	};
	
	this.stop = function()
	{
		this.task = {};
	};
	
};



