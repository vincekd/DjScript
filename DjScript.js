"use strict";
function date ( format, date, ret ) {
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
    
    var dj = (function( da ){
	return { 
	    "d" : (da.getDate() < 10) ? "" + "0" + da.getDate() : da.getDate(),
	    "D" : dayArr[da.getDay()].substr(0,3),
	    "j" : da.getDate(),
	    "l" : dayArr[da.getDay()],
	    "N" : da.getDay() + 1,
	    "L" : getLeap ( da.getFullYear() ),
	    "w" : da.getDay(),
	    "z" : (function(){
		var days = 0;
		for( var i = 0; i < da.getMonth(); i++ )
		    days += mDays[i];
		return days + da.getDate() - 1;
	    })(),
	    "W" : (function() {
		var dd = new Date ();
		dd.setFullYear ( da.getFullYear(), da.getMonth(), da.getDate() );
		var x = dd.getDay();
		if ( x == 0 ) x = 7;
		dd.setDate ( dd.getDate() + ( 4 - x ) );
		var x = dd.getFullYear();
		var z = Math.floor ( ( dd.getTime() - new Date( x, 0, 1, -6) ) / 86400000 );
		return 1 + Math.floor ( z / 7 );
	    })(),
	    "F" : mArr[da.getMonth()],
	    "m" : (da.getMonth()+1 < 10) ? "" + "0" + (da.getMonth() + 1): da.getMonth() + 1,
	    "f" : da.getMonth(),
	    "M" : mArr[da.getMonth()].substr(0,3),
	    "n" : da.getMonth() + 1,
	    "t" : mDays[da.getMonth()],
	    "Y" : da.getFullYear(),
	    "y" : ("" + da.getFullYear()).substr(-2),
	    "a" : (da.getHours() < 12) ? "am" : "pm",
	    "A" : (da.getHours() < 12) ? "AM" : "PM",
	    "g" : (da.getHours() % 12 == 0) ? 12 : da.getHours() % 12,
	    "G" : da.getHours(),
	    "h" : (function(){
		var u = (da.getHours() % 12 == 0) ? 12 : da.getHours() % 12;
		return ( u < 10 ) ? "" + "0" + u : u;
	    })(),
	    "H" : (da.getHours < 10) ? "" + "0" + da.getHours() : da.getHours(),
	    "i" : (da.getMinutes() < 10) ? "" + "0" + da.getMinutes() : da.getMinutes(),
	    "s" : (da.getSeconds() < 10) ? "" + "0" + da.getSeconds() : da.getSeconds(),
	    "u" : da.getMilliseconds(),
	    "c" : da.toString(),
	    "U" : da.getTime(),
	    "compareTo" : function ( dt ) {
		dt = window.date( null, dt, true );
		if ( Math.abs ( dt.getTime() - da.getTime() ) < 1000 ) 
		    return 0;
		else if ( dt.getTime() > da.getTime() ) 
		    return -1;
		else 
		    return 1;
	    },
	    "P" : (function() {
		var metric = [ 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years' ];
		var meter = [ 60, 60, 24, 7, 4, 12 ];
		var d = new Date();
		var comp = Math.round ( Math.abs ( d.getTime() - da.getTime() ) / 1000 );
		var str = "hence";
		if ( d.getTime() > da.getTime() )
		    str = "ago";
		var i = 0;
		while ( comp >= meter[i] ){
		    comp = comp / meter[i];
		    i++;
		}
		return "" + Math.round( comp ) + " " + metric[i] + " " + str;
	    })()
	};
    })(date);

    if ( ret == true ) return date;
    else if ( format == "" || format == null ) return dj;

    var output = "", reg = /[a-zA-Z]/, fArr = format.split( "" );

    for ( var i = 0; i < fArr.length; i++ ){
	if ( fArr[i] == "\\" ) output += fArr[++i];
	else output += ( booS ( fArr[i], reg ) ) ? dj[fArr[i]] : fArr[i];
    }

    return output;

    function parseDate ( s ){
	s = trim ( s );
	s = s.toLowerCase();
	var date = new Date (), d = /[^a-zA-Z]days?/, w = /weeks?/, m = /months?/, y = /years?/, h = /hours?/, min = /mins?/, sec = /secs?(?!o)/, milli = /millis?/, yest = /yest/, tom = /tom/, n;

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
	var st = s.substr ( i );
	st = st.slice ( st.search ( /[0-9]{1,}/ ) );
	if ( st == -1 ) st = st.slice ( s.search ( /[0-9]{1,}/ ) );
	var d = st.search ( /[a-zA-Z\s]/ );
	return (d == -1) ? st : st.substring ( 0, d );
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
	var reg = /[0-9]\s?[(am)(pm)]/;
	var hm = /\s([0-9]{1,2}):([0-9]{2}):{0,1}([0-9]{2}){0,1}(am|pm)?\s/;
	var my = /([0-9]{1,2})[.,_\/-]([0-9]{4})/;
	var ymd = /([0-9]{4})[.,_\/-]{0,1}([0-1]{1}[0-9]{1})[.,_\/-]{0,1}([0-3]{1}[0-9]{1})/;
	var dmy = /([0-3]{0,1}[0-9]{1})[.,_\/-]([0-1]?[0-9]{1})[.,_\/-]([0-9]{4})/;
	var yyd = /\s([0-9]{4})[.,_\/-]?([0-9]{3})\s/;
	var y = /\s([0-9]{4})\s/;
	var e = /([0-9]{9,})/;

	s.replace ( hm, function(str, p1, p2, p3, p4, offset, s){
	    if ( booS ( s, /pm/ ) ) {
		p1 = parseInt ( p1 );
		if ( p1 < 12 ) p1 += 12;
	    }
	    if ( p3 == "" || p3 == undefined ) p3 = 0;
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
		date.setFullYear ( p1 );
		date.setMonth ( i );
		date.setDate( (p2 - count) );
	    });
	} else if ( booS ( s, y ) ) {
	    s.replace ( y, function ( str, p1, offset, s ) {
		date.setFullYear ( p1 );
	    });
	}else if ( booS ( s, e ) ) {
	    date = new Date ( parseInt ( s ) );
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
