"use strict";
function date ( format, dat, ret ) {

    var b = /(-|ago|last|previous|prev|past|former|minus|subtract|sub){1,}/;
    var f = /(\+|hence|next|coming|future|add|plus){1,}/;
    var mArr = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
    var dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dat = ( typeof dat == "string" ) ? parseDate ( dat ) : dat;
    var mDays = (function(year){
	var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	m[1] = ( getLeap ( year ) ) ? 29 : 28;
	return m;
    })(dat.getFullYear());
    
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
		dt = date( "", dt, true );
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
    })(dat);

    if ( ret == true ) return dat;
    else if ( format == "" || format == null ) return dj;

    var output = "", reg = /[a-zA-Z]/, fArr = format.split( "" );

    for ( var i = 0; i < fArr.length; i++ ){
	if ( fArr[i] == "\\" ) output += fArr[++i];
	else output += ( reg.test( fArr[i] ) ) ? dj[fArr[i]] : fArr[i];
    }

    return output;

    function parseDate ( s ){
	s = trim ( s );
	s = s.toLowerCase();
	var date = new Date (), d = /[^a-zA-Z]days?/, w = /weeks?/, m = /months?/, y = /years?/, h = /hours?/, min = /mins?/, sec = /secs?(?!o)/, milli = /millis?/, yest = /yest/, tom = /tom/, n;

	date = mdNames ( s );
	
	if ( yest.test( s ) )
	    date.setDate(date.getDate()-1);
	else if ( tom.test( s ) )
	    date.setDate(date.getDate()+1);

	if ( b.test( s ) ) {
	    n = extNum ( s );
	    n = (n == "") ? -1 : (n-(n*2));
	} else if ( f.test( s ) ) {
	    n = extNum ( s ) || 1;
	} else {
	    return date;
	}
	
	n = parseInt(n);

	if ( d.test( s ) )
	    date.setDate ( date.getDate() + n );
	else if ( m.test( s ) )
	    date.setMonth ( date.getMonth() + n );
	else if ( y.test ( s ) )
	    date.setFullYear ( date.getFullYear() + n );
	else if ( w.test ( s ) )
	    date.setDate ( date.getDate() + (n*7) );
	else if ( h.test ( s ) )
	    date.setHours ( date.getHours() + n );
	else if ( min.test ( s ) )
	    date.setMinutes( date.getMinutes() + n );
	else if ( sec.test( s ) )
	    date.setSeconds ( date.getSeconds() + n );
	else if ( milli.test ( s ) )
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
	}));

	var date = parseMore ( std );

	for ( var i = 0; i < mArr.length; i++ ) {
	    if ( booS ( s, mArr[i].substr ( 0, 3 ).toLowerCase() ) ) {
		if ( date.getMonth () >= i && f.test ( f ) ) {
		    date.setFullYear( date.getFullYear() + 1 );
		} else if ( date.getMonth() <= i && b.test (s ) ) {
		    date.setFullYear( date.getFullYear() - 1 );
		}
		date.setMonth ( i );
	    }
	}

	for ( var i = 0; i < dayArr.length; i++ ) {
	    if ( /mon(?!t)/.test( s ) || ! /mon/.test( s ) ) {
		if ( booS ( s, dayArr[i].substr ( 0, 3 ).toLowerCase() ) ) {
		    var j = date.getDay ();
		    if ( f.test( s ) ) {
			if ( i > j ) {
			    date.setDate ( date.getDate() + (i - j) );
			} else if ( i < j ) {
			    date.setDate ( date.getDate() + ((7 - j) + i) );
			} else if ( i == j ) {
			    date.setDate ( date.getDate () + 7 );
			}
		    } else if ( b.test ( s ) ) {
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
	var my = /\s([0-9]{1,2})[.,_\/-]{0,1}([0-9]{4})\s/;
	var ymd = /\s([0-9]{4})[.,_\/-]{1}([0-9]{2})[.,_\/-]{1}([0-9]{2})\s/;
	var ymd2 = /\s([0-9]{4})[.,_\/-]{1}([0-9]{1,2})[.,_\/-]{1}([0-9]{1,2})\s/;
	var ymd3 = /\s([0-9]{4})([0-9]{2})([0-9]{2})\s/;
	var dmy = /\s([0-3]{0,1}[0-9]{1})[.,_\/-]([0-1]?[0-9]{1})[.,_\/-]([0-9]{4})\s/;
	var yyd = /\s([0-9]{4})[.,_\/-]?([0-9]{3})\s/;
	var y = /\s([0-9]{4})\s/;
	var e = /\s([0-9]{4}[.,\/-]{0,}[0-9]{3})\s/;
	var ep = /\s([0-9]{9,})\s/;

	s.replace ( hm, function(str, p1, p2, p3, p4, offset, s){
	    if ( /pm/.test ( s ) ) {
		p1 = parseInt ( p1 );
		if ( p1 < 12 ) p1 += 12;
	    }
	    p3 = p3 || 0;
	    date.setHours ( p1 );
	    date.setMinutes ( p2 );
	    date.setSeconds ( p3 );
	});
	if ( ep.test ( s ) ) {
	    s.replace ( ep, function ( str, p1, offset, s ) {
		date = new Date ( parseInt ( p1 ) );
	    });
	}
	if ( ymd.test ( s ) ) {
	    s.replace ( ymd, yMD );
	} else if ( ymd2.test ( s ) ) {
	    s.replace ( ymd2, yMD );
	} else if ( ymd3.test ( s ) ) {
	    s.replace ( ymd3, yMD );
	}else if ( dmy.test ( s ) ) {
	    s.replace ( dmy, dMY );
	} else if ( my.test ( s ) ) {
	    s.replace ( my, function (str, p1, p2, offset, s ){
		date.setFullYear ( p2 );
		date.setMonth ( p1-1 );
	    });
	} else if ( yyd.test ( s ) ) {
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
	} else if ( y.test ( s ) ) {
	    s.replace ( y, function ( str, p1, offset, s ) {
		date.setFullYear ( p1 );
	    });
	}else if ( e.test ( s ) ) {
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
try {
    exports.date = date;
} catch ( e ) {}
