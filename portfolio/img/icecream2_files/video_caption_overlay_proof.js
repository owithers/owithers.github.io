/*global
    $pdk, document, window
*/

(function () {
    "use strict";
    var winCheck= window.win7ie || false;
    if (window.nbc.isMobile === "true" && window.navigator.userAgent.indexOf('like Mac OS X') > -1) {
        console.log('--vcop-- iOS detected, not adding card...');
        return false;
    }

    var initCustomCaptionsInterval = -1,
        customCaptionObject = {
            markup: false,
            fontStyle: {},
            currentStyle: {
                opacity: 1,
                backgroundOpacity: 1,
                backgroundColor: 'black',
                fontColor: 'white',
                fontSize: 1,
                fontFamily: 'Arial Black',
                fontEdge: 'None',
                fontEdgeColor: 'red'
            },
        },
        closeTheWindow = function (callback) {
            $pdk.jQuery(".hideMyCaptionControls, .customCaptionControls").stop().fadeOut(500, callback);
            console.log('--vcop-- show subtitles..');
            $pdk.controller.setShowSubtitles(true, ['*']);
        },
        setPreviewCaptionStyle = function () {
            var $sample_text = $pdk.jQuery(".customCaptionControls .caption-sample"),
                $background_color_div = $sample_text.find('.div2'),
                $font_edge_color_divs = $sample_text.find('.div3,.div4,.div5,.div6'),
                iterator = 0,
                keys = [],
                key = null,
                cssKey = null,
                value = null,
                styleOptToCssMap = {
                    fontColor: 'color',
                    fontSize: 'fontSize',
                    fontFamily: 'fontFamily',
                    opacity: 'opacity'
                },
                newStyle = {};

            keys = Object.keys(customCaptionObject.fontStyle);

            console.log('customCaptionObject.fontStyle', customCaptionObject.fontStyle);

            for (iterator = keys.length - 1; iterator >= 0; iterator -= 1) {
                key = keys[iterator];
                value = customCaptionObject.fontStyle[key];
                if (styleOptToCssMap.hasOwnProperty(key)) {
                    cssKey = styleOptToCssMap[key];
                    if (cssKey === "fontSize") {
                        // fontSize = 14 pixels * ratio. (0-2)
                        value = 14 * parseFloat(value);
                    }
                    newStyle[cssKey] = value;
                }
            }

            console.log('newStyle', newStyle);

            $sample_text.css(newStyle);

            if (customCaptionObject.fontStyle.hasOwnProperty('backgroundColor')) {
                // set both foreground and background color to the same
                // div2 is only background, this is hack for aboslute positioning
                // and the layering effects..
                $background_color_div.css({
                    color: customCaptionObject.fontStyle.backgroundColor,
                    backgroundColor: customCaptionObject.fontStyle.backgroundColor
                });
            }

            if (customCaptionObject.fontStyle.hasOwnProperty('fontEdgeColor')) {
                $font_edge_color_divs.css({color: customCaptionObject.fontStyle.fontEdgeColor});
            }

            if (customCaptionObject.fontStyle.hasOwnProperty('fontEdge')) {
                $font_edge_color_divs.addClass('no-edge');
                if (customCaptionObject.fontStyle.fontEdge === "Depressed") {
                    $sample_text.find('.div6').removeClass('no-edge');
                } else if (customCaptionObject.fontStyle.fontEdge === "Raised") {
                    $sample_text.find('.div5').removeClass('no-edge');
                } else if (customCaptionObject.fontStyle.fontEdge === "DropShadow") {
                    $sample_text.find('.div5,.div6').removeClass('no-edge');
                } else if (customCaptionObject.fontStyle.fontEdge === "Uniform") {
                    $font_edge_color_divs.removeClass('no-edge');
                }
            }
        },
        ghettoObjectClone = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        resetFontStyles = function () {
            customCaptionObject.fontStyle = ghettoObjectClone(customCaptionObject.currentStyle);
        },
        setOptionValues = function () {
            var option_controls = $pdk.jQuery(".customCaptionControls select[name*=-control]");

            console.log('--vcop-- option_controls.length:', option_controls.length);
            if (option_controls.length < 1) {
                // THIS IS A FATAL ERROR.
                console.error('--vcop-- The caption controls failed to paint to the screen.');
                return false;
            }

            // set the initial options
            option_controls.each(function (idx) {
                var self = $pdk.jQuery(option_controls[idx]),
                    styleOpt = self.attr('name').replace(/-control$/, '');

                if (customCaptionObject.fontStyle.hasOwnProperty(styleOpt)) {
                    console.log('--vcop-- Setting preset:', styleOpt, customCaptionObject.fontStyle[styleOpt]);
                    self.val(customCaptionObject.fontStyle[styleOpt]);
                }
            });

            if (customCaptionObject.fontStyle.hasOwnProperty('fontSize')) {
                $pdk.jQuery(".customCaptionControls .currentFontSize").text(parseFloat(customCaptionObject.fontStyle.fontSize).toFixed(2));
            }

            if (customCaptionObject.fontStyle.hasOwnProperty('opacity')) {
                $pdk.jQuery(".customCaptionControls .currentOpacity").text(parseFloat(100 * customCaptionObject.fontStyle.opacity).toFixed(2) + "%");
            }

            return true;
        },
        setEventHandlers = function () {
            if (!setOptionValues()) {
                return false;
            }

            // add event listeners
            $pdk.jQuery(".customCaptionControls .caption-controller .switch input").on('click', function () {
                var $self = $pdk.jQuery(this);

                if ($self.is(':checked')) {
                    if (window.nbc.siteKey.startsWith('tlmd')) {
                        $pdk.controller.setSubtitleLanguage('es', ['*']); // Spanish
                    } else {
                        $pdk.controller.setSubtitleLanguage('en', ['*']); // English
                    }
                } else {
                    $pdk.controller.setSubtitleLanguage('none', ['*']); // Disable
                }
            });

            $pdk.jQuery(".customCaptionControls select[name*=-control]").on('change', function (evt) {
                evt.preventDefault();
                var self = $pdk.jQuery(this),
                    newVal = self.val(),
                    styleOpt = self.attr('name').replace(/-control$/, '');

                console.log('--vcop-- styleOption: ' + styleOpt + ' / changed to: ' + newVal);
                customCaptionObject.fontStyle[styleOpt] = newVal;
                setPreviewCaptionStyle();
            });
            $pdk.jQuery("#increaseFontSize").on('click', function (evt) {
                evt.preventDefault();
                if (customCaptionObject.fontStyle.fontSize < 2) {
                    customCaptionObject.fontStyle.fontSize += 0.1;
                }
                setOptionValues();
                setPreviewCaptionStyle();
            });
            $pdk.jQuery("#decreaseFontSize").on('click', function (evt) {
                evt.preventDefault();
                if (customCaptionObject.fontStyle.fontSize > 0.1) {
                    customCaptionObject.fontStyle.fontSize -= 0.1;
                }
                setOptionValues();
                setPreviewCaptionStyle();
            });
            $pdk.jQuery("#increaseOpacity").on('click', function (evt) {
                evt.preventDefault();
                if (customCaptionObject.fontStyle.opacity < 1) {
                    customCaptionObject.fontStyle.opacity += 0.1;
                    customCaptionObject.fontStyle.backgroundOpacity = parseFloat(customCaptionObject.fontStyle.opacity);
                }
                setOptionValues();
                setPreviewCaptionStyle();
            });
            $pdk.jQuery("#decreaseOpacity").on('click', function (evt) {
                evt.preventDefault();
                if (customCaptionObject.fontStyle.opacity > 0.1) {
                    customCaptionObject.fontStyle.opacity -= 0.1;
                    customCaptionObject.fontStyle.backgroundOpacity = parseFloat(customCaptionObject.fontStyle.opacity);
                }
                setOptionValues();
                setPreviewCaptionStyle();
            });
            $pdk.jQuery(".caption-sample-reset").on('click', function (evt) {
                evt.preventDefault();
                resetFontStyles();
                setOptionValues();
                setPreviewCaptionStyle();
            });
            $pdk.jQuery(".caption-sample-done").on('click', function (evt) {
                evt.preventDefault();

                $pdk.controller.setSubtitleStyle(customCaptionObject.fontStyle, ['*']);

                customCaptionObject.currentStyle = ghettoObjectClone(customCaptionObject.fontStyle);

                closeTheWindow();
            });
            $pdk.jQuery("#closeCustomCaptions").on('click', function (evt) {
                evt.preventDefault();

                closeTheWindow(function () {
                    resetFontStyles();
                    setOptionValues();
                    setPreviewCaptionStyle();
                });
            });

            window.customCaptionControlEvent = function (eventData) {
                var $caption_toggle = $pdk.jQuery(".customCaptionControls .caption-controller .switch input");

                if (eventData.data.langCode !== 'none' && eventData.data.wasChanged) {
                    $caption_toggle.attr('checked', 'checked');

                    // we hide the subtitle by default to show our controls instead.
                    console.log('--vcop-- hide subtitles..');
                    $pdk.controller.setShowSubtitles(false, ['*']);

                    // make sure refresh caption style
                    setPreviewCaptionStyle();

                    // fade it in.
                    $pdk.jQuery(".hideMyCaptionControls, .customCaptionControls").stop().fadeIn(500);
                } else {
                    $caption_toggle.removeAttr('checked');
                }
            };

            $pdk.controller.addEventListener("OnGetSubtitleLanguage", "customCaptionControlEvent", ["*"]);
        },
        docCookies = {
            getItem: function (sKey) {
                if (!sKey) { return null; }
                return decodeURIComponent(
                    document.cookie.replace(
                        new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
                            "\\s*\\=\\s*([^;]*).*$)|^.*$"),
                        "$1"
                    )
                ) || null;
            },
            setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
                if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
                var sExpires = "";
                if (vEnd) {
                    switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                    }
                }
                document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
                return true;
            },
            removeItem: function (sKey, sPath, sDomain) {
                if (!this.hasItem(sKey)) { return false; }
                document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
                return true;
            },
            hasItem: function (sKey) {
                if (!sKey) { return false; }
                return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
            },
            keys: function () {
                var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/),
                    nLen = aKeys.length,
                    nIdx = 0;
                for (nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx += 1) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
                return aKeys;
            }
        },
        setDefaultStyles = function () {
            // check if previous styling existed
            if (docCookies.hasItem('tp_subtitles_settings')) {
                try {
                    var obj = JSON.parse(docCookies.getItem('tp_subtitles_settings'));
                    if (obj && obj.hasOwnProperty('subtitleStyle') && obj.subtitleStyle !== null) {
                        customCaptionObject.currentStyle = ghettoObjectClone(obj.subtitleStyle);
                        console.log('--vcop--loaded old styles:', obj.subtitleStyle);
                    }
                } catch (e) {
                    console.error('--vcop--Something happened while retrieving prior caption styles. ERROR: ', e);
                }
            }

            console.log('--vcop-- styles:', customCaptionObject.currentStyle);

            // reset font styles for the first time.
            resetFontStyles();

            $pdk.controller.setSubtitleStyle(customCaptionObject.fontStyle, ['*']);
        },
        addCustomOverlay = function () {
            if (customCaptionObject.markup) {
                console.log('--vcop-- found overlay markup, starting init process');
                setDefaultStyles();

                console.log('--vcop-- markup ready, start the caption overlay card');
                // Add the card to an "overlays" player card deck
                $pdk.controller.addPlayerCard("overlays", "customCaptionControlCard",
                                              customCaptionObject.markup, "urn:theplatform:pdk:area:player",
                                              {}, customCaptionObject.CaptionControlPresenter, 1, ["*"]);

                $pdk.controller.showPlayerCard("overlays", "customCaptionControlCard", null, null, ["*"]);
                return true;
            }

            return false;
        },
        setOverlayInterval = function () {
            // start waiting for template data..
            initCustomCaptionsInterval = setInterval(function () {
                if (addCustomOverlay()) {
                        // clear the interval!
                    clearInterval(initCustomCaptionsInterval);
                    console.debug('--vcop-- Clearing interval:', initCustomCaptionsInterval);
                }
            }, 1000);
        };

    if (window.nbc.isMobile === "false") {
        // Create the card HTML
        customCaptionObject.markup = false;


        // Create the presenter object
        customCaptionObject.CaptionControlPresenter = function () {
            console.log('--vcop-- CaptionControlPresenter init.');
        };

        // Implement the card presenter show method
        customCaptionObject.CaptionControlPresenter.prototype.show = function (state) {

            // Retrieve the controller from state
            this.controller = state.controller;

            // Append the card and styles to the page
            this.card = state.card;
            this.state = state;

            // Hide the card by default.
            $pdk.jQuery(this.card).css('display', 'none');

            setEventHandlers();
        };

        // Implement the card presenter hide method
        customCaptionObject.CaptionControlPresenter.prototype.hide = function () {
            console.log('--vcop-- hide called..');
        };

        setOverlayInterval();

        window.initCustomCaptions = function () {
            console.log('--vcop-- new media started playing..');
            if (customCaptionObject.markup) {
                addCustomOverlay();
            } else {
                $pdk.jQuery.get('/templates/video_overlay_html', function (data) {
                    console.log('--vcop-- got overlay HTML!');
                    customCaptionObject.markup = data;
                }).fail(function () {
                    console.error('--vcop-- Failed to get video overlay html.');
                    if (initCustomCaptionsInterval > -1) {
                        console.log('Clearing interval:', initCustomCaptionsInterval);
                        clearInterval(initCustomCaptionsInterval);
                    }
                });
            }
        };
    } else if (window.nbc.isMobile === "true") {
        window.initCustomCaptions = function () {
            console.log('--vcop-- new media started playing...');
            setDefaultStyles();
            setEventHandlers();
        };
    }
    if(!winCheck) {
        $pdk.controller.addEventListener("OnMediaStart", "initCustomCaptions", ["*"]);
    }
}());
