function djscript( format, date ){
    "use strict";
    var regex = {
	"b" : /(-|ago|last|previous|prev|past|former|minus|subtract|sub){1,}/,
	"f" : /(\+|hence|next|coming|future|add|plus){1,}/,
	"reg" : /[a-zA-Z]/, "d" : /[^a-zA-Z]days?/, "w" : /weeks?/, 
	"m" : /months?/, "ye" : /years?/, "h" : /hours?/, "min" : /mins?/,
	"sec" : /secs?(?!o)/, "milli" : /millis?/, "yest" : /yest/, 
	"hm" : /\s([0-9]{1,2}):([0-9]{2}):{0,1}([0-9]{2}){0,1}(am|pm)?\s/,
	"my" : /\s([0-9]{1,2})[.,_\/\-]{0,1}([0-9]{4})\s/,
	"ymd" : /\s([0-9]{4})[.,_\/\-]{1}([0-9]{2})[.,_\/\-]{1}([0-9]{2})\s/,
	"ymd2" : /\s([0-9]{4})[.,_\/\-]{1}([0-9]{1,2})[.,_\/\-]{1}([0-9]{1,2})\s/,
	"ymd3" : /\s([0-9]{4})([0-9]{2})([0-9]{2})\s/, "tom" : /tom/,
	"dmy" : /\s([0-3]{0,1}[0-9]{1})[.,_\/\-]([0-1]?[0-9]{1})[.,_\/\-]([0-9]{4})\s/,
	"yyd" : /\s([0-9]{4})[.,_\/\-]?([0-9]{3})\s/, "y" : /\s([0-9]{4})\s/,
	"e" : /\s([0-9]{4}[.,\/\-]{0,}[0-9]{3})\s/, "ep" : /\s([0-9]{9,})\s/
    }, 
    mArr = ["January","Febuary","March","April",
	    "May","June","July","August","September",
	    "October","November","December"],
    dayArr = ["Sunday", "Monday", "Tuesday", 
	      "Wednesday", "Thursday", 
	      "Friday", "Saturday"],
    trim = function( str ){
	try{
	    str = str.trim();
	} catch( e ){
	    str = str.replace( /^\s+/, "" ).replace( /\s+$/, "" );
	}
	return str;
    },
    booS = function( h, s ){
	var i;
	if ( typeof s === "string" || s instanceof RegExp ){
	    return h.search( s ) !== -1;
	}
	for( i = 0; i < s.length; i++ ) {
	    if ( h.search ( s[i] ) !== -1 ) {
		return true;
	    }
	}
	return false;
    },
    extNum = function( s ){
	var d, i = ( s.search ( regex.f ) === -1 ) ? s.search ( regex.b ) : s.search( regex.f ),
	st = s.substr ( i );
	st = st.slice ( st.search ( /[0-9]{1,}/ ) );
	if ( st === -1 ){
	    st = st.slice ( s.search ( /[0-9]{1,}/ ) );
	}
	d = st.search ( /[a-zA-Z\s]/ );
	return (d === -1) ? st : st.substring ( 0, d );
    },
    getLeap = function( year ) {
	return (new Date(year,1,29).getDate() !== 1);
    },
    mDays = function(year){
	var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	m[1] = ( getLeap ( year ) ) ? 29 : 28;
	return m;
    },
    dj = function( da ){
	return { 
	    "d" : (da.getDate() < 10) ? "0" + da.getDate() : da.getDate(),
	    "D" : dayArr[da.getDay()].substr(0,3),
	    "j" : da.getDate(),
	    "l" : dayArr[da.getDay()],
	    "N" : da.getDay() + 1,
	    "L" : getLeap ( da.getFullYear() ),
	    "w" : da.getDay(),
	    "z" : (function(){
		var i, days = 0;
		for( i = 0; i < da.getMonth(); i++ ){
		    days += mDays[i];
		}
		return days + da.getDate() - 1;
	    }()),
	    "W" : (function() {
		var z, x, dd = new Date ();
		dd.setFullYear( da.getFullYear(), da.getMonth(), da.getDate() );
		x = dd.getDay();
		x = (x === 0) ? 7 : x;
		dd.setDate( dd.getDate() + ( 4 - x ) );
		x = dd.getFullYear();
		z = Math.floor( ( dd.getTime() - new Date( x, 0, 1, -6) ) / 86400000 );
		return 1 + Math.floor( z / 7 );
	    }()),
	    "F" : mArr[da.getMonth()],
	    "m" : ((da.getMonth()+1 < 10) ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)),
	    "f" : da.getMonth(),
	    "M" : mArr[da.getMonth()].substr(0,3),
	    "n" : da.getMonth() + 1,
	    "t" : mDays[da.getMonth()],
	    "Y" : da.getFullYear(),
	    "y" : (String( da.getFullYear() )).substr(-2),
	    "a" : (da.getHours() < 12) ? "am" : "pm",
	    "A" : (da.getHours() < 12) ? "AM" : "PM",
	    "g" : (da.getHours() % 12 === 0) ? 12 : da.getHours() % 12,
	    "G" : da.getHours(),
	    "h" : (function(){
		var u = (da.getHours() % 12 === 0) ? 12 : da.getHours() % 12;
		return ( u < 10 ) ? "0" + u : u;
	    }()),
	    "H" : (da.getHours < 10) ? "0" + da.getHours() : da.getHours(),
	    "i" : (da.getMinutes() < 10) ? "0" + da.getMinutes() : da.getMinutes(),
	    "s" : (da.getSeconds() < 10) ? "0" + da.getSeconds() : da.getSeconds(),
	    "u" : da.getMilliseconds(),
	    "c" : da.toString(),
	    "U" : da.getTime(),
	    "P" : (function() {
		var i, metric = [ 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years' ],
		meter = [ 60, 60, 24, 7, 4, 12 ], d = new Date(),
		comp = Math.round ( Math.abs ( d.getTime() - da.getTime() ) / 1000 ),
		str = "hence";
		if( d.getTime() > da.getTime() ){
		    str = "ago";
		}
		i = 0;
		while( comp >= meter[i] ){
		    comp = comp / meter[i];
		    i++;
		}
		return String( Math.round( comp ) ) + " " + metric[i] + " " + str;
	    }())
	};
    },
    parseDate = function( s ){
	s = trim ( s );
	s = s.toLowerCase();
	var date = new Date (), n,
	mdNames = function ( s ) {
	    var std = trim ( s.replace ( /[0-9]{1,2}[(th)(nd)(st)(rd)]|([a-zA-Z])(m)?/g, function( str, p1, p2 ){
		return ((p1 + p2) === "am" || (p1 + p2) === "pm" ) ? (p1 + p2) : "";
	    })),
	    parseMore = function( s ){
		s = " " + s + " ";
		var date = new Date(),
		yMD = function( str, p1, p2, p3 ){
		    date.setFullYear( p1 );
		    date.setMonth( p2-1 );
		    date.setDate( p3 );
		},
		dMY = function( str, p1, p2, p3 ){
		    date.setFullYear( p3 );
		    date.setMonth( p2-1 );
		    date.setDate( p1 );
		};

		s.replace( regex.hm, function(str, p1, p2, p3, p4, offset, s){
		    if ( /pm/.test( s ) ) {
			p1 = parseInt( p1, 10 );
			if ( p1 < 12 ){
			    p1 += 12;
			}
		    }
		    p3 = p3 || 0;
		    date.setHours( p1 );
		    date.setMinutes( p2 );
		    date.setSeconds( p3 );
		});

		if( regex.ep.test( s ) ){
		    s.replace( regex.ep, function( str, p1 ){
			date = new Date( parseInt( p1, 10 ) );
		    });
		}

		if( regex.ymd.test( s ) ){
		    s.replace ( regex.ymd, yMD );
		} else if( regex.ymd2.test( s ) ){
		    s.replace ( regex.ymd2, yMD );
		} else if( regex.ymd3.test( s ) ){
		    s.replace ( regex.ymd3, yMD );
		} else if( regex.dmy.test( s ) ){
		    s.replace ( regex.dmy, dMY );
		} else if( regex.my.test( s ) ){
		    s.replace ( regex.my, function( str, p1, p2 ){
			date.setFullYear ( p2 );
			date.setMonth ( p1-1 );
		    });
		} else if ( regex.yyd.test ( s ) ) {
		    s.replace( regex.yyd, function( str, p1, p2 ){
			var mCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			count = 0, i = 0;
			mCount[1] = ( getLeap(p1) ) ? 29 : 28;
			while ( count + mCount[i] < p2 ) {
			    count += mCount[i];
			    i++;
			}
			date.setFullYear ( p1 );
			date.setMonth ( i );
			date.setDate( (p2 - count) );
		    });
		} else if( regex.y.test( s ) ){
		    s.replace( regex.y, function( str, p1 ){
			date.setFullYear( p1 );
		    });
		}else if( regex.e.test( s ) ){
		    date = new Date( parseInt( s, 10 ) );
		}
		return date;
	    }, 
	    date = parseMore( std ),
	    i, j;

	    for( i = 0; i < mArr.length; i++ ) {
		if( booS ( s, mArr[i].substr ( 0, 3 ).toLowerCase() ) ) {
		    if( date.getMonth() >= i && regex.f.test( s ) ) {
			date.setFullYear( date.getFullYear() + 1 );
		    } else if( date.getMonth() <= i && regex.b.test( s ) ) {
			date.setFullYear( date.getFullYear() - 1 );
		    }
		    date.setMonth( i );
		}
	    }

	    for( i = 0; i < dayArr.length; i++ ){
		if( /mon(?!t)/.test( s ) || ! /mon/.test( s ) ){
		    if( booS( s, dayArr[i].substr( 0, 3 ).toLowerCase() ) ){
			j = date.getDay ();
			if( regex.f.test( s ) ) {
			    if( i > j ) {
				date.setDate( date.getDate() + (i - j) );
			    } else if( i < j ){
				date.setDate( date.getDate() + ((7 - j) + i) );
			    } else if ( i === j ){
				date.setDate( date.getDate () + 7 );
			    }
			} else if( regex.b.test ( s ) ){
			    if ( i > j ) {
				date.setDate( date.getDate() - ((7 - i) + j) );
			    } else if( i < j ){
				date.setDate( date.getDate() - (j - i) );
			    } else if( i === j ){
				date.setDate( date.getDate () - 7 );
			    }
			} else {
			    if( i > j ){
				date.setDate( date.getDate() + (i - j) );
			    } else if( i < j ){
				date.setDate( date.getDate() - (j - i) );
			    }
			}
		    }
		}
	    }
	    s.replace( /([0-9]{1,2})[(th)(nd)(st)(rd)]/, function( str, p1 ){
		date.setDate( p1 );
	    });
	    return date;
	};

	date = mdNames( s );
	
	if( regex.yest.test( s ) ){
	    date.setDate( date.getDate()-1 );
	} else if( regex.tom.test( s ) ){
	    date.setDate( date.getDate()+1 );
	}

	if( regex.b.test( s ) ) {
	    n = extNum ( s );
	    n = (n === "") ? -1 : (n-(n*2));
	} else if( regex.f.test( s ) ) {
	    n = extNum ( s ) || 1;
	} else {
	    return date;
	}
	
	n = parseInt(n, 10);

	if( regex.d.test( s ) ){
	    date.setDate ( date.getDate() + n );
	} else if( regex.m.test( s ) ){
	    date.setMonth ( date.getMonth() + n );
	} else if( regex.ye.test ( s ) ){
	    date.setFullYear ( date.getFullYear() + n );
	} else if( regex.w.test ( s ) ){
	    date.setDate ( date.getDate() + (n*7) );
	} else if( regex.h.test ( s ) ){
	    date.setHours ( date.getHours() + n );
	} else if( regex.min.test ( s ) ){
	    date.setMinutes( date.getMinutes() + n );
	} else if( regex.sec.test( s ) ){
	    date.setSeconds ( date.getSeconds() + n );
	} else if( regex.milli.test ( s ) ){
	    date.setMilliseconds( date.getMilliseconds() + n );
	}

	return date;
    };

    date = (typeof date === "string" ) ? parseDate( date ) : date;
    mDays( date.getFullYear() );

    return (function( format, date ){
	if( format === "" || format === undefined || format === null ){
	    return date;
	}
	var i, form = dj( date ), output = "", fArr = format.split( "" );
	
	for( i = 0; i < fArr.length; i ++ ){
	    if( fArr[i] === "\\" && !! fArr[i+1] ){
		output += fArr[++i];
	    } else {
		//output += (!!form[fArr[i]]) ? form[fArr[i]] : (regex.reg.test( fArr[i] ) ? "" : fArr[i]);
		output += (!!form[fArr[i]]) ? form[fArr[i]] : fArr[i];
	    }
	}
	return output;
    }( format, date ));
}
