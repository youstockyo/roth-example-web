
var View = function(data)
{
	
};

View.config =
{
	
};

View.prototype.init = function()
{
	
};

View.prototype.ready = function()
{
	
};

View.prototype.change = function(changeParam)
{
	
};

View.prototype.visible = function()
{
	
};

View.prototype.formatPhone = function(phone)
{
	var formattedPhone = phone;
	if(isNumber(phone))
	{
		phone = phone.toString();
	}
	if(isString(phone) && phone.length == 10)
	{
		formattedPhone = "";
		formattedPhone += "(";
		formattedPhone += phone.slice(0, 3);
		formattedPhone += ") ";
		formattedPhone += phone.slice(3, 6);
		formattedPhone += "-";
		formattedPhone += phone.slice(6, 10);
	}
	return formattedPhone;
};

