/*

ga-track-external.js v0.8

Copyright (c) 2012 Tama Pugsley, Springload, http://springload.co.nz/
MIT License (http://en.wikipedia.org/wiki/MIT_License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var gtrack = gtrack || (function (window, document, location) {

    "use strict";

    var eventsBound = false;

    // Set up object with default values
    var tracker = {
        opt: {
            trackingMode: "event",
            hostRegex: new RegExp("^" + location.host.toString() + "$"),
            trackFiles: true,
            trackExternalLinks: true,
            trackMailtos: true,
            bindEvents: true,
            extensions: "docx?|xlsx?|pptx?|txt|vsd|vxd|eps|jpg|png|gif|svg|pdf|zip|tar|rar|gz|dmg|js|css|exe|wma|mov|avi|wmv|mp3"
        }
    };

    //
    // Recursively loop through the DOM until we find an A or get to the root
    //
    function findA(element) {
        if (element.tagName && element.tagName.toUpperCase() === "A") {
            return element;
        } else {
            if (element.parentNode) {
                return findA(element.parentNode);
            } else {
                return false;
            }
        }
    }

    //
    // Track as page view if the analytics object exists
    //
    function trackPageView(lnk) {
        if (typeof _gaq != "undefined") {
            _gaq.push(["_trackPageview", lnk]);
        }
    }

    //
    // Track as event if the analytics object exists
    //
    function trackEvent(category, action, label, value) {
        if (typeof _gaq != "undefined") {
            _gaq.push(["_trackEvent", category, action, label, value]);
        }
    }

    //
    // Track a mailto link
    //
    function trackMailto(elem) {

        // Extract email address
        var mailto = elem.href.substring(7);

        // trim whitespace or encoded whitespace
        mailto = mailto.replace(/^\s+|\s+$/g, '');
        mailto = mailto.replace('%20', '');

        // Track it
        if (tracker.opt.trackingMode === "event") {
            trackEvent("Mailto", mailto);
        } else {
            mailto = "/mailto/" + mailto;
            trackPageView(mailto);
        }
    }

    //
    // Track a link to a local file or external link
    //
    function trackLink(elem, isExternal) {

        // Add preceeding forward slash if one doesn't exist
        var lnk = elem.pathname;
        if (elem.pathname.charAt(0) !== "/") {
            lnk = "/" + lnk;
        }

        // Add search parameters
        if (elem.search && elem.pathname.indexOf(elem.search) === -1) {
            lnk += elem.search;
        }

        // Add hostname if it's external
        if (isExternal) {
            lnk = elem.hostname + lnk;
        }

        // Track it
        if (tracker.opt.trackingMode === "event") {
            if (isExternal) {
                trackEvent("External", lnk);
            } else {
                trackEvent("File", lnk);
            }
        } else {
            // If external prepend with 'external'
            if (isExternal) {
                lnk = "/external/" + lnk;
            }
            trackPageView(lnk);
        }

    }

    function checkEvent(event) {

        // Get event from window if it's not passed (IE)
        event = event || window.event;

        // IE uses srcElement as the target
        var target = event.target || event.srcElement || document;

        // Get the A element from the event target
        var elem = findA(target);

        if (elem) {
            return tracker.check(elem);
        }

    }

    //
    // Checks a link to see if we should track it
    //
    tracker.check = function (elem) {

        // Don't continue if there's isn't an A
        if (elem === false) {
            return;
        }

        // Ignore javascript links
        if (elem.protocol === "javascript:") {
            return;
        }

        // Check for different types of link
        if (elem.protocol === "mailto:") {

            if (this.opt.trackMailtos) {
                // Mailto
                trackMailto(elem);
            }

        } else if (elem.hostname.match(this.opt.hostRegex)) {

            // We've matched the host regex so the only option left is a local file
            if (this.opt.trackFiles) {
                // Check if the link is to a file
                // Note: '?:' notation simply excludes the match from the returned matches
                var regex = new RegExp(this.opt.extensions + "($|\&)");

                if (elem.pathname.match(regex)) {
                    // A link to a file
                    trackLink(elem, false);
                }
            }

        } else if (tracker.opt.trackExternalLinks) {
            // A link to a different (external) host
            trackLink(elem, true);
        }

    }


    tracker.bindEvents = function () {

        // Set up event listeners
        if (! eventsBound) {
            if (document.addEventListener) {
                document.addEventListener("click", function(event) { return checkEvent(event); }, false);
            } else if (document.attachEvent) {
                document.attachEvent("onclick", function(event) { return checkEvent(event); });
            }
            eventsBound = true;
        }
    }


    tracker.unbindEvents = function() {
        if (eventsBound) {
            // Set up event listeners
            if (document.removeEventListener) {
                document.removeEventListener("click", checkEvent, false);
            } else if (document.attachEvent) {
                document.detachEvent("onclick", checkEvent);
            }
            eventsBound = false;
        }
    }

    tracker.hasBoundEvents = function() {
        return eventsBound;
    }

    tracker.setOptions = function (opt) {

        // Set options
        if (typeof opt != "undefined") {

            if (typeof opt.mode === "string") {
                this.opt.trackingMode = opt.mode;
            }
            if (typeof opt.hostRegex === "string") {
                // Create new regex from string
                this.opt.hostRegex = new RegExp(opt.hostRegex);
            }
            if (opt.hostRegex instanceof RegExp) {
                this.opt.hostRegex = opt.hostRegex;
            }
            if (typeof opt.extensions != "undefined") {
                this.opt.extensions = opt.extensions;
            }
            if (typeof opt.trackExternalLinks === "boolean") {
                this.opt.trackExternalLinks = opt.trackExternalLinks;
            }
            if (typeof opt.trackFiles === "boolean") {
                this.opt.trackFiles = opt.trackFiles;
            }
            if (typeof opt.trackMailtos === "boolean") {
                this.opt.trackMailtos = opt.trackMailtos;
            }
            if (typeof opt.bindEvents === "boolean") {
                this.opt.bindEvents = opt.bindEvents;
            }

        }
    }

    //
    // Add an event handler to any clicks on the page.
    //
    tracker.init = function (opt) {
        this.setOptions(opt);
        if (this.opt.bindEvents) {
            this.bindEvents();
        }
    };

    return tracker;

}(window, document, location));