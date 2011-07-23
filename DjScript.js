"use strict";
function date ( format, date ) {
    var b = /(-|ago|last|previous|prev|past|former|minus|subtract|sub){1,}/;
    var f = /(\+|hence|next|coming|future|add|plus){1,}/;
    var mArr = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
    var dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    date = ( typeof date == "string" ) ? parseDate ( date ) : date;
    var mDays = (function(year){
	var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	m[1] = ( getLeap ( year ) ) ? 29 : 28;
	return m;
    })(date.getFullYear());
    
    var d = (function( da ){
	return { 
	    "d" : function () {
		return (da.getDate() < 10) ? "" + "0" + da.getDate() : da.getDate();
	    },
	    "D" : function () {
		return dayArr[da.getDay()].substr(0,3);
	    },
	    "j" : function () {
		return da.getDate();
	    },
	    "l" : function () {
		return dayArr[da.getDay()];
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
		    days += mDays[i];
		return days + da.getDate() - 1;
	    },
	    "W" : function () {
		var dd = new Date ();
		dd.setFullYear ( da.getFullYear(), da.getMonth(), da.getDate() );
		var x = dd.getDay();
		if ( x == 0 ) x = 7;
		dd.setDate ( dd.getDate() + ( 4 - x ) );
		var x = dd.getFullYear();
		var z = Math.floor ( ( dd.getTime() - new Date( x, 0, 1, -6) ) / 86400000 );
		return 1 + Math.floor ( z / 7 );
	    },
	    "F" : function () {
		return mArr[da.getMonth()];
	    },
	    "m" : function () {
		return (da.getMonth()+1 < 10) ? "" + "0" + (da.getMonth() + 1): da.getMonth() + 1;
	    },
	    "f" : function () {
		return da.getMonth();
	    },
	    "M" : function () {
		return mArr[da.getMonth()].substr(0,3);
	    },
	    "n" : function () {
		return da.getMonth() + 1;
	    },
	    "t" : function () {
		return mDays[da.getMonth()];
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

    var output = "";
    var reg = /[a-zA-Z]/;
    var fArr = format.split( "" );

    for ( var i = 0; i < fArr.length; i++ ){
	if ( fArr[i] == "\\" ) output += fArr[++i];
	else output += ( booS ( fArr[i], reg ) ) ? d[fArr[i]]() : fArr[i];
    }

    return output;

    function parseDate ( s ){
	s = trim ( s );
	s = s.toLowerCase();
	var date = new Date ();
	var d = /[^a-zA-Z]days?/;
	var w = /weeks?/;
	var m = /months?/;
	var y = /years?/;
	var h = /hours?/;
	var min = /mins?/;
	var sec = /secs?(?!o)/;
	var milli = /millis?/;
	var yest = /yest/;
	var tom = /tom/;
	var n;

	date = mdNames ( s );
	
	if ( booS ( s, yest ) )
	    date.setDate(date.getDate()-1);
	else if ( booS ( s, tom ) )
	    date.setDate(date.getDate()+1);

	if ( booS ( s, b ) ) {
	    n = extNum ( s );
	    n = (n == "") ? -1 : (n-(n*2));
	} else if ( booS( s, f ) ) {
	    n = extNum ( s );
	    if ( n == "" ) n = 1;
	} else {
	    return date;
	}
	
	n = parseInt(n);

	if ( booS ( s, d ) )
	    date.setDate ( date.getDate() + n );
	else if ( booS ( s, m ) )
	    date.setMonth ( date.getMonth() + n );
	else if ( booS ( s, y ) )
	    date.setFullYear ( date.getFullYear() + n );
	else if ( booS ( s, w ) )
	    date.setDate ( date.getDate() + (n*7) );
	else if ( booS ( s, h ) )
	    date.setHours ( date.getHours() + n );
	else if ( booS ( s, min ) )
	    date.setMinutes( date.getMinutes() + n );
	else if ( booS ( s, sec ) )
	    date.setSeconds ( date.getSeconds() + n );
	else if ( booS ( s, milli ) )
	    date.setMilliseconds( date.getMilliseconds() + n );

	return date;
    };
    function extNum ( s ) {
	var i = ( s.search ( f ) == -1 ) ? s.search ( b ) : s.search( f );
	s = s.substr ( i );
	s = s.slice ( s.search ( /[0-9]{1,}/ ) );
	var d = s.search ( /[a-zA-Z\s]/ );
	return (d == -1) ? s : s.substring ( 0, d );
    };
    function booS ( h, s ) {
	if ( typeof s == "string" || s instanceof RegExp ) return h.search( s ) != -1;
	for( var i = 0; i < s.length; i++ ) {
	    if ( h.search ( s[i] ) != -1 ) {
		return true;
	    }
	}
	return false;
    };
    function trim ( str ) {
	try {
	    str = str.trim();
	} catch (e) {
	    str = str.replace ( /^\s+/, "" ).replace ( /\s+$/, "" );
	}
	return str;
    };
    function mdNames ( s ) {
	var std = trim ( s.replace ( /[0-9]{1,2}[(th)(nd)(st)(rd)]|([a-zA-Z])(m)?/g, function (str, p1, p2, offset, s) {
	    if ( p1 + p2 == "am" || p1 + p2 == "pm" ) {
		return p1 + p2;
	    } else {
		return "";
	    }
	}) );

	var date = parseMore ( std );

	for ( var i = 0; i < mArr.length; i++ ) {
	    if ( booS ( s, mArr[i].substr ( 0, 3 ).toLowerCase() ) ) {
		if ( date.getMonth () >= i && booS ( s, f ) ) {
		    date.setFullYear( date.getFullYear() + 1 );
		} else if ( date.getMonth() <= i && booS ( s, b ) ) {
		    date.setFullYear( date.getFullYear() - 1 );
		}
		date.setMonth ( i );
	    }
	}

	for ( var i = 0; i < dayArr.length; i++ ) {
	    if ( booS ( s, /mon(?!t)/ ) || ! booS ( s, /mon/ ) ) {
		if ( booS ( s, dayArr[i].substr ( 0, 3 ).toLowerCase() ) ) {
		    var j = date.getDay ();
		    if ( booS ( s, f ) ) {
			if ( i > j ) {
			    date.setDate ( date.getDate() + (i - j) );
			} else if ( i < j ) {
			    date.setDate ( date.getDate() + ((7 - j) + i) );
			} else if ( i == j ) {
			    date.setDate ( date.getDate () + 7 );
			}
		    } else if ( booS ( s, b ) ) {
			if ( i > j ) {
			    date.setDate ( date.getDate() - ((7 - i) + j) );
			} else if ( i < j ) {
			    date.setDate ( date.getDate() - (j - i) );
			} else if ( i == j ) {
			    date.setDate ( date.getDate () - 7 );
			}
		    } else {
			if ( i > j ) {
			    date.setDate ( date.getDate() + (i - j) );
			} else if ( i < j ) {
			    date.setDate ( date.getDate() - (j - i) );
			}
		    }
		}
	    }
	}
	s.replace ( /([0-9]{1,2})[(th)(nd)(st)(rd)]/, function ( str, p1, offset, s ) {
	    date.setDate ( p1 );
	});
	return date;
    };
    function parseMore ( s ) {
	s = " " + s + " ";
	var date = new Date();
	var pun = /[.,_\/-]/;
	var reg = /[0-9]\s?[(am)(pm)]/;
	var hm = /\s([0-9]{1,2}):([0-9]{2}):?([0-9]{0,2})?\s{0,}(am|pm)?\s/;
	var my = /([0-9]{1,2})[.,_\/-]([0-9]{4})/;
	var ymd = /([0-9]{4})[.,_\/-]([0-1]?[0-9]{1})[.,_\/-]([0-3]{0,1}[0-9]{1})/;
	var dmy = /([0-3]{0,1}[0-9]{1})[.,_\/-]([0-1]?[0-9]{1})[.,_\/-]([0-9]{4})/;
	var yyd = /([0-9]{4})[.,_\/-]?([0-9]{3})/;
	var y = /\s([0-9]{4})\s/;
	var e = /([0-9]{9,})/;

	s.replace ( hm, function(str, p1, p2, p3, p4, offset, s){
	    if ( booS ( s, /pm/ ) ) {
		p1 = parseInt ( p1 );
		if ( p1 < 12 ) p1 += 12;
	    }
	    if ( p3 == "" ) p3 = 0;
	    date.setHours ( p1 );
	    date.setMinutes ( p2 );
	    date.setSeconds ( p3 );
	});
	if ( booS ( s, ymd ) ) {
	    s.replace ( ymd, yMD );
	} else if ( booS ( s, dmy ) ) {
	    s.replace ( dmy, dMY );
	} else if ( booS ( s, my ) ) {
	    s.replace ( my, function (str, p1, p2, offset, s ){
		date.setFullYear ( p2 );
		date.setMonth ( p1 );
	    });
	} else if ( booS ( s, yyd ) ) {
	    s.replace ( yyd, function ( str, p1, p2, offset, s ) {
		var mCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		mCount[1] = ( getLeap(p1) ) ? 29 : 28;
		var count = 0;
		var i = 0;
		while ( count + mCount[i] < p2 ) {
		    count += mCount[i];
		    i++;
		}
		var c = (p2-count < 10 ) ? ""+"0"+(p2-count) : (p2-count);
		date.setFullYear ( p1 );
		date.setMonth ( (i+1) );
		date.setDate( c );
	    });
	} else if ( booS ( s, y ) ) {
	    s.replace ( y, function ( str, p1, offset, s ) {
		date.setFullYear ( p1 );
	    });
	}else if ( booS ( s, e ) ) {
	    date = new Date ( Date.parse ( s ) );
	}
	function yMD ( str, p1, p2, p3, offset, s ) {
	    date.setFullYear ( p1 );
	    date.setMonth ( p2-1 );
	    date.setDate( p3 );
	}
	function dMY ( str, p1, p2, p3, offset, s ) {
	    date.setFullYear ( p3 );
	    date.setMonth ( p2-1 );
	    date.setDate( p1 );
	}
	return date;
    };
    function getLeap ( year ) {
	return (new Date(year,1,29).getDate() != 1);
    };
};
