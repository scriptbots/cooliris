// (c) 2008 Cooliris Inc. All rights reserved.

var Cc = Components.classes;
var Ci = Components.interfaces;

function PicLensWindow()
{
    this.doc = window.document;
    this.manager = Cc["@cooliris.com/piclens/manager;1"].getService(Ci.IPicLensManager);
    this.isMac = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS == "Darwin";
    this.initToolbars();
}

PicLensWindow.prototype = {
    initToolbars: function() {
        var toolbar = this.doc.getElementById("nav-bar");//this.isMac ? "PersonalToolbar" : "toolbar-menubar");
        var alreadyInitialized = "piclens-initialized2";
        if (toolbar.hasAttribute(alreadyInitialized)) {
            return;
        }
        toolbar.collapsed = false;
        var plButtonId = "piclens-toolbarbutton2";
        this.insertToolbarItem(plButtonId);
        this.insertIntoDefaultSet(plButtonId);
        toolbar.setAttribute(alreadyInitialized, "1");
        this.doc.persist(toolbar.id, alreadyInitialized);
    },
    insertToolbarItem: function(plButtonId) {
        var navBar = this.doc.getElementById("nav-bar");
        
        // attempt to insert after the search box
        try {
            var afterThisId = "search-container";
            var afterThisElem = this.doc.getElementById(afterThisId);
            // if we didn't find the search somehow, we just put our button at the end
            if(!afterThisElem) {
                var buttons = navBar.getAttribute("currentset").split(",");
                afterThisId = buttons[buttons.length - 1];
                afterThisElem = this.doc.getElementById(afterThisId);
            }
            
            // if we found it, figure out the index of the entry
            if(afterThisElem && this.doc.getElementById(plButtonId) == null) {
                var ret = navBar.insertItem(plButtonId, afterThisElem.nextSibling);
                navBar.setAttribute("currentset", navBar.currentSet);
                this.doc.persist("nav-bar", "currentset");
            }   
        }
        catch(e) { }
    },
    insertIntoDefaultSet: function(plButtonId) {
        var navBar = this.doc.getElementById("nav-bar");
        var set = navBar.getAttribute("defaultset");
        var prev = set.split(",");
        var insertAt;
        for (var i = 0; i != prev.length; ++i) {
            if (prev[i] == "search-container") {
                insertAt = i;
                break;
            }
        }
        
        // otherwise insert at end
        if (!insertAt) {
            insertAt = prev.length;
        }

        prev.splice(insertAt, 0, plButtonId);
        var newSet = prev.join(",");
        navBar.setAttribute("defaultset", newSet);
        this.doc.persist("nav-bar", "defaultset");
    }
}

var gPicLensWindow = null;

window.addEventListener("load", function() {
    // initialization
    gPicLensWindow = new PicLensWindow();
    
    // register event listeners
    gBrowser.addEventListener("DOMContentLoaded", function(event) {
        var doc = event.originalTarget;
        if (doc instanceof HTMLDocument) {
            gPicLensWindow.manager.pageDomLoaded(window, doc);
            doc.defaultView.addEventListener("unload", function() {
                gPicLensWindow.manager.pageUnloaded(doc);
            }, true);
        }
    }, true);
    gBrowser.addEventListener("load", function(event) {
        var doc = event.originalTarget;
        if (doc instanceof HTMLDocument) {
            gPicLensWindow.manager.pageLoaded(doc);
        }
    }, true);
    gBrowser.tabContainer.addEventListener("TabSelect", function(event) {
        var tab = event.originalTarget;
        gPicLensWindow.manager.tabSelectionChanged(window, tab.linkedBrowser.contentDocument);
    }, false);
}, false);

function launchCooliris() {
    Cc['@cooliris.com/piclens/manager;1'].getService(Ci.IPicLensManager).launchFromToolbar();
}
