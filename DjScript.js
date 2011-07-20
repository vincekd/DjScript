"use strict";
function DateJs ( format, date ) {

    date = (typeof date == "string") ? new Date( date ) : date;
    var output = "";
    var reg = /[a-zA-Z]/;
    var fArr = format.split( "" );
    
    var d = (function(da){
	return { 
	    "mArr" : ["January","Febuary","March","April","May","June","July","August","September","October","November","December"],
	    "mDays" : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	    "dayArr" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	    "d" : function () {
		return (da.getDate() < 10) ? "" + "0" + da.getDate() : da.getDate();
	    },
	    "D" : function () {
		return this.dayArr[da.getDay()].substr(0,3);
	    },
	    "j" : function () {
		return da.getDate();
	    },
	    "l" : function () {
		return this.dayArr[da.getDay()];
	    },
	    "N" : function () {
		return da.getDay() + 1;
	    },
	    "w" : function () {
		return da.getDay();
	    },
	    "z" : function () {
		var days = 0;
		for( var i = 0; i < da.getMonth(); i++ )
		    days += this.mDays[i];
		return days + da.getDate() - 1;
	    },
	    "W" : function () {
		
	    },
	    "F" : function () {
		return this.mArr[da.getMonth()];
	    },
	    "m" : function () {
		return (da.getMonth() < 10) ? "" + "0" + (da.getMonth() + 1) : da.getMonth() + 1;
	    },
	    "M" : function () {
		return this.mArr[da.getMonth()].substr(0,3);
	    },
	    "n" : function () {
		return da.getMonth() + 1;
	    },
	    "t" : function () {
		return this.mDays[da.getMonth()];
	    },
	    "Y" : function () {
		return da.getFullYear();
	    },
	    "y" : function () {
		return ("" + da.getFullYear()).substr(-2);
	    },
	    "a" : function () {
		return (da.getHours() < 12) ? "am" : "pm";
	    },
	    "A" : function () {
		return (da.getHours() < 12) ? "AM" : "PM";
	    },
	    "g" : function () {
		return  (da.getHours() % 12 == 0) ? 12 : da.getHours() % 12;
	    },
	    "G" : function () {
		return da.getHours();
	    },
	    "h" : function () {
		return  (this.g() < 10 ) ? "" + "0" + this.g() : this.g();
	    },
	    "H" : function () {
		return (da.getHours < 10) ? "" + "0" + da.getHours() : da.getHours();
	    },
	    "i" : function () {
		return (da.getMinutes() < 10) ? "" + "0" + da.getMinutes() : da.getMinutes();
	    },
	    "s" : function () {
		return (da.getSeconds() < 10) ? "" + "0" + da.getSeconds() : da.getSeconds();
	    },
	    "u" : function () {
		return da.getMilliseconds();
	    },
	    "c" : function () {
		return da.toString();
	    },
	    "U" : function () {
		return da.getTime();
	    }
	};
    })(date);

    if ( format == "" ) return d;

    fArr.forEach ( function (s) {
	output += ( s.search( reg ) != -1 ) ? d[s]() : s;
    });

    return output;
}
