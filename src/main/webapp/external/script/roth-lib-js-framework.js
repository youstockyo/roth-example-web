

var roth = roth || {};
roth.lib = roth.lib || {};
roth.lib.js = roth.lib.js || {};
roth.lib.js.framework = roth.lib.js.framework || {};



var roth = roth || {};
roth.lib = roth.lib || {};
roth.lib.js = roth.lib.js || {};


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
	return typeof value === "boolean";
};


var isNumber = isNumber || function(value)
{
	return !isNaN(value);
};


var isString = isString || function(value)
{
	return typeof value === "string";
};


var isArray = isArray || function(value)
{
	return Array.isArray(value);
};


var isFunction = isFunction || function(value)
{
	return typeof value === "function";
};


var isDate = isDate || function(value)
{
	return value instanceof Date;
};


var isError = isError || function(value)
{
	return value instanceof Error;
};


var isRegExp = isRegExp || function(value)
{
	return value instanceof RegExp;
};


var isObject = isObject || function(value)
{
	return isSet(value) && typeof value === "object";
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


var forEach = forEach || function(object, callback, thisArg)
{
	if(isFunction(callback))
	{
		if(!isSet(thisArg))
		{
			thisArg = this;
		}
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
				if(isFalse(callback.call(thisArg, object[i], i, loop)))
				{
					break;
				}
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
				if(isFalse(callback.call(thisArg, object[key], key, loop)))
				{
					break;
				}
			}
		}
	}
};


var mixin = mixin || function(dest, source)
{
	if(isFunction(dest) && isFunction(source))
	{
		forEach(source.prototype, function(value, name)
		{
			if(!isSet(dest.prototype[name]))
			{
				dest.prototype[name] = value;
			}
		});
	}
};






var CookieUtil = CookieUtil ||
{
	
	
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






var CurrencyUtil = CurrencyUtil ||
{
	
	
	formatInput : function(value)
	{
		return this.format(value, null, null)
	},
	
	
	formatText : function(value)
	{
		return this.format(value, "$", ",")
	},
	
	
	formatRounded : function(value)
	{
		return this.format(value, "$", ",", true)
	},
	
	
	format : function(value, symbol, seperator, round)
	{
		value = parseInt(value);
		if(isNumber(value))
		{
			var decimal = 2;
			var negative = value < 0;
			value = Math.abs(value) / 100;
			if(isTrue(round)) 
			{
				decimal = 0;
				value = Math.round(value);
			}
			var formattedValue = isValidString(symbol) ? symbol : "";
			if(isValidString(seperator))
			{
				var stringValue = parseFloat(value).toFixed(decimal);
				var formattedValues = [];
				var length = stringValue.length;
				if(decimal > 0)
				{
					for(var i = 1; i <= decimal; i++)
					{
						formattedValues.push(stringValue.charAt(length - i));
					}
					formattedValues.push(".");
					length = length - decimal - 1;
				}
				for(var i = 1; i <= length; i++)
				{
					formattedValues.push(stringValue.charAt(length - i));
					if(i < length && i % 3 == 0)
					{
						formattedValues.push(seperator);
					}
				}
				formattedValue += formattedValues.reverse().join("");
			}
			else
			{
				formattedValue = parseFloat(value).toFixed(decimal);
			}
			if(negative)
			{
				formattedValue = "(" + formattedValue + ")";
			}
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
					parsedValue = Math.round(value * 100);
				}
			}
			catch(e)
			{
				
			}
		}
		return parsedValue;
	}
	
	
};






var DateUtil = DateUtil ||
{
	
	
	defaultPattern : "yyyy-MM-dd HH:mm:ss z",
	
	
	defaultLang : "en",
	
	
	formatRegExp : (function()
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
	})(),
	
	
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
		pattern = isValidString(pattern) ? pattern : this.defaultPattern;
		if(!isNaN(date))
		{
			date = new Date(date);
		}
		else if(!isDate(date))
		{
			date = new Date();
		}
		lang = isSet(this.label[lang]) ? lang : this.defaultLang;
		var escape = false;
		var formattedDate = pattern.replace(this.formatRegExp, function(match, capture)
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
				case "A":
				{
					replacement = date.getHours() < 12 ? "AM" : "PM";
					break;
				}
				case "a":
				{
					replacement = date.getHours() < 12 ? "am" : "pm";
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
	
	
	parser : function(pattern, lang)
	{
		var self = this;
		pattern = isValidString(pattern) ? pattern : this.defaultPattern;
		lang = isSet(this.label[lang]) ? lang : this.defaultLang;
		var groups = [];
		var escape = false;
		var builder = pattern.replace(this.formatRegExp, function(match, capture)
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
		var parser = this.parser(pattern, lang);
		return parser.regExp.test(value);
	},
	
	
	parse : function(pattern, value, lang)
	{
		var self = this;
		lang = isSet(this.label[lang]) ? lang : this.defaultLang;
		var parser = this.parser(pattern, lang);
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
	},
	
	
	reformat : function(parsePattern, formatPattern, value, lang)
	{
		var date = this.parse(parsePattern, value, lang);
		if(isSet(date))
		{
			value = this.format(formatPattern, date, lang);
		}
		return value;
	},
	
	
	equals : function(date1, date2)
	{
		return date1 >= date2 && date1 <= date2;
	},
	
	
	day : function(date)
	{
		if(!isDate(date))
		{
			date = new Date();
		}
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	},
	
	
	month : function(date)
	{
		if(!isDate(date))
		{
			date = new Date();
		}
		return new Date(date.getFullYear(), date.getMonth(), 1);
	},
	
	
	year : function(date)
	{
		if(!isDate(date))
		{
			date = new Date();
		}
		return new Date(date.getFullYear(), 0, 1);
	}
	
	
};






var IdUtil = IdUtil ||
{
	
	
	defaultLength : 10,
	
	
	defaultKey : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
	
	
	generate : function(length, key)
	{
		length = isNumber(length) ? length : this.defaultLength;
		key = isValidString(key) ? key : this.defaultKey;
		var value = "";
		for(var i = 0; i < length; i++)
		{
			value += key.charAt(Math.floor(Math.random() * key.length));
		}
		return value;
	}
	
};






var NumberUtil = NumberUtil ||
{
	
	
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
		decimal = isNumber(decimal) ? decimal : 0;
		var parsedValue = parseFloat(value);
		return !isNaN(parsedValue) ? (parsedValue * 100).toFixed(decimal) : "";
	}
	
};






var ObjectUtil = ObjectUtil ||
{
	
	
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
	
	
	find : function(object, path)
	{
		var paths = path.split(".");
		for(var i in paths)
		{
			if(isSet(object[paths[i]]))
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
	},
	
	
	equals : function(object1, object2)
	{
		var equals = false;
		if(!isSet(object1) && !isSet(object2))
		{
			equals = true;
		}
		else if(isArray(object1) && isArray(object2))
		{
			equals = JSON.stringify(object1) == JSON.stringify(object2);
		}
		else if(isObject(object1) && isObject(object2))
		{
			equals = JSON.stringify(object1) == JSON.stringify(object2);
		}
		else
		{
			equals = object1 == object2;
		}
		return equals;
	}
	
	
};





var StringUtil = StringUtil ||
{
	
	
	padNumber : function(value, length)
	{
		return this.pad(new String(value), length, "0", true);
	},
	
	
	padLeft : function(value, length, character)
	{
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
		return isValidString(value) ? value.charAt(0).toUpperCase() + value.slice(1) : "";
	},
	
	
	camelCase : function(value)
	{
		value = this.capitalize(value);
		value = value.replace(/[^a-zA-Z0-9]+([a-zA-Z0-9]{1})/g, function(match, capture)
		{
			var replacement = "";
			if(isValidString(capture))
			{
				replacement = capture.charAt(0).toUpperCase();
			}
			return replacement;
		});
		return value;
	},
	
	
	stripHtml : function(value)
	{
		return value.replace(/<\/?[^>]+(>|$)/g, "");
	}
	
};



roth.lib.js.version = "0.2.0-SNAPSHOT";


var roth = roth || {};
roth.lib = roth.lib || {};
roth.lib.js = roth.lib.js || {};
roth.lib.js.template = roth.lib.js.template || {};


roth.lib.js.template.Template = roth.lib.js.template.Template || function(config)
{
	
	this.config = typeof config === "object" ? config : {};
	
	this.escapeRegExp = function(value)
	{
		return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	
	this.syntaxRegExp = (function(self)
	{
		var Config =
		{
			openUnescapedExpression 	: "{{{",
			openEscapedExpression 		: "{{",
			openStatement 				: "{%",
			closeUnescapedExpression	: "}}}",
			closeEscapedExpression		: "}}",
			closeStatement				: "%}",
			escapeVar					: "$_e",
			issetVar					: "$_i",
			tempVar						: "$_t",
			sourceVar					: "$_s"
		};
		for(var name in Config)
		{
			if(self.config[name] === undefined || self.config[name] === null || self.config[name] == "")
			{
				self.config[name] = Config[name];
			}
		}
		var builder = "";
		builder += "\\t|";
		builder += "\\\\r\\\\n|";
		builder += "\\\\n|";
		builder += "\\r\\n|";
		builder += "\\n|";
		builder += "\\\\\"|";
		builder += "\\\"|";
		builder += self.escapeRegExp(self.config.openUnescapedExpression) + "|";
		builder += self.escapeRegExp(self.config.openEscapedExpression) + "|";
		builder += self.escapeRegExp(self.config.openStatement) + "|";
		builder += self.escapeRegExp(self.config.closeUnescapedExpression) + "|";
		builder += self.escapeRegExp(self.config.closeEscapedExpression) + "|";
		builder += self.escapeRegExp(self.config.closeStatement) + "|";
		return new RegExp(builder, "g");
	})
	(this);
	
	this.escape = function(value)
	{
		return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	};
	
	this.isset = function(value)
	{
		return value !== undefined && value !== null;
	};
	
};


roth.lib.js.template.Template.prototype.parse = function(source)
{
	var self = this;
	var escape = true;
	var parsedSource = "";
	parsedSource += "var self = this; ";
	parsedSource += "var " + self.config.tempVar + "; var " + self.config.sourceVar + "=\"\"; " + self.config.sourceVar + "+=\"";
	parsedSource += source.replace(self.syntaxRegExp, function(match, capture)
	{
		var replacement = "";
		switch(match)
		{
			case "\\t":
			{
				break;
			}
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
			case self.config.openUnescapedExpression:
			{
				replacement = "\"; try{" + self.config.tempVar + "=";
				escape = false;
				break;
			}
			case self.config.openEscapedExpression:
			{
				replacement = "\"; try{" + self.config.tempVar + "=";
				escape = false;
				break;
			}
			case self.config.openStatement:
			{
				replacement = "\";";
				escape = false;
				break;
			}
			case self.config.closeUnescapedExpression:
			{
				replacement = "; " + self.config.sourceVar + "+=(" + self.config.issetVar + "(" + self.config.tempVar + ")) ? new String(" + self.config.tempVar + ") : \"\";}catch(e){}; " + self.config.sourceVar + "+=\"";
				escape = true;
				break;
			}
			case self.config.closeEscapedExpression:
			{
				replacement = "; " + self.config.sourceVar + "+=(" + self.config.issetVar + "(" + self.config.tempVar + ")) ? " + self.config.escapeVar + "(new String(" + self.config.tempVar + ")) : \"\";}catch(e){}; " + self.config.sourceVar + "+=\"";
				escape = true;
				break;
			}
			case self.config.closeStatement:
			{
				replacement = self.config.sourceVar + "+=\"";
				escape = true;
				break;
			}
			default:
			{
				break;
			}
		}
		return replacement;
	});
	parsedSource += "\"; return " + self.config.sourceVar + ";";
	return parsedSource;
};


roth.lib.js.template.Template.prototype.eval = function(parsedSource, scope, thisArg)
{
	var names = [];
	var values = [];
	names.push(this.config.escapeVar);
	values.push(this.escape);
	names.push(this.config.issetVar);
	values.push(this.isset);
	if(scope != null && typeof scope === "object")
	{
		for(var name in scope)
		{
			names.push(name);
			values.push(scope[name]);
		}
	}
	thisArg = thisArg != null ? thisArg : this;
	return new Function(names.join(), parsedSource).apply(thisArg, values);
};


roth.lib.js.template.Template.prototype.render = function(source, scope, thisArg)
{
	return this.eval(this.parse(source), scope, thisArg);
};



roth.lib.js.template.version = "0.2.0-SNAPSHOT";


var roth = roth || {};
roth.lib = roth.lib || {};
roth.lib.js = roth.lib.js || {};
roth.lib.js.web = roth.lib.js.web || {};


roth.lib.js.web.Web = roth.lib.js.web.Web || (function()
{
	
	var Web = function(app, moduleDependencies)
	{
		this.config =
		{
			jqueryScript 		: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.js",
			defaultLang 		: "en",
			endpoint 			: "endpoint",
			service 			: "service",
			csrfToken 			: "csrfToken",
			xCsrfToken 			: "X-Csrf-Token",
			layoutId			: "layout",
			pageId				: "page",
			pageClass			: "",
			attr :
			{
				text			: "data-text",
				textAttr		: "data-text-attr",
				textParam		: "data-text-param",
				component		: "data-component",
				reference		: "data-reference",
				data			: "data-data",
				group 			: "data-group",
				include 		: "data-include",
				required		: "data-required",
				filter			: "data-filter",
				validate		: "data-validate",
				feedback		: "data-feedback",
				submitGroup		: "data-submit-group",
				disable			: "data-disable",
				prerequest		: "data-prerequest",
				presubmit		: "data-presubmit",
				service			: "data-service",
				method			: "data-method",
				success			: "data-success",
				error			: "data-error",
				complete		: "data-complete",
				request			: "data-request",
				updateValue		: "data-update-value",
				editable		: "data-editable",
				name			: "data-name",
				key				: "data-key",
				editor			: "data-editor",
				type			: "data-type",
				radioGroup		: "data-radio-group",
				radioValue		: "data-radio-value",
				checkboxValue	: "data-checkbox-value",
				fileValue		: "data-file-value",
				field			: "data-field",
				onclick			: "data-onclick",
				ondblclick		: "data-ondblclick",
				onchange		: "data-onchange",
				onblur			: "data-onblur",
				onfocus			: "data-onfocus",
				onscroll		: "data-onscroll",
				oninput			: "data-oninput",
				onpaste			: "data-onpaste",
				onkeypress		: "data-onkeypress",
				onkeyup			: "data-onkeyup",
				onenter			: "data-onenter",
				onescape		: "data-onescape",
				onbackspace		: "data-onbackspace"
			}
		};
		
		this.app = app;
		this.moduleDependencies = moduleDependencies;
		this._loadedModules = [];
		this._inited = false;
		this._pageConstructor = null;
		this._pageConfig = null;
		this._loadId = null;
		
		this.template = new roth.lib.js.template.Template();
		this.register = new roth.lib.js.web.Register(app, moduleDependencies, this.template);
		this.hash =  new roth.lib.js.web.Hash();
		this.dev = null;
		
		this.text = {};
		this.layout = null;
		this.page = null;
		this.context = {};
		
		this.handler = 
		{
			endpoint		: {},
			filterer		: {},
			validator		: {},
			disabler		: {},
			loader			: {},
			redirector		: {},
			feedbacker		: {}
		};
		
		this.handler.filterer.replace = function(value, regExp, replacement)
		{
			replacement = isSet(replacement) ? replacement : "";
			return value.replace(regExp, replacement);
		};
		
		this.handler.filterer.number = function(value)
		{
			return value.replace(/[^0-9]/g, "");
		};
		
		this.handler.filterer.decimal = function(value)
		{
			return value.replace(/[^0-9.]/g, "");
		};
		
		this.handler.filterer.int = function(value)
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
		
		this.handler.filterer.float = function(value)
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
		
		this.handler.filterer.currency = function(value)
		{
			return CurrencyUtil.parse(value);
		};
		
		this.handler.validator.test = function(value, regExp)
		{
			return regexp.test(value);
		};
		
		this.handler.validator.email = function(value)
		{
			return (/^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]+$/).test(value);
		};
		
		this.handler.validator.phone = function(value)
		{
			return (/^[0-9]{10}$/).test(value);
		};
		
		this.handler.validator.zip = function(value)
		{
			return (/^[0-9]{5}$/).test(value);
		};
		
		this.handler.validator.number = function(value)
		{
			return (/^[0-9]+(\.[0-9]{1,2})?$/).test(value);
		};
		
		this.handler.validator.confirm = function(value, id)
		{
			var value2 = $("#" + id).val();
			return value == value2;
		};
		
		this.handler.validator.date = function(value, pattern)
		{
			return DateUtil.isValid(pattern, value);
		};
		
	};
	
	Web.prototype.init = function()
	{
		var self = this;
		if(!this._inited)
		{
			if(!isSet(jQuery))
			{
				document.write('<script src="' + this.config.jqueryScript + '"></script>');
			}
			if(isMock())
			{
				self.dev = new roth.lib.js.web.Dev();
			}
			self._initStorage();
			self._initConsole();
			self._initJquery();
			var load = function()
			{
				if(self._isLoadable())
				{
					self._loadId = IdUtil.generate();
					self._loadLayout(self._loadId);
				}
			}
			window.addEventListener("hashchange", load, false);
			document.addEventListener("DOMContentLoaded", function()
			{
				if(!self._inited)
				{
					self._inited = true;
					load();
				}
			});
		}
	};


	Web.prototype._initStorage = function()
	{
		try
		{
			localStorage.setItem("_test", "");
		}
		catch(e)
		{
			var prefix = "cookieStorage_";
			// SET ITEM
			var setItem = function(name, value)
			{
				CookieUtil.set(prefix + name, value);
			};
			localStorage.setItem = setItem;
			sessionStorage.setItem = setItem;
			// GET ITEM
			var getItem = function(name)
			{
				return CookieUtil.get(prefix + name);
			};
			localStorage.getItem = getItem;
			sessionStorage.getItem = getItem;
			// REMOVE ITEM
			var removeItem = function(name)
			{
				CookieUtil.remove(prefix + name);
			};
			localStorage.removeItem = removeItem;
			sessionStorage.removeItem = removeItem;
		}
	};


	Web.prototype._initConsole = function()
	{
		var console = window.console;
		if(console && !isDev() && !isDebug())
		{
			var noop = function(){};
			for(var method in console)
			{
				if(isFunction(console[method]) && Object.prototype.hasOwnProperty.call(console, method))
				{
					console[method] = noop;
				}
			}
			console.json = noop;
		}
		else
		{
			console.json = function(object)
			{
				console.log(JSON.stringify(object, null, 4));
			};
		}
	};


	Web.prototype._initJquery = function()
	{
		var self = this;
		jQuery.expr[":"].include = function(node, index, match)
		{
			var element = $(node);
			return element.is(":enabled") && (element.is(":visible") || isTrue(element.attr(self.config.attr.include)));
		};
	};


	Web.prototype._loadModuleDependencies = function(module)
	{
		var self = this;
		forEach(this.moduleDependencies[module].slice().reverse(), function(module)
		{
			self._loadModule(module);
		});
		this._loadModule(module);
	};


	Web.prototype._loadModule = function(module)
	{
		if(isCompiled() && !inArray(module, this._loadedModules))
		{
			var src = "app/" + this.app + "/" + module + ".js";
			$("<script></script>").attr("src", src).appendTo("head");
			this._loadedModules.push(module);
		}
	};


	Web.prototype._isLoadable = function()
	{
		var self = this;
		var loadable = this.hash.isValid();
		if(loadable)
		{
			// CHECK DEPENDENCIES
			var module = this.hash.getModule();
			this._loadModuleDependencies(module);
			// GET PAGE CONSTRUCTOR
			var pageName = this.hash.getPage();
			var pageConstructor = this.register.getPageConstructor(module, pageName);
			if(isFunction(pageConstructor))
			{
				// CHECK LANG
				if(!(isSet(this.hash.lang) && this.register.isValidLang(module, this.hash.lang)))
				{
					var lang = localStorage.getItem(this.hash.langStorage);
					if(this.register.isValidLang(module, lang))
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
						lang = this.register.isValidLang(module, lang) ? lang : this.hash.defaultLang;
						this.hash.setLang(lang);
						localStorage.setItem(this.hash.langStorage, lang);
					}
				}
				// SET DEFAULT PARAMS
				var pageConfig = isObject(pageConstructor.config) ? pageConstructor.config : {};
				forEach(pageConfig.defaultParams, function(value, name)
				{
					if(!self.hash.hasParam(name))
					{
						self.hash.param[name] = value;
						loadable = false;
					}
				});
				// CHECK FOR ALLOWED PARAMS
				var allowedParams = this._allowedParams(pageConfig);
				if(!isNull(allowedParams))
				{
					forEach(this.hash.param, function(value, name)
					{
						if(!inArray(name, allowedParams))
						{
							delete self.hash.param[name];
							loadable = false;
						}
					});
				}
				if(loadable)
				{
					// CHECK FOR CHANGE PARAMS
					if(!this.hash.newPage && !isEmpty(pageConfig.changeParams))
					{
						var changeParam = this.hash.paramChanges(pageConfig.changeParams);
						if(!isEmpty(changeParam))
						{
							if(isSet(this.layout))
							{
								this.layout._change(changeParam);
							}
							if(isSet(this.page))
							{
								this.page._change(changeParam);
							}
							loadable = false;
						}
					}
					else
					{
						this.hash.changeParam = {};
					}
					if(loadable)
					{
						this.text = this.register.getText(module, this.hash.lang);
						this._pageConstructor = pageConstructor;
						this._pageConfig = pageConfig;
						this.hash.log();
					}
					this.hash.loadedParam();
				}
				else
				{
					// PARAMS MODIFIED
					this.hash.refresh();
				}
			}
			else
			{
				// error no page
			}
		}
		return loadable;
	};


	Web.prototype._allowedParams = function(config)
	{
		var allowedParams = [];
		if(!isNull(config.allowedParams))
		{
			if(isArray(config.allowedParams))
			{
				forEach(config.allowedParams, function(name)
				{
					allowedParams.push(name);
				});
			}
			forEach(config.changeParams, function(name)
			{
				allowedParams.push(name);
			});
			forEach(config.defaultParams, function(value, name)
			{
				allowedParams.push(name);
			});
		}
		else
		{
			allowedParams = null;
		}
		return allowedParams;
	};


	Web.prototype._initMethod = function(name)
	{
		var initMethod = "init";
		forEach(name.replace(/[^a-zA-Z_0-9]/g, "_").split("_"), function(value)
		{
			initMethod += StringUtil.capitalize(value)
		});
		return initMethod;
	};
	
	
	Web.prototype.layoutElement = function()
	{
		return $("#" + this.config.layoutId);
	};
	
	
	Web.prototype.pageElement = function()
	{
		return $("#" + this.config.pageId);
	};
	
	
	Web.prototype._continueLoad = function(loadId)
	{
		return !isSet(loadId) || loadId == this._loadId;
	};
	
	Web.prototype._loadLayout = function(loadId)
	{
		var self = this;
		var module = this.hash.getModule();
		var layoutName = !isUndefined(this._pageConfig.layout) ? this._pageConfig.layout : module;
		if(isPrint())
		{
			layoutName = null;
		}
		this.hash.setLayout(layoutName);
		if(this.hash.newLayout || this.hash.newLang)
		{
			var defaultSource = "<div id=\"" + this.config.pageId + "\" class=\"" + this.config.pageClass + "\"><div>";
			var layoutConstructor = this.register.getLayoutConstructor(module, layoutName, defaultSource);
			var layoutConfig = isObject(layoutConstructor.config) ? layoutConstructor.config : {};
			var success = function(data, status, xhr)
			{
				if(self._continueLoad(loadId))
				{
					if(!isObject(data))
					{
						data = {};
					}
					var layout = self.register.constructView(layoutConstructor, data, self);
					var html = self.template.eval(layoutConstructor.source,
					{
						data : data,
						config : self.config,
						register : self.register,
						hash : self.hash,
						text : self.text,
						layout : layout,
						context : self.context
					},
					layout);
					layout._temp = $("<div></div>");
					layout._temp.html(html);
					self._translate(layout._temp, layoutConstructor._module + ".layout." + layoutConstructor._name + ".");
					self._defaults(layout._temp);
					self._bind(layout);
					self.hash.loadedLayout();
					self.layout = layout;
					self._loadComponents(layout, loadId);
					self._readyLayout(loadId);
				}
			};
			var error = function(errors, status, xhr)
			{
				if(isFunction(self.handler.redirector.init))
				{
					self.handler.redirector.init(errors, status, xhr);
				}
			};
			var complete = function(status, xhr)
			{
				
			};
			var method = !isUndefined(layoutConfig.init) ? layoutConfig.init : this._initMethod(this.hash.layout);
			if(isValidString(method))
			{
				var service = isValidString(layoutConfig.service) ? layoutConfig.service : this.hash.getModule();
				this.service(service, method, this.hash.param, success, error, complete);
			}
			else
			{
				success();
			}
		}
		else
		{
			this.hash.loadedLayout();
			this._loadPage(loadId);
		}
	};
	
	
	Web.prototype._readyLayout = function(loadId)
	{
		if(this._continueLoad(loadId))
		{
			this.layout._references(this);
			this.layout.element = this.layoutElement();
			this.layout.element.hide();
			this.layout.element.empty().append(this.layout._temp.contents().detach());
			this.layout._ready();
			this.layout.element.show();
			this.layout._visible();
			var loader = this.handler.loader._default;
			if(isFunction(loader))
			{
				loader(this.pageElement(), true);
			}
			this._loadPage(loadId);
		}
	};
	
	
	Web.prototype._loadPage = function(loadId)
	{
		var self = this;
		var pageConstructor = this._pageConstructor;
		var pageConfig = this._pageConfig;
		var success = function(data, status, xhr)
		{
			if(self._continueLoad(loadId))
			{
				if(!isObject(data))
				{
					data = {};
				}
				var page = self.register.constructView(pageConstructor, data, self);
				var html = self.template.eval(pageConstructor.source,
				{
					data : data,
					config : self.config,
					register : self.register,
					hash : self.hash,
					text : self.text,
					layout : self.layout,
					page : page,
					context : self.context
				},
				page);
				page._temp = $("<div></div>");
				page._temp.html(html);
				self._translate(page._temp, pageConstructor._module + ".page." + pageConstructor._name + ".");
				self._defaults(page._temp);
				self._bind(page);
				self.hash.loadedModule();
				self.hash.loadedPage();
				self.hash.loadedValue();
				self.hash.loadedLang();
				self.page = page;
				self._loadComponents(page, loadId);
				self._readyPage(loadId);
			}
		};
		var error = function(errors, status, xhr)
		{
			if(isFunction(self.handler.redirector.init))
			{
				self.handler.redirector.init(errors, status, xhr);
			}
		};
		var complete = function(status, xhr)
		{
			
		};
		var method = !isUndefined(pageConfig.init) ? pageConfig.init : this._initMethod(this.hash.getPage());
		if(isValidString(method))
		{
			var service = isValidString(pageConfig.service) ? pageConfig.service : this.hash.getModule();
			this.service(service, method, this.hash.param, success, error, complete);
		}
		else
		{
			success();
		}
	};


	Web.prototype._readyPage = function(loadId)
	{
		if(this._continueLoad(loadId))
		{
			this.layout.page = this.page;
			this.page._references(this);
			this.page.element = this.pageElement();
			this.page.element.hide();
			this.page.element.empty().append(this.page._temp.contents().detach());
			this.page._ready();
			this.page._change();
			this.layout._change();
			var loader = this.handler.loader._default;
			if(isFunction(loader))
			{
				loader(this.page.element, false);
			}
			this.page.element.show();
			this.page._visible();
		}
	};


	Web.prototype._loadComponents = function(view, loadId)
	{
		var self = this;
		var module = this.hash.getModule()
		view._components = [];
		view._temp.find("[" + this.config.attr.component + "]").each(function()
		{
			if(self._continueLoad(loadId))
			{
				var element = $(this);
				var componentName = element.attr(self.config.attr.component);
				var componentConstructor = self.register.getComponentConstructor(module, componentName);
				if(isFunction(componentConstructor))
				{
					var componentConfig = isObject(componentConstructor.config) ? componentConstructor.config : {};
					var data = {};
					var attrData = element.attr(self.config.attr.data);
					if(isSet(attrData))
					{
						data = ObjectUtil.parse(decodeURIComponent(attrData));
					}
					var component = self.register.constructView(componentConstructor, data, self);
					if(isSet(component))
					{
						component.element = element;
						component.parent = view;
						self._loadComponent(component, false, loadId);
						view._components.push(component);
						var reference = element.attr(self.config.attr.reference);
						if(isValidString(reference))
						{
							if(!isSet(view[reference]))
							{
								view[reference] = component;
							}
							else
							{
								console.error(reference + " name is already used on view");
							}
						}
					}
				}
			}
		});
	};


	Web.prototype._loadComponent = function(component, hide, loadId)
	{
		var self = this;
		var html = self.template.eval(component.constructor.source,
		{
			data : component.data,
			config : self.config,
			register : self.register,
			hash : self.hash,
			text : self.text,
			layout : self.layout,
			page : self.page,
			component : component,
			context : self.context
		},
		component);
		component._temp = $("<div></div>");
		component._temp.html(html);
		self._translate(component._temp, component.constructor._module + ".component." + component.constructor._name + ".");
		self._defaults(component._temp);
		self._bind(component);
		self._loadComponents(component, loadId);
		if(!isFalse(hide))
		{
			component.element.hide();
		}
		component.element.empty().append(component._temp.contents().detach());
	};


	Web.prototype.service = function(service, method, request, success, error, complete, group, view)
	{
		if(isMock())
		{
			this._serviceFile(service, method, request, success, error, complete, group, view);
		}
		else
		{
			this._serviceCall(service, method, request, success, error, complete, group, view);
		}
	};


	Web.prototype._serviceFile = function(service, method, request, success, error, complete, group, view)
	{
		var self = this;
		var scenarios = this.dev.getResponseScenarios(service, method);
		if(scenarios.length > 0)
		{
			if(isMockDemo())
			{
				this._serviceCall(service, method, request, success, error, complete, group, view, scenarios[0]);
			}
			else
			{
				this.dev.select(service + "/" + method, scenarios, function(scenario)
				{
					self._serviceCall(service, method, request, success, error, complete, group, view, scenario);
				});
			}
		}
		else
		{
			this._serviceCall(service, method, request, success, error, complete, group, view);
		}
	};


	Web.prototype._serviceCall = function(service, method, request, success, error, complete, group, view, scenario)
	{
		var self = this;
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var url = null;
		var type = "POST";
		if(isMock())
		{
			type = "GET";
			url = "dev/service/" + service + "/" + method + "/" + method + "-response";
			if(scenario)
			{
				url += "-";
				url += scenario;
			}
			url += ".json";
		}
		else
		{
			path = this.config.service+ "/" + service + "/" + method;
			var csrfToken = localStorage.getItem("csrfToken");
			if(isSet(csrfToken))
			{
				path += "?csrfToken=" + encodeURIComponent(csrfToken);
			}
			var endpoint = this._endpoint();
			if(isSet(endpoint))
			{
				var context = isValidString(this.hash.context) ? this.hash.context + "/" : "";
				url = "https://" + endpoint + "/" + context + this.config.endpoint + "/" + path;
			}
			else
			{
				// TODO: error
			}
		}
		var errored = false;
		$.ajax(
		{
			type		: type,
			url			: url,
			data		: !isMock() ? JSON.stringify(request) : null,
			contentType	: "text/plain",
			dataType	: "json",
			cache		: false,
			xhrFields	:
			{
				withCredentials : true
			},
			success		: function(response, status, xhr)
			{
				var csrfTokenHeader = xhr.getResponseHeader(self.config.xCsrfToken);
				if(isSet(csrfTokenHeader))
				{
					localStorage.setItem(self.config.csrfToken, csrfTokenHeader);
				}
				self._serviceLog(service, method, url, request, response);
				if(isEmpty(response.errors))
				{
					if(isFunction(success))
					{
						success(response, status, xhr);
					}
				}
				else
				{
					var handled = false;
					var groupElement = isSet(group) ? $("[" + self.config.attr.group + "='" + group + "']") : $();
					forEach(response.errors, function(error)
					{
						switch(error.type)
						{
							case "SERVICE_AJAX_NOT_AUTHENTICATED":
							case "SERVICE_CSRF_TOKEN_INVALID":
							{
								var authRedirector = self.handler.redirector[self._pageConfig.authRedirector];
								if(!isFunction(authRedirector))
								{
									authRedirector = self.handler.redirector.auth;
								}
								if(isFunction(authRedirector))
								{
									authRedirector();
									handled = true;
								}
								break;
							}
							case "REQUEST_FIELD_REQUIRED":
							case "REQUEST_FIELD_INVALID":
							{
								if(isSet(error.context))
								{
									var element = groupElement.find("[name='" + error.context + "']");
									view.feedback(element, { valid : false });
								}
								break;
							}
						}
					});
					if(!handled && isFunction(error))
					{
						error(response.errors, status, xhr);
					}
				}
			},
			error		: function(xhr, status, errorMessage)
			{
				if(!errored)
				{
					self._serviceLog(service, method, url, request, status + " - " + errorMessage);
					errored = true;
					if(isFunction(error))
					{
						error({}, status, xhr);
					}
				}
			},
			complete	: function(xhr, status)
			{
				if("success" != status && !errored)
				{
					self._serviceLog(service, method, url, request, status);
					errored = true;
					if(isFunction(error))
					{
						error({}, status, xhr);
					}
				}
				if(isFunction(complete))
				{
					complete(status, xhr);
				}
			}
		});
	};


	Web.prototype._serviceLog = function(service, method, url, request, response)
	{
		if(isDebug())
		{
			var group = "SERVICE : " + service + " / " + method;
			var log = "";
			log += url + "\n\n";
			log += "REQUEST" + "\n";
			log += JSON.stringify(request, null, 4) + "\n\n";
			log += "RESPONSE" + "\n";
			log += JSON.stringify(response, null, 4) + "\n\n";
			console.groupCollapsed(group);
			console.log(log);
			console.groupEnd();
		}
	};


	Web.prototype._endpoint = function()
	{
		var endpointStorage = this.config.endpoint + "-" + getEnvironment();
		var endpoint = localStorage.getItem(endpointStorage);
		var endpoints = this.handler.endpoint[getEnvironment()];
		if(isSet(endpoint))
		{
			if(!inArray(endpoint, endpoints))
			{
				endpoint = null;
			}
		}
		if(!isSet(endpoint))
		{
			if(isArray(endpoints) && !isEmpty(endpoints))
			{
				endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
				localStorage.setItem(endpointStorage, endpoint);
			}
		}
		return endpoint;
	};


	Web.prototype._translate = function(viewElement, prefix)
	{
		var self = this;
		viewElement.find("[" + self.config.attr.text + "] > [lang]").each(function()
		{
			var element = $(this);
			var lang = element.attr("lang");
			if(lang == self.hash.lang)
			{
				element.show();
			}
			else
			{
				element.hide();
			}
		});
		viewElement.find("select[" + self.config.attr.text + "]").each(function()
		{
			var element = $(this);
			var path = element.attr(self.config.attr.text);
			element.find("option").each(function()
			{
				var optionElement = $(this);
				if(optionElement.css("display") != "none")
				{
					optionElement.prop("selected", true);
					return false;
				}
			});
			if(path != "true")
			{
				var param = ObjectUtil.parse(element.attr(self.config.attr.textParam));
				var options = self._translation(path, self.text, prefix, param);
				if(isObject(options))
				{
					for(var value in options)
					{
						var text = options[value];
						var option = element.find("option[lang='" + self.hash.lang + "'][value='" + value + "']");
						if(option.length == 0)
						{
							option = $("<option />");
							option.attr("lang", self.hash.lang);
							option.val(value);
							option.text(text);
							element.append(option);
						}
					}
				}
			}
		});
		viewElement.find("[" + self.config.attr.text + "]:not([" + self.config.attr.text + "]:has(> [lang='" + self.hash.lang + "']))").each(function()
		{
			var element = $(this);
			var path = element.attr(self.config.attr.text);
			if(path != "true")
			{
				var param = ObjectUtil.parse(element.attr(self.config.attr.textParam));
				var value = self._translation(path, self.text, prefix, param);
				value = isSet(value) ? value : "";
				element.append($("<span></span>").attr("lang", self.hash.lang).html(value));
			}
		});
		viewElement.find("[" + self.config.attr.textAttr + "]").each(function()
		{
			var element = $(this);
			var attrString = element.attr(self.config.attr.textAttr);
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
							var param = ObjectUtil.parse(element.attr(self.config.attr.textAttr));
							var value = self._translation(path, self.text, prefix, param);
							value = isSet(value) ? value : "";
						}
						element.attr(attr, value);
					}
				}
			}
		});
	};


	Web.prototype._translation = function(path, text, prefix, param)
	{
		var self = this;
		var object = null;
		if(isValidString(prefix))
		{
			object = ObjectUtil.find(text, prefix + path);
		}
		if(isNull(object))
		{
			object = ObjectUtil.find(text, path);
		}
		if(!isEmpty(param))
		{
			if(isString(object))
			{
				object = this.template.render(object, param);
			}
			else if(isObject(object))
			{
				forEach(object, function(value, name)
				{
					object[name] =  self.template.render(value, param);
				});
			}
		}
		return object;
	};


	Web.prototype._defaults = function(viewElement)
	{
		var self = this;
		// select value
		viewElement.find("select[value], select[placeholder]").each(function()
		{
			var element = $(this);
			var selected = false;
			var value = element.attr("value");
			if(isValidString(value))
			{
				var values = [];
				var matches = value.match(/^\[(.*?)\]$/);
				if(!isEmpty(matches))
				{
					values = matches[1].split(",");
				}
				else
				{
					values.push(value);
				}
				forEach(values, function(value)
				{
					var option = element.find("option[value='" + value + "']");
					if(option.length > 0)
					{
						option.first().prop("selected", true);
						selected = true;
					}
				});
			}
			var placeholder = element.attr("placeholder");
			if(isValidString(placeholder))
			{
				var color = element.css("color");
				if(!selected)
				{
					selected = element.find("option[selected]").length > 0;
				}
				element.prepend($("<option />").prop("selected", !selected).val("").css("display", "none").text(placeholder));
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
		});
		// radio group value
		viewElement.find("[" + self.config.attr.radioValue + "]").each(function()
		{
			var element = $(this);
			var value = element.attr(self.config.attr.radioValue);
			var radio = element.find("input[type=radio][value='" + value + "']");
			if(radio.length > 0)
			{
				radio.first().prop("checked", true);
			}
			else
			{
				element.find("input[type=radio]").first().prop("checked", true);
			}
		});
		// checkbox value
		viewElement.find("input[type=checkbox][" + self.config.attr.checkboxValue + "]").each(function()
		{
			var element = $(this);
			var value = element.attr(self.config.attr.checkboxValue);
			if(isSet(value) && value.toLowerCase() == "true")
			{
				element.prop("checked", true);
			}
		});
	};
	
	
	Web.prototype._bind = function(view)
	{
		var self = this;
		view._temp.find("[" + this.config.attr.field + "]").each(function()
		{
			var element = $(this);
			var field = element.attr(self.config.attr.field);
			if(isValidString(field))
			{
				if(!isSet(view[field]))
				{
					view[field] = element;
				}
				else
				{
					console.error(field + " name is already used on view");
				}
			}
		});
		this._bindEvent(view, "click", this.config.attr.onclick);
		this._bindEvent(view, "dblclick", this.config.attr.ondblclick);
		this._bindEvent(view, "change", this.config.attr.onchange);
		this._bindEvent(view, "blur", this.config.attr.onblur);
		this._bindEvent(view, "focus", this.config.attr.onfocus);
		this._bindEvent(view, "scroll", this.config.attr.onscroll);
		this._bindEvent(view, "input", this.config.attr.oninput);
		this._bindEvent(view, "paste", this.config.attr.onpaste);
		this._bindEvent(view, "keypress", this.config.attr.onkeypress);
		this._bindEvent(view, "keyup", this.config.attr.onkeyup);
		this._bindEvent(view, "keyup", this.config.attr.onenter, 13);
		this._bindEvent(view, "keyup", this.config.attr.onescape, 27);
		this._bindEvent(view, "keyup", this.config.attr.onbackspace, 8);
	};
	
	
	Web.prototype._bindEvent = function(view, eventType, eventAttr, key)
	{
		var self = this;
		view._temp.find("[" + eventAttr + "]").each(function()
		{
			var element = $(this);
			var code = element.attr(eventAttr);
			element.on(eventType, function(event)
			{
				if(!isSet(key) || view.key(event, key))
				{
					var scope =
					{
						data : isSet(view.data) ? view.data : {},
						config : self.config,
						register : self.register,
						hash : self.hash,
						text : self.text,
						layout : self.layout,
						page : self.page,
						context : self.context,
						node : element[0],
						element : element,
						event : event,
						eventType : eventType
					};
					view.eval(code, scope);
				}
			});
		});
	};
	
	return Web;
	
})();






roth.lib.js.web.Register = roth.lib.js.web.Register || (function()
{
	
	var Register = function(app, moduleDependencies, template)
	{
		var self = this;
		this._app = app;
		this._moduleDependencies = moduleDependencies;
		this._template = template;
		
		forEach(moduleDependencies, function(dependencies, module)
		{
			self[module] =
			{
				text 		: {},
				mixin		: {},
				layout 		: {},
				page 		: {},
				component	: {}
			};
		});
		
	};
	
	
	Register.prototype.isValidModule = function(module)
	{
		return inMap(module, this._moduleDependencies);
	};


	Register.prototype.isValidLang = function(module, lang)
	{
		if(isSet(lang) && isSet(this[module]) && isSet(this[module].text))
		{
			var valid = isObject(this[module].text[lang]);
			if(isDevFile() && !isCompiled() && !valid)
			{
				this.getText(module, lang);
				valid = isObject(this[module].text[lang]);
			}
			return valid;
		}
		else
		{
			return false;
		}
	};


	Register.prototype.getText = function(module, lang)
	{
		var self = this;
		var text = {};
		if(isSet(lang))
		{
			if(isDevFile() && !isCompiled() && !isObject(this[module].text[lang]))
			{
				var path = module + "/text/" + module + "_" + lang;
				this[module].text[lang] = this.getJson(path);
			}
			text[module] = this[module].text[lang];
			forEach(this._moduleDependencies[module], function(dependency)
			{
				if(isDevFile() && !isCompiled() && !isObject(self[dependency].text[lang]))
				{
					var path = dependency + "/text/" + dependency + "_" + lang;
					self[dependency].text[lang] = self.getJson(path);
				}
				text[dependency] = self[dependency].text[lang];
			});
		}
		return text;
	};


	Register.prototype.getConstructor = function(module, name, type)
	{
		var self = this;
		var constructor = this[module][type][name];
		if(isDevFile() && !isCompiled())
		{
			var path = module + "/" + type + "/" + name;
			if(!isFunction(constructor))
			{
				constructor = new Function(this.getScript(path)).apply(this);
			}
			if(type != "mixin")
			{
				if(!isFunction(constructor))
				{
					var source = this.getSource(path);
					if(isValidString(source))
					{
						constructor = function() {};
						constructor.config =
						{
							init : null
						};
						constructor.source = source;
					}
				}
				else if(!isValidString(constructor.source))
				{
					constructor.source = this.getSource(path);
					if(!isValidString(constructor.source))
					{
						constructor = null;
					}
				}
			}
		}
		if(type != "mixin")
		{
			this.extendViewConstructor(constructor);
		}
		this[module][type][name] = constructor;
		return constructor;
	};
	
	
	Register.prototype.extendViewConstructor = function(constructor)
	{
		if(isFunction(constructor) && !isFunction(constructor.prototype._init))
		{
			var prototype = constructor.prototype;
			constructor.prototype = Object.create(roth.lib.js.web.View.prototype);
			for(var name in prototype)
			{
				if(!isSet(constructor.prototype[name]))
				{
					constructor.prototype[name] = prototype[name];
				}
				else
				{
					console.error(name + " cannot be on view prototype");
				}
			}
			constructor.prototype.constructor = constructor;
		}
		return constructor;
	};
	
	
	Register.prototype.getViewConstructor = function(module, name, type)
	{
		var self = this;
		name = StringUtil.camelCase(name);
		var constructorModule = module;
		var constructor = this.getConstructor(module, name, type);
		if(!isFunction(constructor))
		{
			forEach(this._moduleDependencies[module], function(dependency)
			{
				constructor = self.getConstructor(dependency, name, type);
				if(isFunction(constructor))
				{
					constructorModule = dependency;
					return false;
				}
			});
		}
		if(isFunction(constructor))
		{
			constructor._module = constructorModule;
			constructor._name = name;
			if(isObject(constructor.config) && isArray(constructor.config.mixins))
			{
				forEach(constructor.config.mixins, function(mixinName)
				{
					var mixinConstructor = self.getMixinConstructor(module, mixinName)
					if(isFunction(mixinConstructor))
					{
						mixin(constructor, mixinConstructor);
					}
				});
			}
		}
		return constructor;
	};
	
	
	Register.prototype.constructView = function(constructor, data, web)
	{
		var self = this;
		var view = null;
		if(isFunction(constructor))
		{
			view = new constructor(data);
			view.data = data;
			view._init(web);
		}
		return view;
	};
	
	
	Register.prototype.getLayoutConstructor = function(module, name, defaultSource)
	{
		var layoutConstructor = null;
		if(isValidString(name))
		{
			layoutConstructor = this.getViewConstructor(module, name, "layout");
		}
		if(!isFunction(layoutConstructor))
		{
			layoutConstructor = function(){};
			layoutConstructor._module = module;
			layoutConstructor._name = "default";
			layoutConstructor.config = { init : null };
			layoutConstructor.source = this._template.parse(defaultSource);
			this.extendViewConstructor(layoutConstructor);
		}
		return layoutConstructor;
	};
	
	
	Register.prototype.getPageConstructor = function(module, name)
	{
		return this.getViewConstructor(module, name, "page");
	};
	
	
	Register.prototype.getComponentConstructor = function(module, name)
	{
		return this.getViewConstructor(module, name, "component");
	};
	
	
	Register.prototype.getMixinConstructor = function(module, name)
	{
		return this.getViewConstructor(module, name, "mixin");
	};
	
	
	Register.prototype.getScript = function(path)
	{
		var self = this;
		var script = "";
		var url = "dev/app/" + this._app + "/" + path + ".js";
		var success = function(data)
		{
			script = data;
			script += "return View;"
		};
		$.ajax(
		{
			url : url,
			dataType : "text",
			cache : false,
			async : false,
			success : success
		});
		return script;
	};


	Register.prototype.getSource = function(path)
	{
		var self = this;
		var source = null;
		var url = "dev/app/" + this._app + "/" + path + ".html";
		var success = function(data)
		{
			source = self._template.parse(data);
		};
		$.ajax(
		{
			url : url,
			dataType : "text",
			cache : false,
			async : false,
			success : success
		});
		return source;
	};


	Register.prototype.getJson = function(path)
	{
		var self = this;
		var json = null;
		var url = "dev/app/" + this._app + "/" + path + ".json";
		var success = function(data)
		{
			json = data;
		};
		$.ajax(
		{
			url : url,
			dataType : "json",
			cache : false,
			async : false,
			success : success
		});
		return json;
	};
	
	return Register;
	
})();





roth.lib.js.web.Hash = roth.lib.js.web.Hash || (function()
{
	
	var Hash = function()
	{
		this.value = null;
		this.lang = null;
		this.layout = null;
		this.module = null;
		this.page = null;
		this.param = {};
		
		this.search = null;
		this.context = null;
		
		this.defaultLang = "en";	
		this.defaultModule = "index";
		this.defaultPage = "index";	
		this.langStorage = "lang";
		
		this.loaded = {};
		this.changeParam = {};
		
		this.newValue = false;
		this.newLang = false;
		this.newLayout = false;
		this.newModule = false;
		this.newPage = false;
		
	};
	
	
	Hash.prototype.hasParam = function(name)
	{
		return isSet(this.param[name]);
	};


	Hash.prototype.getParam = function(name, defaultValue)
	{
		var value = this.param[name];
		return isValidString(value) ? value : defaultValue;
	};


	Hash.prototype.getParamSize = function()
	{
		return Object.keys(this.param).length;
	};


	Hash.prototype.isParamEmpty = function()
	{
		return this.getParamSize() == 0;
	};


	Hash.prototype.getModule = function()
	{
		return isSet(this.module) ? this.module : this.defaultModule;
	};


	Hash.prototype.getPage = function()
	{
		return isSet(this.page) ? this.page : this.defaultPage;
	};


	Hash.prototype.setValue = function(value)
	{
		this.value = value;
		this.newValue = this.value !== this.loaded.value;
	};


	Hash.prototype.setLang = function(lang)
	{
		this.lang = lang;
		this.newLang = this.lang !== this.loaded.lang;
	};


	Hash.prototype.setLayout = function(layout)
	{
		this.layout = layout;
		this.newLayout = this.layout !== this.loaded.layout;
	};


	Hash.prototype.setModule = function(module)
	{
		this.module = module;
		this.newModule = this.module !== this.loaded.module;
	};


	Hash.prototype.setPage = function(page)
	{
		this.page = page;
		this.newPage = this.newModule || this.page !== this.loaded.page;
	};


	Hash.prototype.changeLang = function(lang)
	{
		if(isValidString(lang))
		{
			lang = lang.toLowerCase();
			if(this.lang != lang)
			{
				window.location.replace("#/" + lang + window.location.hash.slice(1));
			}
		}
	};


	Hash.prototype.back = function()
	{
		window.history.back();
	};


	Hash.prototype.next = function(module, page, param)
	{
		if(isValidString(module) && !isValidString(page))
		{
			window.location.assign(module);
		}
		else
		{
			window.location.assign(this.build(module, page, param));
		}
	};


	Hash.prototype.replace = function(module, page, param)
	{
		if(isValidString(module) && !isValidString(page))
		{
			window.location.replace(module);
		}
		else
		{
			window.location.replace(this.build(module, page, param));
		}
	};


	Hash.prototype.refresh = function()
	{
		window.location.replace(this.build(this.module, this.page, this.param));
	};


	Hash.prototype.reload = function()
	{
		window.location.reload();
	};


	Hash.prototype.change = function(changeParam, page, module)
	{
		var param = this.cloneParam();
		if(isObject(changeParam))
		{
			forEach(changeParam, function(value, name)
			{
				param[name] = value;
			});
		}
		if(!isValidString(page))
		{
			page = this.page;
		}
		if(!isValidString(module))
		{
			module = this.module;
		}
		return {
			module : module,
			page : page,
			param : param
		};
	};


	Hash.prototype.build = function(module, page, param)
	{
		if(isObject(module))
		{
			var change = this.change(module, page, param);
			module = change.module;
			page = change.page;
			param = change.param;
		}
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
					var value = param[name];
					if(isSet(value))
					{
						hash += encodeURIComponent(name) + "/";
						if(isArray(value))
						{
							hash += "[";
							var seperator = "";
							for(var i in value)
							{
								hash += seperator;
								hash += encodeURIComponent(value[i]);
								seperator = ",";
							}
							hash += "]/";
						}
						else
						{
							hash += encodeURIComponent(value) + "/";
						}
					}
				}
			}
		}
		return hash;
	};


	Hash.prototype.isValid = function()
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
					var value = decodeURIComponent(values[i]);
					var matches = value.match(/^\[(.*?)\]$/);
					if(!isEmpty(matches))
					{
						this.param[name] = matches[1].split(",");
					}
					else
					{
						this.param[name] = value;
					}
					hash += name + "/";
					hash += values[i] + "/";
					name = null;
				}
			}
		}
		if(!isSet(this.search))
		{
			this.search = {};
			var nameValues = window.location.search.substr(1).split("&");
			for(var i = 0; i < nameValues.length; i++)
			{
				var nameValue = nameValues[i].split("=", 2);
				if(nameValue.length == 2)
				{
					var name = nameValue[0];
					var value = nameValue[1];
					this.search[name] = decodeURIComponent(value.replace(/\+/g, " "));
				}
			}
		}
		if(!isSet(this.context))
		{
			this.context = getContext();
			if(!isSet(this.context))
			{
				if(isSet(this.search.context))
				{
					this.context = this.search.context;
				}
				if(!isSet(this.context))
				{
					if(isHyperTextProtocol())
					{
						var path = window.location.pathname.substr(1);
						var index = path.lastIndexOf("/");
						if(index > -1)
						{
							path = path.slice(0, index);
						}
						this.context = path;
					}
				}
			}
		}
		var blankHash = window.location.hash == "" || window.location.hash == "#";
		if(isSet(this.search.hash))
		{
			var url = "";
			url += window.location.protocol;
			url += "//";
			url += window.location.host;
			url += window.location.pathname;
			// TODO add query string
			url += "#";
			url += decodeURIComponent(this.search.hash);
			window.location.replace(url);
			return false;
		}
		else if(!blankHash && window.location.hash != hash)
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


	Hash.prototype.loadedParam = function()
	{
		this.loaded.param = this.param;
	};


	Hash.prototype.loadedValue = function()
	{
		this.loaded.value = this.value;
	};


	Hash.prototype.loadedLang = function()
	{
		this.loaded.lang = this.lang;
	};


	Hash.prototype.loadedLayout = function()
	{
		this.loaded.layout = this.layout;
	};


	Hash.prototype.loadedModule = function()
	{
		this.loaded.module = this.module;
	};


	Hash.prototype.loadedPage = function()
	{
		this.loaded.page = this.page;
	};


	Hash.prototype.log = function()
	{
		console.groupEnd();
		var group = "";
		group += "PAGE : ";
		group += this.lang + " / ";
		group += this.getModule() + " / ";
		group += this.getPage() + " / ";
		console.group(group + JSON.stringify(this.param));
	};


	Hash.prototype.cloneParam = function()
	{
		return $.extend({}, this.param);;
	};


	Hash.prototype.cloneLoadedParam = function()
	{
		return isSet(this.loaded.param) ? $.extend({}, this.loaded.param) : {};
	};


	Hash.prototype.paramChanges = function(changeParams)
	{
		var self = this;
		var changeParam = {};
		var param = this.cloneParam();
		var loadedParam = this.cloneLoadedParam();
		var names = Object.keys(param);
		forEach(loadedParam, function(value, name)
		{
			if(!inArray(name, names))
			{
				names.push(name);
			}
		});
		var empty = false;
		forEach(names, function(name)
		{
			var changed = !ObjectUtil.equals(param[name], loadedParam[name]);
			if(changed)
			{
				if(inArray(name, changeParams))
				{
					changeParam[name] = isSet(param[name]) ? param[name] : null;
				}
				else
				{
					empty = true;
				}
			}
		});
		this.changeParam = changeParam;
		return !empty ? changeParam : {};
	};
	
	
	Hash.prototype.print = function()
	{
		var url = "";
		url += window.location.protocol;
		url += "//";
		url += window.location.hostname;
		url += window.location.pathname;
		if(isValidString(window.location.search))
		{
			url += window.location.search;
			url += "&";
		}
		else
		{
			url += "?";
		}
		url += "print";
		url += window.location.hash;
		window.open(url, "_blank");
	};
	
	
	return Hash;
	
})();





roth.lib.js.web.View = roth.lib.js.web.View || (function()
{
	
	var View = function()
	{
		
	};
	
	
	View.prototype._init = function(web)
	{
		this._references(web);
		if(isFunction(this.init))
		{
			this.init();
		}
	};
	
	
	View.prototype._references = function(web)
	{
		this.web = web;
		this.config = web.config;
		this.handler = web.handler;
		this.template = web.template;
		this.register = web.register;
		this.hash = web.hash;
		this.text = web.text;
		this.layout = web.layout;
		this.page = web.page;
		this.context = web.context;
	};
	
	
	View.prototype._change = function(changeParam)
	{
		var self = this;
		if(!isObject(changeParam))
		{
			changeParam = this.hash.changeParam;
		}
		if(isFunction(this.change))
		{
			this.change(changeParam);
		}
		forEach(this._components, function(component)
		{
			component._change(changeParam);
		});
	};
	
	
	View.prototype._ready = function()
	{
		var self = this;
		if(isFunction(this.ready))
		{
			this.ready();
		}
		forEach(this._components, function(component)
		{
			component._ready();
		});
	};
	
	
	View.prototype._visible = function()
	{
		var self = this;
		if(isFunction(this.visible) && isSet(this.element) && this.element.is(":visible"))
		{
			this.visible();
		}
		forEach(this._components, function(component)
		{
			component._visible();
		});
	};
	
	
	View.prototype.loadComponentInit = function(element, componentName, service, method, request, data, callback)
	{
		var self = this;
		element = this.wrap(element);
		if(element.length > 0)
		{
			var service = isValidString(service) ? service : element.attr(this.config.attr.service);
			var method = isValidString(method) ? method : element.attr(this.config.attr.method);
			if(isValidString(service) && isValidString(method))
			{
				request = isObject(request) ? request : {};
				var serviceRequest = this.hash.cloneParam();
				$.extend(true, serviceRequest, request, ObjectUtil.parse(element.attr(this.config.attr.request)));
				var success = function(response)
				{
					data = isObject(data) ? data : {};
					$.extend(true, data, response);
					self.loadComponent(element, componentName, data, callback);
				};
				var error = function(errors)
				{
					self.loadComponent(element, componentName, data, callback);
				};
				var complete = function()
				{
					
				};
				this.service(service, method, serviceRequest, success, error, complete);
			}
			else
			{
				this.loadComponent(element, componentName, data, callback);
			}
		}
		else
		{
			console.error("element not found");
		}
	};
	
	
	View.prototype.loadComponent = function(element, componentName, data, callback)
	{
		var component = null;
		element = this.wrap(element);
		if(element.length > 0)
		{
			var module = this.hash.getModule();
			var componentConstructor = this.register.getComponentConstructor(module, componentName);
			if(isFunction(componentConstructor))
			{
				if(!isObject(data))
				{
					data = {};
				}
				var componentConfig = isObject(componentConstructor.config) ? componentConstructor.config : {};
				component = this.register.constructView(componentConstructor, data, this.web);
				if(isSet(component))
				{
					component.element = element;
					component.parent = this;
					if(!isArray(this._components))
					{
						this._components = [];
					}
					this._components.push(component);
					this.web._loadComponent(component, true);
					component._ready();
					component._change();
					component.element.show();
					component._visible();
					if(isFunction(callback))
					{
						callback(data, component);
					}
				}
			}
		}
		else
		{
			console.error("element not found");
		}
		return component;
	};


	View.prototype.service = function(service, method, request, success, error, complete, group)
	{
		this.web.service(service, method, request, success, error, complete, group, this);
	};


	View.prototype.eval = function(code, scope)
	{
		var names = [];
		var values = [];
		forEach(scope, function(value, name)
		{
			names.push(name);
			values.push(value);
		});
		return new Function(names.join(), code).apply(this, values);
	};


	View.prototype.groupElements = function(element, active)
	{
		active = isSet(active) ? active : true;
		var selector = "";
		selector += "input[name][type=hidden]" + (active ? ":enabled" : "") + ", ";
		selector += "input[name][type!=hidden][type!=radio][" + this.config.attr.required + "]" + (active ? ":include" : "") + ", ";
		selector += "select[name][" + this.config.attr.required + "]" + (active ? ":include" : "") + ", ";
		selector += "textarea[name][" + this.config.attr.required + "]" + (active ? ":include" : "") + ", ";
		selector += "[" + this.config.attr.radioGroup + "][" + this.config.attr.required + "]:has(input[name][type=radio]" + (active ? ":include" : "") + ") ";
		return element.find(selector);
	};


	View.prototype.request = function(element, service, method)
	{
		var self = this;
		var elementRegExp = new RegExp("^(\\w+)(?:\\[|$)");
		var indexRegExp = new RegExp("\\[(\\d+)?\\]", "g");
		var valid = true;
		var request = this.hash.cloneParam();
		var fields = [];
		this.groupElements(element).each(function()
		{
			var field = self.validate($(this));
			if(!field.valid)
			{
				valid = false;
			}
			if(isDebug())
			{
				fields.push(field);
			}
			if(valid && isValidString(field.name)) // && isValid(field.value))
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
		if(valid)
		{
			return request;
		}
		else
		{
			if(isDebug())
			{
				var i = fields.length;
				while(i--)
				{
					if(fields[i].valid)
					{
						fields.splice(i, 1);
					}
					else
					{
						delete fields[i].element;
					}
				}
				var group = "INVALID" + (isValidString(service) && isValidString(method) ? " : " + service + " / " + method : "");
				var log = "\n\n" + JSON.stringify(fields, null, 4) + "\n\n";
				console.groupCollapsed(group);
				console.log(log);
				console.groupEnd();
			}
			return null;
		}
	};


	View.prototype.update = function(element)
	{
		var self = this;
		element = this.wrap(element);
		var field = this.validate(element);
		if(field.valid && field.name)
		{
			var updateValue = element.attr(this.config.attr.updateValue);
			if(field.value != updateValue)
			{
				var request = this.hash.cloneParam();
				request.name = field.name;
				request.value = field.value;
				this.submit(element, request, function()
				{
					element.attr(self.config.attr.updateValue, field.value);
				},
				function()
				{
					element.val(element.attr(self.config.attr.updateValue));
				},
				function()
				{
					
				});
			}
		}
	};


	View.prototype.submit = function(element, request, success, error, complete)
	{
		var self = this;
		element = this.wrap(element);
		var disable = element.attr(this.config.attr.disable);
		var submitGroup = element.attr(this.config.attr.submitGroup);
		var prerequest = element.attr(this.config.attr.prerequest);
		var presubmit = element.attr(this.config.attr.presubmit);
		var service = element.attr(this.config.attr.service);
		var method = element.attr(this.config.attr.method);
		var successAttr = element.attr(this.config.attr.success);
		var errorAttr = element.attr(this.config.attr.error);
		var completeAttr = element.attr(this.config.attr.complete);
		var disabler = this.handler.disabler[disable];
		submitGroup = isValidString(submitGroup) ? submitGroup : method;
		var groupElement = $("[" + this.config.attr.group + "='" + submitGroup + "']");
		var scope =
		{
			data : this.data,
			config : this.config,
			handler : this.handler,
			register : this.register,
			hash : this.hash,
			text : this.text,
			layout : this.layout,
			page : this.page,
			context : this.context,
			node : element[0],
			element : element,
			groupElement : groupElement
		};
		if(!isFunction(disabler))
		{
			disabler = this.handler.disabler._default;
		}
		if(isFunction(disabler))
		{
			disabler(element, true);
		}
		if(isValidString(prerequest))
		{
			if(this.eval("return " + prerequest, scope) === false)
			{
				if(isFunction(disabler))
				{
					disabler(element, false);
				}
				return;
			}
		}
		if(!isObject(request))
		{
			request = this.request(groupElement, service, method);
		}
		if(isObject(request))
		{
			$.extend(true, request, ObjectUtil.parse(element.attr(this.config.attr.request)));
			scope.request = request;
			if(isValidString(presubmit))
			{
				if(this.eval("return " + presubmit, scope) === false)
				{
					if(isFunction(disabler))
					{
						disabler(element, false);
					}
					return;
				}
			}
			if(isValidString(service) && isValidString(method))
			{
				this.service(service, method, request, function(data)
				{
					scope.data = data;
					var enable = true;
					if(isFunction(success))
					{
						success(data, request, element);
					}
					if(isValidString(successAttr))
					{
						enable = self.eval(successAttr, scope);
					}
					if(isFunction(disabler) && !isFalse(enable))
					{
						disabler(element, false);
					}
				},
				function(errors)
				{
					scope.errors = errors;
					if(isFunction(error))
					{
						error(errors, request, element);
					}
					if(isValidString(errorAttr))
					{
						self.eval(errorAttr, scope);
					}
					if(isFunction(disabler))
					{
						disabler(element, false);
					}
				},
				function()
				{
					if(isFunction(complete))
					{
						complete();
					}
					if(isValidString(completeAttr))
					{
						self.eval(completeAttr, scope);
					}
				},
				submitGroup);
			}
		}
		else
		{
			if(isFunction(disabler))
			{
				disabler(element, false);
			}
		}
	};


	View.prototype.wrap = function(element, selector)
	{
		if(isSet(element))
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
				return $();
			}
		}
		else
		{
			return $();
		}
	};


	View.prototype.filter = function(element)
	{
		var self = this;
		element = this.wrap(element);
		var field = {};
		field.element = element;
		field.name = element.attr(this.config.attr.radioGroup);
		field.value = null;
		field.formValue = null;
		field.tag = element.prop("tagName").toLowerCase();
		field.type = null;
		field.filter = element.attr(this.config.attr.filter);
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
				var value = element.attr("value");
				if(isSet(value))
				{
					field.value = element.is(":checked") ? value : null;
				}
				else
				{
					field.value = element.is(":checked");
				}
			}
			else if(field.type == "file")
			{
				field.value = element.attr(this.config.attr.fileValue);
			}
			else
			{
				field.formValue = element.val();
				field.value = field.formValue;
				if(isValidString(field.value))
				{
					field.value = field.value;
					if(isValidString(field.filter))
					{
						var scope =
						{
							data : this.data,
							config : this.config,
							handler : this.handler,
							register : this.register,
							hash : this.hash,
							text : this.text,
							layout : this.layout,
							page : this.page,
							context : this.context,
							node : element[0],
							element : element,
							field : field,
							value : field.value
						};
						for(var name in this.handler.filterer)
						{
							scope[name] = this.handler.filterer[name];
						}
						field.value = this.eval("return " + field.filter, scope);
					}
				}
				else if(isArray(field.value))
				{
					var i = field.value.length;
					while(i--)
					{
						if(!isValidString(field.value[i]))
						{
							field.value.splice(i, 1);
						}
					}
				}
			}
		}
		if(!isValid(field.value))
		{
			field.value = null;
		}
		return field;
	};


	View.prototype.validateGroup = function(element)
	{
		var self = this;
		var validGroup = true;
		this.groupElements(element).each(function()
		{
			var field = self.validate($(this));
			if(!field.valid)
			{
				validGroup = false;
			}
		});
		return validGroup;
	};


	View.prototype.validate = function(element)
	{
		var self = this;
		element = this.wrap(element);
		var field = this.filter(element);
		field.visible = element.is(":visible");
		field.include = field.visible || isTrue(element.attr(this.config.attr.include));
		field.required =  isTrue(element.attr(this.config.attr.required));
		field.defined = !isEmpty(field.value);
		field.valid = !(field.required && !field.defined) ? true : false;
		field.validate = element.attr(this.config.attr.validate);
		if(field.include && field.valid && field.defined)
		{
			if(isValidString(field.validate))
			{
				var scope =
				{
					data : this.data,
					config : this.config,
					handler : this.handler,
					register : this.register,
					hash : this.hash,
					text : this.text,
					layout : this.layout,
					page : this.page,
					context : this.context,
					node : element[0],
					element : element,
					field : field,
					value : field.value
				};
				for(var name in this.handler.validator)
				{
					scope[name] = this.handler.validator[name];
				}
				field.valid = this.eval("return " + field.validate, scope);
			}
		}
		this.feedback(element, field);
		return field;
	};


	View.prototype.file = function(element, callback)
	{
		var self = this;
		element = this.wrap(element);
		var files = element[0].files;
		if(files.length > 0)
		{
			var file = files[0];
			if(file)
			{
				var reader  = new FileReader();
				reader.onload = function(event)
				{
					element.attr(self.config.attr.fileValue, reader.result);
					if(isFunction(callback))
					{
						callback(reader.result);
					}
				};
				reader.readAsDataURL(file);
			}
		}
	};


	View.prototype.feedback = function(element, field)
	{
		var self = this;
		element = this.wrap(element);
		var module = this.hash.getModule();
		var page = this.hash.getPage();
		var feedback = element.attr(this.config.attr.feedback);
		var feedbacker = this.handler.feedbacker[feedback];
		if(!isFunction(feedbacker))
		{
			 feedbacker = this.handler.feedbacker._default;
		}
		if(isFunction(feedbacker))
		{
			feedbacker(element, field);
		}
	};


	View.prototype.resetGroups = function()
	{
		this.resetGroupsValidation();
		this.resetGroupsValue();
	};


	View.prototype.resetGroup = function(element)
	{
		this.resetGroupValidation(element);
		this.resetGroupValue(element);
	};


	View.prototype.reset = function(element)
	{
		this.resetValidation(element);
		this.resetValue(element);
	};


	View.prototype.resetGroupsValidation = function()
	{
		var self = this;
		$("[" + this.config.attr.group + "]").each(function()
		{
			self.resetGroupValidation($(this));
		});
	};


	View.prototype.resetGroupValidation = function(element)
	{
		var self = this;
		element = this.wrap(element, "[" + this.config.attr.group + "='{name}']");
		this.groupElements(element, false).each(function()
		{
			self.resetValidation($(this));
		});
	};


	View.prototype.resetValidation = function(element)
	{
		this.feedback(element);
	};


	View.prototype.resetGroupsValue = function()
	{
		var self = this;
		$("[" + this.config.attr.group + "]").each(function()
		{
			self.resetGroupValue($(this));
		});
	};


	View.prototype.resetGroupValue = function(element)
	{
		var self = this;
		element = this.wrap(element, "[" + this.config.attr.group + "='{name}']");
		this.groupElements(element, false).each(function()
		{
			self.resetValue($(this));
		});
		this.web._defaults(element);
	};


	View.prototype.resetValue = function(element)
	{
		this.feedback(element);
		var tag = element.prop("tagName").toLowerCase();
		var type = element.attr("type");
		element.val("");
		if(type == "file")
		{
			element.attr(this.config.attr.fileValue, "");
		}
	};


	View.prototype.key = function(event, key)
	{
		var keyCode = event.which || event.keyCode;
		return (keyCode == key);
	};


	View.prototype.enter = function(event)
	{
		return this.key(event, 13);
	};


	View.prototype.escape = function(event)
	{
		return this.key(event, 27);
	};


	View.prototype.backspace = function(event)
	{
		return this.key(event, 8);
	};


	View.prototype.enterSubmit = function(event)
	{
		var self = this;
		if(this.enter(event))
		{
			var element = $(event.target);
			var groupElement = element.closest("[" + self.config.attr.group + "]");
			if(groupElement.length > 0)
			{
				var group = groupElement.attr(self.config.attr.group);
				if(isSet(group))
				{
					var submitElement = groupElement.find("[" + self.config.attr.submitGroup + "='" + group + "'], [" + self.config.attr.method + "='" + group + "']");
					if(submitElement.length > 0)
					{
						self.submit(submitElement);
					}
				}
			}
		}
	};
	
	return View;
	 
})();





roth.lib.js.web.Dev = roth.lib.js.web.Dev || (function()
{
	
	var Dev = function()
	{
		var self = this;
		this.template = new roth.lib.js.template.Template();
		this.selectHtml = "<div id=\"{{ id }}-select\" class=\"roth-dev-select\"><div class=\"roth-dev-select-header\">{{ context }}</div><div class=\"roth-dev-select-body\"><div class=\"roth-dev-radio-button-group\">{% forEach(values, function(value, i, loop) { %}<label class=\"roth-dev-radio-button {{ loop.first ? \"roth-dev-radio-button-active\" : \"\" }}\" onclick=\"$(this).siblings().removeClass('roth-dev-radio-button-active');$(this).addClass('roth-dev-radio-button-active');\"><input class=\"roth-dev-radio-input\" name=\"{{ id }}-response\" value=\"{{ value }}\" type=\"radio\" autocomplete=\"off\" {{ loop.first ? \"checked\" : \"\" }} />{{ value }}</label>{% }); %}</div></div><div class=\"roth-dev-select-footer\"><button id=\"{{ id }}-once\" type=\"button\" class=\"roth-dev-button roth-dev-button-once\">Once</button><button id=\"{{ id }}-session\" type=\"button\" class=\"roth-dev-button roth-dev-button-session\">Session</button></div></div>";
		$('<style></style>').html(".roth-dev-selects{display:none;position:absolute;left:0;top:0;right:0;bottom:0;text-align:center;z-index:10000;background-color:rgba(0, 0, 0, 0.5);box-sizing:border-box;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;}.roth-dev-select{background-color:#fff;color:#4b4b4b;text-align:left;width:300px;margin:30px auto;padding:0;background-clip:padding-box;border:1px solid rgba(0, 0, 0, 0.2);border-radius:6px;outline:0 none;box-shadow:0 5px 15px rgba(0, 0, 0, 0.5);}.roth-dev-select-header{font-size:16px;padding:15px;border-bottom:1px solid #e5e5e5;}.roth-dev-select-body{padding:15px;}.roth-dev-select-footer{padding:15px;border-top: 1px solid #e5e5e5;text-align:right;}.roth-dev-radio-button-group{width:100%;display:inline-block;vertical-align:middle;}.roth-dev-radio-button{margin:-1px 0 0 0;padding:6px 12px;text-align:center;border:1px solid #dadada;display:block;width:100%;box-sizing:border-box;cursor:pointer;border-radius:0;position:relative;}.roth-dev-radio-button:hover{box-shadow:0 3px 5px rgba(0, 0, 0, 0.125) inset;background-color:#e6e6e6;border-color:#adadad;z-index:2;}.roth-dev-radio-button.roth-dev-radio-button-active{box-shadow:0 3px 5px rgba(0, 0, 0, 0.125) inset;background-color:#e6e6e6;border-color:#adadad;z-index:2;}.roth-dev-radio-button-group > .roth-dev-radio-button:first-child{border-radius:4px 4px 0 0;}.roth-dev-radio-button-group > .roth-dev-radio-button:last-child{border-radius:0 0 4px 4px;}.roth-dev-radio-input{position:absolute;clip:rect(0px, 0px, 0px, 0px);pointer-events:none;}.roth-dev-button{border-radius:1px;padding:6px 12px;margin:0 2px;cursor:pointer;display:inline-block;font-family:inherit;font-size:inherit;font-weight:inherit;color:#fff;border:1px solid transparent;}.roth-dev-button.roth-dev-button-once{background-color:#5bc0de;}.roth-dev-button.roth-dev-button-once:hover{background-color:#31b0d5;}.roth-dev-button.roth-dev-button-session{background-color:#47acc3;}.roth-dev-button.roth-dev-button-session:hover{background-color:#42a0b5;}").appendTo("head");
		this.selects = $("<div class=\"roth-dev-selects\"></div>");
		$(document).ready(function()
		{
			self.selects.appendTo("body");
		});
		
		this.service = (function()
		{
			var service = {};
			var url = "dev/service.json";
			var success = function(data)
			{
				service = data;
			};
			$.ajax(
			{
				url : url,
				dataType : "json",
				cache : false,
				async : false,
				success : success
			});
			return service;
		})
		();
		
	};
	
	
	Dev.prototype.getResponseScenarios = function(service, method)
	{
		var scenarios = [];
		if(isObject(this.service) && isObject(this.service[service]) && isObject(this.service[service][method]) && isArray(this.service[service][method].response))
		{
			scenarios = this.service[service][method].response;
		}
		return scenarios;
	};


	Dev.prototype.select = function(context, values, callback)
	{
		var self = this;
		var value = sessionStorage.getItem(context);
		if(!value)
		{
			var id = IdUtil.generate();
			var select = $(this.template.render(this.selectHtml, { id : id, context : context, values : values}));
			select.find("#" + id + "-once").click(function()
			{
				var value = select.find("input[type='radio'][name='" + id + "-response']:checked").val();
				if(!isSet(value))
				{
					value = values[0];
				}
				select.remove();
				if(self.selects.children().length == 0)
				{
					self.selects.hide();
				}
				callback(value);
			});
			select.find("#" + id + "-session").click(function()
			{
				var value = select.find("input[type='radio'][name='" + id + "-response']:checked").val();
				if(!isSet(value))
				{
					value = values[0];
				}
				select.remove();
				if(self.selects.children().length == 0)
				{
					self.selects.hide();
				}
				sessionStorage.setItem(context, value);
				callback(value);
			});
			self.selects.append(select);
			self.selects.show();
		}
		else
		{
			callback(value);
		}
	};
	
	return Dev;
	
})();



roth.lib.js.web.version = "0.2.0-SNAPSHOT";
roth.lib.js.framework.version = "0.2.0-SNAPSHOT";
