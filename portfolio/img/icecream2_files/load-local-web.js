/*--------------------------------------
[mps:EXT] Client-Side MPS Load + Execute
--------------------------------------*/
//--> SCRIPT INIT
var mps = mps||{}, debugmode=debugmode||{}, mpscall=mpscall||{}, mpsopts=mpsopts||{}, mpsinstance=mpsinstance||false;
mps._ext={'_p':{},'loaded':0,'loadheader':0,'loadfooter':0,'nowrite':'2'};
mps._ext._insertedads = mps._ext._insertedads || {};
mpsopts.callback = mpsopts.callback || 'mpsCallback';
mpsopts.catprefix = mpsopts.catprefix || '';
mpsopts.deriveparams = mpsopts.deriveparams || {1:'cat1',2:'cat2',3:'cat3',4:'cat4',5:'cat5',6:'cat6'};
mpsopts.deriveoff = mpsopts.deriveoff ? true : false;
mpsopts.maxcats = mpsopts.maxcats || 6;
mpsopts.updatecorrelator = (typeof mpsopts.updatecorrelator != 'undefined')? mpsopts.updatecorrelator : 1;
mpsopts.maxpathsegs = mpsopts.maxpathsegs || 4;
mpsopts.subset = mpsopts.subset || mpsopts.subset || false;
mpsopts.skipheader = (typeof(mpsopts.skipheader)=='undefined'||mpsopts.skipheader!=1) ? 0 : 1;
mpsopts.legacyqueues=(typeof(mpsopts.legacyqueues)==='undefined') ? 1 : mpsopts.legacyqueues;
mpsopts.forcenetcalls = mpsopts.forcenetcalls || false;
mpsopts.skipautorequest = (typeof(mpsopts.skipautorequest)=='undefined' || mpsopts.skipautorequest==0 || mpsopts.skipautorequest==false) ? 0 : 1;
mpsopts.skipdisableinitialload = typeof(mpsopts.skipdisableinitialload)==='undefined' || mpsopts.skipdisableinitialload==0 || mpsopts.skipdisableinitialload==false ?  0 : 1;
mps._ext._set = mps._ext._set || -1;
mps._reqs = mps._reqs || {};
mps._clonevars = mps._clonevars || {};
mps._ext._ = mps._loadset || 0;
mps._reqset = mps._reqset || 0;
mps._gptloaded=false;
mps.lazyloadclone=mps.lazyloadclone||{};
mps._reportingbaseurl = mps._reportingbaseurl || 'pix.nbcuni.com/x.gif';
var isMPS = true;
mps._adsheld2=mps._adsheld2||[]; // tracking queued ads (before gpt ready)

//--> INTERNAL FUNCTIONS
var mps=mps||{};
var debugmode=debugmode||{};
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
debugmode.log&&window.console||(debugmode.log=0);
mps.debugMsg = [];
mps._gptcmd = mps._gptcmd || [];
mps._queue = mps._queue || {};
mps._queue.gptloadset=mps._queue.gptloadset||{};
mps._queue.mpsloaded = mps._queue.mpsloaded || [];
mps._queue.gptloaded = mps._queue.gptloaded || [];
mps._queue.mpsinit = mps._queue.mpsinit || [];
mps._queue.adload = mps._queue.adload || [];
mps._queue.adview = mps._queue.adview || [];
mps._queue.adrender = mps._queue.adrender || [];
mps._queue.adviewchange = mps._queue.adviewchange || [];
mps._queue.adclone = mps._queue.adclone || [];
mps._queue.destroyads = mps._queue.destroyads || [];
mps._queue.refreshads = mps._queue.refreshads || [];
mps._queue.activerefresh = mps._queue.activerefresh || [];
mps._queue.lazyload = mps._queue.lazyload || [];
mps._queue.setrails = mps._queue.setrails || [];
mps._queue.adshow = mps._queue.adshow || [];
mps._queue.adhide = mps._queue.adhide || [];
mps._queue.abdetect = mps._queue.abdetect || [];
mps._queue.clonead = [];
mps._queue.errorpixels = mps._queue.errorpixels || [];
mps._queue.error = mps._queue.error || [];
mps._queue.mpsready = mps._queue.mpsready || [];
mps._ext = mps._ext || {};
mps._ext.mpsready = mps._ext.mpsready || false;
mps._ext._jq = typeof(jQuery) === 'function' ? 1 : 0;
mps._clonerunning = false;
mps._gptrefresh = mps._gptrefresh || true;
mps._adviews = mps._adviews || {};
mps._targeting = mps._targeting || {};
mps._delays = mps._delays || {};
mps._delays.reportingdelay = mps._delays.reportingdelay || 2000;
mps._delays.bodyheader = mps._delays.bodyheader || 20000;
mps._delays.bodyheaderint = mps._delays.bodyheaderint || 100;
mps._delays._adview = mps._delays._adview || {};
mps._delays._adview[mps._loadset||0] = mps._delays._adview[mps._loadset||0] || {};
mps._delays._reportingdelay = null;
mps._ext = mps._ext || {};
mps._ext.mpsready = false;

//--(IE<9: indexOf)
if(!Array.prototype.indexOf)Array.prototype.indexOf=function(searchElement,fromIndex){var k;if(this==null)throw new TypeError('"this" is null or not defined');var o=Object(this);var len=o.length>>>0;if(len===0)return-1;var n=fromIndex|0;if(n>=len)return-1;k=Math.max(n>=0?n:len-Math.abs(n),0);while(k<len){if(k in o&&o[k]===searchElement)return k;k++}return-1};
mps._os = mps._os || navigator.platform.indexOf('Win') > -1 ? 'windows' : 'macintosh';

// If KILLCOMPONENTS exists in the query params set in mpscall
if(location.search.indexOf('KILLCOMPONENTS') > -1){
  mpscall.KILLCOMPONENTS = 1;
  mpscall.CACHESKIP = 1;
}

mps._bool = function(val,intval) {
  if(typeof(val)=='boolean') val = val ? 1 : 0;
  if(typeof(val)=='string') {
    if(val=='true') {
      val = 1;
    }
    if(val=='false') {
      val = 0;
    }
  }
  val = parseInt(val,10);
  if(!intval) {
    return val === 1 ? true : false;
  } else {
    return typeof(val) === 'number' ? val : parseInt(val, 10);
  }
};

//: Debug Mode Detection
debugmode.log=navigator.userAgent.toLowerCase().indexOf("android")>-1?null:function(a){
  var b=navigator.cookieEnabled?!0:!1;
  "undefined"!=typeof navigator.cookieEnabled||b||(document.cookie="_ckT",b=-1!=document.cookie.indexOf("_ckT")?!0:!1);
  var c=window.location.search&&window.location.search.indexOf("DEBUGMODE")>-1;
  if(c){
    return 2;
  }
  if(!b){
    return!1;
  }
  a+="=";
  for(var b=document.cookie.split(";"),d=0;d<b.length;d++){
    for(var e=b[d];" "==e.charAt(0);) {
      e=e.substring(1,e.length);
    }
    if(0==e.indexOf(a)){
      return e.substring(a.length,e.length);
    }
  }
  return null;
}
(String.fromCharCode(95,95)+"de"+String.fromCharCode(98,117,103,109,111)+"de"+Array(3).join("_"))||debugmode.log;
//--[MPS Doc Ready] mps._ready(function(){ ... });
mps._ready=function(func){
  if(typeof jQuery=="function"){
    jQuery().ready(func);
  }
  else {
    mps._onload(func,window);
  }
};
//--[Native JS Doc Ready] not invoked directly
mps._onload=function(a,b){
  var c=!1,d=!0,e="object"!=typeof b?window.document:b.document,f=e.documentElement,g=e.addEventListener?"addEventListener":"attachEvent",h=e.addEventListener?"removeEventListener":"detachEvent",i=e.addEventListener?"":"on",j=function(d){
    try{
      ("readystatechange"!=d.type||"complete"==e.readyState)&&(("load"==d.type?b:e)[h](i+d.type,j,!1),!c&&(c=!0)&&a.call(b,d.type||d));
    }catch(f){
      return mps._errorCallback(f, 'mps._onload'),!1;
    }
  },k=function(){
    try{
      f.doScroll("left");
    }catch(a){
      return void setTimeout(k,50);
    }
    j("poll");
  };
  if("complete"==e.readyState) {
    try{
      a.call(b,"lazy");
    }catch(l){
      mps._errorCallback(l, 'mps._onload');
    }
  }else{
    if(e.createEventObject&&f.doScroll){
      try{
        d=!b.frameElement;
      }catch(m){}
      d&&k();
    }
    e[g](i+"DOMContentLoaded",j,!1),e[g](i+"readystatechange",j,!1),b[g](i+"load",j,!1);
  }
};

//--[Get Elapsed Time]
mps._elapsed = function(label,asval) {
  Date.now = Date.now || function() {
    return +new Date;
  };
  var displaylabel = typeof(label)!='undefined' ? ' ('+label+')' : '';
  if(typeof(mps._timer)!='number'||!(mps._timer>1)) {
    mps._timer=Date.now();
    retval = 0;
    ret = '#mpsTimer\u2022 /started/ '+mps._timer+displaylabel;
  } else {
    retval = Date.now()-mps._timer;
    ret = '#mpsTimer\u2022'+retval+'ms'+displaylabel;
  }
  if(typeof(asval)!='undefined'){
    return retval;
  }
  return ret;
};

//--[Ad DOM Object] Return DOM selector using slot name
mps.selectAd = function(adunit) {
  if(typeof(adunit)!='undefined' && adunit!='' && typeof(mps)=='object' && typeof(mps.advars)!='undefined' && typeof(mps.adslots[adunit])!='undefined' && typeof(mps._select) == 'function' && (adselect=mps._select('#'+mps.adslots[adunit]))) {
    return adselect;
  } else {
    return false;
  }
};

//--[GPT Ad Object] Return Google ad object reference using the slot name
mps.getSlot = function(slotstr,loadset) {
  var _advars = mps.advars;
  loadset = (loadset !== null && typeof loadset != 'undefined') ? parseInt(loadset,10) : mps._loadset;
  if(parseInt(loadset)>-1) {
    if(!mps._advars[loadset]) {
      return false;
    }
    _advars = mps._advars[loadset];
  }
  if(typeof(slotstr) != 'string') {
    mps._debug('mps.getSlot: param is not a string');
    return false;
  }
  if(typeof(_advars) != 'object' || typeof(_advars[slotstr]) != 'string') {
    mps._debug('mps.getSlot: invalid slot name');
    return false;
  }
  if(typeof(mps._advarprefix) != 'string' || typeof(window[mps._advarprefix]) != 'object') {
    mps._debug('mps.getSlot: invalid page gpt object');
    return false;
  }
  if(typeof(window[mps._advarprefix][_advars[slotstr]]) != 'object') {
    mps._debug('mps.getSlot: failed to load slot object');
    return false;
  }
  return window[mps._advarprefix][_advars[slotstr]];
};

//--[Single DOM Object via Selector String] example strings: #id .class body
mps._select = function(selector) {
  // jQuery available
  if(typeof(jQuery) === 'function') {
    return (jQuery(selector)[0]||false);
  }
  if(typeof(selector) != 'string' || selector.length < 2) {
    return false;
  }
  // Modern Browser
  if(typeof(document.querySelectorAll)=='function' || typeof(document.querySelectorAll)=='object') {
    return (document.querySelectorAll(selector)[0]||false);
  }
  // Old Browser (func by first char)
  if(selector.charAt(0)=='#') {
    return (top.document.getElementById(selector.substr(1))||false);
  } else if(selector.charAt(0)=='.') {
    return (top.document.getElementsByClassName(selector.substr(1))[0]||false);
  } else {
    return (top.document.getElementsByTagName(selector)[0]||false);
  }
};


//--[Insert HTML into Selector] mps._append (obj)domelement,(str)html
mps._append = function(selector, d, name) {
  if(typeof(selector)=='string') {
    selector = mps._select(selector);
  }
  if(typeof(selector)!='object'||typeof(d)!='string') {
    mps._debug('mps._append() invalid parameters');
    return false;
  }
  // jQuery available
  if(typeof(jQuery) === 'function') {
    return (jQuery(selector).append(d)||false);
  }
  var content = d;
  content = Array.prototype.concat( [], content );

  if(content.length) {

    var frag = document.createDocumentFragment();
    var tmp = frag.appendChild( document.createElement('div'));
    tmp.innerHTML = 'X' + content;

    var scripts = tmp.getElementsByTagName('script');
    // Append html.
    if(selector) {
      try {
        selector.insertAdjacentHTML('beforeend', content);
      } catch(err) {
        mps._errorCallback(err, (name || 'mps._append'));
      }
    } else {
      mps._log('Invalid selector provided.');
    }
    for(var i=0; i<scripts.length; i++) {
      var newScript = document.createElement('script');
      if(scripts[i].id) {
        newScript.id = scripts[i].id;
      }
      if(scripts[i].src) {
        newScript.type = 'text/javascript';
        newScript.src = scripts[i].src;
        newScript.onerror = function(){
          mps._loadError(newScript.src);
        };
        document.getElementsByTagName('head')[0].appendChild(newScript);
      } else {
        var nscript = document.createElement('script');
        nscript.type = 'text/javascript';
        nscript.text = 'try{ '+scripts[i].innerHTML+' } catch(err){ mps._errorCallback(err, "mps._append inline"); }';
        document.getElementsByTagName('head')[0].appendChild(nscript).parentNode.removeChild(nscript);
      }
    }
  }
};

//-- mps.attachData(instance[string, 'test-web'], mpsid[string, 123456789], data[object { "fruits":["kiwi",'dragonfruit"]}])
mps.attachData = function(mpsid, data){
  var mpsid = mpsid || mps.pagevars.mpsid;
  var instance = mps.pagevars.instance;
  var mpsdomain = mps.pagevars.mpsurl ? mps.pagevars.mpsurl : 'mps.nbcuni.com';
  var legacy = mps._checkua().oldie === false || mps._checkua().oldie && mps._checkua().oldie > 10 ? false : true;

  // Sort and Serialize object, if omitted, pass empty string
  var attachData = typeof data !== 'undefined' && mps._keys(data).length ? mps._sortObject(data) : '';
  var serializedData = (attachData !== '') ?  mps._serialize(attachData, "cag") : attachData;

  // Compare sorted JSON string with existing
  if(typeof mps.pagevars.cagsattached === 'object' && (JSON.stringify(serializedData) !== JSON.stringify(mps._serialize(mps.pagevars.cagsattached, "cag")))) {
    var xhr,
        url = 'https://' + mpsdomain + '/request/attachdata/' + instance + '/' + mpsid + '?' + serializedData;
    if(!legacy){
      xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200 && xhr.responseText.length > 0) {
            mps._debug('[mps:attachData] SUCCESS 200' + xhr.responseText);
          } else if (xhr.status == 0) {
            mps._debug("[mps:attachData] FAILED 410 - Page doesn't exist");
            return false;
          }
        }
      };
      xhr.send(null);
      return true;
    } else {
      xhr = new XDomainRequest();
      xhr.onload=function() {
        return xhr.responseText;
      };
      xhr.onerror=function() {
        return xhr.responseText;
      };
      xhr.open('get', url, true);
      setTimeout(function () {
        xhr.send();
      }, 0);
      return xhr;
    }
  } else {
    mps._debug('[mps:attachData] SKIPPED attaching cags - Already Set');
    return false;
  }
};

mps._loadError = function(source){
  mps._errorCallback({name: 'Script', message: source}, 'Load Error');
};

//--[Remove Selector(s) from DOM] mps._remove (obj)
mps._remove = function(elem) {
  if(!elem) { mps._log('Invalid selector provided.'); return false; }
  // jQuery available
  if(typeof(jQuery) === 'function') {
    if((jQuery(elem).length > 0)) {
      jQuery(elem).remove(); return false;
    } else {
      mps._log('Invalid selector provided.'); return false;
    }
  }
  // querySelectorAll, getElementsByClassName, getElementsByTagName
  if(typeof elem.length === 'number' && elem.length > 0) {
    for (var j = elem.length-1; j >= 0; j--) {
      if (elem[j].parentNode) {
        elem[j].parentNode.removeChild(elem[j]);
      }
    }
    // mps._select or getElementById
  } else if(elem.nodeType) {
    if(elem.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  } else {
    mps._log('Invalid selector provided.');
  }
};

//--[Cookies] mps._ck.r(name) | mps._ck.w(name,value,days) | mps._ck.d(name)
  mps._ck = {
    params: function() {
      var query = location.search.substr(1);
      var result = {};
      var queryArray = query.split("&");
      for(i = 0; i < queryArray.length; i++) {
        var item = queryArray[i].split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      }
      return result;
    },
    c: function() {
      document.cookie = "cookietest=1";
      var ret = document.cookie.indexOf("cookietest=") != -1;
      // Delete cookie
      document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return ret;
    },
    w: function(name, val, days) {
      mps._debug("[MPS/Cookies] w is called for: " + name);
      var p = this.params();
      var dateObj = new Date;
      dateObj.setTime(dateObj.getTime() + 864E5 * days);

      if(mps._ck.c() === true &&
        (typeof p.nocookies === "undefined" || p.nocookies !== "1")) {
        var entireCookie = name + "=" + val + "; expires=" + dateObj.toGMTString() + "; path=/;";
        mps._debug("[MPS/Cookies] w is called and val is: " + val);
        document.cookie = entireCookie;
      } else {
        mps._debug("[MPS/Cookies] cookies disabled - write");
        if (typeof(localStorage) !== "undefined") {
          mps._debug("[MPS/Local Storage] Writing " + name + " to local storage, value: " + val);
          localStorage.setItem(name, val);
        } else {
          mps._debug("[MPS/Local Storage] Sorry! No Web Storage support..nothing written");
        }
      }
    },
    r: function(name) {
      var p = this.params();
      mps._debug("[MPS/Cookies] r is called for name: " + name);
      if(mps._ck.c() === true &&
        (typeof p.nocookies === "undefined" || p.nocookies !== "1")) {
        var entireCookie  = name + "=";
        for (var pairs = document.cookie.split(";"), x = 0; x < pairs.length; x++) {
          for (var pair = pairs[x];
               " " == pair.charAt(0);) pair = pair.substring(1, pair.length);
          if (0 == pair.indexOf(entireCookie)) {
            var val = pair.substring(entireCookie.length, pair.length);
            mps._debug("[MPS/Cookies] read cookie val: " + val);
            return val
          }
        }
      } else {
        if (mps._isdebug) {
          mps._debug("[MPS/Cookies] cookies disabled - read");
        }
        if (typeof(localStorage) !== "undefined") {
          var value =  localStorage.getItem(name);
          mps._debug("[MPS/Local Storage] local storage set for " + name + ": " + value);
          return localStorage.getItem(name);
        } else {
          mps._debug("[MPS/Local Storage] Sorry! No Web Storage support..nothing read");
        }
      }
      return null
    },
    d: function(name) {
      mps._debug("[MPS/Cookies] d is called for name: " + name);
      mps._debug("[MPS/Cookies] mps._ck.d calls mps._ck.w");
      mps._debug("[MPS/Local Storage] cannot be deleted (only renamed)");
      mps._ck.w(name, "", -1)
    }
};

//--[MPS Execution Helpers] mps._protocol() mps._checkua()
mps._protocol = function(){
  var c=null,a=window,b=null;try{for(;null!=a&&a!==c;){b=a.location.protocol;if("https:"===b)break;else if("http:"===b||"file:"===b)return"http:";c=a;a=a.parent}}catch(d){}return"https:"
};

mps._checkua = function() {
  if (mps.__ua) return mps.__ua;
  var iecheck = navigator.appVersion.match(/MSIE ([\d]+)/);
  var ret = {};
  ret.os = mps._os;
  ret.mobile = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) < 1025 || window.navigator.userAgent.match('Mobile')) ? true : false;
  if (!!navigator.userAgent.match(/Trident\/7\./)){
    ret.oldie = 11;
  }else if(iecheck){
    ret.oldie = parseInt(iecheck[1]);
  }else{
    ret.oldie = false;
  }
  mps.__ua = ret;
  return ret;
};

// _getBoundingRect(selector) returns offset top and left (used in lazyload.js, ab.js, rails.js)
mps._getBoundingRect = function(s) {
  var sel = s, bRect = document.body.getBoundingClientRect(), elemRect = sel.getBoundingClientRect(),
      rectY = Math.round(elemRect.top), rectX = Math.round(elemRect.left), offsetY = rectY - bRect.top, offsetX = rectX - bRect.left;
  return {
    top: offsetY,
    left: offsetX
  };
};

// _getDocHeight() returns document height, cross browser
mps._getDocHeight = function(){
  var D = document;
  return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
  );
};

//--Check for debugmode.
mps._isdebug = function() { return typeof(debugmode)==='object' && parseInt(debugmode.log) === 2; };

//--[Get Query String Parameter] mps._get([parameter],[url],[decode],keyonly))
mps._get=function(n,r,e,t){if("undefined"==typeof e&&(e=!0),"string"!=typeof r&&(r=""),r=r.length?r:window.location.search,0>r.indexOf("?"))return!1;r=r.split("?")[1].split("&");for(var i=function(n){return t===!0&&"undefined"==typeof n?!0:n},o=!0,p=0;p<r.length;p++){if(parr=r[p].split("="),parr[0]==n)return e?decodeURIComponent(i(parr[1])):i(parr[1]);o=!1}return o?void 0:!1};

//--[Serializes object for query string] mps._serialize=function({key:{val}}, 'cag'), encodes and lowercases all key/val
mps._serialize=function(obj,prefix){var str=[],p,v;for(p in obj)if(obj.hasOwnProperty(p)){var k=prefix?prefix+"["+p+"]":p;v=obj[p];if(typeof v==="object")v=JSON.stringify(v); if(typeof v.toString==="function")v=v.toString();if(v!==null&&v instanceof Array){var pipeval="";for(var i=0;i<v.length;i++)pipeval+=i==v.length-1?v[i].toLowerCase():v[i].toLowerCase()+"|";str.push(encodeURIComponent(k)+"="+encodeURIComponent(pipeval))}else if(v!==null&&typeof v==="object"&&!(v instanceof Array))str.push(mps._serialize(v, k));else str.push(encodeURIComponent(k)+"="+encodeURIComponent(v.toLowerCase()))}return str.join("&")};
//--Returns input sorted alphabetically on property names  mps._sortObject(o[object])
mps._sortObject=function(c){var d={},a,b=[];for(a in c)c.hasOwnProperty(a)&&b.push(a);b.sort();for(a=0;a<b.length;a++)d[b[a]]=c[b[a]];return d};

//--[Strings] mps._trim(str,charlist)
mps._trim = function(a,e){var c,d=0,b=0;a+="";c=e?(e+"").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,"$1"):" \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";d=a.length;for(b=0;b<d;b++)if(-1===c.indexOf(a.charAt(b))){a=a.substring(b);break}d=a.length;for(b=d-1;0<=b;b--)if(-1===c.indexOf(a.charAt(b))){a=a.substring(0,b+1);break}return-1===c.indexOf(a.charAt(0))?a:""};

//--[Sets] mps._merge(obj1,obj2,...) mps._keys(obj,[filter])
mps._merge = function(){var d=Array.prototype.slice.call(arguments),g=d.length,a,e={},c="",k=0,f=0,b=0,h=0,l=Object.prototype.toString;a=!0;for(b=0;b<g;b++)if("[object Array]"!==l.call(d[b])){a=!1;break}if(a){a=[];for(b=0;b<g;b++)a=a.concat(d[b]);return a}for(h=b=0;b<g;b++)if(a=d[b],"[object Array]"===l.call(a))for(f=0,k=a.length;f<k;f++)e[h++]=a[f];else for(c in a)a.hasOwnProperty(c)&&(parseInt(c,10)+""===c?e[h++]=a[c]:e[c]=a[c]);return e};
mps._keys = function(a,c,f){var g="undefined"!==typeof c,e=[],h=!!f,d=!0,b="";if(a&&"object"===typeof a&&a.change_key_case)return a.keys(c,f);for(b in a)a.hasOwnProperty(b)&&(d=!0,g&&(h&&a[b]!==c?d=!1:a[b]!=c&&(d=!1)),d&&(e[e.length]=b));return e};

//--[DOM Object Class] mps._classHas(elem,class) mps._classAdd(elem,class) mps._classRemove(elem,class)
mps._classHas=function(a,b){return RegExp(" "+b+" ").test(" "+a.className+" ")};mps._classAdd=function(a,b){return mps._classHas(a,b)||(a.className+=" "+b)};mps._classRemove=function(a,b){if(!0!==mps._classHas(a,b))return!1;var c=" "+a.className.replace(/[\t\r\n]/g," ")+" ";if(mps._classHas(a,b)){for(;0<=c.indexOf(" "+b+" ");)c=c.replace(" "+b+" "," ");a.className=c.replace(/^\s+|\s+$/g,"")}return!0};

//--[Remove Event Handler] mps._eventRemove(elem,eventType,handler)
mps._eventRemove=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1);a.detachEvent&&a.detachEvent("on"+b,c)};

// [check if Element exists in DOM] mps._isElement(elem)
mps._isElement=function(e){try{return e instanceof HTMLElement}catch(t){return typeof e==="object"&&e.nodeType===1&&typeof e.style==="object"&&typeof e.ownerDocument==="object"}};

//--[Load External JS] url(str): file url, onload(func): callback, noasync(bool)
mps._loadJS = function(url,onload,noasync) {
  if(!url) return false;
  noasync = !noasync ? false : true;
  var scr = document.createElement('script');
  if(!noasync) scr.async = true;
  scr.type = 'text/javascript';
  if(url.substring(0,4) == 'http' || url.substring(0,2) == '//') url = url.replace('http://','').replace('https://','').replace('//','');
  scr.src = mps._protocol()+'//'+url;
  scr.onload=function(){
    mps._log('#[mps/loadJS] async:'+!noasync+', '+url.split('/').pop());
    if(typeof(onload)=='function') { onload.call(scr); }
  };
  scr.onerror = function(){ mps._loadError(scr.src); }

  document.getElementsByTagName('head')[0].appendChild(scr);
  return true;
};

//--[ResetTargetingObj] insertAd & cloneAd to retrieve save originalTargeting
mps._resetTargetingObj=function(a){if("[object Array]"===Object.prototype.toString.call(a)){for(var c=[],b=0,d=a.length;b<d;b++)c[b]=arguments.callee(a[b]);return c}if("object"===typeof a){c={};for(b in a)c[b]=arguments.callee(a[b]);return c}return a};

//--[Detect if Horizontal Scrollbar exists] returns boolean, 15px for mac, 17px for windows
mps._hscroll=function(docElem){
  return docElem&&window&&docElem.clientHeight<window.innerHeight?Math.round(window.innerHeight-docElem.clientHeight):0;
};

//--[Detect if Vertical Scrollbar exists] returns boolean, 15px for mac, 17px for windows
mps._vscroll=function(docElem){
  return docElem&&window&&docElem.clientWidth<window.innerWidth?Math.round(window.innerWidth-docElem.clientWidth):0;
};

//--[Get Viewport Size] returns array of [width, height]
mps._viewport=function(){
  var d=window,a=document,e=a.documentElement,a=a.getElementsByTagName("body")[0],b=mps._hscroll(e)?mps._hscroll(e):0,c=mps._vscroll(e)?mps._vscroll(e):0;
  return [d.innerWidth-c||e.clientWidth-c||a.clientWidth-c,d.innerHeight-b||e.clientHeight-b||a.clientHeight-b];
};

//--[Browser Safe Debugging] !error ^warning  #debug ~log
// (internal) call using: mps._log / mps._l
mps.__console = {
  log: function() {
    if(mps.__nolog) {
      return false;
    }
    var args = Array.prototype.slice.call(arguments);
    for(var arg in args) {
      var m = args[arg];
      if(window.console && console.log && console.warn && console.debug && console.error) {
        if(typeof(m)!='string') {
          if(mps.__console._last && typeof(console[mps.__console._last])){
            console[mps.__console._last](m);
          }
          else {
            console.log(m);
            mps.__console.overlay(m, 'log');
          }
          continue;
        }
        var f = m.charAt(0);
        if(f=='~') {
          console.log(m.substring(1));
          mps.__console.overlay(m.substring(1), 'log');
          mps.__console._last = false;
        } else if(f=='!') {
          mps.__console._last='error';
          mps.__console.overlay(m.substring(1), 'error');
          console.error(m.substring(1));
        } else if(f=='^') {
          mps.__console._last='warn';
          mps.__console.overlay(m.substring(1), 'warn');
          console.warn(m.substring(1));
        } else if(f=='#') {
          mps.__console._last='debug';
          mps.__console.overlay(m.substring(1), 'debug');
          console.debug(m.substring(1));
        } else {
          mps.__console.auto(m);
        }
      } else if(window.console && console.log) {
        console.log(m);
        mps.__console.overlay(m, 'log');
        mps._console._last=false;
      } else {
        return false;
      }
    }
    return true;
  },
  debug: function() {
    if(!mps._isdebug()) {
      return false;
    }
    var args = Array.prototype.slice.call(arguments);
    return mps.__console.log.apply(this, args);
  },
  //(internal) don't call directly
  overlay: function(m, type){
    type = type || '';
    m = (typeof m != 'undefined') ? m.toString() : '';

    var prefix = (m.match(/\[(.*?)\]/)) ? m.match(/\[(.*?)\]/)[0] : '[MPS]';
    var debugPanel = document.getElementById('debugPanel');
    var debugMsgInx = mps._keys(mps.debugMsg).length || 0;
    var debugMarkup = '';
      mps.debugMsg.push({
        'm': m,
        'type': type,
        'prefix': prefix
      });
      if( debugPanel ){
        var date = new Date(),
            mil = date.getMilliseconds(),
            sec = date.getSeconds(),
            min = date.getMinutes(),
            hrs = date.getHours(),
            now = hrs+':'+min+':'+sec+'.'+mil;
        if(typeof 's'.indexOf == 'function' && m.indexOf('loadmore') === -1) {
          debugMarkup = '<p class="'+ type +'" title="'+now+'">' + m + '</p>';
        } else {
          debugMarkup = m;
        }
        if(debugMsgInx > 0){
          for(var i in mps.debugMsg){
            if(mps.debugMsg.hasOwnProperty(i)) {
              if (typeof 's'.indexOf == 'function' && mps.debugMsg[i].m.indexOf('loadmore') === -1) {
                debugMarkup += '<p class="' + mps.debugMsg[i].type + '" title="' + now + '">' + mps.debugMsg[i].m + '</p>';
              } else {
                debugMarkup += mps.debugMsg[i].m;
              }
            }
          }
          if(mps._ext._jq){
            $('#debugPanel').html(debugMarkup);
          }else{
            document.getElementById('debugPanel').outerHTML = debugMarkup;
          }
        }
        debugPanel.scrollTop = debugPanel.scrollHeight;
        return true;
      }
  },
  // (internal) do not call directly
  auto: function(m) {
    var typemap = {
      // debug
      '#': [,'called','loaded','disabled','enabled','init','callback','calling '],
      // warning
      '^': ['warning','skip','bypass'],
      // error
      '!': ['error','invalid','fail','terminated']
    };
    for(var t in typemap) {
      for(var tv in typemap[t]) {
        if(m.toLowerCase().indexOf(typemap[t][tv]) > -1) {
          return mps.__console.log(t+m);
        }
      }
    }
    return mps.__console.log('~'+m);
  },
  _last: false
};

//--SHORTCUTS
mps._log=mps._l=mps._console=mps.__console.log;
mps._vp=mps._viewport;
mps._debug=mps._d=mps.__console.debug;

//--[Queues]
if(!mps._loadset) {
  mps._queue.exec = function(args, param) {
    if (typeof(args) === 'function') {
      try {
        typeof(param) === 'undefined' ? args.call() : args.call(this, param);
      } catch (err) {
        mps._errorCallback(err);
      }
    }
  };
  // Copy queued functions from mps._gptcmd.
  mps._gptcmdtmp = mps._gptcmd;
  mps._gptcmd = [];
  mps._gptcmd.push = function() {
    var _args = arguments[0];
    var _func = function() {
      try {
        _args.call();
      } catch(err) {
        mps._errorCallback(err, 'mps._gptcmd.push');
        googletag.cmd.push(_args);
      }
    };
    googletag.cmd.push(_func);
    return Array.prototype.push.apply(this, arguments);
  };
  // Push queued functions to mps._gptcmd after being extended.
  while(mps._gptcmdtmp.length) {
    mps._gptcmd.push(mps._gptcmdtmp[0]);
    mps._gptcmdtmp.shift();
  }
  mps._queue['mpsinit'].push = function () {
    if (mps._ext && mps._ext.loaded === 1) {
      mps._queue.exec(arguments[0]);
    }
    return Array.prototype.push.apply(this, arguments);
  };
  mps._queue['abdetect'].push = function () {
    if (mps._ab && mps._ab.run) {
      mps._queue.exec(arguments[0], mps._ab.type);
    }
    return Array.prototype.push.apply(this, arguments);
  };
  mps._queue.gptloadset[0] = mps._queue.gptloadset[0] || [];
  if (typeof(mps._queue.gptloaded.length) !== 'undefined') {
    for (var i = 0; i < mps._queue.gptloaded.length; i++) {
      mps._queue.gptloadset[0].push(mps._queue.gptloaded[i]);
    }
    mps._queue.gptloaded = [];
  }
  mps._queue['gptloaded'].push = function () {
    if (arguments[0]) {
      if (mpsopts.legacyqueues === 1) {
        var gptLoadset = mps._reqset;
      } else {
        var gptLoadset = mps._gptloaded ? mps._reqset + 1 : mps._reqset;
      }
      mps._queue.gptloadset[gptLoadset] = mps._queue.gptloadset[gptLoadset] || [];
      // GPT callback already executed for this loadset.
      if ((mps._reqset === mps._loadset) && mps._gptloaded) {
        mps._gptcmd.push(arguments[0]);
      } else {
        mps._queue.gptloadset[gptLoadset].push(arguments[0]);
      }
    }
    return Array.prototype.push.apply(this);
  };
  mps._queue['mpsready'].push = function () {
    if (arguments[0] && mps._ext.mpsready === true) {
      try {
        arguments[0].call();
      } catch (err) {
        mps._errorCallback(err, 'mps._queue.mpsready');
      }
    } else {
      return Array.prototype.push.apply(this, arguments);
    }
  };
}
mps._queue.render = function(type, param1, param2, param3, param4) {
  if(type !== 'adviewchange') {
    mps._debug('[mps/QUEUE] (processing queue items) ' + type + ' ' + mps._elapsed());
  }
  try {
    switch (type) {
      case 'mpsinit':
        for (var i = 0; i < mps._queue.mpsinit.length; i++) {
          mps._queue.mpsinit[i].call();
        }
        break;
      case 'mpsready':
        while(mps._queue.mpsready.length) {
          mps._queue.mpsready.shift().call();
        }
        break;
      case 'error':
        for (var j = 0; j < mps._queue[type].length; j++) {
          mps._queue[type][j].call(this, param1, param2, param3, param4);
        }
        break;
      case 'adviewchange':
        for (var k = 0; k < mps._queue[type].length; k++) {
          mps._queue[type][k].call(this, param1, param2, param3, param4);
        }
        break;
      default:
        for (var d = 0; d < mps._queue[type].length; d++) {
          typeof(param2 === 'number') ? mps._queue[type][d].call(this, param1, param2, param3) : mps._queue[type][d].call(this, param1);
        }
        if (type === 'adclone') {
          mps._queue.clear(type);
        }
        break;
    }
  } catch(err) {
    mps._errorCallback(err, 'mps._queue.render(' + type + ')');
  }
};
mps._queue.clear = function(type) {
  if(type) {
    mps._debug('[mps/QUEUE] (clear ' + type + ')');
    mps._queue[type] ? mps._queue[type] = [] : mps._debug('[mps/QUEUE] (clear ' + type + ') is not a valid queue.');
  } else {
    mps._debug('[mps/QUEUE] (clear all)');
    for(var i in mps._queue) {
      if(typeof(mps._queue[i])==='object'&&i!='mpsloaded') {
        mps._queue[i] = [];
      }
    }
  }
};

/* ----- Error handling ----- */
// Execute error tracking pixel.
mps._errorpixel = function(_errsrc) {
  var _errimg = '<img width="1" height="1" src="'+encodeURI(_errsrc)+'" />';
  mps._append(mps._select('body'), _errimg);
};

// Error callback.
mps._errorCallback = function(err, func) {
  if(err.name) {
    if(err.message) {
      mps._debug('![mps/!] ERROR ' + func + ' - Uncaught ' + err.name + ': ' + err.message + ' (' + mps._elapsed() + ')');
    } else {
      mps._debug('![mps/!] ERROR ' + func + ' - Uncaught ' + err.name + ' (' + mps._elapsed() + ')');
    }
  }
  if(typeof mps.errorCallback === 'function') {
    mps.errorCallback(err.name, err.message, err.lineNumber, func);
  }
  if(mps._queue.error.length) {
    for(var i = 0; i < mps._queue.error.length; i += 1) {
      mps._queue.render('error', err.name, err.message, err.lineNumber, func);
    }
  }
  // Error tracking url for Splunk
  if(mps._reportingbaseurl.trim() !== '') {
    var _errsrc = mps._protocol() + '//' + mps._reportingbaseurl,
        _mpsid = (mps.pagevars && mps.pagevars.mpsid) ? mps.pagevars.mpsid: '',
        _authuser = (mps.pagevars && mps.pagevars.authuser) ? mps.pagevars.authuser: '';
    _errsrc += '?mpsid=' + _mpsid;
    _errsrc += '&mpspath=' + encodeURIComponent(mpscall.path);
    _errsrc += '&site=' + mpscall.site;
    _errsrc += '&authusr=' + _authuser;

    if (err.name) {
      _errsrc += '&errtype=' + err.name;
      if (err.message) {
        _errsrc += '&errmsg=' + func + ' - ' + encodeURIComponent(err.message);
      }
      if (err.stack) {
        _errsrc += '&errstack=' + encodeURIComponent(err.stack);
      }
      if (err.lineNumber) {
        _errsrc += '&errline=' + err.lineNumber;
      }
    }
    if (typeof(mps._delays._reportingdelay) === 'number' && (mps._elapsed('', true) > mps._delays._reportingdelay)) {
      mps._errorpixel(_errsrc);
    } else {
      mps._queue.errorpixels.push(function () {
        mps._errorpixel(_errsrc);
      });
    }
  }
};

// Set pixel reporting delay atleast 2s from mps._ready.
mps._ready(function() {
  mps._ext.mpsready = true;
  mps._delays._reportingdelay = (mps._elapsed('', true) + mps._delays.reportingdelay);
  var _execpixels = setTimeout(function() {
    while(mps._queue.errorpixels.length) {
      mps._queue.errorpixels.shift().call();
    }
    clearTimeout(_execpixels);
  }, mps._delays._reportingdelay);
});

// Update and Get correctlor, store correlators by loadset
mps._correlator = {
  sets: this.sets || {},
  update: function(){
    mps._gptcmd.push(function(){
      googletag.pubads().updateCorrelator();
    });
    if(googletag && typeof googletag.pubads().updateCorrelator() == 'object'){
      mps._debug('[mps:Loader] Update Correlator: public');
      return googletag.pubads().getCorrelator();
    }else{
      mps._debug('[mps:Loader] FAILED Update Correlator: public');
      return false;
    }
  },
  get: function(){
    if(typeof googletag.pubads() == 'object' && typeof googletag.pubads().getCorrelator() == 'string'){
      mps._debug('[mps:Loader] Get Correlator');
      return googletag.pubads().getCorrelator();
    }else{
      mps._debug('[mps:Loader] FAILED Get Correlator');
      return false;
    }
  }
};

mps._setPageTargeting = function(key,val) {
  try {
    // normalize all val inputs into array and validate
    if (!key || !val) {
      return false;
    }
    if (typeof(val) == 'boolean') {
      val = val + 0;
    }
    if (typeof(val) == 'number') {
      val = val.toString();
    }
    if (typeof(val) == 'string') {
      val = [val];
    }
    // array check
    if (val.constructor !== Array) {
      return false;
    }
    // normalize and validate key
    if (typeof(key) == 'boolean') {
      key = key + 0;
    }
    if (typeof(key) == 'number') {
      key = key.toString();
    }
    if (typeof(key) != 'string' || !key.length) {
      return key;
    }
    if (val.length === 1) {
      val = val[0].split(',');
    }
    // strip unsupported characters from key & val
    key = key.replace(/[^a-zA-Z0-9\.~_-]/gi, '');
    for (i = 0; i < val.length; i++) {
      val[i] = val[i].replace(/[^a-zA-Z0-9\.~_-]/gi, '');
    }
  } catch(err) {
    mps._errorCallback(err, 'mps._setPageTargeting');
    return false;
  }
  mps._gptcmd.push(function () {
    // call gpt page targeting
    if (mps._keys(mps._targeting).indexOf(key) === -1) {
      googletag.pubads().setTargeting(key, val);
      // save page targeting
      mps._targeting[key] = mps._targeting[key] || [];
      mps._targeting[key] = mps._merge(mps._targeting[key], val);
    }
  });
};

mps._clearPageTargeting = function(key) {
  if(typeof(key)=='boolean') {
    key=key+0;
  }
  if(typeof(key)=='number') {
    key=key.toString();
  }
  // If no arg passed, clear all targeting
  if(key == undefined) {
    if(!mps._targeting || typeof(mps._targeting)!='object') {
      return false;
    }
    for(var k in mps._targeting) {
      if(k.length) {
        mps._clearPageTargeting(key);
      }
    }
  } else {
    key=key.replace(/[^a-zA-Z0-9\.~_-]/gi,'');
    delete mps._targeting[key];
    mps._gptcmd.push(function() {
      googletag.pubads().clearTargeting(mps._targeting[key]);
    });
  }
};

//--mps._clone(a[obj]) returns deep copy
mps._clone=function(a){if(null==a||"object"!=typeof a)return a;var c=a.constructor(),b;for(b in a)a.hasOwnProperty(b)&&(c[b]=a[b]);return c};

// _haskeyval(obj[a],key[b],val[c]) Returns true if obj has a key called "key" and that key has "val" as its value.
mps._haskeyval=function(a,b,c){return a.hasOwnProperty(b)&&a[b]==c};

mps._debug('[mps/JS] LOADED: MPStools');

mps._bool = function(val,intval) {
  if(typeof(val)=='boolean') {
    val = val ? 1 : 0;
  }
  if(typeof(val)=='string') {
    if(val=='true') {
      val = 1;
    }
    if(val=='false') {
      val = 0;
    }
  }
  val = parseInt(val,10);
  if(!intval) {
    return val === 1 ? true : false;
  } else {
    return typeof(val) === 'number' ? val : parseInt(val, 10);
  }
};

// Active refresh.
mps._debug('[mps:active refresh]: active refresh is enabled.');
mps._activerefresh = mps._activerefresh || {};
mps._activerefresh._focus = document.hasFocus();
mps._activerefresh._callback = function(func, name) {
  try {
    func();
  } catch(err) {
    mps._errorCallback(err, name);
  }
};

mps._activerefresh._wfocus = function() {
  mps._activerefresh._focus = true;
  if(typeof mps.detectwinfocusCallback === 'function') {
    mps._activerefresh._callback(mps.detectwinfocusCallback, 'mps.detectwinfocusCallback');
  }
};
mps._activerefresh._wblur = function() {
  mps._activerefresh._focus = false;
  if(typeof mps.detectwinblurCallback === 'function') {
    mps._activerefresh._callback(mps.detectwinblurCallback, 'mps.detectwinblurCallback');
  }
};
mps._activerefresh.blisten = window.addEventListener ? window.addEventListener('blur', mps._activerefresh._wblur) : window.attachEvent('onblur', mps._activerefresh._wblur);
mps._activerefresh.flisten = window.addEventListener ? window.addEventListener('focus', mps._activerefresh._wfocus) : window.attachEvent('onfocus', mps._activerefresh._wfocus);

mps.submit = mps.submit || {};
mps.submit._requested = mps.submit._requested || {};
mps.submit._responses = mps.submit._responses || {};
mps.submit._legacy = mps._checkua().oldie === false || mps._checkua().oldie && mps._checkua().oldie > 10 ? false : true;
mps.submit._getparams = function(getobj) {
  var _paramstr = '';
  for(var i in getobj) {
    _paramstr += encodeURIComponent(i);
    _paramstr += getobj[i] ? '=' + encodeURIComponent(getobj[i]) + '&' : '&';
  }
  return _paramstr.slice(0, -1);
};
mps.submit._response = function(_response, _statuscode, _key, _callback) {
  mps._debug('[mps:submit]: response received from url: ' + mps.submit._requested[0].url + ' with status code: ' + _statuscode);
  var _res = {
    response: _response,
    statuscode: _statuscode,
    elapsed: mps._elapsed('', true)
  };
  mps.submit._responses[_key] = _res;
  if(_callback) {
    return _callback.call(this, _statuscode, _response);
  }
  return _statuscode;
};
mps.submit._jq = function(_requested, _key, _callback, _timeout) {
  if(mps.submit._legacy === true) {
    jQuery.support.cors = true;
  }
  return jQuery.ajax({
    type: _requested.type,
    url:  _requested.url,
    data: _requested.type === 'POST' ? _requested.data : false,
    timout: _requested.timeout,
    dataType: mps.submit._legacy === true ? 'jsonp':'json',
    success: function(data, textStatus, xhr) {
      mps.submit._response(data, xhr.status, _key, _callback);
    },
    error: function(data, exception) {
      var _res = exception;
      var _xhrstatus = data && data.statusText ? data.statusText : false;
      mps.submit._response(_res, _xhrstatus, _key, _callback);
    }
  });
};
mps.submit._xhr = function(_requested, _key, _callback, _timeout) {
  var _newxhr;
  var _send = _requested.type === 'POST' ? mps.submit._getparams(_requested.data) : null;
  if(mps.submit._legacy === false) {
    _newxhr = new XMLHttpRequest();
    _newxhr.timeout = _requested.timeout;
    _newxhr.responseType = 'json';
    _newxhr.onreadystatechange = function() {
      if(_newxhr.readyState == 4) {
        var _responseobj = _newxhr.status === 200 ?_newxhr.response : _newxhr.statusText;
        return mps.submit._response(_responseobj, _newxhr.status, _key, _callback);
      }
    };
    _newxhr.open(_requested.type, _requested.url, true);
    _newxhr.send(_send);
    return _newxhr;
  } else {
    _newxhr = new XDomainRequest();
    _newxhr.onload=function() {
      return mps.submit._response(_newxhr.responseText, 200, _key, _callback);
    };
    _newxhr.onerror=function() {
      return mps.submit._response(_newxhr.responseText, 0, _key, _callback);
    };
    _newxhr.open(_requested.type, _requested.url, true);
    _newxhr.send(_send);
    return _newxhr;
  }
};

mps.submit.request = function(endpointurl, kvdata, usepost, timeoutsecs, callback) {
  var _endpointurl = typeof(endpointurl) === 'string' && endpointurl.length ? endpointurl : false;
  var _kvdata = typeof(kvdata) === 'object' && mps._keys(kvdata).length ? kvdata : false;
  var _type = mps._bool(usepost) === true ? 'POST': 'GET';
  var _timeoutsecs = typeof(timeoutsecs) === 'number' && timeoutsecs > 0 ? timeoutsecs * 1000 : 4000;
  var _callback = typeof(callback) === 'function' ? callback : false;
  if(_endpointurl && _kvdata) {
    _endpointurl = _type === 'POST' ? _endpointurl : _endpointurl + '?' + this._getparams(_kvdata);
    var _key = mps._keys(mps.submit._requested).length;
    var _requested = {
      url: _endpointurl,
      data: _kvdata,
      type: _type,
      timeout: _timeoutsecs,
      elapsed: mps._elapsed('', true)
    };
    mps.submit._requested[_key] = _requested;
    if(typeof(jQuery) === 'function') {
      return mps.submit._jq(_requested, _key, _callback);
    } else {
      return mps.submit._xhr(_requested, _key, _callback);
    }
  } else {
    mps._debug('[mps:submit]: invalid url or key value data specified.');
    return false;
  }
};

mps._elapsed(); // Begin execution timer

mps._ext.mpsRequestParams = function(mpscall) {
  mps._debug('[mps/Loader] mpsRequestParams()');
  //(paths) mps._ext._pathsegs
  sitepath = mpscall.path || window.location.pathname;
  if(sitepath!='' && sitepath!='/' && sitepath.indexOf('/') > -1) {
    if(sitepath.substr(-1)=='/') sitepath=sitepath.substr(0, sitepath.length-1);
    if(sitepath.substr(0,1)=='/') sitepath=sitepath.substr(1,sitepath.length-1);
    sitepatharr = sitepath.split('/');
    mps._ext._pathsegs=[];
    var cleanpatharr=[],cutpatharr=[];
    for (var i=0; i<sitepatharr.length; i++) {
      mps._ext._pathsegs[i+1] = sitepatharr[i];
      if(i < mpsopts.maxpathsegs) {
        cleanpatharr[i+1]= sitepatharr[i];
      } else {
        cutpatharr[i+1] = sitepatharr[i];
      }
    }
    cleanpath = cleanpatharr.join('/');
    mpscall.path = cleanpath;
  } else {
    mps._ext._pathsegs = (sitepath!='/' && sitepath!='') ? [undefined,sitepath] : [undefined];
    mpscall.path = sitepath;
  }
  var qs = window.location.search.substring(1).split('&'),qsv;
  mps._ext._qsparams={};
  for(var i=0; i<qs.length; i++){
    qsv = qs[i].split('=');
    if(typeof(qsv[1])!='undefined') mps._ext._qsparams[qsv[0]] = qsv[1];
  }
  return mpscall;
}

mps._ext.mpsDeriveParams = function() {
  derived={};
  if(mpsopts.deriveoff) return derived;
  mps._debug('[mps/Loader] EXECUTE mpsDeriveParams()');

  // Extract mpscall params using format defined in mpsopts.deriveparams
  if(typeof(mpsopts.deriveparams)=='object') {
    var catkeys=['cat1','cat2','cat3','cat4','cat5','cat6'], catstring='';
    for(var k in mpsopts.deriveparams) {
      if(isNaN(k)) { //qs
        if(typeof(mps._ext._qsparams[k])=='string') derived[mpsopts.deriveparams[k]] = mps._ext._qsparams[k];
      } else { //url
        if(typeof(mps._ext._pathsegs[k])=='string') derived[mpsopts.deriveparams[k]] = mps._ext._pathsegs[k];
      }
    }
    for (var i=0; i<catkeys.length; i++) {
      if(typeof(derived[catkeys[i]])=='string') {
        catstring+=derived[catkeys[i]].replace('|','~');
        delete(derived[catkeys[i]]);
      }
      catstring+='|';
    }
    derived.cat = mps._trim(catstring,'| ').replace('||','|~|');
    mps._debug('[mps/Loader] (derived params) '+JSON.stringify(derived));
  }
  return derived;
}

mps._ext.mpsQueryString = function(mpscall) {
  if(typeof(mpscall)!='object') return '';
  var mpscallenc='';
  for(var key in mpscall) {
    if(typeof(mpscall[key])=='object') {
      for(var keyk in mpscall[key]) {
        mpscall[key+'['+keyk+']'] = mpscall[key][keyk];
      }
      delete mpscall[key];
    }
  }
  for (var k in mpscall) {
    if(typeof(mpscall[k])!='undefined' && mpscall[k] != '') {
      // Truncate really long strings at 250 chars
      if(typeof(mpscall[k]=='string') && mpscall.length > 0) mpscall[k]=mps._trim(mpscall[k].substring(0,250));
      mpscallenc+=encodeURIComponent(k)+'='+encodeURIComponent(mpscall[k]) + '&';
    }
  }
  if(mpscallenc.substr(-1)=='&') mpscallenc = mpscallenc.substr(0, mpscallenc.length - 1);
  return mpscallenc;
}

mps._ext.mpsRequestUrl = function(LOADMODE) {
  if(typeof(mpscall)!='object') return '';
  if(typeof(LOADMODE)=='string') {
    mpscall.LOADMODE=LOADMODE;
  } else {
    delete mpscall.LOADMODE;
    LOADMODE='';
  }
  mpscall.NOLOAD='mpstools';
        mpscall.ASYNC=1;
    mps._ext._async=1;
    mps.qs = mps._ext.mpsQueryString(mpscall);
  var subset = (typeof(mpsopts.subset)=='string' && mpsopts.subset.length>0) ? '/'+mpsopts.subset : '';
  mps.requesturl = mpsinstance + '/request/page/jsonp'+subset+'?CALLBACK=' + mpsopts.callback + '&'+ mps.qs;
  mps._debug('[mps/Loader] mpsRequestUrl('+LOADMODE+'): '+mps.requesturl);
  return mps.requesturl;
};

mps._ext.mpsOnReady = function(usejq) {
  mps._debug("[mps/Loader] CALLED mpsOnReady() "+mps._elapsed());
  usejq = (typeof(usejq)=='undefined'||usejq!=1) ? 0 : 1;
  if(mps._ext.loaded == 1 && mps._ext.loadfooter == 0) {
    if(usejq == 1) {
      mps._debug('[mps/Loader] No Footer Execution Detected - Attaching Footer (jquery)');
      jQuery('body').append(mps.response.pagevars.insert_bodyfooter);
    } else {
      mps._append(mps._select('body'),mps.response.pagevars.insert_bodyfooter);
      mps._debug('[mps/Loader] No Footer Execution Detected - Attaching Footer (non-jquery)');
    }
    mps._ext.loadfooter=1;
  }
  if(mps._ext.nowrite=="0"){
    mps._ext.nowrite="2";
  }
};

//--> SET REQUEST VARS & OPTS
mps._debug(($dM=(new Array(8).join('*')))+' [mps] Debug Mode: ('+debugmode.log+') '+$dM);
if(typeof(mpsopts.host)=='string'&&mpsopts.host.length>0) mpsinstance=mpsopts.host;
if(typeof(mpsinstance)!='string'||mpsinstance=='') mpsinstance='mps.nbcuni.com';

//--> JSONP CALLBACK
function mpsCallback(data, update) {
  mps._debug('[mps/Loader] JSONP Callback Execution '+mps._elapsed());
  if(typeof(data)=='object' && typeof(data.pagevars.insert_head)!='undefined' && typeof(data.pagevars.insert_head)!='undefined') { // TODO: More response validation
    mps.response = data;
    mps.adslothtml = {};
    if(typeof(mps)=='object' && typeof(mps.response)=='object' && typeof(mps.response.dart)=='object' && typeof(mps.response.dart.adunits)=='object') {
      for(var adunit in mps.response.dart.adunits) {
        mps.adslothtml[adunit] = mps.response.dart.adunits[adunit].data;
      }
    }
    mps._ext.loaded = 1;
    mps.executeInserts();
    //--> DOCUMENT READY EVENT HOOK
    if(typeof(jQuery)!='function') {
      mps._debug('[mps/Loader] NO JQUERY (using native js)');
      mps._ready(function(){
        mps._ext.mpsOnReady(0);
      });
    } else {
      mps._debug('[mps/Loader] JQUERY AVAILABLE');
      jQuery().ready(function() {
        mps._ext.mpsOnReady(1);
      });
    }
    if(!update) {
      if(!mps._loadset) {
        mps._queue.render('mpsready');
      }
      mps._queue.render('mpsinit');
      if(typeof(mps.initCallback) === 'function') {
        try {
          mps.initCallback();
        } catch(err) {
          mps._errorCallback(err, 'mps.initCallback');
        }
      }
    }
  }
}

mps._ext.determineSlot = function(adunit) {
  if(typeof(adunit)=='string' && typeof(mps)=='object' && typeof(mps.adunit)=='object' && typeof(mps.response)=='object' && typeof(mps.response.dart)=='object' && typeof(mps.response.dart.adunits)=='object') {
    if(typeof(mps.response.dart.adunits[adunit])=='object' && typeof(mps.response.dart.adunits[adunit].data)!='undefined' && mps.response.dart.adunits[adunit].data!='') {
      return adunit;
    }
    // Determine whether to use slot name or regular name
    if(typeof(mps.adunits[adunit])=='string') {
      if(typeof(mps.response.dart.adunits[mps.adunits[adunit]])=='object' && typeof(mps.response.dart.adunits[mps.adunits[adunit]].data)!='undefined' && mps.response.dart.adunits[mps.adunits[adunit]].data!='') {
        return mps.adunits[adunit];
      }
      // Get other ad units that have same slot
      for(var i in mps.adunits) {
        if(mps.adunits[i] == mps.adunits[adunit]) {
          if(typeof(mps.response.dart.adunits[mps.adunits[i]])=='object' && typeof(mps.response.dart.adunits[i].data)!='undefined' && mps.response.dart.adunits[i].data!='') {
            return i;
          }
        }
      }
    }
  }
  return adunit;
}

mps._replicateAd = function (adslot,loadset) {
  if(adslot.length>0 && typeof adslot == 'string'){
     loadset = (!isNaN(loadset) && loadset <= mps._keys(mps._adloads).length) ? parseInt(loadset,10) : mps._loadset;
     if(gpt && mps._advars && mps._advars[loadset] && mps._advars[loadset][adslot]){
        mps._clonevars[loadset]=mps._clonevars[loadset]||{};
        mps._clonevars[loadset][adslot] = mps._clonevars[loadset][adslot] || '';
        var count = (mps._clonevars[loadset][adslot].length > 0 && parseInt(mps._clonevars[loadset][adslot].split('_C')[1], 10) > 0) ? parseInt(mps._clonevars[loadset][adslot].split('_C')[1],10)+1 : 1;
        mps._clonevars[loadset][adslot] = mps._advars[loadset][adslot]+'_C'+count;
        mps._debug('[mps/Loader] _replicateAd: gpt.'+mps._clonevars[loadset][adslot]);
        mps.advars[adslot+'-C'+ count] = mps._advars[loadset][adslot+'-C'+ count] =  mps._advars[loadset][adslot]+ '_C' +count;      // create var name
        mps._adslots[loadset][adslot +'-C'+ count] =  mps._adslots[loadset][adslot]+ '-C' +count;   // create slot name
        gpt[mps._clonevars[loadset][adslot]] = gpt[mps._advars[loadset][adslot]];                   // clone object
        return gpt[mps._clonevars[loadset][adslot]];
     }else{
      //_replicateAd SKIPPED: Slot Disabled
      return false;
     }
  }else{
    mps._debug('[mps/Loader] _replicateAd invalid parameters');
    return false;
  }
}

//--> MPS PAGE FUNCTIONS
mps.getAd = function(adunit,_swap,loadset) {
  try {
    var _adunit = adunit;
    var _slotid = 'mps-getad-'+_adunit.replace(/\W/g, '');
    var adslothtml = '<div id="'+_slotid+'" class="mps-wrapper" data-mps-fill-slot="'+_slotid+'"></div>';
    var adunit = mps._ext.determineSlot(adunit);
    var beenrequested = false;

    if (_swap){
      for(var adunitname in mps.adunits){
        if(adunit == mps.adunits[adunitname]){
          adunit = adunitname;
          break;
        } else if (mps.adunits.hasOwnProperty(adunit)) {
          adunit = mps.adunits[adunit];
          break;
        }
      }
    }

    if(typeof(adunit)!='undefined' && typeof(mps)=='object' && typeof(mps.response)=='object' && typeof(mps.response.dart)=='object' && typeof(mps.response.dart.adunits)=='object' && typeof(mps.response.dart.adunits[adunit])=='object' && typeof(mps.response.dart.adunits[adunit].data)!='undefined') {
      var ls = typeof(loadset) === 'number' ? parseInt(loadset, 10) : mps._loadset;
      mps._ext._insertedads[ls] = mps._ext._insertedads[ls] || [];
      if(mps._keys(mps._ext._insertedads[ls]).length && mps._ext._insertedads[ls].indexOf(adunit) >= 0) {
        beenrequested = true;
      } else {
        mps._ext._insertedads[ls].push(adunit);
      }
      if(mps.response.dart.adunits[adunit].data != '') {
        adslothtml = mps.response.dart.adunits[adunit].data;
        //save mps._req adslot begin time
        if(mps.pagevars.dart_mode == 'legacy'){
          var adslotname = 'legacy';
        }else{
          var adslotname = mps.response.dart.adunits[adunit].data.split('data-mps-slot=');
          adslotname = adslotname[1].split('"')[1];
        }
        if(typeof mps._reqs == 'object'){
          mps._reqs[ls]=mps._reqs[ls]||{};
          mps._reqs[ls]['begin_'+adslotname] = mps._reqs[ls]['begin_'+adslotname] || mps._elapsed('',true);
        }
      } else {
        mps._debug("^[mps/Loader] mps.getAd("+_adunit+") SKIPPED: Disabled "+mps._elapsed());
        adslothtml = '<!--(mps.getAd) '+adunit+' disabled-->';
      }
    } else {
      if (_swap){
        mps._debug("^[mps/Loader] mps.getAd('"+_adunit+"') QUEUED: Pending GPT "+mps._elapsed());
        if (!mps._ext || !mps._ext.loaded) {
          mps._queue.gptloaded.push(function() {
            mps.insertAd("#" + _slotid, adunit)
          });
          mps._adsheld2.push(adunit);
        }
        return adslothtml;
      } else {
        return mps.getAd(adunit,true);
      }
    }
    return adslothtml;
  } catch(err) {
      mps._errorCallback(err, 'mps.getAd');
      return false;
  }
}

mps.getComponent = function(sid) {
  componentdata='';
  if(typeof(sid)!='undefined' && sid !='' && typeof(mps)=='object' && typeof(mps.response)=='object' && typeof(mps.response.components)=='object' && typeof(mps.response.components[sid])=='object' && typeof(mps.response.components[sid].data)!='undefined') {
    mps._debug('[mps/Loader] mps.getComponent() LOAD: '+sid);
    if(mps.response.components[sid].data != '') {
      componentdata = mps.response.components[sid].data;
    }
  } else {
    mps._debug('[mps/Loader] mps.getComponent() SKIP: '+sid);
  }
  return componentdata;
}

mps.targetingArray = function(str) {
  if(typeof(str)=='string'&&str.length) {
    _targetingArr = [],_tmpArr = [],map={},_str = str.split(';');
    for(var i=0;i<_str.length;i++) {
      if(_str[i].indexOf('=') > -1) {
        _kv = _str[i].split('=');
        _tmpArr.push(_kv);
      }
    }
    for(var i=0; i<_tmpArr.length; i++) {
      if(_tmpArr[i][0] in map) {
        map[_tmpArr[i][0]].push(_tmpArr[i][1]);
      } else {
        map[_tmpArr[i][0]] = [_tmpArr[i][1]];
      }
    }
    for(var k in map) {
      if(map[k].length > 1) {
        _targetingArr.push([k,map[k]]);
      } else {
        _targetingArr.push([k,map[k][0]]);
      }
    }
    return _targetingArr;
  }
  return false;
};

// Append default targeting - get targeting from gpt and append new values.
mps.prependDefaultTargeting = function(obj, adslot, override) {
  try {
    var _pagecontextKey = mps._pagecontextKey();
    if(_pagecontextKey === false)  { return false; }
    var _currentTargeting = typeof(mps._pagecontext[_pagecontextKey]['targeting'][adslot]) === 'object' ? mps._clone(mps._pagecontext[_pagecontextKey]['targeting'][adslot]) : {};
    if(!_currentTargeting || mps._keys(_currentTargeting).length ===   0) {
      mps._debug('[MPS/Loader] setTargeting('+adslot+') SKIPPED: Disabled');
      return false;
    }
    var _currentTargetingKeys = mps._keys(_currentTargeting);
    // Merge existing objects.
    for(var i in obj) {
      // Merge param.
      if(typeof obj[i] !== 'function' && typeof obj[i] !== 'undefined' && obj[i] != null) {
        if(_currentTargetingKeys.indexOf(obj[i][0]) > -1 && !override) {
          var tmpArr = [];
          if(typeof obj[i][1] === 'string') {
            tmpArr = [obj[i][1]];
          } else {
            tmpArr = obj[i][1];
          }
          var _currTargetingObj = _currentTargeting[obj[i][0]];
          for(var j=0; j<_currTargetingObj.length;j++) {
            if(tmpArr.indexOf(_currTargetingObj[j]) === -1) {
              tmpArr.push(_currTargetingObj[j]);
            }
          }
          _currentTargeting[obj[i][0]] = tmpArr;
        // New param or override param.
        } else {
          if(obj[i][1] && typeof obj[i][1] === 'string') {
            _currentTargeting[obj[i][0]] = [obj[i][1]];
          } else {
            _currentTargeting[obj[i][0]] = obj[i][1];
          }
        }
      }
    }
    return _currentTargeting;
  } catch(err) {
    mps._errorCallback(err, 'mps.prependDefaultTargeting');
    return false;
  }
};

// Copy adobjects from loadset.
// TODO - implement function in mps.updateRequest.
mps._copyadobs = function(loadset) {
mps._loadset++;
mps.adobs = mps._clone(mps._adobs[loadset]);
mps.adslots = mps._clone(mps._adslots[loadset]);
mps.advars = mps._clone(mps._advars[loadset]);
mps._adobs[mps._loadset] = mps.adobs;
mps._adslots[mps._loadset] = mps.adslots;
mps._advars[mps._loadset] = mps.advars;
mps.adslots = {};
for(var i in mps._adslots[loadset]) {
var _adslot = mps._adslots[loadset][i];
_adslot = _adslot.split('-');
_adslot[_adslot.length - 1] = mps._loadset;
_adslot = _adslot.join().replace(/,/g,'-');
mps.adslots[i] = _adslot;
}
mps._adslots[mps._loadset] = mps.adslots;

mps._slotscalled[mps._loadset] = mps._slotscalled[mps._loadset] || {};
mps.slotsdisabled[mps._loadset] = [];
};

// Replace loadset and build ad unit execution string.
mps._replaceLoadset = function(str, adslot, mpsid) {
  var _adslot = adslot;
  var _str = str;
  var _adprefix = mps._advarprefix;
  var _mpsid = mpsid;
  var _loadset = mps._loadset;
  var _adid = 'div-' + _adprefix + '-' + _adslot + '-' + _mpsid + '-' + _loadset;
  var _adunitstr = '<div id="' + _adid + '" class="mps-slot" data-mps-slot="' + _adslot + '" data-mps-loadset="' + _loadset + '">';
    _adunitstr += '<script>mps._execAd("' + _adslot + '", ' + _loadset + ');</script>';
    _adunitstr += '</div>';
  if(_str.indexOf('outofpage') > -1) {
    var _oopid = 'div-' + _adprefix + '-outofpage-' + _mpsid + '-' + _loadset;
    _adunitstr += '<div id="' + _oopid + '" class="mps-slot-oop" data-mps-slot="_oop" data-mps-loadset="' + _loadset + '">';
    _adunitstr += '<script>mps._execAd("_oop", ' + _loadset + ');</script>';
    _adunitstr += '</div>';
  }
  return _adunitstr;
};

mps._setAdunitTargeting = function(targeting, adslot) {
  for(var i in targeting) {
    if(i.indexOf('!c') != -1 ){
      gpt[mps.advars[adslot]].setCategoryExclusion(targeting[i][0]);
    } else {
      gpt[mps.advars[adslot]].setTargeting(i, targeting[i]);
    }
  }
};

mps._setpageContext = function() {
  var _mpscallslen = (mps._keys(mps._ext.mpscalls).length - 1);
  while(_mpscallslen > -1) {
    if(_mpscallslen > 0) {
      if(typeof(mps._ext.mpscalls[_mpscallslen].path) === 'string' && (mpscall.path !== mps._ext.mpscalls[_mpscallslen].path) && !mps._ext.mpscalls[_mpscallslen].adreq) {
        mps._debug('[mps/Loader]: new path: reset mps.pagevars and mpscall objects to previous path.');
        mps.pagevars = mps._clone(mps._ext.pagevars[_mpscallslen]);
        mpscall = mps._clone(mps._ext.mpscalls[_mpscallslen]);
        break;
      }
    } else {
      mps._debug('[mps/Loader]: new path: no different previous path found in additional loadsets, reset to default.');
      if(typeof mps._ext.pagevars[0] == 'object'){ mps.pagevars = mps._clone(mps._ext.pagevars[0]); }
      if(typeof mps._ext.mpscalls[0] == 'object'){ mpscall = mps._clone(mps._ext.mpscalls[0]); }
    }
    _mpscallslen -= 1;
  }
};

mps.targetingAppend = function(selector,adslot,targetingappend,disabledetect,newpath,overridetargeting,clone,loadset) {
  clone = clone || 0;
  newpath = newpath || null;
  loadset = (typeof loadset != 'undefined') ? parseInt(loadset,10) : mps._loadset; //loadset to clone
  var adslotopt = (clone > 0) ? adslot + '-C' + clone : adslot;

 if(newpath && typeof(newpath)==='string' && newpath.length > 0) {
    mps._debug('[mps/Loader]: new path: ' + newpath + ' specified, mps.makeRequest()');
    mpscall.path = mps.pagevars.path = newpath;
    mpscall.READONLY = 1;
    mpscall.adreq = 1;
    var _pagecontextKey = mps._pagecontextKeyPath(newpath);
    if(_setTargeting && mps.advars[adslotopt]) {
      if(!mps.pagevars.fields) {
        mps.pagevars.fields = {};
      }
      for(var i in _setTargeting) {
        mpscall['field[' + i + ']'] = _setTargeting[i].toString();
        mps.pagevars.fields[i] = _setTargeting[i].toString();
      }
    }
    var gptQueue = mps._reqset > mps._loadset ? mps._reqset : mps._loadset;
    gptQueue = gptQueue + 1;
    mps._queue.gptloadset[gptQueue]=mps._queue.gptloadset[gptQueue]||[];
    var newrequest = (_pagecontextKey === false || mpsopts.forcenetcalls) ? true : false;
    if(newrequest) {
      mps._queue.gptloadset[gptQueue].push(function() {
        var _setTargeting = mps.prependDefaultTargeting(mps.targetingArray(targetingappend), adslot, overridetargeting);
        mps._setAdunitTargeting(_setTargeting, adslotopt);
        mps.insertAd(selector, adslot, null, disabledetect, null, null, clone, loadset);
      });
    }
    // Check if new network request is needed.
    if(clone === 0){
      if(newrequest) {
        mps._debug('[mps/Loader]: new path: ' + newpath + ' specified and not previously loaded, mps.makeRequest().');
        mps._queue.gptloadset[gptQueue].push(function() {
          mps._setpageContext();
        });
        mps.makeRequest('more');
      } else {
        // Path already called, reference mps._pagecontext.
        mps._debug('[mps/Loader]: new path: ' + newpath + ' specified but previously loaded, reference mps._pagecontext.');
        var _loadsettotal = (mps._pagecontext[_pagecontextKey].loadsets.length - 1);
        var _loadset = mps._pagecontext[_pagecontextKey].loadsets[_loadsettotal];
        var _mpscallslen = (mps._keys(mps._ext.mpscalls).length - 1);
        for(var j in mps._ext.mpscalls) {
          if(mps._ext.mpscalls[j].path === mpscall.path) {
            var _loadsetstotal = (mps._pagecontext[_pagecontextKey].loadsets.length - 1);
            var _loadset = mps._pagecontext[_pagecontextKey].loadsets[_loadsetstotal];
            break;
          }
        }
        if(mps._ext._insertedads[_loadset] && mps._ext._insertedads[_loadset].indexOf(adslot) > -1) {
          mps.cloneAd(selector, adslot, targetingappend, disabledetect, overridetargeting, _loadset);
        } else {
          mps.insertAd(selector, adslot, null, disabledetect, null, null, 0, _loadset, true);
        }
        mps._setpageContext();
      }
    }
  } else { // no path set
    var _setTargeting = mps.prependDefaultTargeting(mps.targetingArray(targetingappend), adslot, overridetargeting);
    var _advar = mps._advars[loadset] && mps._advars[loadset][adslotopt] ? mps._advars[loadset][adslotopt] : null;
    if(_setTargeting && _advar) {
      mps._debug('[mps/Loader]: set targeting and insertAd()');
      for(var i in _setTargeting) {
        if(i.indexOf('!c') != -1 ){
          gpt[_advar].setCategoryExclusion(_setTargeting[i][0]);
          delete _setTargeting[i];
        }else{
          gpt[_advar].setTargeting(i, _setTargeting[i]);
        }
      }
    } else {
      mps._debug('[mps/Loader]: no path or targeting params specified, insertAd()');
    }
    mps.insertAd(selector, adslot, null, disabledetect, null, null, clone, loadset);
  }
};

//--[mps.cloneAd] params: [(obj) element, (str) adslot, (str) key=val, (bool) disable lazyload, (bool) overridetarget, (int)loadset]
mps.cloneAd = function (selector, adslot, targetingappend, disabledetect, overridetargeting, loadset) {
  if(mps._clonerunning) {
    mps._queue.clonead.push(function() {
      mps.cloneAd(selector, adslot, targetingappend, disabledetect, overridetargeting, loadset);
    });
    return false;
  }
  mps._clonerunning = true;
  targetingappend = targetingappend || '';
  disabledetect = disabledetect || false;
  overridetargeting = overridetargeting || false;
  loadset = (typeof loadset != 'undefined') ? parseInt(loadset,10) : mps._loadset;
  if(!mps._gptloaded){
    mps._queue.gptloaded.push( function(){ mps.cloneAd(selector, adslot, targetingappend, disabledetect, overridetargeting, loadset);} );
    mps._clonerunning = false;
    return false;
  }
  if (selector && mps._select(selector) && adslot.length>0 && typeof adslot == 'string' && typeof mps._replicateAd == 'function' && mps._ext) {
    mps._ext._insertedads[loadset] = mps._ext._insertedads[loadset] || [];
    if (mps._ext._insertedads[loadset].indexOf(adslot) == -1) {
      // skip cloneAd --> call insertAd
      mps._debug('[mps:Loader] SKIPPED cloneAd, call insertAd.');
      mps.insertAd(selector, adslot, targetingappend, disabledetect, null, overridetargeting, 0, loadset);
      mps._clonerunning = false;
      return false;
    } else {
      try {
        var cloneObj = mps._replicateAd(adslot, loadset);
        if( typeof cloneObj == 'object'){
          var cloneSizes = [], cloneTargeting = '';
          // Get clone sizes
          var cloneSize = cloneObj.getSizes();
          for (var key in cloneSize) {
            if(cloneSize.hasOwnProperty(key)){
              if(key == 0 && cloneSize[key] == 'fluid'){ cloneSizes = cloneSize[key]; }
              else{ cloneSizes.push([cloneSize[key].l, cloneSize[key].j]); }
            }
          }
          // Define slot
          var currentCloneVar = mps._clonevars[loadset][adslot];
          if( currentCloneVar && currentCloneVar.length > 0){
            var clonecount = parseInt(currentCloneVar.split('_C')[1], 10),
              clonevar = mps._advars[loadset][adslot] + '_C' + clonecount, // gpt_slot_id
              cloneslot = mps._adslots[loadset][adslot] + '-C' + clonecount, // gpt-div-id
              cloneadslot = adslot + '-C' + clonecount;   // topbanner-C1
            // disable detect display cloneAd using mps.lazyloadclone
            mps.lazyloadclone[loadset] = mps.lazyloadclone[loadset] || [];
            var cloneIndex = mps.lazyloadclone[loadset] ? mps.lazyloadclone[loadset].indexOf(cloneadslot) : -1;
            if((!disabledetect || disabledetect == 'undefined') && cloneIndex == -1 && mps._detect && mps._detect.removed && mps._detect.removed[loadset] && mps._detect.removed[loadset].indexOf(adslot) > -1){
              mps.lazyloadclone[loadset].push(cloneadslot);
            }
            if(disabledetect && cloneIndex > -1){
              mps.lazyloadclone[mps._loadset].splice(cloneIndex, 1);
            }
            gpt[clonevar]=googletag.defineSlot(cloneObj.getAdUnitPath(),cloneSizes,cloneslot);
            if(mps._resetrsizemap && mps._resetrsizemap[adslot]) {
              gpt[clonevar].defineSizeMapping(mps._resetrsizemap[adslot]);
            }

            // Add Service
            gpt[clonevar].addService(googletag.pubads());
            mps._gptcmd.push(function(){
              //call insertAd(clone) --> skip getAd
              mps.insertAd(selector, adslot, targetingappend, disabledetect, null, overridetargeting, clonecount, loadset);
              mps._queue.render('adclone',cloneadslot,loadset,clonecount); // render adclone queue
              if(mps.responsiveslots && mps.responsiveslots[loadset] && mps.responsiveslots[loadset][adslot]){
                mps.responsiveslots[loadset][cloneadslot] = mps.responsiveslots[loadset][adslot];
              }
            });
            for(var i in cloneObj.getCategoryExclusions()) {
              gpt[clonevar].setCategoryExclusion(cloneObj.getCategoryExclusions()[i]);
            }

            // Set custom targeting.
            if(!overridetargeting && mpscall.path && typeof mps._resettargeting[mpscall.path] !== 'undefined') {
              for (var i in mps.advars) {
                mps._resettargeting[mpscall.path][i] = mps._resetTargetingObj(gpt[mps.advars[i]].getTargetingMap());
              }
              for(var l in mps._resettargeting[mpscall.path][adslot]) {
                for(var m=0; m<mps._resettargeting[mpscall.path][adslot][l].length; m++) {
                  gpt[clonevar].setTargeting(l,mps._resettargeting[mpscall.path][adslot][l][m]);
                }
              }
            } else {
              // Set default targeting.
              var targetingMap =  mps.prependDefaultTargeting(mps.targetingArray(targetingappend), adslot, overridetargeting)
              for(var t in targetingMap) {
                gpt[clonevar].setTargeting(t, targetingMap[t]);
              }
            }

            // Set Collapse Emtpy Divs
            if(mps._collapsemap[adslot] === 0){
              gpt[clonevar].setCollapseEmptyDiv(false);
            } else if(mps._collapsemap[adslot] === 1){
              gpt[clonevar].setCollapseEmptyDiv(true);
            }else if(mps._collapsemap[adslot] === 2){
              gpt[clonevar].setCollapseEmptyDiv(true, true);
            }

            // Update Clone adobs
            mps.adobs.push(gpt[clonevar]);
            return true;
          }

        }else{
          if(mps.response.dart.adunits[adslot].data == ''){
            mps._debug("[mps/Loader] cloneAd("+adslot+") SKIPPED: Disabled "+mps._elapsed());
          }else{
            mps._debug('[mps:Loader] _replicateAd invalid slot or loadset.');
          }
          mps._clonerunning = false;
          return false;
        }
      } catch(err) {
        mps._errorCallback(err, 'mps.cloneAd');
      }
    }
  }else{
    mps._debug('[mps:Loader] cloneAd FAILED: Invalid parameters. ');
    mps._clonerunning = false;
    return false;
  }
};

//--[Insert Ad Slot into Page] params: (obj) dom element, (str) adslot, (bool) insertAd from clone
mps.insertAd = function(selector,adslot,targetingappend,disabledetect,newpath,overridetargeting,clone,loadset, prevloadset){
  if(!selector) return false;
  clone = clone || 0;
  var loadset = (clone > 0 || prevloadset) && (typeof loadset != 'undefined') ? parseInt(loadset,10) : mps._loadset;
  // disable detect display insertAd
  if(disabledetect && mps.lazyload && mps.lazyload[loadset]) {
    var detectIndex = mps.lazyload[loadset].adslots.indexOf(adslot);
    if(detectIndex > -1) {
      mps._debug('[mps:Loader] insertAd disable detected display called on adslot: '+adslot);
      mps.lazyload[loadset].adslots.splice(detectIndex, 1);
      mps._detect.removed[loadset] = mps._detect.removed[loadset] || [];
      mps._detect.removed[loadset].push(adslot);
    }
  }
  if(mps._gptloaded == false) {
    var gptQueue = 0;
    if(typeof mps._loadset === 'number' && !isNaN(mps._loadset)) {
      gptQueue = mps._reqset > mps._loadset ? mps._reqset : mps._loadset;
    }

    mps._queue.gptloadset[gptQueue]=mps._queue.gptloadset[gptQueue]||[];
    mps._queue.gptloadset[gptQueue].push(function(){ mps.insertAd(selector,adslot,targetingappend,disabledetect,newpath,overridetargeting,clone,loadset) });
    return true;
  }
  if(targetingappend && targetingappend.length || newpath) {
    mps.targetingAppend(selector,adslot,targetingappend,disabledetect,newpath,overridetargeting,clone,loadset)
    return false;
  }
  if(selector) {
    if(clone > 0){
      mps._clonevars[loadset]=mps._clonevars[loadset]||{};
      mps._clonevars[loadset][adslot] = mps._clonevars[loadset][adslot] || [];
      var count = (mps._clonevars[loadset][adslot].length > 0 && parseInt(mps._clonevars[loadset][adslot].split('_C')[1],10) > 0) ? parseInt(mps._clonevars[loadset][adslot].split('_C')[1],10) : 1;
      var cloneadslot = adslot+'-C'+ count;
      mps._debug('[mps:Loader] cloneAd('+selector+','+adslot+', C'+count+') '+mps._elapsed());
      var adcode = '<div id="'+mps._adslots[loadset][cloneadslot]+'" class="mps-slot" data-mps-slot="' +cloneadslot+ '" data-mps-loadset="' + loadset + '" data-mps-clone="' + count+ '"><script>mps._execAd("'+ adslot +'",'+ loadset +',' + count +',false);</script></div>';
      mps._ext._insertedads[loadset] = mps._ext._insertedads[loadset] || [];
      mps._ext._insertedads[loadset].push(cloneadslot);
      var _rset = (typeof mps.getResponsiveSet === 'function') ? mps.getResponsiveSet() : 0;
      if(mps.responsiveslots && mps.responsiveslots[loadset] && mps.responsiveslots[loadset][adslot] && mps.responsiveslots[loadset][adslot][_rset] && mps.responsiveslots[loadset][adslot][_rset][0] === "NONE"){
        mps.slotsdisabled[loadset].push(cloneadslot);
      }
      if(typeof mps._ext == 'object' && typeof mps._reqs == 'object'){
        mps._reqs[loadset] = mps._reqs[loadset] || {};
        mps._reqs[loadset]['begin_'+cloneadslot] = mps._reqs[loadset]['begin_'+cloneadslot] || mps._elapsed('',true);
      }
      if((window.googletag && googletag.apiReady) && typeof(googletag.pubads)=='function' && mps._bool(mpsopts.updatecorrelator) == true) {
        mps._debug('[mps:Loader] Refreshed Correlator:cloneAd');
        mps._correlator.update();
      }
      if(adcode && (typeof(selector) === 'object' || mps._select(selector))) {
        return mps._append(selector,adcode,'mps.insertAd');
      } else {
        mps._clonerunning = false;
      }
    }else{
      mps._debug('[mps:Loader] insertAd('+selector+','+adslot+') '+mps._elapsed());
      if(!prevloadset) {
        var adcode = mps.getAd(adslot);
      } else {
        var adcode = mps.getAd(adslot, false, loadset);
        adcode = mps._updateAdCode(adcode, adslot, loadset, true);
      }
      if(adcode){
        return mps._append(selector,adcode,'mps.insertAd');
      }
    }
  }
  return false;
}

//--[Insert Component into Page] params: (obj) dom element, (str) service identifer
mps.insertComponent = function(selector,sid){
  var componentdata='';
  if(typeof(sid)!='undefined' && sid !='' && typeof(mps)=='object' && typeof(mps.response)=='object' && typeof(mps.response.components)=='object' && typeof(mps.response.components[sid])=='object' && typeof(mps.response.components[sid].data)!='undefined') {
    mps._debug('[mps:Loader] mps.getComponent() LOAD: '+sid);
    if(mps.response.components[sid].data != '' && !(selector)) {
      componentdata = mps.response.components[sid].data;
    } else if (mps.response.components[sid].data != '' && selector){
      componentdata = mps._append(selector,mps.response.components[sid].data, 'mps.getComponent: ' + sid);
    }
  } else {
    mps._debug('[mps:Loader] mps.getComponent() SKIP: '+sid);
  }
  return componentdata;
};

mps.writeFooter = function() {
  var _nowrite = '2';
  var _loadfooter = mps._bool(mps._ext.loadfooter);
  footerdata = mps.response && mps.response.pagevars && typeof(mps.response.pagevars.insert_bodyfooter) === 'string' ? mps.response.pagevars.insert_bodyfooter : '';
  if(!footerdata.length) {
    mps._debug('[mps:Loader] mps.writeFooter SKIP: undefined response (async) or empty response.');
    return false;
  }
  mps._debug('[mps:Loader] mps.writeFooter LOAD');
  if(_nowrite !== 1 && _loadfooter === false) {
    mps._ext.loadfooter = 1;
    if(typeof(mps._ext._async) === 'undefined' || mps._bool(mps._ext._async) === false) {
      mps._debug('[mps:Loader] mps.writeFooter: DOCUMENT.WRITE');
      document.write(footerdata);
    } else {
      mps._debug('[mps:Loader] mps.writeFooter: ASYNC.');
      mps._append('body', footerdata, 'mps.writeFooter');
    }
  } else {
    var _msg = _loadfooter === true ? 'FOOTER DELAYED OR ALREADY EXECUTED VIA mpsOnReady().' : 'SKIP: NO WRITE MODE';
    mps._debug('[mps:Loader] mps.writeFooter ' + _msg);
    return _loadfooter === true ? false : footerdata;
  }
};

mps._cloneObjects = function() {
  var loadset = (typeof mps._loadset === 'number' && !isNaN(mps._loadset)) ? mps._loadset : 0;
  mps._ext.pagevars = mps._ext.pagevars||{};
  mps._ext.mpscalls = mps._ext.mpscalls||{};
  if(loadset == 0) {
    if(typeof mpscall == 'object') mps._ext.mpscalls[0] = mps._clone(mpscall);
    if(typeof mps.pagevars == 'object') mps._ext.pagevars[0] = mps._clone(mps.pagevars);
  } else if(loadset > 0){
    mps._ext.pagevars[loadset] = mps._clone(mps.pagevars);
    mps._ext.mpscalls[loadset] = mps._clone(mpscall);
  }
  if(mps._ext.mpscalls[loadset].type) {
    mps._ext.pagevars[loadset].type = mps._ext.mpscalls[loadset].type;
  }
  if(mps._ext.mpscalls[loadset].content_id) {
    mps._ext.pagevars[loadset].cid = mps._ext.mpscalls[loadset].content_id;
  }
};

mps._updateAdCode = function(adcode, adunit, loadset, appendloadset, mpsid) {
  try {
    var _adcode = adcode, _loadset = loadset, _appendloadset = appendloadset;
    var _mpsid = typeof(mpsid) === 'number' ? mpsid : mps._ext.pagevars[loadset].mpsid;
    var _adunit = adunit.toLowerCase().replace(' ','');
    // Udpate loadset & mpsid;
    _adcode = _adcode.replace(/data-mps-loadset=\"([^\"]*)\"/g,'data-mps-loadset="' + _loadset + '"');
    if(_adcode.indexOf('outofpage') === -1) {
      if(_loadset > 0) {
        _adcode = _adcode.replace(/id=\"([^\"]*)\"/,'id="div-' + mps._advarprefix + '-' + _adunit + '-' + _mpsid + '-' + _loadset + '"');
      } else {
        _adcode = _adcode.replace(/id=\"([^\"]*)\"/,'id="div-' + mps._advarprefix + '-' + _adunit + '-' + _mpsid + '"');
      }
    } else {
      if(_loadset > 0) {
        var _adoop = 'div-' + mps._advarprefix + '-outofpage-' + _mpsid + '-' + _loadset;
        var _adunit = 'div-' + mps._advarprefix + '-' +  _adunit + '-' + _mpsid + '-' + _loadset;
        _adcode = _adcode.replace(/id=\"([^\"]*)\"/g,'id="div-' + mps._advarprefix + '-outofpage-' + _mpsid + '-' + _loadset + '"');
        _adcode = _adcode.replace(_adoop, _adunit);
      } else {
        var _adoop = 'div-' + mps._advarprefix + '-outofpage-' + _mpsid;
        var _adunit = 'div-' + mps._advarprefix + '-' +  _adunit + '-' + _mpsid;
        _adcode = _adcode.replace(/id=\"([^\"]*)\"/g,'id="div-' + mps._advarprefix + '-outofpage-' + _mpsid + '"');
        _adcode = _adcode.replace(_adoop, _adunit);
      }
    }
    if(_appendloadset) {
      _adcode = _adcode.replace(/\);\<\/script>/g, ', ' + _loadset + ');<\/script>');
    }
    return _adcode;
  } catch(err) {
    mps._errorCallback(err, 'mps._updateAdCode');
    return false;
  }
};

mps.updateRequest = function() {
  mps._debug('[mps:Loader] updateRequest');
  var _pagecontextKey = mps._pagecontextKey();
  if(_pagecontextKey === false)  { return false; }
  if(mps._ext.nowrite=="0"){
    mps._ext.nowrite="2";
  }
  mps._gptloaded = false;
  mps._gptrefresh = false;

  // Re-execute inserts if original path.
  if(_pagecontextKey === 0) {
    mps.response.pagevars = mps._pagecontext[_pagecontextKey].pagevars;
    mpsCallback(mps.response, true);
  } else {
    mps._loadset++;
  }

  try {
    var _loadset = mps._loadset;
    mps.adobs=[];
    mps.adslots={};
    mps.advars={};
    mps._slotscalled[_loadset]={};
    mps._slotsdisabled[_loadset]={};
    mps.slotsdisabled[_loadset]=[];
    mps.slotsdisabled[_loadset] = mps.slotsdisabled[0];
    var _originalloadset = mps._pagecontext[_pagecontextKey].loadsets[0];
    var _mpsid = mps._pagecontext[_pagecontextKey].mpsid;

    // Update dart response.
    var _adunits = mps._pagecontext[_pagecontextKey].adunits;
    for(var i in _adunits) {
      if(typeof(_adunits[i].data) === 'string' && _adunits[i].data.length > 0) {
        _adunits[i].data = mps._updateAdCode(_adunits[i].data, i, _loadset, false, _mpsid);
      }
    }
    // Update response.dart.adunits to updated context adunits.
    mps.response.dart.adunits = mps._pagecontext[_pagecontextKey].adunits;

    // Copy adslothtml.
    if(typeof(mps)=='object' && typeof(mps.response)=='object' && typeof(mps.response.dart)=='object' && typeof(mps.response.dart.adunits)=='object') {
      for(var adunit in mps.response.dart.adunits) {
        mps.adslothtml[adunit] = mps._pagecontext[_pagecontextKey].adunits[adunit].data;
      }
    }
    // update lazyload (insert,clone) adslots from loadset 0 map
    if(typeof mps.lazyload !== 'undefined' && mps.lazyload[0]) {
      mps.lazyload[mps._loadset] = mps._lazyloadmap;
      mps.lazyloadclone[mps._loadset] = mps._lazyloadmap.adslots;
    }
    var buildSlotName = function(slotname) {
      var _slotname = slotname.split('_');
      var _name = '';
      for(var i = 0; i < _slotname.length; i += 1) {
        if(_slotname[i] != _mpsid) {
          _name += _name.length > 1 ? '_' + _slotname[i] : _slotname[i];
        } else {
          break;
        }
      }
      return _name;
    }
    // Define googletag slots, set targeting and enable pubads.
    for(var i in mps._pagecontext[_pagecontextKey].gpt) {
      var _gptTargeting = mps._pagecontext[_pagecontextKey].gpt[i];
      if(_gptTargeting.gptid && _gptTargeting.gptdiv) {
        // Set targeting and define in GPT.
        var gptKey = i;
        var _gptKey = gptKey.split('.');
        var _slotName = buildSlotName(_gptKey[1]);
        _gptKey = _slotName + '_' + _mpsid + '_' + _loadset;
        var _gptDiv = 'div-' + mps._advarprefix + '-' + _slotName + '-' + _mpsid + '-' + _loadset;
        if(i.indexOf('outofpage') === -1) {
          gpt[_gptKey] = googletag.defineSlot(mps._setAdId(_gptTargeting.gptid), _gptTargeting.sizes, _gptDiv);

          if(mps._collapsemap[_slotName] === 0){
            gpt[_gptKey].setCollapseEmptyDiv(false);
          } else if(mps._collapsemap[_slotName] === 1){
            gpt[_gptKey].setCollapseEmptyDiv(true);
          }else if(mps._collapsemap[_slotName] === 2){
            gpt[_gptKey].setCollapseEmptyDiv(true, true);
          }

          if(mps._resetcatexclusion[gptKey] && mps._resetcatexclusion[gptKey].length) {
            for(var j = 0; j < mps._resetcatexclusion[gptKey].length; j++) {
              gpt[_gptKey].setCategoryExclusion(mps._resetcatexclusion[gptKey][j]);
            }
          }
        } else {
          _slotName = '_oop';
          gpt[_gptKey] = googletag.defineOutOfPageSlot(_gptTargeting.gptid, _gptDiv);
          if(mps._resetcatexclusion[gptKey] && mps._resetcatexclusion[gptKey].length) {
            for(var j = 0; j < mps._resetcatexclusion[gptKey].length; j++) {
              gpt[_gptKey].setCategoryExclusion(mps._resetcatexclusion[gptKey][j]);
            }
          }
        }

        // Set custom targeting.
        if(mpscall.path && typeof(mps._pagecontext[_pagecontextKey]['targeting'][_slotName] === 'object')) {
          var _resettargeting = mps._pagecontext[_pagecontextKey]['targeting'][_slotName];
          for(var l in _resettargeting) {
            var _targeting = _resettargeting[l].length > 1 ? [] : _resettargeting[l][0];
            if(typeof(_targeting) !== 'string') {
              for(var m = 0; m < _resettargeting[l].length; m+=1) {
                _targeting.push(_resettargeting[l][m]);
              }
            }
            gpt[_gptKey].setTargeting(l, _targeting);
          }
        }

        // Set responsive mapping.
        if(typeof mps._resetrsizemap[_slotName] !== 'undefined') {
          gpt[_gptKey].defineSizeMapping(mps._resetrsizemap[_slotName]);
        }

        gpt[_gptKey].addService(googletag.pubads());

        // Update mps objects
        mps.adslots[_slotName] = _gptDiv;
        mps.advars[_slotName] = _gptKey;

      }
    }

    mps._adslots[mps._loadset] = mps._clone(mps.adslots);
    mps._advars[mps._loadset] = mps._clone(mps.advars);
  } catch(err) {
    mpsopts.forcenetcalls = true;
    mps.makeRequest('more');
    mps._errorCallback(err, 'mps.updateRequest');
    return false;
  }

  mps._gptcmd.push(function() {
    // Callbacks.
    mps._queue.render('mpsinit');
    if(typeof(mps.initCallback) === 'function') {
      try {
        mps.initCallback();
      } catch(err) {
        mps._errorCallback(err, 'mps.initCallback');
      }
    }
    mps._pagecontext[_pagecontextKey].loadsets.push(mps._loadset);
    mps._gptloadCallback();
  });
};

// COMPARE: (A) mps._ext.mpscalls[mps._keys(mps._ext.mpscalls).length-1] (B) mpscall
// PARAMS: site, path, cat, type, content_id, cag[*], field[*]
mps._pagecontextKey = function() {
  // Return true if any differences, else return false.
  var params = ['site', 'path', 'cat', 'type', 'content_id'],
  wildparams = /(field|cag)+\[([a-z0-9-_\.]*?)\]/i,
  contextKey = false;

  for(var i in mps._pagecontext) {
    contextKey = parseInt(i, 10);
    for(var j in mpscall){
      if(params.indexOf(j) > -1 || wildparams.test(j)){
        // Field and cag - check key and value.
        if(wildparams.test(j)) {
          if((mps._keys(mpscall).indexOf(j) == -1 || (mpscall[j] !== mps._pagecontext[i].mpscall[j]) && mps._haskeyval && !mps._haskeyval(mpscall,j,mps._pagecontext[i].mpscall[j]))) {
            contextKey = false;
          }
          // Check values and key exists.
        } else if((mps._haskeyval && !mps._haskeyval(mpscall,j,mps._pagecontext[i].mpscall[j])) || typeof(mps._pagecontext[i].mpscall[j]) === 'undefined'){
          contextKey = false;
        }
      }
    }
    if(typeof contextKey === 'number') {
      return contextKey;
    }
  }
  return false;
};

// Get page context key by path only - insertAd().
mps._pagecontextKeyPath = function(path) {
  for(var i in mps._pagecontext) {
    if(mps._pagecontext[i].mpscall.path === path) {
      return i;
    }
  }
  return false;
};

mps._matchprevRequest = function() {
  if(mpsopts.forcenetcalls || typeof(mps._loadset)=='undefined') return false;
  return mps._pagecontextKey();
};

mps.makeRequest = function(loadmode, retry) {
  if(!retry && loadmode === 'more') {
    if(mps._reqset > mps._loadset || !mps._gptloaded) {
      mps._reqset++;
      mps._queue.mpsloaded.push(function() { mps.makeRequest('more', true) });
      return false;
    }
    mps._adslots[mps._reqset]=mps.adslots;
    mps._reqset++;
  }
  mps._ext._insertedads=mps._ext._insertedads || {};
  mps._ext.loaded=0; mps._ext.loadhead = 0; mps._ext.loadheader=0; mps._ext.loadfooter=0; mps._gptloaded = false;
  var loadmode = (typeof(loadmode)=='string' && loadmode.length > 0) ? loadmode : '';
  var update = false;
    if(typeof(mps.requesturl)!='string' || mps.requesturl=='') return false;

  if(typeof(loadmode)=='string' && loadmode.length > 0) {
    if(loadmode=='more') {
      mpscall['ASYNC']=1;
      mpscall['_']=mps._loadset+1;
      mps._ext._async = true;
    }
    if(typeof mps._correlator.update == 'function' && (window.googletag && googletag.apiReady) && typeof(googletag.pubads)=='function' && (mps._bool(mpsopts.updatecorrelator) == true) || (mps._loadset && ((mps._loadset+1) % mps._bool(mpsopts.updatecorrelator, true))===0)) {
      mps._correlator.update();
    }
    // If page exists in mps._pagecontext, refresh objects without a new request.
    if(typeof(mps._matchprevRequest()) === 'number') {
      mps.updateRequest();
      return false;
    }
  }
  delete(mps.response);
  mps.requesturl = mps._ext.mpsRequestUrl(loadmode);
  (function(){
    var gptQueue = typeof mps._loadset === 'number' && !isNaN(mps._loadset) ? mps._loadset + 1 : 0;
    mps._ext._set++;
    mps._reqs[gptQueue] = {};
    var src = mps.requesturl;
    var loadscript = document.createElement('script');
    loadscript.async = true; loadscript.type = 'text/javascript';
    if(src.substring(0,4) == 'http' || src.substring(0,2) == '//') src.replace('http://','').replace('https://','').replace('//','');
      src = mps._protocol()+'//'+src;
      loadscript.src = src;
      loadscript.onload=function(){
      if(mps._ext && mps._reqs && mps._reqs[gptQueue]){
        mps._reqs[gptQueue]['mpsready'] = mps._elapsed('',true);
      }
    };
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(loadscript, node);
  })();
};

mps.executeBodyheader = function(jq) {
  mps._debug('[mps:Loader] body defined, execute bodyheader inserts.' + mps._elapsed(true));
  if(jq === true) {
    jQuery('body').prepend(mps.response.pagevars.insert_bodyheader);
  } else {
    mps._append(mps._select('body'),mps.response.pagevars.insert_bodyheader);
  }
  mps._ext.loadheader = 1;
  return true;
};

mps.intBodyheader = function(jq) {
  mps._debug('[mps:Loader] body not defined, set listener.' + mps._elapsed(true));
  mps._ext.loadfooter = 1;
  var _jq = mps._bool(jq);
  var _reqanimation = typeof(window.requestAnimationFrame) === 'function' ? true : false;
  var _body = function() {
    return _jq === true ? jQuery('body').length : mps._select('body');
  };
  var _exec = function(body) {
    if(body && _body()) {
      mps.executeBodyheader(_jq);
      mps._ext.loadfooter = 0;
      mps._ext._async = true;
      mps.writeFooter();
      return false;
    } else {
      if(_reqanimation === true) {
        window.requestAnimationFrame(_exec);
      }
    }
  };
  if(_reqanimation === true) {
    _exec();
  } else {
    var _time = 0;
    var _int = setInterval(function() {
      if(_time <= mps._delays.bodyheader) {
        if(_body()) {
          _exec(true);
          clearInterval(_int);
        }
      } else {
        clearInterval(_int);
      }
      _time += mps._delays.bodyheaderint;
    }, mps._delays.bodyheaderint);
  }
};

mps.executeInserts = function() {
  if(typeof(mps)!='object' || typeof(mps.response)!='object') {
    mps._log('[mps:Loader] Failed executeInserts(): No MPS Response');
    return false;
  }
  var _jq = typeof(jQuery) === 'function' ? true : false;
  if(mps._ext.nowrite==0 && !mps.__intcode && !mpsopts.skipautorequest) {
    document.write(mps.response.pagevars.insert_head);
    mps._ext.loadhead = 1;
    if(mpsopts.skipheader != 1) {
      if(!mps._select('body')) {
        mps.intBodyheader(_jq);
      } else {
        document.write(mps.response.pagevars.insert_bodyheader);
      }
      mps._ext.loadheader = 1;
    }
    return true;
  } else {
    if(_jq === false) {
      mps._debug('[mps:Loader] executeInserts (non-jquery)');
      mps._append(mps._select('head'),mps.response.pagevars.insert_head);
      mps._ext.loadhead = 1;
      if(mps._select('body')) {
        mps.executeBodyheader(false);
      } else {
        mps.intBodyheader(false);
      }
    } else {
      mps._debug('[mps:Loader] executeInserts (jquery)');
      jQuery('head').append(mps.response.pagevars.insert_head);
      mps._ext.loadhead = 1;
      if(jQuery('body').length) {
        mps.executeBodyheader(true);
      } else {
        mps.intBodyheader(true);
      }
    }
    return true;
  }
};

//--> BUILD MPS REQUEST VARS
mps._ext._p.defined = mps._ext.mpsRequestParams(mpscall);
mps._ext._p.defined.path = typeof(mps._ext._p.defined.path)!='undefined' ? mps._ext._p.defined.path : '~';
mps._ext._p.derived = mps._ext.mpsDeriveParams();
mpscall = mps._merge(mps._ext._p.derived,mps._ext._p.defined);
mps._ext.mpscalls = mps._ext.mpscalls||{};
mps._ext.mpscalls[0] = mps._clone(mpscall);
mps._debug('[mps:Loader] (merge params)'+JSON.stringify(mps._ext._p));

//--> VARIABLES FOR INCLUDE
if(typeof(mpscall.cat)=='string') {
  mpscall.cat = mps._trim(mpscall.cat,'| ');
  var cats = mpscall.cat.split('|'), lastcat = cats[cats.length-1];
} else {
  var cats = [], lastcat = undefined;
}

//--> INCLUDE CODE [local-web]
/* (add before header bidding loaderjs) */ mps.hb=mps.hb||{};
mps.hb.ixjsmap = {
  'KNTV': '186439-206022773251238.js',
  'WBTS': '186439-278590540860522.js',
  'WMAQ': '186439-32299936421738.js',
  'WVIT': '186439-109265750698089.js',
  'KXAS': '186439-199425704232587.js',
  'KNBC': '186439-8110681084214.js',
  'WTVJ': '186439-146649146255048.js',
  'NECN': '186439-78479425397755.js',
  'WNBC': '186439-239008123149972.js',
  'WCAU': '186439-186231565045987.js',
  'KNSD': '186439-118061844360218.js',
  'WRC': '186439-157644263009631.js',
  'KSTS': '186439-133455007306856.js',
  'WSNS': '186439-118061844560210.js',
  'KXTX': '186439-5911658571253.js',
  'KTMD': '186439-80678449403524.js',
  'KVEA': '186439-148848170443565.js',
  'KTLM': '186439-274192496062438.js',
  'WSCV': '186439-10309705427711.js',
  'WNJU': '186439-164241333408562.js',
  'KTAZ': '186439-19105798584294.js',
  'KHRR': '186439-19105798584294.js',
  'WKAQ': '186439-265396403250667.js',
  'KVDA': '186439-129056961447453.js',
  'WNEU': '186439-8110937945949.js',
  'KDEN': '186439-153246473026735.js',
  'KBLR': '186439-89474798789618.js',
  'WWSI': '186439-10309961626855.js',
  'ONSD': '186439-93872845461277.js',
  'WZDC': '186439-228013264086439.js',
}
mps.hb.customConfig = function(){
  if(typeof(mpscall['cag[callLetter]'])=='string') {
    if(mps.hb.ixjsmap[mpscall['cag[callLetter]'].toUpperCase()]) {
      mps.hb.ixjs = mps.hb.ixjsmap[mpscall['cag[callLetter]'].toUpperCase()];
    }
  }
}
/* [2017-02-14] <START> Header Bidding (v4) */ mps.hb=mps.hb||{}; mps.hb.executed=0;
/*====[config]============================*/
mps.hb.a9pubid = '';
mps.hb.ixjs = '';
/*========================================*/
// @TODO !c=headerbid
mps.hb.a9timeout = 2000;
mps.hb.execute = function() {
  if(typeof(mps.hb.customConfig)=='function') mps.hb.customConfig();
  if(mps._checkQS('DISABLEHB') || (!mps.hb.a9pubid && !mps.hb.ixjs)) {
    mpsopts.skipdisableinitialload = 1;
    mps._d('[mps/hb] SKIPPED (DISABLEHB)');
    return false;
  } else {
    mpsopts.skipdisableinitialload = 0;
  }
  mps._reqs.hb=mps._reqs.hb||{}; mps.hb.executed++; mps.hb.loadedads=0;
  mps._d('[mps/hb] Starting Execution');
  if(mps.hb.ixjs) {
    mps._d('[mps/hb] IX: Load ('+mps.hb.ixjs+')');
    mps.hb.ixurl = 'https://js-sec.indexww.com/ht/p/'+mps.hb.ixjs;
    mps._reqs.hb['ix_begin']=mps._elapsed('',true);
    mps._loadJS(mps.hb.ixurl,function(){
      mps._d('[mps/hb] IX: Loaded');
      mps._reqs.hb['ix_loaded']=mps._elapsed('',true);
    });
  }
  if(mps.hb.a9pubid) {
    mps._reqs.hb['a9_begin']=mps._elapsed('',true);
    mps._d('[mps/hb] A9: Load ('+mps.hb.a9pubid+')');
    !function(a9,a,p,s,t,A,g){if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function() {q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},targetingKeys:function(){return[]},_Q: []};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)} ("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");
    apstag.init({
      pubID: mps.hb.a9pubid,
      adServer: 'googletag'
    });
  }
  mps._queue=mps._queue||{}; mps._queue.gptloaded=mps._queue.gptloaded||{}; mps._queue.mpsloaded=mps._queue.mpsloaded||{}; mps._queue.mpsready=mps._queue.mpsready||{};
  mps._queue.mpsloaded.push(function() {
    mps._d('[mps/hb] MPS Loaded');
    mps._reqs.hb['mpsload']=mps._elapsed('',true);
  });
  mps._queue.mpsready.push(function() {
    mps._d('[mps/hb] MPS Ready');
    mps._reqs.hb['mpsready']=mps._elapsed('',true);
  });
  mps._queue.gptloaded.push(function() {
    mps._d('[mps/hb] GPT Loaded');
    mps._reqs.hb['gptload']=mps._elapsed('',true);
  });
  mps._queue.gptloaded.push(function() {
    if(mps.hb.a9pubid) {
      mps._d('[mps/hb] A9: fetchBids');
      mps.hb.a9slots=mps.hb.a9slots||[];
      for(var i in mps._advars[mps._loadset]) {
        if(i=='_oop') continue;
        var adobj = gpt[mps._advars[mps._loadset][i]], slot = {};
        if(!adobj || !adobj.getSlotElementId || !adobj.getAdUnitPath || !adobj.getSizes  || !adobj.getTargetingMap) continue;
        var targ = adobj.getTargetingMap();
        if(targ.nohb && targ.nohb.indexOf('a9')>-1) {
          mps._d('[mps/hb] A9: skipping '+i+' (nohb=a9)');
          continue;
        }
        slot.slotID = adobj.getSlotElementId();
        slot.slotName = adobj.getAdUnitPath();
        if(mps.getResponsiveSet && mps.responsiveslots && mps.responsiveslots[mps._loadset] && mps.responsiveslots[mps._loadset][i]) {
          slot.sizes = mps.responsiveslots[mps._loadset][i][mps.getResponsiveSet()];
        }
        if(!slot.sizes) {
          var sizeobj = adobj.getSizes();
          slot.sizes = [];
          for(var ii in sizeobj) slot.sizes.push([sizeobj[ii].l,sizeobj[ii].j]);
        }
        mps.hb.a9slots.push(slot);
      }
      if(mps.hb.a9slots.length) {
        mps._d('[mps/hb] A9: Passing '+mps.hb.a9slots.length+' ad slots',mps.hb.a9slots);
        // apstag.fetchBids...
        apstag.fetchBids({slots:mps.hb.a9slots, timeout:mps.hb.a9timeout}, function(bids){
          apstag.setDisplayBids();
          mps._d('[mps/hb] A9: Loaded');
          mps._reqs.hb['a9_loaded']=mps._elapsed('',true);
          mps.hb.startAdExecution();
        });
      } else {
        mps.hb.startAdExecution();
      }
    } else {
      mps.hb.startAdExecution();
    }
  });
  return 1;
}
mps.hb.startAdExecution = function(a) {
  mps._queue.gptloaded.push(function(){
    mps.hb.loadedads = 1;
    mps._d('[mps/hb] startAdExecution delay '+mps.hb.adexecdelay);
    var refreshobs=[]; mps.hb._initialads=mps.hb._initialads||{}; mps.hb._initialads[mps._loadset]=[];
    for(var sloti in mps._slotscalled[mps._loadset]) {
      refreshobs.push(gpt[mps._advars[mps._loadset][sloti]]);
      mps.hb._initialads[mps._loadset].push(sloti);
      mps._reqs.hb['adcall-'+mps._loadset+'-'+sloti] = mps._elapsed('',true);
    }
    mps._d('[mps/hb] startAdExecution: '+mps.hb._initialads[mps._loadset].join(', '));
    googletag.pubads().refresh(refreshobs,{changeCorrelator:false});
    mps._reqs.hb['start_ad_execution']=mps._elapsed('',true);
  },mps.hb.adexecdelay);
  return 1;
}
mps._checkQS=function(a){return"string"==typeof a&&a?!1!==mps._get(a)||!1!==mps._get(a.toLowerCase())||!1!==mps._get(a.toUpperCase())?!0:!1:!1};
mps.hb.execute();
/* <END> Header Bidding (v4) */

mps.local=mps.local||{};

//====[preprocess core]=====================================
/*[CORE VARIABLES]*/
mps._pp=mps._pp||{};
mps._pp.host = window.location.host;
mps._pp.hostsegs = mps._pp.host.split('.');
mps._pp.subdoms = mps._clone(mps._pp.hostsegs);
mps._pp.topdom = mps._pp.subdoms.pop();
mps._pp.topdom = mps._pp.subdoms.pop()+'.'+mps._pp.topdom;
mpscall.path = '/'+mps._trim(mpscall.path,' /');
mps._pp.pathsegs = mps._trim(window.location.pathname,'/').split('/');
mps._pp.pathsegso = mps._trim(mpscall.path,'/').split('/');
mpscall['field[host]'] = mps._pp.host;
mpscall['field[path]'] = '/'+mps._trim(window.location.pathname,'/');
if(!mpscall.cat && !mps._pp.pathsegs[0]) mpscall.cat = 'home';
mps._pp.catsegs = mpscall.cat ? mpscall.cat.split('|') : [];
/*[FIX MISSING OR BAD CAT]*/
mps._pp.badsegs = ['','node','file','taxonomy','view','user'];
if(mps._pp._badsegsadd && mps._pp._badsegsadd instanceof Array) mps._pp.badsegs = mps._merge(mps._pp.badsegs,mps._pp._badsegsadd);
if(mps._pp.badsegs.indexOf(mps._pp.catsegs[0]) > -1 || mps._pp.catsegs.length==0 || !mps._pp.catsegs[0]) {
  if(mps._pp.badsegs.indexOf(mps._pp.pathsegs[0]) > -1) { /* path is not useful */
    mpscall.READONLY = 1;
    mps._d('[mps:Loader] /fixcat/ WARNING: Unable to use path - Setting request to readonly');
  } else { /* create cat from path */
    mps._d('[mps:Loader] /fixcat/ Replacing current mpscall.cat value: '+mpscall.cat);
    mps._pp.catsegsnew = mps._pp.pathsegs;
    //--Cleanup category vals
    for(var $ncsi=0; $ncsi < mps._pp.catsegsnew.length; ++$ncsi) {
      mps._pp.catsegsnew[$ncsi] = mps._pp.catsegsnew[$ncsi].replace(/(\|)/g,'').toLowerCase();
    }
    //--Determine if page is content
    mps._pp._contentpage=0; mps._pp._lastseg=mps._pp.catsegsnew.slice(-1)[0];
    // [mpscall.is_content]
    if(parseInt(mpscall.is_content)==1 && mps._pp.catsegsnew.length > 1) mps._pp._contentpage = 1;
    // [last segment is numeric]
    if(mps._pp.catsegsnew.length > 1 && /^\d+$/.test(mps._pp._lastseg)) mps._pp._contentpage = 1;
    // [last segment is filename]
    var $lastsegarr = mps._pp._lastseg.split('.');
    if($lastsegarr.length===2 && $lastsegarr[1].match(/^[a-z0-9]{2,4}$/i)) mps._pp._contentpage = 1;
    // [more than three segments]
    if(mps._pp.catsegsnew.length > 3) mps._pp._contentpage = 1;
    //--Remove last category level if is content
    if(mps._pp._contentpage) mps._pp.catsegsnew.pop();
    //--Save original cat and replace with new one
    mpscall['field[modified]'] = 1;
    mpscall.cat = mps._pp.catsegsnew.join('|');
    mps._pp.catsegso = mps._pp.catsegs;
    mps._pp.catsegs = mps._pp.catsegsnew;
    mps._d('[mps:Loader] /fixcat/ Generated new mpscall.cat value: '+mpscall.cat);
  }
}
/*[AUTO-SET IF EMPTY]*/
if(typeof(mpscall.type)=='undefined') mpscall.type = 'page';
if(typeof(mpscall.title)=='undefined' && typeof(document.title)=='string' && document.title.length > 0) mpscall.title = mps._trim(document.title.replace(/[^-a-z0-9\s\[\]._():]/ig,'')).substring(0,250);
//====[/preprocess core]====================================

/*[CUSTOM LOCAL HANDLERS ]*/
mps.local._aff = mps._get('aff');
if(mps.local._aff) {
  mpscall['field[aff]'] = mps.local._aff;
  mpscall['cag[callLetter]'] = mps.local._aff;
}

mps.local._clones = mps.local._clones||{};


mps._debug('[mps:Loader] (mpsopts) '+JSON.stringify(mpsopts));

//(cat) resplit cat string
mps._ext._cats = (typeof(mpscall.cat)=='string') ? mpscall.cat.split('|') : [];
lastcat = mps._ext._cats[mps._ext._cats.length-1];
//(cat) set depth limit on cat level
mpsopts.maxcats = (typeof(mpsopts.maxcats)=='string') ? parseInt(mpsopts.maxcats) : mpsopts.maxcats||0;
if(mpsopts.maxcats > 0  && mps._ext._cats.length > mpsopts.maxcats) {
  mps._ext._catscut = mps._ext._cats.splice(mpsopts.maxcats+1);
}
//(cat) remove last level if filename or numeric
if(!isNaN(lastcat) || lastcat.lastIndexOf('.')>0 || lastcat.indexOf('index')===0) {
  mps._ext._cats.splice(mps._ext._cats.length-1,mps._ext._cats.length);
}
//(cat) attach prefix
mpsopts.catprefix = mps._trim(mpsopts.catprefix,'| ');
if(mpsopts.catprefix != '') {
  mps._ext._cats = mps._merge(mpsopts.catprefix.split('|'),mps._ext._cats);
}
//(cat) join and override existing value
mpscall.cat = mps._ext._cats.join('|');

mps._debug('~[mps:Loader] MPSCALL: '+JSON.stringify(mpscall)+': '+mps._elapsed());
if(mps._isdebug() === true) mpscall.CACHESKIP=1;

//--> CREATE URL AND REQUEST
mps.requesturl = mps._ext.mpsRequestUrl()+'&tm='+24383;
  if(mpsinstance!='' && mps.qs.length > 6) {
        if (!mpsopts.skipautorequest && mps._ext.nowrite != 1) {
      mps.makeRequest();
    }
        if (mps._ext.nowrite == 1) {
      mps._debug('[mps:Loader] Skipped MPS Request: nowrite=' + mps._ext.nowrite);
    }
    if (mpsopts.skipautorequest) {
      mps._debug('[mps:Loader] Skipped MPS Request: skipautorequest=' + mpsopts.skipautorequest);
    }
  }

  delete(mps.qs);

//--> BACKWARDS COMPATIBILITY
mpsGetAd=mps.getAd; var mpsrequesturl=mps.requesturl; mps.writeHeader=function(){};