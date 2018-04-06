var nbcu_account;
var s_linkInternalFilters;
var s_stationDivision;
var s_stationMarket;
var s_stationCall;
var nbcu_siteID;
var s_timeZone;
var linkPosValue;
var linkNameValue;
var tempLinkNameValue;
var checkCookieOnce = false;

if (!nbcu_account) {
  var nbcu_account = "nbcuotsdivisiondev"; //default nbcu_account if nothing is passed from the page
  var nbcu = s_gi(nbcu_account);
} else {
  var nbcu = s_gi(nbcu_account);
}

/******** VISITOR ID SERVICE CONFIG - REQUIRES VisitorAPI.js ********/
nbcu.visitor = Visitor.getInstance("A8AB776A5245B4220A490D44@AdobeOrg");

if (!s_linkInternalFilters) {
  nbcu.linkInternalFilters = 'javascript:,localhost'; //default nbcu.linkInternalFilters if nothing is passed from the page
} else {
  nbcu.linkInternalFilters = s_linkInternalFilters;
}

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
nbcu.charSet = "utf-8";
nbcu.currencyCode = "USD";
/* Link Tracking Config */
nbcu.trackDownloadLinks = true;
nbcu.trackExternalLinks = false;
nbcu.trackInlineStats = true;
nbcu.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
/* Conversion Config */
nbcu.linkLeaveQueryString = false;
nbcu.linkTrackVars = "prop52,prop53,prop54,prop55,prop5";
nbcu.linkTrackEvents = "None";

/* Page Name Plugin Config */
nbcu.siteID = nbcu_siteID; // leftmost value in pagename
nbcu.defaultPage = "home page"; // filename to add when none exists
nbcu.queryVarsList = ""; // query parameters to keep
nbcu.pathExcludeDelim = ";"; // portion of the path to exclude
nbcu.pathConcatDelim = ":"; // page name component separator
nbcu.pathExcludeList = ""; // elements to exclude from the path

/* Channel Manager addition config variables */
  //nbcu._extraSearchEngines="bing.com|q|Microsoft bing"
nbcu._channelDomain = "Social Networks|facebook.com,linkedin.com,twitter.com,plus.google.com,orkut.com,friendster.com,livejournal.com,blogspot.com,wordpress.com,friendfeed.com,myspace.com,digg.com,reddit.com,stumbleupon.com,twine.com,yelp.com,mixx.com,delicious.com,tumblr.com,disqus.com,intensedebate.com,plurk.com,slideshare.net,backtype.com,netvibes.com,mister-wong.com,diigo.com,flixster.com,youtube.com,vimeo.com,12seconds.tv,zooomr.com,identi.ca,jaiku.com,flickr.com,imeem.com,dailymotion.com,photobucket.com,fotolog.com,smugmug.com,classmates.com,myyearbook.com,mylife.com,tagged.com,brightkite.com,ning.com,bebo.com,hi5.com,yuku.com,cafemom.com,xanga.com,t.co,pintrist.com>Affiliate|nbcnewyork.com,nbcdfw.com,nbclosangeles.com,nbcchicago.com,nbcphiladelphia.com,nbcwashington.com,nbcsandiego.com,nbcmiami.com,nbcconnecticut.com";
nbcu._channelParameter = "";
nbcu._channelPattern = "Paid Search|knc-,ps->Display|bac-,ba:>Email|Newsltr_,Newltr_,Newsletter-Daily,Newsletter>Partners|parc->Widgets|widgets>Paid Social Network|soc->Mobile|mob-";
/*
Paid Search ps
Banner Ad   ba
Email   em
Vanity Redirect va
Paid Social Media   sm
Affiliates  affil
 */
//Use this function to strip out undesired characters.
//syntax s.pageName = _omniStrip(s.pageName);

function omniStrip(a) {
  a = a.split("&quot;").join("");
  a = a.split("&rsquo;").join("");
  a = a.split("\"").join("");
  a = a.split("&").join("");
  a = a.split("'").join("");
  a = a.split("#").join("");
  a = a.split("$").join("");
  a = a.split("%").join("");
  a = a.split("^").join("");
  a = a.split("*").join("");
  a = a.split("!").join("");
  a = a.split("<").join("");
  a = a.split(">").join("");
  a = a.split("~").join("");
  a = a.split(";").join("");
  a = a.split("?").join("");
  a = a.split("�").join("");
  return a;
}

/* Plugin Config */
nbcu.usePlugins = true;

function s_doPlugins(nbcu) {

  typeof(Visitor) != "undefined" ? console.log("VisitorAPI Present") : console.log("VisitorAPI Missing");

  /* Add calls to plugins here */

  /* Set Station Variables for mostly video player*/
  if(nbcu_prop8)
  {
    nbcu.eVar8 = nbcu_prop8;
    nbcu.prop8 = "D=v8";
  }
  if(nbcu_prop9)
  {
    nbcu.eVar9 = nbcu_prop9;
    nbcu.prop9 = "D=v9";
  }
  if(nbcu_prop10)
  {
    nbcu.eVar10 = nbcu_prop10;
    nbcu.prop10 = "D=v10";
  }

  //   nbcu.prop75 = "D=s_vi";
  if (!nbcu.prop75) {
    nbcu.prop75 = "D=s_vi";
  }

  //   nbcu.eVar75 = "D=s_vi";
  if (!nbcu.eVar75) {
    nbcu.eVar75 = "D=s_vi";
  }

  /* Sponsor Metrics */
  if (nbcu.prop74 && nbcu.prop74 != "page not sponsored") {
    nbcu.eVar74 = nbcu.prop74;
    nbcu.events = nbcu.apl(nbcu.events, "event51", ",", 2)
  } else {
    nbcu.prop74 = nbcu.eVar74 = "page not sponsored";
  }

  if (!nbcu.pageType && !nbcu.pageName) {
    nbcu.pageName = nbcu.getPageName();
  }

  /* SET PAGES (CUSTOM) */
  if (nbcu.pageName) {
    nbcu.pageName = omniStrip(nbcu.pageName);
    nbcu.serverStop = nbcu.pageName.indexOf(':');
    nbcu.channelStop = nbcu.pageName.lastIndexOf(':');
    if (!nbcu.server) {
      nbcu.server = nbcu_siteID;
    }
    if (!nbcu.channel) {
      nbcu.channel = nbcu.pageName.slice(0, nbcu.channelStop);
    }
    if (!nbcu.eVar5) {
      nbcu.eVar5 = "D=pageName";
    }
    if (!nbcu.eVar54) {
      nbcu.eVar54 = "D=server";
    }
    if (!nbcu.eVar55) {
      nbcu.eVar55 = "D=ch";
    }
    if (!nbcu.eVar6) {
      nbcu.eVar6 = document.URL;
    }
    if (!nbcu.prop6) {
      nbcu.prop6 = "D=v6";
    }
    if (!nbcu.eVar49) {
      nbcu.eVar49 = document.title;
    }
    if (nbcu.eVar49.indexOf('|') > -1) {
      nbcu.eVar49end = nbcu.eVar49.indexOf('|');
      nbcu.eVar49 = nbcu.eVar49.slice(0, nbcu.eVar49end);
    }
    //nbcu.eVar49 = omniStrip(nbcu.eVar49);
    if (!nbcu.prop49) {
      nbcu.prop49 = "D=v49";
    }

    if (!nbcu.eVar53) {
      nbcu.eVar53 = nbcu.getPreviousValue(nbcu.pageName, 'nbcu_prepagename', '');
    }
    if (!nbcu.hier1) {
      nbcu.hier1 = "D=pageName";
    }

    // nbcu.eVar1 = nbcu.channelExtractCust(":", 1, 1, nbcu.channel, 1);
    /* Sets prop/eVar 1, 3-4 based on the pageName variable */
    if (!nbcu.prop1) {
      nbcu.prop1 = nbcu.channelExtractCust(":", 1, 1, nbcu.channel, 1);
    }
    if (!nbcu.eVar1) {
      nbcu.eVar1 = nbcu.channelExtractCust(":", 1, 1, nbcu.channel, 1);
    }
    if (!nbcu.prop3) {
      nbcu.prop3 = nbcu.channelExtractCust(":", 1, 2, nbcu.channel, 1);
    }
    if (!nbcu.eVar3) {
      nbcu.eVar3 = nbcu.channelExtractCust(":", 1, 2, nbcu.channel, 1);
    }
    if (!nbcu.prop4) {
      nbcu.prop4 = nbcu.channelExtractCust(":", 1, 10, nbcu.channel, 1);
    }
    if (!nbcu.eVar4) {
      nbcu.eVar4 = nbcu.channelExtractCust(":", 1, 10, nbcu.channel, 1);
    }
  }

  /* SET CUSTOM PAGE VIEW EVENT */
  if (!nbcu.events) {
    nbcu.events = "event1";
  } else {
    nbcu.events = nbcu.apl(nbcu.events, "event1", ",", 2);
  }
  /* Plugin Example: setupLinkTrack 0.1 */
  nbcu.hbx_lt = "auto"; // manual, auto


  /* Disabling. No Longer Supported */
  try{
    nbcu.setupLinkTrack('prop52,prop53,prop54,prop55', 'SC_LINKS');
  } catch(e) {
    console.warn('nbcu.setupLinkTrack | Failure | ' + e + ' | Trying to recover...');
  }
  /* Reset Variable to base values */
  ///* Automatically Capture Exit Links */

  nbcu.exitURL = nbcu.exitLinkHandler();
  if (nbcu.exitURL) {
    nbcu.setupLinkTrack('prop52,prop53,prop54,prop55', 'SC_LINKS');
    nbcu.linkTrackVars = "prop52,prop53,prop54,prop55,prop5";
    nbcu.linkTrackEvents = "";
    nbcu.events = "";
    nbcu.prop53 = 'exit: ' + nbcu.prop53 + ' | ' + nbcu.exitURL;
  }

  /* Automatically Capture Downloads */
  nbcu.downloadURL = nbcu.downloadLinkHandler();

  if (nbcu.downloadURL) {
    nbcu.linkTrackVars = "prop52,prop53,prop54,prop55,prop5";
    nbcu.setupLinkTrack('prop52,prop53,prop54,prop55', 'SC_LINKS');
    nbcu.linkTrackVars = nbcu.apl(nbcu.linkTrackVars, "prop51,eVar51,events", ",", 2);
    nbcu.linkTrackEvents = "event37";
    nbcu.prop51 = nbcu.prop53 + ' | ' + nbcu.downloadURL;
    nbcu.eVar51 = 'D=c51';
    nbcu.events = nbcu.linkTrackEvents;
    nbcu.prop53 = 'download: ' + nbcu.prop53 + ' | ' + nbcu.downloadURL;
  }

  /* External Campaign Tracking */
  if (!nbcu.campaign) {
    nbcu.campaign = nbcu.Util.getQueryParam('cid') !== "" ? nbcu.Util.getQueryParam('cid') :
      nbcu.Util.getQueryParam('cmp') !== "" ? nbcu.Util.getQueryParam('cmp') :
      nbcu.Util.getQueryParam('cmpid') !== "" ? nbcu.Util.getQueryParam('cmpid') :
      nbcu.Util.getQueryParam('_osource') !== "" ? nbcu.Util.getQueryParam('_osource') :
      nbcu.Util.getQueryParam('__source') !== "" ? nbcu.Util.getQueryParam('__source') :
      nbcu.Util.getQueryParam('sky') !== "" ? nbcu.Util.getQueryParam('sky') : '';
    /*
    nbcu.campaign = nbcu.Util.getQueryParam('cid');
    nbcu.campaign = nbcu.Util.getQueryParam('cmp');
    nbcu.campaign = nbcu.Util.getQueryParam('cmpid');
    nbcu.campaign = nbcu.Util.getQueryParam('_osource');
    nbcu.campaign = nbcu.Util.getQueryParam('__source');
    nbcu.campaign = nbcu.Util.getQueryParam('sky');
    */
    if(nbcu.campaign !== ''){
      nbcu.campaign = nbcu.getValOnce(nbcu.campaign, 'nbcu_campaign', 0);
    }
  } else {
    nbcu.campaign = nbcu.getValOnce(nbcu.campaign, 'nbcu_campaign', 0);
  }
  nbcu.clickPast(nbcu.campaign, 'event3', 'event4', 'cmp_clickpast');

  /* Internal  Campaign Tracking */
  if (!nbcu.eVar52) {
    nbcu.eVar52 = nbcu.Util.getQueryParam('intcmp');
    nbcu.eVar52 = nbcu.getValOnce(nbcu.eVar52, 'nbcu_evar52', 0);
  } else {
    nbcu.eVar52 = nbcu.getValOnce(nbcu.eVar52, 'nbcu_evar52', 0);
  }
  if (nbcu.eVar52) {
    nbcu.events = nbcu.apl(nbcu.events, 'event5', ',', 2);
  }

  /* Site Search */
  /* Type */
  if (document.URL.indexOf('/results/') > -1) {
    if (!nbcu.prop31) {
      nbcu.prop31 = nbcu.Util.getQueryParam('type').toLowerCase();
    }
    if (!nbcu.prop31) {
      nbcu.prop31 = nbcu.getValOnce(nbcu.prop31, 'search_prop31', 0);
    }
    if (!nbcu.prop35) {
      nbcu.prop35 = "D=v6";
    }
    if (!nbcu.eVar35) {
      nbcu.eVar35 = "D=v6";
    }
    if (nbcu.prop31) {
      nbcu.eVar31 = "D=c31";
      nbcu.events = nbcu.apl(nbcu.events, "event49", ",", 2);
    } else {
      nbcu.prop31 = "global search";
      nbcu.eVar31 = "D=c31";
    }
  }
  /* Keyword */
  if (document.URL.indexOf('/results/') > -1) {
    if (document.getElementById('noResults')) {
      if (!nbcu.prop32) {
        nbcu.prop32 = "zero results: " + nbcu.Util.getQueryParam('keywords').toLowerCase();
        nbcu.prop32 = nbcu.getValOnce(nbcu.prop32, 'search_prop32', 0);
      }
    } else {

      if (!nbcu.prop32) {
        nbcu.prop32 = nbcu.Util.getQueryParam('keywords').toLowerCase();
        nbcu.prop32 = "no keyword";
      }
      nbcu.prop32 = nbcu.getValOnce(nbcu.prop32, 'search_prop32', 0);
    }
    if (nbcu.prop32) {
      if (!nbcu.eVar32) {
        nbcu.eVar32 = 'D=c32';
      }
      if (nbcu.prop32 != "no keyword") {
        nbcu.events = nbcu.apl(nbcu.events, "event48", ",", 2);
      }
    }

  }
  /* Internal Search Refinements */
  if (document.URL.indexOf('/results/') > -1) {
    nbcu.prop33 = nbcu.Util.getQueryParam('sort,timeline', '|').toLowerCase();
    if (!nbcu.prop33) {
      nbcu.prop33 = "no search refinement";
    }
    nbcu.prop33 = nbcu.getValOnce(nbcu.prop33, 'search_prop33', 0);
    if (nbcu.prop33) {
      if (nbcu.prop33 != "no search refinement") {
        nbcu.events = nbcu.apl(nbcu.events, "event49", ",", 2);
      }
      nbcu.eVar33 = 'D=c33';
    }
  }
  /* Internal Search Browse */
  if (document.URL.indexOf('/results/') > -1) {
    if (!nbcu.prop34) {
      nbcu.prop34 = "page: " + nbcu.Util.getQueryParam('pg');
    }
    if (nbcu.prop34 == "page: ") {
      nbcu.prop34 = "page: 1";
    }
    nbcu.events = nbcu.apl(nbcu.events, "event50", ",", 2);
    if (!nbcu.eVar34) {
      nbcu.eVar34 = 'D=c34';
    }
  }

  /* Set Channel Variables */
  /* Disabling Channel code as per Ticket #36868
  nbcu.channelManager('cid,cmp,cmpid,_osource,__source,sky');
  if (nbcu._channel) {
    if (!nbcu.eVar56) {
      nbcu.eVar56 = nbcu._channel;
    }
    if (!nbcu.prop56) {
      nbcu.prop56 = "D=v56";
    }
    if (nbcu._partner) {
      if (!nbcu.eVar57) {
        nbcu.eVar57 = nbcu._partner;
      }
      if (!nbcu.prop57) {
        nbcu.prop57 = "D=v57";
      }
    } else {
      if (!nbcu.prop57 && !nbcu.eVar57)
        nbcu.prop57 = nbcu.eVar57 = 'no partner';
    }

    if (nbcu._keywords) {
      if (!nbcu.eVar58) {
        nbcu.eVar58 = nbcu._keywords;
      }
      if (!nbcu.prop58) {
        nbcu.prop58 = "D=v58";
      }
    } else {
      if (!nbcu.prop58 && !nbcu.eVar58)
        nbcu.prop58 = nbcu.eVar58 = 'no type keyword';
    }
    if (nbcu._keywords == "n/a") {
      if (!nbcu.prop58 && !nbcu.eVar58)
        nbcu.prop58 = nbcu.eVar58 = 'no type keyword';
    }
    if (nbcu._referringDomain) {
      if (!nbcu.eVar59)
        nbcu.eVar59 = nbcu._referringDomain;
      if (!nbcu.prop59) {
        nbcu.prop59 = "D=v59";
      }
    } else {
      if (!nbcu.prop59 && !nbcu.eVar59) {
        nbcu.prop59 = nbcu.eVar59 = 'no referring domain';
      }
    }
    if (nbcu._referrer) {
      if (!nbcu.eVar60) {
        nbcu.eVar60 = nbcu._referrer;
      }
      if (!nbcu.prop60) {
        nbcu.prop60 = "D=v60";
      }
    } else {
      if (!nbcu.prop60 && !nbcu.eVar60) {
        nbcu.prop60 = nbcu.eVar60 = 'no referrer';
      }
    }
    nbcu.hier2 = nbcu.crossVisitParticipation(nbcu.campaign, 'nbcu_campaign_channel', '30', '15', ':', '', 1);
    nbcu.hier3 = nbcu.crossVisitParticipation(nbcu.eVar56, 'nbcu_eVar56_mktchannel', '30', '15', ':', '', 1);
    if (nbcu._channel == 'Paid Search' || nbcu._channel == 'Natural Search') {
      nbcu.hier4 = nbcu._partner + '>' + nbcu._channel + '>' + nbcu._keywords;
    }
  }
*/
  /* TIME PARTING */
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  if (s_timeZone) {
    s_timeZone = s_timeZone.toUpperCase();
  }
  switch (s_timeZone) {
    case 'EST':
      //  nbcu.prop12=nbcu.getTimeParting('h','-5',year).toLowerCase(); // Set hour
      if (!nbcu.prop12) {
        nbcu.prop12 = nbcu.getTimeParting('h', '-5', year).toLowerCase(); // Set hour
      }

      if (!nbcu.eVar12) {
        nbcu.eVar12 = "D=c12";
      }

      if (!nbcu.prop13) {
        nbcu.prop13 = nbcu.getTimeParting('d', '-5', year).toLowerCase(); // Set day
      }
      if (!nbcu.eVar13) {
        nbcu.eVar13 = "D=c13";
      }
      break;
    case 'MST':
      if (!nbcu.prop12) {
        nbcu.prop12 = nbcu.getTimeParting('h', '-6', year).toLowerCase(); // Set hour
      }
      if (!nbcu.eVar12) {
        nbcu.eVar12 = "D=c12";
      }
      if (!nbcu.prop13) {
        nbcu.prop13 = nbcu.getTimeParting('d', '-6', year).toLowerCase(); // Set day
      }
      if (!nbcu.eVar13) {
        nbcu.eVar13 = "D=c13";
      }
      break;
    case 'CST':
      if (!nbcu.prop12) {
        nbcu.prop12 = nbcu.getTimeParting('h', '-7', year).toLowerCase(); // Set hour
      }
      if (!nbcu.eVar12) {
        nbcu.eVar12 = "D=c12";
      }
      if (!nbcu.prop13) {
        nbcu.prop13 = nbcu.getTimeParting('d', '-7', year).toLowerCase(); // Set day
      }
      if (!nbcu.eVar13) {
        nbcu.eVar13 = "D=c13";
      }
      break;
    case 'PST':
      if (!nbcu.prop12) {
        nbcu.prop12 = nbcu.getTimeParting('h', '-8', year).toLowerCase(); // Set hour
      }
      if (!nbcu.eVar12) {
        nbcu.eVar12 = "D=c12";
      }
      if (!nbcu.prop13) {
        nbcu.prop13 = nbcu.getTimeParting('d', '-8', year).toLowerCase(); // Set day
      }
      if (!nbcu.eVar13) {
        nbcu.eVar13 = "D=c13";
      }
      break;
    case 'AKST':
      if (!nbcu.prop12) {
        nbcu.prop12 = nbcu.getTimeParting('h', '-9', year).toLowerCase(); // Set hour
      }
      if (!nbcu.eVar12) {
        nbcu.eVar12 = "D=c12";
      }
      if (!nbcu.prop13) {
        nbcu.prop13 = nbcu.getTimeParting('d', '-9', year).toLowerCase(); // Set day
      }
      if (!nbcu.eVar13) {
        nbcu.eVar13 = "D=c13";
      }
      break;
    case 'HAST':
      if (!nbcu.prop12) {
        nbcu.prop12 = nbcu.getTimeParting('h', '-10', year).toLowerCase(); // Set hour
      }
      if (!nbcu.eVar12) {
        nbcu.eVar12 = "D=c12";
      }
      if (!nbcu.prop13) {
        nbcu.prop13 = nbcu.getTimeParting('d', '-10', year).toLowerCase(); // Set day
      }
      if (!nbcu.eVar13) {
        nbcu.eVar13 = "D=c13";
      }
      break;
    default:
      if (!nbcu.prop12) {
        nbcu.prop12 = nbcu.getTimeParting('h', '-5', year).toLowerCase(); // Set hour
      }
      if (!nbcu.eVar12) {
        nbcu.eVar12 = "D=c12";
      }
      nbcu.prop13 = nbcu.getTimeParting('d', '-5', year).toLowerCase(); // Set day
      if (!nbcu.eVar13) {
        nbcu.eVar13 = "D=c13";
      }
    }

  /* New/Repeat Status and Pathing Variables */
  nbcu.prop15 = nbcu.getNewRepeat();
  nbcu.prop15 = nbcu.prop15.toLowerCase();
  nbcu.eVar15 = nbcu.prop15;
  if (nbcu.pageName && nbcu.prop15 == 'new')
    nbcu.prop11 = "D=pageName";
  if (nbcu.pageName && nbcu.prop15 == 'repeat')
    if (!nbcu.prop14) {
      nbcu.prop14 = "D=pageName";
    }

  /* Get Visit Number Monthly */
  if (!nbcu.prop16) {
    nbcu.prop16 = nbcu.getVisitNum();
  }
  if (!nbcu.eVar16) {
    nbcu.eVar16 = "D=c16";
  }

  /* Get Days Since Last Visit */
  if (!nbcu.prop17) {
    nbcu.prop17 = nbcu.getDaysSinceLastVisit('nbcu_dayslastvisit');
  }
  if (!nbcu.eVar17) {
    nbcu.eVar17 = "D=c17";
  }

  /* A/B Testing Metrics */
  if (nbcu.prop48) {
    nbcu.eVar20 = "D=c48";
  }
  /* Detail Content */
  if (nbcu.prop21) {
    nbcu.prop21 = omniStrip(nbcu.prop21);
    nbcu.eVar21 = nbcu.prop21;
  }
  if (nbcu.prop22) {
    // remove per ticket 29042
    //nbcu.prop22 = omniStrip(nbcu.prop22);
    nbcu.eVar22 = nbcu.prop22;
  }
  if (!nbcu.prop23) {
    nbcu.prop23 = "Not yet specified";
  }
  if (nbcu.prop23) {
    nbcu.prop23 = omniStrip(nbcu.prop23);
    nbcu.eVar23 = nbcu.prop23;
  }
  if (nbcu.prop24) {
    nbcu.prop24 = omniStrip(nbcu.prop24);
    nbcu.eVar24 = nbcu.prop24;
  }
  if (nbcu.prop25) {
    nbcu.prop25 = omniStrip(nbcu.prop25);
    nbcu.eVar25 = nbcu.prop25;
  }
  if (nbcu.prop26) {
    nbcu.prop26 = omniStrip(nbcu.prop26);
    //nbcu.eVar26 = nbcu.prop26;
  }
  if (nbcu.prop27) {
    // remove per ticket 29042
    //nbcu.prop27 = omniStrip(nbcu.prop27);
    nbcu.eVar44 = nbcu.prop27;
  }
  if (nbcu.prop28) {
    nbcu.prop28 = omniStrip(nbcu.prop28);
    nbcu.eVar28 = nbcu.prop28;
  }

  /* Membership Tracking*/
  /* Member Metrics */
  if (nbcu.eVar29) {
    nbcu.prop29 = nbcu.eVar29;
    nbcu.eVar29 = nbcu.getAndPersistValue(nbcu.prop29, 'nbcu_eVar29_persist', 0);
    nbcu.prop29 = nbcu.getAndPersistValue(nbcu.eVar29, 'nbcu_prop29_persist', 0);
  }
  if (nbcu.eVar30) {
    nbcu.prop30 = nbcu.eVar30;
    nbcu.eVar30 = nbcu.getAndPersistValue(nbcu.prop30, 'nbcu_evar30_persist', 0);
    nbcu.prop30 = nbcu.getAndPersistValue(nbcu.eVar30, 'nbcu_prop30_persist', 0);
  }
  if (nbcu.eVar29) {
    nbcu.eVar29temp = nbcu.eVar29;
    nbcu.eVar29temp = nbcu.getValOnce(nbcu.eVar29temp, 'nbcu_eVar29temp', 0);
    if (nbcu.eVar29temp) {
      nbcu.events = nbcu.apl(nbcu.events, "event7", ",", 2);
    }
  }

  // Link tracking v2 cookie check
  tempLinkNameValue = nbcu.Util.cookieRead("tempLinkTracking");
  if(tempLinkNameValue !== "" && checkCookieOnce == false){
    tempLinkNameValue = tempLinkNameValue.split(/&lpos=|&lid=/);
    var tempLinkPos = tempLinkNameValue[1];
    var tempLinkId = tempLinkNameValue[2];

    nbcu.prop52 = nbcu.eVar53;// c52
    nbcu.prop53 = tempLinkId;// c53
    nbcu.prop54 = nbcu.eVar53 + " | " + tempLinkId;// c54
    nbcu.prop55 = tempLinkPos;// c55

    nbcu.Util.cookieWrite("tempLinkTracking","");
  }
  checkCookieOnce = true;


  /*override none values with null*/

  for(i=1;i<76;i++)
  {
    var for_prop="prop",for_evar="eVar";
    for_prop=for_prop+i.toString();
    for_evar=for_evar+i.toString();

    if(nbcu[for_prop]=='none'||nbcu[for_prop]=='None'||nbcu[for_prop]=='NONE')
    {
      nbcu[for_prop]="";
    }
    if(nbcu[for_evar]=='none'||nbcu[for_evar]=='None'||nbcu[for_evar]=='NONE')
    {
      nbcu[for_evar]="";
    }
  }

  //Custom code starts from ots_dil.js
  var otsDil = DIL.create({
    partner: "nbcu",
    containerNSID: 0 ,
    secureDataCollection: false,
    uuidCookie: {
      name: 'aam_uuid',
      days: 30
    }
  });
  //host finder
  if(nbc.env !== ""){// Keep out of prod for now
    var cleaned_host;
    if(nbc.env === ""){
      if(location.host.indexOf('www.') === 0){
        cleaned_host = location.host.replace('www.','');
        cleaned_host = cleaned_host.replace('.com','');
      }
    } else {
      cleaned_host = location.host.replace(nbc.env + 'www.','');
      cleaned_host = cleaned_host.replace('.com','');
    }
  }

  //replace customObj - line 106 & 109 with the MPS obj having the data
  if(typeof mpscall != 'undefined'){
    //Object is present, submit data
    var nbcotsDilInstance = DIL.getDil('nbcu');
    if(nbc.env !== ""){// Keep out of prod for now
      nbcotsDilInstance.api.signals(mpscall, cleaned_host+'_');
    } else {
      nbcotsDilInstance.api.signals(mpscall, 'c_');
    }
  };

  if (typeof s != 'undefined' && s === Object(s) && typeof s.account != 'undefined' && s.account) {
  	_scDilObj = s_gi(s.account);
  } else {
  	_scDilObj = s_gi(nbcu_account);
  };

  //SC Object Data Collection
  DIL.modules.siteCatalyst.init(_scDilObj, otsDil, {
    names: ['pageName', 'channel', 'campaign', 'products', 'events', 'pe', 'referrer', 'server', 'purchaseID', 'zip', 'state'],
    iteratedNames: [{
      name: 'eVar',
      maxIndex: 75
    }, {
      name: 'prop',
      maxIndex: 75
    }, {
      name: 'pev',
      maxIndex: 3
    }, {
      name: 'hier',
      maxIndex: 4
    }]
  });
  //DIL instantiation ends
  //Custom code ends
}
nbcu.doPlugins = s_doPlugins;

nbcu.getLinks = function () {
  for (var i = 0; i < document.links.length; i++) {
    lnk = document.links[i];
    var exitLinkAttachEvent = jQuery(lnk).hasClass( "lbFile" ) || jQuery(lnk).hasClass( "embedCode" ) || jQuery(lnk).hasClass( "sample" );
    if (!exitLinkAttachEvent) {
        if (lnk.addEventListener) {
          lnk.addEventListener('click', nbcu.sendExitConversion, false);
        } else if (lnk.attachEvent) {
          lnk.attachEvent('onclick', nbcu.sendExitConversion);
        }
    }
  }
};

nbcu.setBodyOnload = function () {
  if (document.addEventListener) {
    document.addEventListener('load', nbcu.getLinks(), false);
  } else if (document.attachEvent) {
    document.attachEvent('onload', nbcu.getLinks());
  }
};

jQuery(document).ready(function(){
  nbcu.getLinks();
});


nbcu.sendExitConversion = function(event) {

  var obj;
  event = event ? event : window.event;

  if (event.target) {
    obj = event.target;
  } else if (event.srcElement) {
    obj = event.srcElement;
  }
  if (obj.href) {
    var exitLinks = nbcu.linkInternalFilters;
    var exitArray = exitLinks.split(',');
    if (nbcu.trackExternalLinks == false) {
      isExitLink = true;
      for ( i = 0; i < exitArray.length; i++) {
        if (obj.href.toLowerCase().indexOf(exitArray[i].toLowerCase()) > -1) {
          isExitLink = false;
        }
      }
      exitURLStart = obj.href.substring(obj.href.indexOf('//') + 2, obj.href.length);
      if (exitURLStart.indexOf('/') > -1) {
        exitURLEnd = exitURLStart.indexOf('/');
      } else {
        exitURLEnd = exitURLStart.length;
      }
      var exitDomain = exitURLStart.substring(0, exitURLEnd);
      if (isExitLink) {

        /* SET YOUR EXIT LINK VARIABLES AND EVENTS HERE */
        url = obj.href;
        target = (obj.getAttribute("target") !== null) ? obj.getAttribute("target") : '';
        nbcu.linkTrackVars = "prop5";
        nbcu.prop5 = exitDomain;
        nbcu.linkTrackEvents = "None";
        nbcu.events = "None";
        //var ppv = nbcu.getPercentPageViewed(nbcu.pageName); //get array of data on prev page % viewed
        //nbcu.prop72 = ppv[3]+"px maximum vertical pixels viewed";//prop72: Viewport height in CSS pixels new
        //nbcu.prop73 = ppv[7]+"px displayed height";//Display height in real pixels (reflecting orientation) new

        if (target === "_blank" || target === "new" || target === "_newtab" || obj.getAttribute("onclick") !== null) {
          nbcu.tl(this,'e',exitDomain,null);

        } else if (target !== "") {
          event.preventDefault();
          nbcu.tl(this,'e',exitDomain,null, function() {
            window.open(url,target);
          });

        } else {
          event.preventDefault();
          nbcu.tl(this,'e',exitDomain,null,'navigate' );
        }
      } else { // Start Link Tracking v2
        linkPosValue = (obj.getAttribute("data-lpos") !== null) ? obj.getAttribute("data-lpos") : '';
        linkNameValue = (obj.getAttribute("data-lid") !== null) ? obj.getAttribute("data-lid") : '';

        nbcu.Util.cookieWrite("tempLinkTracking","&lpos=" + linkPosValue + "&lid=" + linkNameValue);
      }
    }
  }
};

nbcu.trackingServer = "nbcume.sc.omtrdc.net";
nbcu.trackingServerSecure = "nbcume.sc.omtrdc.net";

/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here.                 */
nbcu.p_fo = new Function("n", ""
     + "var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
     + "new Object;return 1;}else {return 0;}");
/*
 * Plugin: clickPast - version 1.0
 */
nbcu.clickPast = new Function("scp", "ct_ev", "cp_ev", "cpc", ""
     + "var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc)"
     + "{cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev"
     + ";s.Util.cookieWrite(cpc,1,0);}else{if(s.Util.cookieRead(cpc)>=1){s.events=ev+cp_ev;s.Util.cookieWrite(cpc"
     + ",0,0);}}}");
/*
 * Plugin: channelExtract (customized) : 1.0 -
 * returns site section based on delimiter
 */
nbcu.channelExtractCust = new Function("d", "sp", "p", "u", "pv", "ep", ""
     + "var s=this,v='';var i,n,a=s.split(u+'',d),al=a.length;if(al<p){if(p"
     + "v==1)p=al;else return'';}for(i=sp;i<=p;i++){if(ep!=i){v+=a[i-1];if("
     + "i<p)v+=d;}}return v");
/*
 * Utility Function: vpr - set the variable vs with value v
 */
nbcu.vpr = new Function("vs", "v",
    "if(typeof(v)!='undefined'){var s=this; eval('s.'+vs+'=\"'+v+'\"')}");
/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here.                 */

/* * Plugin: exitLinkHandler 0.8 - identify and report exit links */
nbcu.exitLinkHandler = new Function("p", "e", ""
     + "var s=this,o=s.p_gh(),h=o.href,n='linkInternalFilters',i,t;if(!h||("
     + "s.linkType&&(h||s.linkName)))return'';i=h.indexOf('?');t=s[n];s[n]="
     + "p?p:t;h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);if(s.lt(h)=="
     + "'e')s.linkType='e';else h='';s[n]=t;return e?o:h;");

/* * Plugin: downloadLinkHandler 0.8 - identify and report download links */
nbcu.downloadLinkHandler = new Function("p", "e", ""
     + "var s=this,o=s.p_gh(),h=o.href,n='linkDownloadFileTypes',i,t;if(!h|"
     + "|(s.linkType&&(h||s.linkName)))return'';i=h.indexOf('?');t=s[n];s[n"
     + "]=p?p:t;if(s.lt(h)=='d')s.linkType='d';else h='';s[n]=t;return e?o:"
     + "h;");

/* * Plugin: linkHandler 0.8 - identify and report custom links */
nbcu.linkHandler = new Function("p", "t", "e", ""
     + "var s=this,o=s.p_gh(),h=o.href,i,l;t=t?t:'o';if(!h||(s.linkType&&(h"
     + "||s.linkName)))return'';i=h.indexOf('?');h=s.linkLeaveQueryString||"
     + "i<0?h:h.substring(0,i);l=s.pt(p,'|','p_gn',h.toLowerCase());if(l){s"
     + ".linkName=l=='[['?'':l;s.linkType=t;return e?o:h;}return'';");
nbcu.p_gh = new Function("", ""
     + "var s=this;if(!s.eo&&!s.lnk)return'';var o=s.eo?s.eo:s.lnk,y=s.ot(o"
     + "),n=s.oid(o),x=o.s_oidt;if(s.eo&&o==s.eo){while(o&&!n&&y!='BODY'){o"
     + "=o.parentElement?o.parentElement:o.parentNode;if(!o)return'';y=s.ot"
     + "(o);n=s.oid(o);x=o.s_oidt;}}return o?o:'';");
nbcu.p_gn = new Function("t", "h", ""
     + "var i=t?t.indexOf('~'):-1,n,x;if(t&&h){n=i<0?'':t.substring(0,i);x="
     + "t.substring(i+1);if(h.indexOf(x.toLowerCase())>-1)return n?n:'[[';}"
     + "return 0;");

/*
 * Plugin: getPreviousValue v1.0 - return previous value of designated
 *   variable (requires split utility)
 */
nbcu.getPreviousValue = new Function("v", "c", "el", ""
     + "var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
     + "){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
     + "){for(y in j){if(i[x]==j[y]){if(s.Util.cookieRead(c)) r=s.Util.cookieRead(c);v?s.Util.cookieWrite(c,v,t)"
     + ":s.Util.cookieWrite(c,'no value',t);return r}}}}}else{if(s.Util.cookieRead(c)) r=s.Util.cookieRead(c);v?"
     + "s.Util.cookieWrite(c,v,t):s.Util.cookieWrite(c,'no value',t);return r}");
/*
 * Plugin: getAndPersistValue 0.3 - get a value on every page
 */
nbcu.getAndPersistValue = new Function("v", "c", "e", ""
     + "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("
     + "v)s.Util.cookieWrite(c,v,e?a:0);return s.Util.cookieRead(c);");
/*
 * Plugin: setupLinkTrack 2.0 - return links for HBX-based link
 *         tracking in SiteCatalyst (requires nbcu.split and nbcu.apl)
 */
nbcu.setupLinkTrack = new Function("vl", "c", ""
     + "var s=this;var l=s.d.links,cv,cva,vla,h,i,l,t,b,o,y,n,oc,d='';cv=s."
     + "Util.cookieRead(c);if(vl&&cv!=''){cva=s.split(cv,'^^');vla=s.split(vl,',');for("
     + "x in vla)s._hbxm(vla[x])?s[vla[x]]=cva[x]:'';}s.Util.cookieWrite(c,'',0);if(!s.e"
     + "o&&!s.lnk)return '';o=s.eo?s.eo:s.lnk;y=s.ot(o);n=s.oid(o);if(s.eo&"
     + "&o==s.eo){while(o&&!n&&y!='BODY'){o=o.parentElement?o.parentElement"
     + ":o.parentNode;if(!o)return '';y=s.ot(o);n=s.oid(o);}for(i=0;i<4;i++"
     + ")if(o.tagName)if(o.tagName.toLowerCase()!='a')if(o.tagName.toLowerC"
     + "ase()!='area')o=o.parentElement;}b=s._LN(o);o.lid=b[0];o.lpos=b[1];"
     + "if(s.hbx_lt&&s.hbx_lt!='manual'){if((o.tagName&&s._TL(o.tagName)=='"
     + "area')){if(!s._IL(o.lid)){if(o.parentNode){if(o.parentNode.name)o.l"
     + "id=o.parentNode.name;else o.lid=o.parentNode.id}}if(!s._IL(o.lpos))"
     + "o.lpos=o.coords}else{if(s._IL(o.lid)<1)o.lid=s._LS(o.lid=o.text?o.t"
     + "ext:o.innerText?o.innerText:'');if(!s._IL(o.lid)||s._II(s._TL(o.lid"
     + "),'<img')>-1){h=''+o.innerHTML;bu=s._TL(h);i=s._II(bu,'<img');if(bu"
     + "&&i>-1){eval(\"__f=/ src\s*=\s*[\'\\\"]?([^\'\\\" ]+)[\'\\\"]?/i\")"
     + ";__f.exec(h);if(RegExp.$1)h=RegExp.$1}o.lid=h}}}h=o.href?o.href:'';"
     + "i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l"
     + "=s.linkName?s.linkName:s._hbxln(h);t=s.linkType?s.linkType.toLowerC"
     + "ase():s.lt(h);oc=o.onclick?''+o.onclick:'';cv=s.pageName+'^^'+o.lid"
     + "+'^^'+s.pageName+' | '+(o.lid=o.lid?o.lid:'no &lid')+'^^'+o.lpos;if"
     + "(t&&(h||l)){cva=s.split(cv,'^^');vla=s.split(vl,',');for(x in vla)s"
     + "._hbxm(vla[x])?s[vla[x]]=cva[x]:'';}else if(!t&&oc.indexOf('.tl(')<"
     + "0){s.Util.cookieWrite(c,cv,0);}else return ''");
nbcu._IL = new Function("a", "var s=this;return a!='undefined'?a.length:0");
nbcu._II = new Function("a", "b", "c", "var s=this;return a.indexOf(b,c?c:0)");
nbcu._IS = new Function("a", "b", "c", ""
     + "var s=this;return b>s._IL(a)?'':a.substring(b,c!=null?c:s._IL(a))");
nbcu._LN = new Function("a", "b", "c", "d", ""
     + "var s=this;b=a.href;b+=a.name?a.name:'';c=s._LVP(b,'lid');d=s._LVP("
     + "b,'lpos');r"
     + "eturn[c,d]");
nbcu._LVP = new Function("a", "b", "c", "d", "e", ""
     + "var s=this;c=s._II(a,'&'+b+'=');c=c<0?s._II(a,'?'+b+'='):c;if(c>-1)"
     + "{d=s._II(a,'&',c+s._IL(b)+2);e=s._IS(a,c+s._IL(b)+2,d>-1?d:s._IL(a)"
     + ");return e}return ''");
nbcu._LS = new Function("a", ""
     + "var s=this,b,c=100,d,e,f,g;b=(s._IL(a)>c)?escape(s._IS(a,0,c)):esca"
     + "pe(a);b=s._LSP(b,'%0A','%20');b=s._LSP(b,'%0D','%20');b=s._LSP(b,'%"
     + "09','%20');c=s._IP(b,'%20');d=s._NA();e=0;for(f=0;f<s._IL(c);f++){g"
     + "=s._RP(c[f],'%20','');if(s._IL(g)>0){d[e++]=g}}b=d.join('%20');retu"
     + "rn unescape(b)");
nbcu._LSP = new Function("a", "b", "c", "d", "var s=this;d=s._IP(a,b);return d"
     + ".join(c)");
nbcu._IP = new Function("a", "b", "var s=this;return a.split(b)");
nbcu._RP = new Function("a", "b", "c", "d", ""
     + "var s=this;d=s._II(a,b);if(d>-1){a=s._RP(s._IS(a,0,d)+','+s._IS(a,d"
     + "+s._IL(b),s._IL(a)),b,c)}return a");
nbcu._TL = new Function("a", "var s=this;return a.toLowerCase()");
nbcu._NA = new Function("a", "var s=this;return new Array(a?a:0)");
nbcu._hbxm = new Function("m", "var s=this;return (''+m).indexOf('{')<0");
nbcu._hbxln = new Function("h", "var s=this,n=s.linkNames;if(n)return s.pt("
     + "n,',','lnf',h);return ''");
/*
 * channelManager v2.5 - Tracking External Traffic
 */
nbcu.channelManager = new Function("a", "b", "c", "d", "e", "f", ""
     + "var s=this,A,B,g,l,m,M,p,q,P,h,k,u,S,i,O,T,j,r,t,D,E,F,G,H,N,U,v=0,"
     + "X,Y,W,n=new Date;n.setTime(n.getTime()+1800000);if(e){v=1;if(s.Util.cookieRead("
     + "e))v=0;if(!s.Util.cookieWrite(e,1,n))s.Util.cookieWrite(e,1,0);if(!s.Util.cookieRead(e))v=0;}g=s.referrer"
     + "?s.referrer:document.referrer;g=g.toLowerCase();if(!g)h=1;i=g.index"
     + "Of('?')>-1?g.indexOf('?'):g.length;j=g.substring(0,i);k=s.linkInter"
     + "nalFilters.toLowerCase();k=s.split(k,',');for(m=0;m<k.length;m++){B"
     + "=j.indexOf(k[m])==-1?'':g;if(B)O=B;}if(!O&&!h){p=g;U=g.indexOf('//'"
     + ");q=U>-1?U+2:0;Y=g.indexOf('/',q);r=Y>-1?Y:i;u=t=g.substring(q,r).t"
     + "oLowerCase();P='Other Natural Referrers';S=s.seList+'>'+s._extraSea"
     + "rchEngines;if(d==1){j=s.repl(j,'oogle','%');j=s.repl(j,'ahoo','^');"
     + "g=s.repl(g,'as_q','*')}A=s.split(S,'>');for(i=0;i<A.length;i++){D=A"
     + "[i];D=s.split(D,'|');E=s.split(D[0],',');for(G=0;G<E.length;G++){H="
     + "j.indexOf(E[G]);if(H>-1){i=s.split(D[1],',');for(k=0;k<i.length;k++"
     + "){l=s.Util.getQueryParam(i[k],'',g).toLowerCase();if(l){M=l;if(D[2])N=u="
     + "D[2];else N=t;if(d==1){N=s.repl(N,'#','-');g=s.repl(g,'*','as_q');N"
     + "=s.repl(N,'^','ahoo');N=s.repl(N,'%','oogle');}}}}}}}if(!O||f!='1')"
     + "{O=s.Util.getQueryParam(a,b);if(O){u=O;if(M)P='Paid Search';else P='Unkn"
     + "own Paid Channel';}if(!O&&M){u=N;P='Natural Search';}}if(h==1&&!O&&"
     + "v==1)u=P=t=p='Typed/Bookmarked';g=s._channelDomain;if(g){k=s.split("
     + "g,'>');;for(m=0;m<k.length;m++){q=s.split(k[m],'|');r=s.split(q[1],"
     + "',');S=r.length;for(T=0;T<S;T++){Y=r[T];Y=Y.toLowerCase();i=j.index"
     + "Of(Y);if(i>-1)P=q[0];}}}g=s._channelParameter;if(g){k=s.split(g,'>'"
     + ");h;for(m=0;m<k.length;m++){q=s.split(k[m],'|');r=s.split(q[1],',')"
     + ";S=r.length;for(T=0;T<S;T++){U=s.Util.getQueryParam(r[T]);if(U)P=q[0];}}"
     + "}g=s._channelPattern;if(g){k=s.split(g,'>');for(m=0;m<k.length;m++)"
     + "{q=s.split(k[m],'|');r=s.split(q[1],',');S=r.length;for(T=0;T<S;T++"
     + "){Y=r[T];Y=Y.toLowerCase();i=O.toLowerCase();H=i.indexOf(Y);if(H==0"
     + ")P=q[0];}}}X=P+M+t;c=c?c:'c_m';if(c!='0')X=s.getValOnce(X,c,0);if(X"
     + "){s._referrer=p?p:'n/a';s._referringDomain=t?t:'n/a';s._partner=N?N"
     + ":'n/a';s._campaignID=O?O:'n/a';s._campaign=u?u:'n/a';s._keywords=M?"
     + "M:'n/a';s._channel=P?P:'n/a';}");
/* non-custom list */
/* Top 130 */
nbcu.seList = "altavista.co|q,r|AltaVista>aol.co.uk,search.aol.co.uk|query"
   + "|AOL - United Kingdom>search.aol.com,search.aol.ca|query,q|AOL.com "
   + "Search>ask.com,ask.co.uk|ask,q|Ask Jeeves>www.baidu.com|wd|Baidu>da"
   + "um.net,search.daum.net|q|Daum>google.co,googlesyndication.com|q,as_"
   + "q|Google>google.com.ar|q,as_q|Google - Argentina>google.com.au|q,as"
   + "_q|Google - Australia>google.at|q,as_q|Google - Austria>google.com."
   + "bh|q,as_q|Google - Bahrain>google.com.bd|q,as_q|Google - Bangladesh"
   + ">google.be|q,as_q|Google - Belgium>google.com.bo|q,as_q|Google - Bo"
   + "livia>google.ba|q,as_q|Google - Bosnia-Hercegovina>google.com.br|q,"
   + "as_q|Google - Brasil>google.bg|q,as_q|Google - Bulgaria>google.ca|q"
   + ",as_q|Google - Canada>google.cl|q,as_q|Google - Chile>google.cn|q,a"
   + "s_q|Google - China>google.com.co|q,as_q|Google - Colombia>google.co"
   + ".cr|q,as_q|Google - Costa Rica>google.hr|q,as_q|Google - Croatia>go"
   + "ogle.cz|q,as_q|Google - Czech Republic>google.dk|q,as_q|Google - De"
   + "nmark>google.com.do|q,as_q|Google - Dominican Republic>google.com.e"
   + "c|q,as_q|Google - Ecuador>google.com.eg|q,as_q|Google - Egypt>googl"
   + "e.com.sv|q,as_q|Google - El Salvador>google.ee|q,as_q|Google - Esto"
   + "nia>google.fi|q,as_q|Google - Finland>google.fr|q,as_q|Google - Fra"
   + "nce>google.de|q,as_q|Google - Germany>google.gr|q,as_q|Google - Gre"
   + "ece>google.com.gt|q,as_q|Google - Guatemala>google.hn|q,as_q|Google"
   + " - Honduras>google.com.hk|q,as_q|Google - Hong Kong>google.hu|q,as_"
   + "q|Google - Hungary>google.co.in|q,as_q|Google - India>google.co.id|"
   + "q,as_q|Google - Indonesia>google.ie|q,as_q|Google - Ireland>google."
   + "is|q,as_q|Google - Island>google.co.il|q,as_q|Google - Israel>googl"
   + "e.it|q,as_q|Google - Italy>google.com.jm|q,as_q|Google - Jamaica>go"
   + "ogle.co.jp|q,as_q|Google - Japan>google.jo|q,as_q|Google - Jordan>g"
   + "oogle.co.ke|q,as_q|Google - Kenya>google.co.kr|q,as_q|Google - Kore"
   + "a>google.lv|q,as_q|Google - Latvia>google.lt|q,as_q|Google - Lithua"
   + "nia>google.com.my|q,as_q|Google - Malaysia>google.com.mt|q,as_q|Goo"
   + "gle - Malta>google.mu|q,as_q|Google - Mauritius>google.com.mx|q,as_"
   + "q|Google - Mexico>google.co.ma|q,as_q|Google - Morocco>google.nl|q,"
   + "as_q|Google - Netherlands>google.co.nz|q,as_q|Google - New Zealand>"
   + "google.com.ni|q,as_q|Google - Nicaragua>google.com.ng|q,as_q|Google"
   + " - Nigeria>google.no|q,as_q|Google - Norway>google.com.pk|q,as_q|Go"
   + "ogle - Pakistan>google.com.py|q,as_q|Google - Paraguay>google.com.p"
   + "e|q,as_q|Google - Peru>google.com.ph|q,as_q|Google - Philippines>go"
   + "ogle.pl|q,as_q|Google - Poland>google.pt|q,as_q|Google - Portugal>g"
   + "oogle.com.pr|q,as_q|Google - Puerto Rico>google.com.qa|q,as_q|Googl"
   + "e - Qatar>google.ro|q,as_q|Google - Romania>google.ru|q,as_q|Google"
   + " - Russia>google.st|q,as_q|Google - Sao Tome and Principe>google.co"
   + "m.sa|q,as_q|Google - Saudi Arabia>google.com.sg|q,as_q|Google - Sin"
   + "gapore>google.sk|q,as_q|Google - Slovakia>google.si|q,as_q|Google -"
   + " Slovenia>google.co.za|q,as_q|Google - South Africa>google.es|q,as_"
   + "q|Google - Spain>google.lk|q,as_q|Google - Sri Lanka>google.se|q,as"
   + "_q|Google - Sweden>google.ch|q,as_q|Google - Switzerland>google.com"
   + ".tw|q,as_q|Google - Taiwan>google.co.th|q,as_q|Google - Thailand>go"
   + "ogle.bs|q,as_q|Google - The Bahamas>google.tt|q,as_q|Google - Trini"
   + "dad and Tobago>google.com.tr|q,as_q|Google - Turkey>google.com.ua|q"
   + ",as_q|Google - Ukraine>google.ae|q,as_q|Google - United Arab Emirat"
   + "es>google.co.uk|q,as_q|Google - United Kingdom>google.com.uy|q,as_q"
   + "|Google - Uruguay>google.co.ve|q,as_q|Google - Venezuela>google.com"
   + ".vn|q,as_q|Google - Viet Nam>google.co.vi|q,as_q|Google - Virgin Is"
   + "lands>icqit.com|q|icq>bing.com|q|Microsoft Bing>myway.com|searchfor"
   + "|MyWay.com>naver.com,search.naver.com|query|Naver>netscape.com|quer"
   + "y,search|Netscape Search>reference.com|q|Reference.com>seznam|w|Sez"
   + "nam.cz>abcsok.no|q|Startsiden>tiscali.it|key|Tiscali>virgilio.it|qs"
   + "|Virgilio>yahoo.com,search.yahoo.com|p|Yahoo!>ar.yahoo.com,ar.searc"
   + "h.yahoo.com|p|Yahoo! - Argentina>au.yahoo.com,au.search.yahoo.com|p"
   + "|Yahoo! - Australia>ca.yahoo.com,ca.search.yahoo.com|p|Yahoo! - Can"
   + "ada>fr.yahoo.com,fr.search.yahoo.com|p|Yahoo! - France>de.yahoo.com"
   + ",de.search.yahoo.com|p|Yahoo! - Germany>hk.yahoo.com,hk.search.yaho"
   + "o.com|p|Yahoo! - Hong Kong>in.yahoo.com,in.search.yahoo.com|p|Yahoo"
   + "! - India>yahoo.co.jp,search.yahoo.co.jp|p,va|Yahoo! - Japan>kr.yah"
   + "oo.com,kr.search.yahoo.com|p|Yahoo! - Korea>mx.yahoo.com,mx.search."
   + "yahoo.com|p|Yahoo! - Mexico>ph.yahoo.com,ph.search.yahoo.com|p|Yaho"
   + "o! - Philippines>sg.yahoo.com,sg.search.yahoo.com|p|Yahoo! - Singap"
   + "ore>es.yahoo.com,es.search.yahoo.com|p|Yahoo! - Spain>telemundo.yah"
   + "oo.com,espanol.search.yahoo.com|p|Yahoo! - Spanish (US : Telemundo)"
   + ">tw.yahoo.com,tw.search.yahoo.com|p|Yahoo! - Taiwan>uk.yahoo.com,uk"
   + ".search.yahoo.com|p|Yahoo! - UK and Ireland>yandex|text|Yandex.ru>s"
   + "earch.cnn.com|query|CNN Web Search>search.earthlink.net|q|Earthlink"
   + " Search>search.comcast.net|q|Comcast Search>search.rr.com|qs|RoadRu"
   + "nner Search>optimum.net|q|Optimum Search";

nbcu.handlePPVevents = new Function("", ""
     + "if(!s.getPPVid)return;var dh=Math.max(Math.max(s.d.body.scrollHeigh"
     + "t,s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight,"
     + "s.d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s."
     + "d.documentElement.clientHeight)),vph=s.wd.innerHeight||(s.d.documen"
     + "tElement.clientHeight||s.d.body.clientHeight),st=s.wd.pageYOffset||"
     + "(s.wd.document.documentElement.scrollTop||s.wd.document.body.scroll"
     + "Top),vh=st+vph,pv=Math.min(Math.round(vh/dh*100),100),c=s.Util.cookieRead('s_pp"
     + "v'),a=(c.indexOf(',')>-1)?c.split(',',4):[],id=(a.length>0)?(a[0]):"
     + "escape(s.getPPVid),cv=(a.length>1)?parseInt(a[1]):(0),p0=(a.length>"
     + "2)?parseInt(a[2]):(pv),cy=(a.length>3)?parseInt(a[3]):(0),cn=(pv>0)"
     + "?(id+','+((pv>cv)?pv:cv)+','+p0+','+((vh>cy)?vh:cy)):'';s.Util.cookieWrite('s_pp"
     + "v',cn);");
/*
 * Plugin: getPercentPageViewed v1.74
 */
    nbcu.getPercentPageViewed=new Function("n",""
    +"var s=this,W=window,EL=W.addEventListener,AE=W.attachEvent,E=['load"
    +"','unload','scroll','resize','zoom','keyup','mouseup','touchend','o"
    +"rientationchange','pan'],K='s_ppv',P=K+'l',I=n||s.pageName||documen"
    +"t.location.href;W.s_Obj=s;if(!W.s_PPVevent){s.s_PPVg=function(n,o){"
    +"var c=s.Util.cookieRead(o?P:K)||'',a=c.indexOf(',')>-1?c.split(',',10):[''],i;a"
    +"[0]=o?unescape(a[0]||''):I;for(i=1;i<9&&(i<a.length||!o);i++)a[i]=a"
    +"[i]?parseInt(a[i])||0:0;if(a.length>9||!o)a[9]=a[9]&&a[9]!='L'&&a[9"
    +"]!='LP'&&a[9]!='PL'?'P':a[9];return a};s.Util.cookieWrite(P,s.Util.cookieRead(K)||'');s.Util.cookieWrite("
    +"K,escape(I)+',0,0,0,0,0,0,0,0');W.s_PPVevent=function(e){var W=wind"
    +"ow,D=document||{},B=D.body,E=D.documentElement||{},S=window.screen|"
    +"|{},Ho='offsetHeight',Hs='scrollHeight',Ts='scrollTop',Wc='clientWi"
    +"dth',Hc='clientHeight',M=Math,C=100,J='object',N='number',Z=',',s=W"
    +".s_Obj||W.s||0;e=e&&typeof e==J?e.type||'':'';if(!e.indexOf('on'))e"
    +"=e.substring(2);if(W.s_PPVt&&!e){clearTimeout(s_PPVt);s_PPVt=0}if(s"
    +"&&typeof s==J&&B&&typeof B==J){var h=M.max(B[Hs]||E[Hs],B[Ho]||E[Ho"
    +"],B[Hc]||E[Hc]||1),X=W.innerWidth||E[Wc]||B[Wc]||1,Y=W.innerHeight|"
    +"|E[Hc]||B[Hc]||1,x=S.width||1,y=S.height||1,r=M.round(C*(W.devicePi"
    +"xelRatio||1))/C,b=(D.pageYOffset||E[Ts]||B[Ts]||0)+Y,p=h>0&&b>0?M.r"
    +"ound(C*b/h):1,O=W.orientation,o=!isNaN(O)?M.abs(O)%180:Y>X?0:90,a=s"
    +".s_PPVg(n),L=(e=='load')||(a[1]<1),t,V=function(u,v,f,n){v=typeof v"
    +"!=N?u:v;v=f||(u>v)?u:v;return n?v:v>C?C:v<0?0:v};if(new RegExp('(iP"
    +"od|iPad|iPhone)').exec((window.navigator&&navigator.userAgent)||'')"
    +"&&o){t=x;x=y;y=t}o=o?'L':'P';a[9]=L||!a[9]?o:a[9].substring(0,1);if"
    +"(a[9]!='L'&&a[9]!='P')a[9]=o;s.Util.cookieWrite(K,escape(a[0])+Z+V(a[1],p,!L)+Z+"
    +"V(a[2],p,L)+Z+V(a[3],b,L,1)+Z+X+Z+Y+Z+x+Z+y+Z+r+Z+a[9]+(a[9]==o?'':"
    +"o))}if(!W.s_PPVt&&e!='unload')W.s_PPVt=setTimeout(W.s_PPVevent,333)"
    +"};for(var f=W.s_PPVevent,i=0;i<E.length;i++)if(EL)EL(E[i],f,false);"
    +"else if(AE)AE('on'+E[i],f);f()};var a=s.s_PPVg(n,1);return!argument"
    +"s.length||n=='-'?a[1]:a");

    var ppv = nbcu.getPercentPageViewed(nbcu.pageName); //get array of data on prev page % viewed
    nbcu.prop72 = ppv[3]+"px maximum vertical pixels viewed";//prop72: Viewport height in CSS pixels new
    nbcu.prop73 = ppv[7]+"px displayed height";//Display height in real pixels (reflecting orientation) new

/*
 * Plugin: getPageName v2.1 - parse URL and return
 */
nbcu.getPageName = new Function("u", ""
     + "var s=this,v=u?u:''+s.wd.location,x=v.indexOf(':'),y=v.indexOf('/',"
     + "x+4),z=v.indexOf('?'),c=s.pathConcatDelim,e=s.pathExcludeDelim,g=s."
     + "queryVarsList,d=s.siteID,n=d?d:'',q=z<0?'':v.substring(z+1),p=v.sub"
     + "string(y+1,q?z:v.length);z=p.indexOf('#');p=z<0?p:s.fl(p,z);x=e?p.i"
     + "ndexOf(e):-1;p=x<0?p:s.fl(p,x);p+=!p||p.charAt(p.length-1)=='/'?s.d"
     + "efaultPage:'';y=c?c:'/';while(p){x=p.indexOf('/');x=x<0?p.length:x;"
     + "z=s.fl(p,x);if(!s.pt(s.pathExcludeList,',','p_c',z))n+=n?y+z:z;p=p."
     + "substring(x+1)}y=c?c:'?';while(g){x=g.indexOf(',');x=x<0?g.length:x"
     + ";z=s.fl(g,x);z=s.pt(q,'&','p_c',z);if(z){n+=n?y+z:z;y=c?c:'&'}g=g.s"
     + "ubstring(x+1)}return n");
/*
 * Utility Function: p_c
 */
nbcu.p_c = new Function("v", "c", ""
     + "var x=v.indexOf('=');return c.toLowerCase()==v.substring(0,x<0?v.le"
     + "ngth:x).toLowerCase()?v:0");

/*
 * Plugin: getTimeParting 1.3 - Set timeparting values based on time zone
 */

nbcu.getTimeParting = new Function("t", "z", "y", ""
     + "dc=new Date('1/1/2000');f=15;ne=8;if(dc.getDay()!=6||"
     + "dc.getMonth()!=0){return'Data Not Available'}else{;z=parseInt(z);"
     + "if(y=='2009'){f=8;ne=1};gmar=new Date('3/1/'+y);dsts=f-gmar.getDay("
     + ");gnov=new Date('11/1/'+y);dste=ne-gnov.getDay();spr=new Date('3/'"
     + "+dsts+'/'+y);fl=new Date('11/'+dste+'/'+y);cd=new Date();"
     + "if(cd>spr&&cd<fl){z=z+1}else{z=z};utc=cd.getTime()+(cd.getTimezoneO"
     + "ffset()*60000);tz=new Date(utc + (3600000*z));thisy=tz.getFullYear("
     + ");var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Fr"
     + "iday','Saturday'];if(thisy!=y){return'Data Not Available'}else{;thi"
     + "sh=tz.getHours();thismin=tz.getMinutes();thisd=tz.getDay();var dow="
     + "days[thisd];var ap='AM';var dt='Weekday';var mint='00';if(thismin>3"
     + "0){mint='30'}if(thish>=12){ap='PM';thish=thish-12};if (thish==0){th"
     + "ish=12};if(thisd==6||thisd==0){dt='Weekend'};var timestring=thish+'"
     + ":'+mint+ap;var daystring=dow;var endstring=dt;if(t=='h'){return tim"
     + "estring}if(t=='d'){return daystring};if(t=='w'){return en"
     + "dstring}}};");

/*
 * Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
 */
nbcu.getNewRepeat = new Function("d", "cn", ""
     + "var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:"
     + "'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.Util.cookieRead(cn);if(cval.length="
     + "=0){s.Util.cookieWrite(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct"
     + "-sval[0]<30*60*1000&&sval[1]=='New'){s.Util.cookieWrite(cn,ct+'-New',e);return'N"
     + "ew';}else{s.Util.cookieWrite(cn,ct+'-Repeat',e);return'Repeat';}");
/*
 * Plugin: Days since last Visit 1.1.H - capture time from last visit
 */
nbcu.getDaysSinceLastVisit = new Function("c", ""
     + "var s=this,e=new Date(),es=new Date(),cval,cval_s,cval_ss,ct=e.getT"
     + "ime(),day=24*60*60*1000,f1,f2,f3,f4,f5;e.setTime(ct+3*365*day);es.s"
     + "etTime(ct+30*60*1000);f0='Cookies Not Supported';f1='First Visit';f"
     + "2='More than 30 days';f3='More than 7 days';f4='Less than 7 days';f"
     + "5='Less than 1 day';cval=s.Util.cookieRead(c);if(cval.length==0){s.Util.cookieWrite(c,ct,e);"
     + "s.Util.cookieWrite(c+'_s',f1,es);}else{var d=ct-cval;if(d>30*60*1000){if(d>30*da"
     + "y){s.Util.cookieWrite(c,ct,e);s.Util.cookieWrite(c+'_s',f2,es);}else if(d<30*day+1 && d>7*day"
     + "){s.Util.cookieWrite(c,ct,e);s.Util.cookieWrite(c+'_s',f3,es);}else if(d<7*day+1 && d>day){s."
     + "Util.cookieWrite(c,ct,e);s.Util.cookieWrite(c+'_s',f4,es);}else if(d<day+1){s.Util.cookieWrite(c,ct,e);s.c"
     + "_w(c+'_s',f5,es);}}else{s.Util.cookieWrite(c,ct,e);cval_ss=s.Util.cookieRead(c+'_s');s.Util.cookieWrite(c"
     + "+'_s',cval_ss,es);}}cval_s=s.Util.cookieRead(c+'_s');if(cval_s.length==0) retur"
     + "n f0;else if(cval_s!=f1&&cval_s!=f2&&cval_s!=f3&&cval_s!=f4&&cval_s"
     + "!=f5) return '';else return cval_s;");
/*
 * Plugin: getValOnce_v1.1
*/
nbcu.getValOnce = new Function("v", "c", "e", "t", ""
     + "var s=this,a=new Date,v=v?v:'',c=c?c:'s_gvo',e=e?e:0,i=t=='m'?6000"
     + "0:86400000;k=s.Util.cookieRead(c);if(v){a.setTime(a.getTime()+e*i);s.Util.cookieWrite(c,v,e"
     + "==0?0:a);}return v==k?'':v");

/*
 * Plugin Utility: apl v1.1
 */
nbcu.apl = new Function("l", "v", "d", "u", ""
     + "var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
     + "length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
     + "e()));}}if(!m)l=l?l+d+v:v;return l");
/*
 * Plugin Utility: Replace v1.0
 */
nbcu.repl = new Function("x", "o", "n", ""
     + "var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
     + "substring(i+o.length);i=x.indexOf(o,i+l)}return x");
/*
 * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
 */
nbcu.split = new Function("l", "d", ""
     + "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
     + "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
/*
 * nbcu.join: 1.0 - Joins an array into a string
 */
nbcu.join = new Function("v", "p", ""
     + "var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
     + ":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
     + ";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
     + "se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");
/*
 * Plugin: getVisitNum - version 3.0
 */
nbcu.getVisitNum = new Function("tp", "c", "c2", ""
     + "var s=this,e=new Date,cval,cvisit,ct=e.getTime(),d;if(!tp){tp='m';}"
     + "if(tp=='m'||tp=='w'||tp=='d'){eo=s.endof(tp),y=eo.getTime();e.setTi"
     + "me(y);}else {d=tp*86400000;e.setTime(ct+d);}if(!c){c='s_vnum';}if(!"
     + "c2){c2='s_invisit';}cval=s.Util.cookieRead(c);if(cval){var i=cval.indexOf('&vn="
     + "'),str=cval.substring(i+4,cval.length),k;}cvisit=s.Util.cookieRead(c2);if(cvisi"
     + "t){if(str){e.setTime(ct+1800000);s.Util.cookieWrite(c2,'true',e);return str;}els"
     + "e {return 'unknown visit number';}}else {if(str){str++;k=cval.substri"
     + "ng(0,i);e.setTime(k);s.Util.cookieWrite(c,k+'&vn='+str,e);e.setTime(ct+1800000);"
     + "s.Util.cookieWrite(c2,'true',e);return str;}else {s.Util.cookieWrite(c,e.getTime()+'&vn=1',e)"
     + ";e.setTime(ct+1800000);s.Util.cookieWrite(c2,'true',e);return 1;}}");
nbcu.dimo = new Function("m", "y", ""
     + "var d=new Date(y,m+1,0);return d.getDate();");
nbcu.endof = new Function("x", ""
     + "var t=new Date;t.setHours(0);t.setMinutes(0);t.setSeconds(0);if(x=="
     + "'m'){d=nbcu.dimo(t.getMonth(),t.getFullYear())-t.getDate()+1;}else if("
     + "x=='w'){d=7-t.getDay();}else {d=1;}t.setDate(t.getDate()+d);return "
     + "t;");
/*
 *  Plug-in: crossVisitParticipation v1.7 - stacks values from
 *  specified variable in cookie and returns value
 */
nbcu.crossVisitParticipation = new Function("v", "cn", "ex", "ct", "dl", "ev", "dv", ""
     + "var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
     + " ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
     + "ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
     + "f(!v||v==''){if(ce){s.Util.cookieWrite(cn,'');return'';}else return'';}v=escape("
     + "v);var arry=new Array(),a=new Array(),c=s.Util.cookieRead(cn),g=0,h=new Array()"
     + ";if(c&&c!=''){arry=s.split(c,'],[');for(q=0;q<arry.length;q++){z=ar"
     + "ry[q];z=s.repl(z,'[','');z=s.repl(z,']','');z=s.repl(z,\"'\",'');arry"
     + "[q]=s.split(z,',')}}var e=new Date();e.setFullYear(e.getFullYear()+"
     + "5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[arry.len"
     + "gth-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new Date("
     + ").getTime()];var start=arry.length-ct<0?0:arry.length-ct;var td=new"
     + " Date();for(var x=start;x<arry.length;x++){var diff=Math.round((td."
     + "getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arry[x][0"
     + "]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{delim:',',"
     + "front:'[',back:']',wrap:\"'\"});s.Util.cookieWrite(cn,data,e);var r=s.join(h,{deli"
     + "m:dl});if(ce)s.Util.cookieWrite(cn,'');return r;");

nbcu.loadModule("Media");
nbcu.Media.autoTrack = false;
nbcu.Media.trackWhilePlaying = true;
nbcu.Media.trackVars = "None";
nbcu.Media.trackEvents = "None";

nbcu.loadModule("Integrate");

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/


function AppMeasurement_Module_Integrate(l){var c=this;c.s=l;var e=window;e.s_c_in||(e.s_c_il=[],e.s_c_in=0);c._il=e.s_c_il;c._in=e.s_c_in;c._il[c._in]=c;e.s_c_in++;c._c="s_m";c.list=[];c.add=function(d,b){var a;b||(b="s_Integrate_"+d);e[b]||(e[b]={});a=c[d]=e[b];a.a=d;a.e=c;a._c=0;a._d=0;void 0==a.disable&&(a.disable=0);a.get=function(b,d){var f=document,h=f.getElementsByTagName("HEAD"),k;if(!a.disable&&(d||(v="s_"+c._in+"_Integrate_"+a.a+"_get_"+a._c),a._c++,a.VAR=v,a.CALLBACK="s_c_il["+c._in+"]."+
a.a+".callback",a.delay(),h=h&&0<h.length?h[0]:f.body))try{k=f.createElement("SCRIPT"),k.type="text/javascript",k.setAttribute("async","async"),k.src=c.c(a,b),0>b.indexOf("[CALLBACK]")&&(k.onload=k.onreadystatechange=function(){a.callback(e[v])}),h.firstChild?h.insertBefore(k,h.firstChild):h.appendChild(k)}catch(l){}};a.callback=function(b){var c;if(b)for(c in b)Object.prototype[c]||(a[c]=b[c]);a.ready()};a.beacon=function(b){var d="s_i_"+c._in+"_Integrate_"+a.a+"_"+a._c;a.disable||(a._c++,d=e[d]=
new Image,d.src=c.c(a,b))};a.script=function(b){a.get(b,1)};a.delay=function(){a._d++};a.ready=function(){a._d--;a.disable||l.delayReady()};c.list.push(d)};c._g=function(d){var b,a=(d?"use":"set")+"Vars";for(d=0;d<c.list.length;d++)if((b=c[c.list[d]])&&!b.disable&&b[a])try{b[a](l,b)}catch(e){}};c._t=function(){c._g(1)};c._d=function(){var d,b;for(d=0;d<c.list.length;d++)if((b=c[c.list[d]])&&!b.disable&&0<b._d)return 1;return 0};c.c=function(c,b){var a,e,g,f;"http"!=b.toLowerCase().substring(0,4)&&
(b="http://"+b);l.ssl&&(b=l.replace(b,"http:","https:"));c.RAND=Math.floor(1E13*Math.random());for(a=0;0<=a;)a=b.indexOf("[",a),0<=a&&(e=b.indexOf("]",a),e>a&&(g=b.substring(a+1,e),2<g.length&&"s."==g.substring(0,2)?(f=l[g.substring(2)])||(f=""):(f=""+c[g],f!=c[g]&&parseFloat(f)!=c[g]&&(g=0)),g&&(b=b.substring(0,a)+encodeURIComponent(f)+b.substring(e+1)),a=e));return b}}

function AppMeasurement_Module_Media(q){var b=this;b.s=q;q=window;q.s_c_in||(q.s_c_il=[],q.s_c_in=0);b._il=q.s_c_il;b._in=q.s_c_in;b._il[b._in]=b;q.s_c_in++;b._c="s_m";b.list=[];b.open=function(d,c,e,k){var f={},a=new Date,l="",g;c||(c=-1);if(d&&e){b.list||(b.list={});b.list[d]&&b.close(d);k&&k.id&&(l=k.id);if(l)for(g in b.list)!Object.prototype[g]&&b.list[g]&&b.list[g].R==l&&b.close(b.list[g].name);f.name=d;f.length=c;f.offset=0;f.e=0;f.playerName=b.playerName?b.playerName:e;f.R=l;f.C=0;f.a=0;f.timestamp=
Math.floor(a.getTime()/1E3);f.k=0;f.u=f.timestamp;f.c=-1;f.n="";f.g=-1;f.D=0;f.I={};f.G=0;f.m=0;f.f="";f.B=0;f.L=0;f.A=0;f.F=0;f.l=!1;f.v="";f.J="";f.K=0;f.r=!1;f.H="";f.complete=0;f.Q=0;f.p=0;f.q=0;b.list[d]=f}};b.openAd=function(d,c,e,k,f,a,l,g){var h={};b.open(d,c,e,g);if(h=b.list[d])h.l=!0,h.v=k,h.J=f,h.K=a,h.H=l};b.M=function(d){var c=b.list[d];b.list[d]=0;c&&c.monitor&&clearTimeout(c.monitor.interval)};b.close=function(d){b.i(d,0,-1)};b.play=function(d,c,e,k){var f=b.i(d,1,c,e,k);f&&!f.monitor&&
(f.monitor={},f.monitor.update=function(){1==f.k&&b.i(f.name,3,-1);f.monitor.interval=setTimeout(f.monitor.update,1E3)},f.monitor.update())};b.click=function(d,c){b.i(d,7,c)};b.complete=function(d,c){b.i(d,5,c)};b.stop=function(d,c){b.i(d,2,c)};b.track=function(d){b.i(d,4,-1)};b.P=function(d,c){var e="a.media.",k=d.linkTrackVars,f=d.linkTrackEvents,a="m_i",l,g=d.contextData,h;c.l&&(e+="ad.",c.v&&(g["a.media.name"]=c.v,g[e+"pod"]=c.J,g[e+"podPosition"]=c.K),c.G||(g[e+"CPM"]=c.H));c.r&&(g[e+"clicked"]=
!0,c.r=!1);g["a.contentType"]="video"+(c.l?"Ad":"");g["a.media.channel"]=b.channel;g[e+"name"]=c.name;g[e+"playerName"]=c.playerName;0<c.length&&(g[e+"length"]=c.length);g[e+"timePlayed"]=Math.floor(c.a);0<Math.floor(c.a)&&(g[e+"timePlayed"]=Math.floor(c.a));c.G||(g[e+"view"]=!0,a="m_s",b.Heartbeat&&b.Heartbeat.enabled&&(a=c.l?b.__primetime?"mspa_s":"msa_s":b.__primetime?"msp_s":"ms_s"),c.G=1);c.f&&(g[e+"segmentNum"]=c.m,g[e+"segment"]=c.f,0<c.B&&(g[e+"segmentLength"]=c.B),c.A&&0<c.a&&(g[e+"segmentView"]=
!0));!c.Q&&c.complete&&(g[e+"complete"]=!0,c.S=1);0<c.p&&(g[e+"milestone"]=c.p);0<c.q&&(g[e+"offsetMilestone"]=c.q);if(k)for(h in g)Object.prototype[h]||(k+=",contextData."+h);l=g["a.contentType"];d.pe=a;d.pev3=l;var q,s;if(b.contextDataMapping)for(h in d.events2||(d.events2=""),k&&(k+=",events"),b.contextDataMapping)if(!Object.prototype[h]){a=h.length>e.length&&h.substring(0,e.length)==e?h.substring(e.length):"";l=b.contextDataMapping[h];if("string"==typeof l)for(q=l.split(","),s=0;s<q.length;s++)l=
q[s],"a.contentType"==h?(k&&(k+=","+l),d[l]=g[h]):"view"==a||"segmentView"==a||"clicked"==a||"complete"==a||"timePlayed"==a||"CPM"==a?(f&&(f+=","+l),"timePlayed"==a||"CPM"==a?g[h]&&(d.events2+=(d.events2?",":"")+l+"="+g[h]):g[h]&&(d.events2+=(d.events2?",":"")+l)):"segment"==a&&g[h+"Num"]?(k&&(k+=","+l),d[l]=g[h+"Num"]+":"+g[h]):(k&&(k+=","+l),d[l]=g[h]);else if("milestones"==a||"offsetMilestones"==a)h=h.substring(0,h.length-1),g[h]&&b.contextDataMapping[h+"s"][g[h]]&&(f&&(f+=","+b.contextDataMapping[h+
"s"][g[h]]),d.events2+=(d.events2?",":"")+b.contextDataMapping[h+"s"][g[h]]);g[h]&&(g[h]=0);"segment"==a&&g[h+"Num"]&&(g[h+"Num"]=0)}d.linkTrackVars=k;d.linkTrackEvents=f};b.i=function(d,c,e,k,f){var a={},l=(new Date).getTime()/1E3,g,h,q=b.trackVars,s=b.trackEvents,t=b.trackSeconds,u=b.trackMilestones,v=b.trackOffsetMilestones,w=b.segmentByMilestones,x=b.segmentByOffsetMilestones,p,n,r=1,m={},y;b.channel||(b.channel=b.s.w.location.hostname);if(a=d&&b.list&&b.list[d]?b.list[d]:0)if(a.l&&(t=b.adTrackSeconds,
u=b.adTrackMilestones,v=b.adTrackOffsetMilestones,w=b.adSegmentByMilestones,x=b.adSegmentByOffsetMilestones),0>e&&(e=1==a.k&&0<a.u?l-a.u+a.c:a.c),0<a.length&&(e=e<a.length?e:a.length),0>e&&(e=0),a.offset=e,0<a.length&&(a.e=a.offset/a.length*100,a.e=100<a.e?100:a.e),0>a.c&&(a.c=e),y=a.D,m.name=d,m.ad=a.l,m.length=a.length,m.openTime=new Date,m.openTime.setTime(1E3*a.timestamp),m.offset=a.offset,m.percent=a.e,m.playerName=a.playerName,m.mediaEvent=0>a.g?"OPEN":1==c?"PLAY":2==c?"STOP":3==c?"MONITOR":
4==c?"TRACK":5==c?"COMPLETE":7==c?"CLICK":"CLOSE",2<c||c!=a.k&&(2!=c||1==a.k)){f||(k=a.m,f=a.f);if(c){1==c&&(a.c=e);if((3>=c||5<=c)&&0<=a.g&&(r=!1,q=s="None",a.g!=e)){h=a.g;h>e&&(h=a.c,h>e&&(h=e));p=u?u.split(","):0;if(0<a.length&&p&&e>=h)for(n=0;n<p.length;n++)(g=p[n]?parseFloat(""+p[n]):0)&&h/a.length*100<g&&a.e>=g&&(r=!0,n=p.length,m.mediaEvent="MILESTONE",a.p=m.milestone=g);if((p=v?v.split(","):0)&&e>=h)for(n=0;n<p.length;n++)(g=p[n]?parseFloat(""+p[n]):0)&&h<g&&e>=g&&(r=!0,n=p.length,m.mediaEvent=
"OFFSET_MILESTONE",a.q=m.offsetMilestone=g)}if(a.L||!f){if(w&&u&&0<a.length){if(p=u.split(","))for(p.push("100"),n=h=0;n<p.length;n++)if(g=p[n]?parseFloat(""+p[n]):0)a.e<g&&(k=n+1,f="M:"+h+"-"+g,n=p.length),h=g}else if(x&&v&&(p=v.split(",")))for(p.push(""+(0<a.length?a.length:"E")),n=h=0;n<p.length;n++)if((g=p[n]?parseFloat(""+p[n]):0)||"E"==p[n]){if(e<g||"E"==p[n])k=n+1,f="O:"+h+"-"+g,n=p.length;h=g}f&&(a.L=!0)}(f||a.f)&&f!=a.f&&(a.F=!0,a.f||(a.m=k,a.f=f),0<=a.g&&(r=!0));(2<=c||100<=a.e)&&a.c<e&&
(a.C+=e-a.c,a.a+=e-a.c);if(2>=c||3==c&&!a.k)a.n+=(1==c||3==c?"S":"E")+Math.floor(e),a.k=3==c?1:c;!r&&0<=a.g&&3>=c&&(t=t?t:0)&&a.a>=t&&(r=!0,m.mediaEvent="SECONDS");a.u=l;a.c=e}if(!c||3>=c&&100<=a.e)2!=a.k&&(a.n+="E"+Math.floor(e)),c=0,q=s="None",m.mediaEvent="CLOSE";7==c&&(r=m.clicked=a.r=!0);if(5==c||b.completeByCloseOffset&&(!c||100<=a.e)&&0<a.length&&e>=a.length-b.completeCloseOffsetThreshold)r=m.complete=a.complete=!0;l=m.mediaEvent;"MILESTONE"==l?l+="_"+m.milestone:"OFFSET_MILESTONE"==l&&(l+=
"_"+m.offsetMilestone);a.I[l]?m.eventFirstTime=!1:(m.eventFirstTime=!0,a.I[l]=1);m.event=m.mediaEvent;m.timePlayed=a.C;m.segmentNum=a.m;m.segment=a.f;m.segmentLength=a.B;b.monitor&&4!=c&&b.monitor(b.s,m);b.Heartbeat&&b.Heartbeat.enabled&&0<=a.g&&(r=!1);0==c&&b.M(d);r&&a.D==y&&(d={contextData:{}},d.linkTrackVars=q,d.linkTrackEvents=s,d.linkTrackVars||(d.linkTrackVars=""),d.linkTrackEvents||(d.linkTrackEvents=""),b.P(d,a),d.linkTrackVars||(d["!linkTrackVars"]=1),d.linkTrackEvents||(d["!linkTrackEvents"]=
1),b.s.track(d),a.F?(a.m=k,a.f=f,a.A=!0,a.F=!1):0<a.a&&(a.A=!1),a.n="",a.p=a.q=0,a.a-=Math.floor(a.a),a.g=e,a.D++)}return a};b.O=function(d,c,e,k,f){var a=0;if(d&&(!b.autoTrackMediaLengthRequired||c&&0<c)){if(b.list&&b.list[d])a=1;else if(1==e||3==e)b.open(d,c,"HTML5 Video",f),a=1;a&&b.i(d,e,k,-1,0)}};b.attach=function(d){var c,e,k;d&&d.tagName&&"VIDEO"==d.tagName.toUpperCase()&&(b.o||(b.o=function(c,a,d){var e,h;b.autoTrack&&(e=c.currentSrc,(h=c.duration)||(h=-1),0>d&&(d=c.currentTime),b.O(e,h,a,
d,c))}),c=function(){b.o(d,1,-1)},e=function(){b.o(d,1,-1)},b.j(d,"play",c),b.j(d,"pause",e),b.j(d,"seeking",e),b.j(d,"seeked",c),b.j(d,"ended",function(){b.o(d,0,-1)}),b.j(d,"timeupdate",c),k=function(){d.paused||d.ended||d.seeking||b.o(d,3,-1);setTimeout(k,1E3)},k())};b.j=function(b,c,e){b.attachEvent?b.attachEvent("on"+c,e):b.addEventListener&&b.addEventListener(c,e,!1)};void 0==b.completeByCloseOffset&&(b.completeByCloseOffset=1);void 0==b.completeCloseOffsetThreshold&&(b.completeCloseOffsetThreshold=
1);b.Heartbeat={};b.N=function(){var d,c;if(b.autoTrack&&(d=b.s.d.getElementsByTagName("VIDEO")))for(c=0;c<d.length;c++)b.attach(d[c])};b.j(q,"load",b.N)}


/*
 Start ActivityMap Module

 The following module enables ActivityMap tracking in Adobe Analytics. ActivityMap
 allows you to view data overlays on your links and content to understand how
 users engage with your web site. If you do not intend to use ActivityMap, you
 can remove the following block of code from your AppMeasurement.js file.
 Additional documentation on how to configure ActivityMap is available at:
 https://marketing.adobe.com/resources/help/en_US/analytics/activitymap/getting-started-admins.html
*/
function AppMeasurement_Module_ActivityMap(f){function g(a,d){var b,c,n;if(a&&d&&(b=e.c[d]||(e.c[d]=d.split(","))))for(n=0;n<b.length&&(c=b[n++]);)if(-1<a.indexOf(c))return null;p=1;return a}function q(a,d,b,c,e){var g,h;if(a.dataset&&(h=a.dataset[d]))g=h;else if(a.getAttribute)if(h=a.getAttribute("data-"+b))g=h;else if(h=a.getAttribute(b))g=h;if(!g&&f.useForcedLinkTracking&&e&&(g="",d=a.onclick?""+a.onclick:"")){b=d.indexOf(c);var l,k;if(0<=b){for(b+=10;b<d.length&&0<="= \t\r\n".indexOf(d.charAt(b));)b++;
if(b<d.length){h=b;for(l=k=0;h<d.length&&(";"!=d.charAt(h)||l);)l?d.charAt(h)!=l||k?k="\\"==d.charAt(h)?!k:0:l=0:(l=d.charAt(h),'"'!=l&&"'"!=l&&(l=0)),h++;if(d=d.substring(b,h))a.e=new Function("s","var e;try{s.w."+c+"="+d+"}catch(e){}"),a.e(f)}}}return g||e&&f.w[c]}function r(a,d,b){var c;return(c=e[d](a,b))&&(p?(p=0,c):g(k(c),e[d+"Exclusions"]))}function s(a,d,b){var c;if(a&&!(1===(c=a.nodeType)&&(c=a.nodeName)&&(c=c.toUpperCase())&&t[c])&&(1===a.nodeType&&(c=a.nodeValue)&&(d[d.length]=c),b.a||
b.t||b.s||!a.getAttribute||((c=a.getAttribute("alt"))?b.a=c:(c=a.getAttribute("title"))?b.t=c:"IMG"==(""+a.nodeName).toUpperCase()&&(c=a.getAttribute("src")||a.src)&&(b.s=c)),(c=a.childNodes)&&c.length))for(a=0;a<c.length;a++)s(c[a],d,b)}function k(a){if(null==a||void 0==a)return a;try{return a.replace(RegExp("^[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+","mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+$",
"mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]{1,}","mg")," ").substring(0,254)}catch(d){}}var e=this;e.s=f;var m=window;m.s_c_in||(m.s_c_il=[],m.s_c_in=0);e._il=m.s_c_il;e._in=m.s_c_in;e._il[e._in]=e;m.s_c_in++;e._c="s_m";e.c={};var p=0,t={SCRIPT:1,STYLE:1,LINK:1,CANVAS:1};e._g=function(){var a,d,b,c=f.contextData,e=f.linkObject;(a=f.pageName||f.pageURL)&&(d=r(e,"link",f.linkName))&&(b=r(e,"region"))&&(c["a.activitymap.page"]=a.substring(0,
255),c["a.activitymap.link"]=128<d.length?d.substring(0,128):d,c["a.activitymap.region"]=127<b.length?b.substring(0,127):b,c["a.activitymap.pageIDType"]=f.pageName?1:0)};e.link=function(a,d){var b;if(d)b=g(k(d),e.linkExclusions);else if((b=a)&&!(b=q(a,"sObjectId","s-object-id","s_objectID",1))){var c,f;(f=g(k(a.innerText||a.textContent),e.linkExclusions))||(s(a,c=[],b={a:void 0,t:void 0,s:void 0}),(f=g(k(c.join(""))))||(f=g(k(b.a?b.a:b.t?b.t:b.s?b.s:void 0)))||!(c=(c=a.tagName)&&c.toUpperCase?c.toUpperCase():
"")||("INPUT"==c||"SUBMIT"==c&&a.value?f=g(k(a.value)):"IMAGE"==c&&a.src&&(f=g(k(a.src)))));b=f}return b};e.region=function(a){for(var d,b=e.regionIDAttribute||"id";a&&(a=a.parentNode);){if(d=q(a,b,b,b))return d;if("BODY"==a.nodeName)return"BODY"}}}
/* End ActivityMap Module */

/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

AppMeasurement for JavaScript version: 1.7.0
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.adobe.com/marketing-cloud.html
*/
function AppMeasurement(){var a=this;a.version="1.7.0";var k=window;k.s_c_in||(k.s_c_il=[],k.s_c_in=0);a._il=k.s_c_il;a._in=k.s_c_in;a._il[a._in]=a;k.s_c_in++;a._c="s_c";var q=k.AppMeasurement.Jb;q||(q=null);var r=k,n,t;try{for(n=r.parent,t=r.location;n&&n.location&&t&&""+n.location!=""+t&&r.location&&""+n.location!=""+r.location&&n.location.host==t.host;)r=n,n=r.parent}catch(u){}a.yb=function(a){try{console.log(a)}catch(b){}};a.Ha=function(a){return""+parseInt(a)==""+a};a.replace=function(a,b,d){return!a||
0>a.indexOf(b)?a:a.split(b).join(d)};a.escape=function(c){var b,d;if(!c)return c;c=encodeURIComponent(c);for(b=0;7>b;b++)d="+~!*()'".substring(b,b+1),0<=c.indexOf(d)&&(c=a.replace(c,d,"%"+d.charCodeAt(0).toString(16).toUpperCase()));return c};a.unescape=function(c){if(!c)return c;c=0<=c.indexOf("+")?a.replace(c,"+"," "):c;try{return decodeURIComponent(c)}catch(b){}return unescape(c)};a.pb=function(){var c=k.location.hostname,b=a.fpCookieDomainPeriods,d;b||(b=a.cookieDomainPeriods);if(c&&!a.cookieDomain&&
!/^[0-9.]+$/.test(c)&&(b=b?parseInt(b):2,b=2<b?b:2,d=c.lastIndexOf("."),0<=d)){for(;0<=d&&1<b;)d=c.lastIndexOf(".",d-1),b--;a.cookieDomain=0<d?c.substring(d):c}return a.cookieDomain};a.c_r=a.cookieRead=function(c){c=a.escape(c);var b=" "+a.d.cookie,d=b.indexOf(" "+c+"="),f=0>d?d:b.indexOf(";",d);c=0>d?"":a.unescape(b.substring(d+2+c.length,0>f?b.length:f));return"[[B]]"!=c?c:""};a.c_w=a.cookieWrite=function(c,b,d){var f=a.pb(),e=a.cookieLifetime,g;b=""+b;e=e?(""+e).toUpperCase():"";d&&"SESSION"!=
e&&"NONE"!=e&&((g=""!=b?parseInt(e?e:0):-60)?(d=new Date,d.setTime(d.getTime()+1E3*g)):1==d&&(d=new Date,g=d.getYear(),d.setYear(g+5+(1900>g?1900:0))));return c&&"NONE"!=e?(a.d.cookie=a.escape(c)+"="+a.escape(""!=b?b:"[[B]]")+"; path=/;"+(d&&"SESSION"!=e?" expires="+d.toGMTString()+";":"")+(f?" domain="+f+";":""),a.cookieRead(c)==b):0};a.K=[];a.ha=function(c,b,d){if(a.Aa)return 0;a.maxDelay||(a.maxDelay=250);var f=0,e=(new Date).getTime()+a.maxDelay,g=a.d.visibilityState,m=["webkitvisibilitychange",
"visibilitychange"];g||(g=a.d.webkitVisibilityState);if(g&&"prerender"==g){if(!a.ia)for(a.ia=1,d=0;d<m.length;d++)a.d.addEventListener(m[d],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&(a.ia=0,a.delayReady())});f=1;e=0}else d||a.p("_d")&&(f=1);f&&(a.K.push({m:c,a:b,t:e}),a.ia||setTimeout(a.delayReady,a.maxDelay));return f};a.delayReady=function(){var c=(new Date).getTime(),b=0,d;for(a.p("_d")?b=1:a.va();0<a.K.length;){d=a.K.shift();if(b&&!d.t&&d.t>c){a.K.unshift(d);
setTimeout(a.delayReady,parseInt(a.maxDelay/2));break}a.Aa=1;a[d.m].apply(a,d.a);a.Aa=0}};a.setAccount=a.sa=function(c){var b,d;if(!a.ha("setAccount",arguments))if(a.account=c,a.allAccounts)for(b=a.allAccounts.concat(c.split(",")),a.allAccounts=[],b.sort(),d=0;d<b.length;d++)0!=d&&b[d-1]==b[d]||a.allAccounts.push(b[d]);else a.allAccounts=c.split(",")};a.foreachVar=function(c,b){var d,f,e,g,m="";e=f="";if(a.lightProfileID)d=a.O,(m=a.lightTrackVars)&&(m=","+m+","+a.ma.join(",")+",");else{d=a.g;if(a.pe||
a.linkType)m=a.linkTrackVars,f=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(m=a[e].Hb,f=a[e].Gb));m&&(m=","+m+","+a.G.join(",")+",");f&&m&&(m+=",events,")}b&&(b=","+b+",");for(f=0;f<d.length;f++)e=d[f],(g=a[e])&&(!m||0<=m.indexOf(","+e+","))&&(!b||0<=b.indexOf(","+e+","))&&c(e,g)};a.r=function(c,b,d,f,e){var g="",m,p,k,w,n=0;"contextData"==c&&(c="c");if(b){for(m in b)if(!(Object.prototype[m]||e&&m.substring(0,e.length)!=e)&&b[m]&&(!d||0<=d.indexOf(","+(f?f+
".":"")+m+","))){k=!1;if(n)for(p=0;p<n.length;p++)m.substring(0,n[p].length)==n[p]&&(k=!0);if(!k&&(""==g&&(g+="&"+c+"."),p=b[m],e&&(m=m.substring(e.length)),0<m.length))if(k=m.indexOf("."),0<k)p=m.substring(0,k),k=(e?e:"")+p+".",n||(n=[]),n.push(k),g+=a.r(p,b,d,f,k);else if("boolean"==typeof p&&(p=p?"true":"false"),p){if("retrieveLightData"==f&&0>e.indexOf(".contextData."))switch(k=m.substring(0,4),w=m.substring(4),m){case "transactionID":m="xact";break;case "channel":m="ch";break;case "campaign":m=
"v0";break;default:a.Ha(w)&&("prop"==k?m="c"+w:"eVar"==k?m="v"+w:"list"==k?m="l"+w:"hier"==k&&(m="h"+w,p=p.substring(0,255)))}g+="&"+a.escape(m)+"="+a.escape(p)}}""!=g&&(g+="&."+c)}return g};a.usePostbacks=0;a.sb=function(){var c="",b,d,f,e,g,m,p,k,n="",r="",s=e="";if(a.lightProfileID)b=a.O,(n=a.lightTrackVars)&&(n=","+n+","+a.ma.join(",")+",");else{b=a.g;if(a.pe||a.linkType)n=a.linkTrackVars,r=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(n=a[e].Hb,r=a[e].Gb));
n&&(n=","+n+","+a.G.join(",")+",");r&&(r=","+r+",",n&&(n+=",events,"));a.events2&&(s+=(""!=s?",":"")+a.events2)}if(a.visitor&&1.5<=parseFloat(a.visitor.version)&&a.visitor.getCustomerIDs){e=q;if(g=a.visitor.getCustomerIDs())for(d in g)Object.prototype[d]||(f=g[d],e||(e={}),f.id&&(e[d+".id"]=f.id),f.authState&&(e[d+".as"]=f.authState));e&&(c+=a.r("cid",e))}a.AudienceManagement&&a.AudienceManagement.isReady()&&(c+=a.r("d",a.AudienceManagement.getEventCallConfigParams()));for(d=0;d<b.length;d++){e=b[d];
g=a[e];f=e.substring(0,4);m=e.substring(4);!g&&"events"==e&&s&&(g=s,s="");if(g&&(!n||0<=n.indexOf(","+e+","))){switch(e){case "supplementalDataID":e="sdid";break;case "timestamp":e="ts";break;case "dynamicVariablePrefix":e="D";break;case "visitorID":e="vid";break;case "marketingCloudVisitorID":e="mid";break;case "analyticsVisitorID":e="aid";break;case "audienceManagerLocationHint":e="aamlh";break;case "audienceManagerBlob":e="aamb";break;case "authState":e="as";break;case "pageURL":e="g";255<g.length&&
(a.pageURLRest=g.substring(255),g=g.substring(0,255));break;case "pageURLRest":e="-g";break;case "referrer":e="r";break;case "vmk":case "visitorMigrationKey":e="vmt";break;case "visitorMigrationServer":e="vmf";a.ssl&&a.visitorMigrationServerSecure&&(g="");break;case "visitorMigrationServerSecure":e="vmf";!a.ssl&&a.visitorMigrationServer&&(g="");break;case "charSet":e="ce";break;case "visitorNamespace":e="ns";break;case "cookieDomainPeriods":e="cdp";break;case "cookieLifetime":e="cl";break;case "variableProvider":e=
"vvp";break;case "currencyCode":e="cc";break;case "channel":e="ch";break;case "transactionID":e="xact";break;case "campaign":e="v0";break;case "latitude":e="lat";break;case "longitude":e="lon";break;case "resolution":e="s";break;case "colorDepth":e="c";break;case "javascriptVersion":e="j";break;case "javaEnabled":e="v";break;case "cookiesEnabled":e="k";break;case "browserWidth":e="bw";break;case "browserHeight":e="bh";break;case "connectionType":e="ct";break;case "homepage":e="hp";break;case "events":s&&
(g+=(""!=g?",":"")+s);if(r)for(m=g.split(","),g="",f=0;f<m.length;f++)p=m[f],k=p.indexOf("="),0<=k&&(p=p.substring(0,k)),k=p.indexOf(":"),0<=k&&(p=p.substring(0,k)),0<=r.indexOf(","+p+",")&&(g+=(g?",":"")+m[f]);break;case "events2":g="";break;case "contextData":c+=a.r("c",a[e],n,e);g="";break;case "lightProfileID":e="mtp";break;case "lightStoreForSeconds":e="mtss";a.lightProfileID||(g="");break;case "lightIncrementBy":e="mti";a.lightProfileID||(g="");break;case "retrieveLightProfiles":e="mtsr";break;
case "deleteLightProfiles":e="mtsd";break;case "retrieveLightData":a.retrieveLightProfiles&&(c+=a.r("mts",a[e],n,e));g="";break;default:a.Ha(m)&&("prop"==f?e="c"+m:"eVar"==f?e="v"+m:"list"==f?e="l"+m:"hier"==f&&(e="h"+m,g=g.substring(0,255)))}g&&(c+="&"+e+"="+("pev"!=e.substring(0,3)?a.escape(g):g))}"pev3"==e&&a.e&&(c+=a.e)}return c};a.D=function(a){var b=a.tagName;if("undefined"!=""+a.Mb||"undefined"!=""+a.Cb&&"HTML"!=(""+a.Cb).toUpperCase())return"";b=b&&b.toUpperCase?b.toUpperCase():"";"SHAPE"==
b&&(b="");b&&(("INPUT"==b||"BUTTON"==b)&&a.type&&a.type.toUpperCase?b=a.type.toUpperCase():!b&&a.href&&(b="A"));return b};a.Da=function(a){var b=a.href?a.href:"",d,f,e;d=b.indexOf(":");f=b.indexOf("?");e=b.indexOf("/");b&&(0>d||0<=f&&d>f||0<=e&&d>e)&&(f=a.protocol&&1<a.protocol.length?a.protocol:l.protocol?l.protocol:"",d=l.pathname.lastIndexOf("/"),b=(f?f+"//":"")+(a.host?a.host:l.host?l.host:"")+("/"!=h.substring(0,1)?l.pathname.substring(0,0>d?0:d)+"/":"")+b);return b};a.L=function(c){var b=a.D(c),
d,f,e="",g=0;return b&&(d=c.protocol,f=c.onclick,!c.href||"A"!=b&&"AREA"!=b||f&&d&&!(0>d.toLowerCase().indexOf("javascript"))?f?(e=a.replace(a.replace(a.replace(a.replace(""+f,"\r",""),"\n",""),"\t","")," ",""),g=2):"INPUT"==b||"SUBMIT"==b?(c.value?e=c.value:c.innerText?e=c.innerText:c.textContent&&(e=c.textContent),g=3):"IMAGE"==b&&c.src&&(e=c.src):e=a.Da(c),e)?{id:e.substring(0,100),type:g}:0};a.Kb=function(c){for(var b=a.D(c),d=a.L(c);c&&!d&&"BODY"!=b;)if(c=c.parentElement?c.parentElement:c.parentNode)b=
a.D(c),d=a.L(c);d&&"BODY"!=b||(c=0);c&&(b=c.onclick?""+c.onclick:"",0<=b.indexOf(".tl(")||0<=b.indexOf(".trackLink("))&&(c=0);return c};a.Bb=function(){var c,b,d=a.linkObject,f=a.linkType,e=a.linkURL,g,m;a.na=1;d||(a.na=0,d=a.clickObject);if(d){c=a.D(d);for(b=a.L(d);d&&!b&&"BODY"!=c;)if(d=d.parentElement?d.parentElement:d.parentNode)c=a.D(d),b=a.L(d);b&&"BODY"!=c||(d=0);if(d&&!a.linkObject){var p=d.onclick?""+d.onclick:"";if(0<=p.indexOf(".tl(")||0<=p.indexOf(".trackLink("))d=0}}else a.na=1;!e&&d&&
(e=a.Da(d));e&&!a.linkLeaveQueryString&&(g=e.indexOf("?"),0<=g&&(e=e.substring(0,g)));if(!f&&e){var n=0,r=0,q;if(a.trackDownloadLinks&&a.linkDownloadFileTypes)for(p=e.toLowerCase(),g=p.indexOf("?"),m=p.indexOf("#"),0<=g?0<=m&&m<g&&(g=m):g=m,0<=g&&(p=p.substring(0,g)),g=a.linkDownloadFileTypes.toLowerCase().split(","),m=0;m<g.length;m++)(q=g[m])&&p.substring(p.length-(q.length+1))=="."+q&&(f="d");if(a.trackExternalLinks&&!f&&(p=e.toLowerCase(),a.Ga(p)&&(a.linkInternalFilters||(a.linkInternalFilters=
k.location.hostname),g=0,a.linkExternalFilters?(g=a.linkExternalFilters.toLowerCase().split(","),n=1):a.linkInternalFilters&&(g=a.linkInternalFilters.toLowerCase().split(",")),g))){for(m=0;m<g.length;m++)q=g[m],0<=p.indexOf(q)&&(r=1);r?n&&(f="e"):n||(f="e")}}a.linkObject=d;a.linkURL=e;a.linkType=f;if(a.trackClickMap||a.trackInlineStats)a.e="",d&&(f=a.pageName,e=1,d=d.sourceIndex,f||(f=a.pageURL,e=0),k.s_objectID&&(b.id=k.s_objectID,d=b.type=1),f&&b&&b.id&&c&&(a.e="&pid="+a.escape(f.substring(0,255))+
(e?"&pidt="+e:"")+"&oid="+a.escape(b.id.substring(0,100))+(b.type?"&oidt="+b.type:"")+"&ot="+c+(d?"&oi="+d:"")))};a.tb=function(){var c=a.na,b=a.linkType,d=a.linkURL,f=a.linkName;b&&(d||f)&&(b=b.toLowerCase(),"d"!=b&&"e"!=b&&(b="o"),a.pe="lnk_"+b,a.pev1=d?a.escape(d):"",a.pev2=f?a.escape(f):"",c=1);a.abort&&(c=0);if(a.trackClickMap||a.trackInlineStats||a.ActivityMap){var b={},d=0,e=a.cookieRead("s_sq"),g=e?e.split("&"):0,m,p,k,e=0;if(g)for(m=0;m<g.length;m++)p=g[m].split("="),f=a.unescape(p[0]).split(","),
p=a.unescape(p[1]),b[p]=f;f=a.account.split(",");m={};for(k in a.contextData)k&&!Object.prototype[k]&&"a.activitymap."==k.substring(0,14)&&(m[k]=a.contextData[k],a.contextData[k]="");a.e=a.r("c",m)+(a.e?a.e:"");if(c||a.e){c&&!a.e&&(e=1);for(p in b)if(!Object.prototype[p])for(k=0;k<f.length;k++)for(e&&(g=b[p].join(","),g==a.account&&(a.e+=("&"!=p.charAt(0)?"&":"")+p,b[p]=[],d=1)),m=0;m<b[p].length;m++)g=b[p][m],g==f[k]&&(e&&(a.e+="&u="+a.escape(g)+("&"!=p.charAt(0)?"&":"")+p+"&u=0"),b[p].splice(m,
1),d=1);c||(d=1);if(d){e="";m=2;!c&&a.e&&(e=a.escape(f.join(","))+"="+a.escape(a.e),m=1);for(p in b)!Object.prototype[p]&&0<m&&0<b[p].length&&(e+=(e?"&":"")+a.escape(b[p].join(","))+"="+a.escape(p),m--);a.cookieWrite("s_sq",e)}}}return c};a.ub=function(){if(!a.Fb){var c=new Date,b=r.location,d,f,e=f=d="",g="",m="",k="1.2",n=a.cookieWrite("s_cc","true",0)?"Y":"N",q="",s="";if(c.setUTCDate&&(k="1.3",(0).toPrecision&&(k="1.5",c=[],c.forEach))){k="1.6";f=0;d={};try{f=new Iterator(d),f.next&&(k="1.7",
c.reduce&&(k="1.8",k.trim&&(k="1.8.1",Date.parse&&(k="1.8.2",Object.create&&(k="1.8.5")))))}catch(t){}}d=screen.width+"x"+screen.height;e=navigator.javaEnabled()?"Y":"N";f=screen.pixelDepth?screen.pixelDepth:screen.colorDepth;g=a.w.innerWidth?a.w.innerWidth:a.d.documentElement.offsetWidth;m=a.w.innerHeight?a.w.innerHeight:a.d.documentElement.offsetHeight;try{a.b.addBehavior("#default#homePage"),q=a.b.Lb(b)?"Y":"N"}catch(u){}try{a.b.addBehavior("#default#clientCaps"),s=a.b.connectionType}catch(x){}a.resolution=
d;a.colorDepth=f;a.javascriptVersion=k;a.javaEnabled=e;a.cookiesEnabled=n;a.browserWidth=g;a.browserHeight=m;a.connectionType=s;a.homepage=q;a.Fb=1}};a.P={};a.loadModule=function(c,b){var d=a.P[c];if(!d){d=k["AppMeasurement_Module_"+c]?new k["AppMeasurement_Module_"+c](a):{};a.P[c]=a[c]=d;d.Xa=function(){return d.ab};d.bb=function(b){if(d.ab=b)a[c+"_onLoad"]=b,a.ha(c+"_onLoad",[a,d],1)||b(a,d)};try{Object.defineProperty?Object.defineProperty(d,"onLoad",{get:d.Xa,set:d.bb}):d._olc=1}catch(f){d._olc=
1}}b&&(a[c+"_onLoad"]=b,a.ha(c+"_onLoad",[a,d],1)||b(a,d))};a.p=function(c){var b,d;for(b in a.P)if(!Object.prototype[b]&&(d=a.P[b])&&(d._olc&&d.onLoad&&(d._olc=0,d.onLoad(a,d)),d[c]&&d[c]()))return 1;return 0};a.wb=function(){var c=Math.floor(1E13*Math.random()),b=a.visitorSampling,d=a.visitorSamplingGroup,d="s_vsn_"+(a.visitorNamespace?a.visitorNamespace:a.account)+(d?"_"+d:""),f=a.cookieRead(d);if(b){f&&(f=parseInt(f));if(!f){if(!a.cookieWrite(d,c))return 0;f=c}if(f%1E4>v)return 0}return 1};a.Q=
function(c,b){var d,f,e,g,m,k;for(d=0;2>d;d++)for(f=0<d?a.wa:a.g,e=0;e<f.length;e++)if(g=f[e],(m=c[g])||c["!"+g]){if(!b&&("contextData"==g||"retrieveLightData"==g)&&a[g])for(k in a[g])m[k]||(m[k]=a[g][k]);a[g]=m}};a.Qa=function(c,b){var d,f,e,g;for(d=0;2>d;d++)for(f=0<d?a.wa:a.g,e=0;e<f.length;e++)g=f[e],c[g]=a[g],b||c[g]||(c["!"+g]=1)};a.ob=function(a){var b,d,f,e,g,k=0,p,n="",q="";if(a&&255<a.length&&(b=""+a,d=b.indexOf("?"),0<d&&(p=b.substring(d+1),b=b.substring(0,d),e=b.toLowerCase(),f=0,"http://"==
e.substring(0,7)?f+=7:"https://"==e.substring(0,8)&&(f+=8),d=e.indexOf("/",f),0<d&&(e=e.substring(f,d),g=b.substring(d),b=b.substring(0,d),0<=e.indexOf("google")?k=",q,ie,start,search_key,word,kw,cd,":0<=e.indexOf("yahoo.co")&&(k=",p,ei,"),k&&p)))){if((a=p.split("&"))&&1<a.length){for(f=0;f<a.length;f++)e=a[f],d=e.indexOf("="),0<d&&0<=k.indexOf(","+e.substring(0,d)+",")?n+=(n?"&":"")+e:q+=(q?"&":"")+e;n&&q?p=n+"&"+q:q=""}d=253-(p.length-q.length)-b.length;a=b+(0<d?g.substring(0,d):"")+"?"+p}return a};
a.Wa=function(c){var b=a.d.visibilityState,d=["webkitvisibilitychange","visibilitychange"];b||(b=a.d.webkitVisibilityState);if(b&&"prerender"==b){if(c)for(b=0;b<d.length;b++)a.d.addEventListener(d[b],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&c()});return!1}return!0};a.da=!1;a.I=!1;a.eb=function(){a.I=!0;a.j()};a.ba=!1;a.U=!1;a.$a=function(c){a.marketingCloudVisitorID=c;a.U=!0;a.j()};a.ea=!1;a.V=!1;a.fb=function(c){a.visitorOptedOut=c;a.V=!0;a.j()};a.Y=!1;
a.R=!1;a.Sa=function(c){a.analyticsVisitorID=c;a.R=!0;a.j()};a.aa=!1;a.T=!1;a.Ua=function(c){a.audienceManagerLocationHint=c;a.T=!0;a.j()};a.Z=!1;a.S=!1;a.Ta=function(c){a.audienceManagerBlob=c;a.S=!0;a.j()};a.Va=function(c){a.maxDelay||(a.maxDelay=250);return a.p("_d")?(c&&setTimeout(function(){c()},a.maxDelay),!1):!0};a.ca=!1;a.H=!1;a.va=function(){a.H=!0;a.j()};a.isReadyToTrack=function(){var c=!0,b=a.visitor,d,f,e;a.da||a.I||(a.Wa(a.eb)?a.I=!0:a.da=!0);if(a.da&&!a.I)return!1;b&&b.isAllowed()&&
(a.ba||a.marketingCloudVisitorID||!b.getMarketingCloudVisitorID||(a.ba=!0,a.marketingCloudVisitorID=b.getMarketingCloudVisitorID([a,a.$a]),a.marketingCloudVisitorID&&(a.U=!0)),a.ea||a.visitorOptedOut||!b.isOptedOut||(a.ea=!0,a.visitorOptedOut=b.isOptedOut([a,a.fb]),a.visitorOptedOut!=q&&(a.V=!0)),a.Y||a.analyticsVisitorID||!b.getAnalyticsVisitorID||(a.Y=!0,a.analyticsVisitorID=b.getAnalyticsVisitorID([a,a.Sa]),a.analyticsVisitorID&&(a.R=!0)),a.aa||a.audienceManagerLocationHint||!b.getAudienceManagerLocationHint||
(a.aa=!0,a.audienceManagerLocationHint=b.getAudienceManagerLocationHint([a,a.Ua]),a.audienceManagerLocationHint&&(a.T=!0)),a.Z||a.audienceManagerBlob||!b.getAudienceManagerBlob||(a.Z=!0,a.audienceManagerBlob=b.getAudienceManagerBlob([a,a.Ta]),a.audienceManagerBlob&&(a.S=!0)),c=a.ba&&!a.U&&!a.marketingCloudVisitorID,b=a.Y&&!a.R&&!a.analyticsVisitorID,d=a.aa&&!a.T&&!a.audienceManagerLocationHint,f=a.Z&&!a.S&&!a.audienceManagerBlob,e=a.ea&&!a.V,c=c||b||d||f||e?!1:!0);a.ca||a.H||(a.Va(a.va)?a.H=!0:a.ca=
!0);a.ca&&!a.H&&(c=!1);return c};a.o=q;a.u=0;a.callbackWhenReadyToTrack=function(c,b,d){var f;f={};f.jb=c;f.ib=b;f.gb=d;a.o==q&&(a.o=[]);a.o.push(f);0==a.u&&(a.u=setInterval(a.j,100))};a.j=function(){var c;if(a.isReadyToTrack()&&(a.cb(),a.o!=q))for(;0<a.o.length;)c=a.o.shift(),c.ib.apply(c.jb,c.gb)};a.cb=function(){a.u&&(clearInterval(a.u),a.u=0)};a.Ya=function(c){var b,d,f=q,e=q;if(!a.isReadyToTrack()){b=[];if(c!=q)for(d in f={},c)f[d]=c[d];e={};a.Qa(e,!0);b.push(f);b.push(e);a.callbackWhenReadyToTrack(a,
a.track,b);return!0}return!1};a.qb=function(){var c=a.cookieRead("s_fid"),b="",d="",f;f=8;var e=4;if(!c||0>c.indexOf("-")){for(c=0;16>c;c++)f=Math.floor(Math.random()*f),b+="0123456789ABCDEF".substring(f,f+1),f=Math.floor(Math.random()*e),d+="0123456789ABCDEF".substring(f,f+1),f=e=16;c=b+"-"+d}a.cookieWrite("s_fid",c,1)||(c=0);return c};a.t=a.track=function(c,b){var d,f=new Date,e="s"+Math.floor(f.getTime()/108E5)%10+Math.floor(1E13*Math.random()),g=f.getYear(),g="t="+a.escape(f.getDate()+"/"+f.getMonth()+
"/"+(1900>g?g+1900:g)+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+" "+f.getDay()+" "+f.getTimezoneOffset());a.visitor&&(a.visitor.getAuthState&&(a.authState=a.visitor.getAuthState()),!a.supplementalDataID&&a.visitor.getSupplementalDataID&&(a.supplementalDataID=a.visitor.getSupplementalDataID("AppMeasurement:"+a._in,a.expectSupplementalData?!1:!0)));a.p("_s");a.Ya(c)||(b&&a.Q(b),c&&(d={},a.Qa(d,0),a.Q(c)),a.wb()&&!a.visitorOptedOut&&(a.analyticsVisitorID||a.marketingCloudVisitorID||(a.fid=
a.qb()),a.Bb(),a.usePlugins&&a.doPlugins&&a.doPlugins(a),a.account&&(a.abort||(a.trackOffline&&!a.timestamp&&(a.timestamp=Math.floor(f.getTime()/1E3)),f=k.location,a.pageURL||(a.pageURL=f.href?f.href:f),a.referrer||a.Ra||(a.referrer=r.document.referrer),a.Ra=1,a.referrer=a.ob(a.referrer),a.p("_g")),a.tb()&&!a.abort&&(a.ub(),g+=a.sb(),a.Ab(e,g),a.p("_t"),a.referrer=""))),c&&a.Q(d,1));a.abort=a.supplementalDataID=a.timestamp=a.pageURLRest=a.linkObject=a.clickObject=a.linkURL=a.linkName=a.linkType=k.s_objectID=
a.pe=a.pev1=a.pev2=a.pev3=a.e=a.lightProfileID=0};a.tl=a.trackLink=function(c,b,d,f,e){a.linkObject=c;a.linkType=b;a.linkName=d;e&&(a.l=c,a.A=e);return a.track(f)};a.trackLight=function(c,b,d,f){a.lightProfileID=c;a.lightStoreForSeconds=b;a.lightIncrementBy=d;return a.track(f)};a.clearVars=function(){var c,b;for(c=0;c<a.g.length;c++)if(b=a.g[c],"prop"==b.substring(0,4)||"eVar"==b.substring(0,4)||"hier"==b.substring(0,4)||"list"==b.substring(0,4)||"channel"==b||"events"==b||"eventList"==b||"products"==
b||"productList"==b||"purchaseID"==b||"transactionID"==b||"state"==b||"zip"==b||"campaign"==b)a[b]=void 0};a.tagContainerMarker="";a.Ab=function(c,b){var d,f=a.trackingServer;d="";var e=a.dc,g="sc.",k=a.visitorNamespace;f?a.trackingServerSecure&&a.ssl&&(f=a.trackingServerSecure):(k||(k=a.account,f=k.indexOf(","),0<=f&&(k=k.substring(0,f)),k=k.replace(/[^A-Za-z0-9]/g,"")),d||(d="2o7.net"),e=e?(""+e).toLowerCase():"d1","2o7.net"==d&&("d1"==e?e="112":"d2"==e&&(e="122"),g=""),f=k+"."+e+"."+g+d);d=a.ssl?
"https://":"http://";e=a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks;d+=f+"/b/ss/"+a.account+"/"+(a.mobile?"5.":"")+(e?"10":"1")+"/JS-"+a.version+(a.Eb?"T":"")+(a.tagContainerMarker?"-"+a.tagContainerMarker:"")+"/"+c+"?AQB=1&ndh=1&pf=1&"+(e?"callback=s_c_il["+a._in+"].doPostbacks&et=1&":"")+b+"&AQE=1";a.mb(d);a.ja()};a.Pa=/{(%?)(.*?)(%?)}/;a.Ib=RegExp(a.Pa.source,"g");a.nb=function(c){if("object"==typeof c.dests)for(var b=0;b<c.dests.length;++b)if(o=c.dests[b],"string"==
typeof o.c&&"aa."==o.id.substr(0,3))for(var d=o.c.match(a.Ib),b=0;b<d.length;++b){match=d[b];var f=match.match(a.Pa),e="";"%"==f[1]&&"timezone_offset"==f[2]?e=(new Date).getTimezoneOffset():"%"==f[1]&&"timestampz"==f[2]&&(e=a.rb());o.c=o.c.replace(match,a.escape(e))}};a.rb=function(){var c=new Date,b=new Date(6E4*Math.abs(c.getTimezoneOffset()));return a.k(4,c.getFullYear())+"-"+a.k(2,c.getMonth()+1)+"-"+a.k(2,c.getDate())+"T"+a.k(2,c.getHours())+":"+a.k(2,c.getMinutes())+":"+a.k(2,c.getSeconds())+
(0<c.getTimezoneOffset()?"-":"+")+a.k(2,b.getUTCHours())+":"+a.k(2,b.getUTCMinutes())};a.k=function(a,b){return(Array(a+1).join(0)+b).slice(-a)};a.ra={};a.doPostbacks=function(c){if("object"==typeof c)if(a.nb(c),"object"==typeof a.AudienceManagement&&"function"==typeof a.AudienceManagement.isReady&&a.AudienceManagement.isReady()&&"function"==typeof a.AudienceManagement.passData)a.AudienceManagement.passData(c);else if("object"==typeof c&&"object"==typeof c.dests)for(var b=0;b<c.dests.length;++b)dest=
c.dests[b],"object"==typeof dest&&"string"==typeof dest.c&&"string"==typeof dest.id&&"aa."==dest.id.substr(0,3)&&(a.ra[dest.id]=new Image,a.ra[dest.id].alt="",a.ra[dest.id].src=dest.c)};a.mb=function(c){a.i||a.vb();a.i.push(c);a.la=a.C();a.Na()};a.vb=function(){a.i=a.xb();a.i||(a.i=[])};a.xb=function(){var c,b;if(a.qa()){try{(b=k.localStorage.getItem(a.oa()))&&(c=k.JSON.parse(b))}catch(d){}return c}};a.qa=function(){var c=!0;a.trackOffline&&a.offlineFilename&&k.localStorage&&k.JSON||(c=!1);return c};
a.Ea=function(){var c=0;a.i&&(c=a.i.length);a.q&&c++;return c};a.ja=function(){if(a.q&&(a.B&&a.B.complete&&a.B.F&&a.B.ua(),a.q))return;a.Fa=q;if(a.pa)a.la>a.N&&a.La(a.i),a.ta(500);else{var c=a.hb();if(0<c)a.ta(c);else if(c=a.Ba())a.q=1,a.zb(c),a.Db(c)}};a.ta=function(c){a.Fa||(c||(c=0),a.Fa=setTimeout(a.ja,c))};a.hb=function(){var c;if(!a.trackOffline||0>=a.offlineThrottleDelay)return 0;c=a.C()-a.Ka;return a.offlineThrottleDelay<c?0:a.offlineThrottleDelay-c};a.Ba=function(){if(0<a.i.length)return a.i.shift()};
a.zb=function(c){if(a.debugTracking){var b="AppMeasurement Debug: "+c;c=c.split("&");var d;for(d=0;d<c.length;d++)b+="\n\t"+a.unescape(c[d]);a.yb(b)}};a.Za=function(){return a.marketingCloudVisitorID||a.analyticsVisitorID};a.X=!1;var s;try{s=JSON.parse('{"x":"y"}')}catch(x){s=null}s&&"y"==s.x?(a.X=!0,a.W=function(a){return JSON.parse(a)}):k.$&&k.$.parseJSON?(a.W=function(a){return k.$.parseJSON(a)},a.X=!0):a.W=function(){return null};a.Db=function(c){var b,d,f;a.Za()&&2047<c.length&&("undefined"!=
typeof XMLHttpRequest&&(b=new XMLHttpRequest,"withCredentials"in b?d=1:b=0),b||"undefined"==typeof XDomainRequest||(b=new XDomainRequest,d=2),b&&(a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks)&&(a.X?b.xa=!0:b=0));!b&&a.Oa&&(c=c.substring(0,2047));!b&&a.d.createElement&&(0!=a.usePostbacks||a.AudienceManagement&&a.AudienceManagement.isReady())&&(b=a.d.createElement("SCRIPT"))&&"async"in b&&((f=(f=a.d.getElementsByTagName("HEAD"))&&f[0]?f[0]:a.d.body)?(b.type="text/javascript",
b.setAttribute("async","async"),d=3):b=0);b||(b=new Image,b.alt="",b.abort||"undefined"===typeof k.InstallTrigger||(b.abort=function(){b.src=q}));b.za=function(){try{b.F&&(clearTimeout(b.F),b.F=0)}catch(a){}};b.onload=b.ua=function(){b.za();a.lb();a.fa();a.q=0;a.ja();if(b.xa){b.xa=!1;try{a.doPostbacks(a.W(b.responseText))}catch(c){}}};b.onabort=b.onerror=b.Ca=function(){b.za();(a.trackOffline||a.pa)&&a.q&&a.i.unshift(a.kb);a.q=0;a.la>a.N&&a.La(a.i);a.fa();a.ta(500)};b.onreadystatechange=function(){4==
b.readyState&&(200==b.status?b.ua():b.Ca())};a.Ka=a.C();if(1==d||2==d){var e=c.indexOf("?");f=c.substring(0,e);e=c.substring(e+1);e=e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,"");1==d?(b.open("POST",f,!0),b.send(e)):2==d&&(b.open("POST",f),b.send(e))}else if(b.src=c,3==d){if(a.Ia)try{f.removeChild(a.Ia)}catch(g){}f.firstChild?f.insertBefore(b,f.firstChild):f.appendChild(b);a.Ia=a.B}b.F=setTimeout(function(){b.F&&(b.complete?b.ua():(a.trackOffline&&b.abort&&b.abort(),b.Ca()))},5E3);a.kb=c;a.B=k["s_i_"+
a.replace(a.account,",","_")]=b;if(a.useForcedLinkTracking&&a.J||a.A)a.forcedLinkTrackingTimeout||(a.forcedLinkTrackingTimeout=250),a.ga=setTimeout(a.fa,a.forcedLinkTrackingTimeout)};a.lb=function(){if(a.qa()&&!(a.Ja>a.N))try{k.localStorage.removeItem(a.oa()),a.Ja=a.C()}catch(c){}};a.La=function(c){if(a.qa()){a.Na();try{k.localStorage.setItem(a.oa(),k.JSON.stringify(c)),a.N=a.C()}catch(b){}}};a.Na=function(){if(a.trackOffline){if(!a.offlineLimit||0>=a.offlineLimit)a.offlineLimit=10;for(;a.i.length>
a.offlineLimit;)a.Ba()}};a.forceOffline=function(){a.pa=!0};a.forceOnline=function(){a.pa=!1};a.oa=function(){return a.offlineFilename+"-"+a.visitorNamespace+a.account};a.C=function(){return(new Date).getTime()};a.Ga=function(a){a=a.toLowerCase();return 0!=a.indexOf("#")&&0!=a.indexOf("about:")&&0!=a.indexOf("opera:")&&0!=a.indexOf("javascript:")?!0:!1};a.setTagContainer=function(c){var b,d,f;a.Eb=c;for(b=0;b<a._il.length;b++)if((d=a._il[b])&&"s_l"==d._c&&d.tagContainerName==c){a.Q(d);if(d.lmq)for(b=
0;b<d.lmq.length;b++)f=d.lmq[b],a.loadModule(f.n);if(d.ml)for(f in d.ml)if(a[f])for(b in c=a[f],f=d.ml[f],f)!Object.prototype[b]&&("function"!=typeof f[b]||0>(""+f[b]).indexOf("s_c_il"))&&(c[b]=f[b]);if(d.mmq)for(b=0;b<d.mmq.length;b++)f=d.mmq[b],a[f.m]&&(c=a[f.m],c[f.f]&&"function"==typeof c[f.f]&&(f.a?c[f.f].apply(c,f.a):c[f.f].apply(c)));if(d.tq)for(b=0;b<d.tq.length;b++)a.track(d.tq[b]);d.s=a;break}};a.Util={urlEncode:a.escape,urlDecode:a.unescape,cookieRead:a.cookieRead,cookieWrite:a.cookieWrite,
getQueryParam:function(c,b,d){var f;b||(b=a.pageURL?a.pageURL:k.location);d||(d="&");return c&&b&&(b=""+b,f=b.indexOf("?"),0<=f&&(b=d+b.substring(f+1)+d,f=b.indexOf(d+c+"="),0<=f&&(b=b.substring(f+d.length+c.length+1),f=b.indexOf(d),0<=f&&(b=b.substring(0,f)),0<b.length)))?a.unescape(b):""}};a.G="supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
a.g=a.G.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));a.ma="timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");a.O=a.ma.slice(0);a.wa="account allAccounts debugTracking visitor visitorOptedOut trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData usePostbacks AudienceManagement".split(" ");
for(n=0;250>=n;n++)76>n&&(a.g.push("prop"+n),a.O.push("prop"+n)),a.g.push("eVar"+n),a.O.push("eVar"+n),6>n&&a.g.push("hier"+n),4>n&&a.g.push("list"+n);n="pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest".split(" ");a.g=a.g.concat(n);a.G=a.G.concat(n);a.ssl=0<=k.location.protocol.toLowerCase().indexOf("https");a.charSet="UTF-8";a.contextData={};a.offlineThrottleDelay=0;a.offlineFilename=
"AppMeasurement.offline";a.Ka=0;a.la=0;a.N=0;a.Ja=0;a.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";a.w=k;a.d=k.document;try{if(a.Oa=!1,navigator){var y=navigator.userAgent;if("Microsoft Internet Explorer"==navigator.appName||0<=y.indexOf("MSIE ")||0<=y.indexOf("Trident/")&&0<=y.indexOf("Windows NT 6"))a.Oa=!0}}catch(z){}a.fa=function(){a.ga&&(k.clearTimeout(a.ga),a.ga=q);a.l&&a.J&&a.l.dispatchEvent(a.J);a.A&&("function"==typeof a.A?a.A():a.l&&a.l.href&&(a.d.location=
a.l.href));a.l=a.J=a.A=0};a.Ma=function(){a.b=a.d.body;a.b?(a.v=function(c){var b,d,f,e,g;if(!(a.d&&a.d.getElementById("cppXYctnr")||c&&c["s_fe_"+a._in])){if(a.ya)if(a.useForcedLinkTracking)a.b.removeEventListener("click",a.v,!1);else{a.b.removeEventListener("click",a.v,!0);a.ya=a.useForcedLinkTracking=0;return}else a.useForcedLinkTracking=0;a.clickObject=c.srcElement?c.srcElement:c.target;try{if(!a.clickObject||a.M&&a.M==a.clickObject||!(a.clickObject.tagName||a.clickObject.parentElement||a.clickObject.parentNode))a.clickObject=
0;else{var m=a.M=a.clickObject;a.ka&&(clearTimeout(a.ka),a.ka=0);a.ka=setTimeout(function(){a.M==m&&(a.M=0)},1E4);f=a.Ea();a.track();if(f<a.Ea()&&a.useForcedLinkTracking&&c.target){for(e=c.target;e&&e!=a.b&&"A"!=e.tagName.toUpperCase()&&"AREA"!=e.tagName.toUpperCase();)e=e.parentNode;if(e&&(g=e.href,a.Ga(g)||(g=0),d=e.target,c.target.dispatchEvent&&g&&(!d||"_self"==d||"_top"==d||"_parent"==d||k.name&&d==k.name))){try{b=a.d.createEvent("MouseEvents")}catch(n){b=new k.MouseEvent}if(b){try{b.initMouseEvent("click",
c.bubbles,c.cancelable,c.view,c.detail,c.screenX,c.screenY,c.clientX,c.clientY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,c.relatedTarget)}catch(q){b=0}b&&(b["s_fe_"+a._in]=b.s_fe=1,c.stopPropagation(),c.stopImmediatePropagation&&c.stopImmediatePropagation(),c.preventDefault(),a.l=c.target,a.J=b)}}}}}catch(r){a.clickObject=0}}},a.b&&a.b.attachEvent?a.b.attachEvent("onclick",a.v):a.b&&a.b.addEventListener&&(navigator&&(0<=navigator.userAgent.indexOf("WebKit")&&a.d.createEvent||0<=navigator.userAgent.indexOf("Firefox/2")&&
k.MouseEvent)&&(a.ya=1,a.useForcedLinkTracking=1,a.b.addEventListener("click",a.v,!0)),a.b.addEventListener("click",a.v,!1))):setTimeout(a.Ma,30)};a.Ma();a.loadModule("ActivityMap")}
function s_gi(a){var k,q=window.s_c_il,r,n,t=a.split(","),u,s,x=0;if(q)for(r=0;!x&&r<q.length;){k=q[r];if("s_c"==k._c&&(k.account||k.oun))if(k.account&&k.account==a)x=1;else for(n=k.account?k.account:k.oun,n=k.allAccounts?k.allAccounts:n.split(","),u=0;u<t.length;u++)for(s=0;s<n.length;s++)t[u]==n[s]&&(x=1);r++}x||(k=new AppMeasurement);k.setAccount?k.setAccount(a):k.sa&&k.sa(a);return k}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var a=window,k=a.s_giq,q,r,n;if(k)for(q=0;q<k.length;q++)r=k[q],n=s_gi(r.oun),n.setAccount(r.un),n.setTagContainer(r.tagContainerName);a.s_giq=0}s_pgicq();
