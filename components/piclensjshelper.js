// Copyright 2008, Cooliris Inc.

function PicLensJSHelper() {}

PicLensJSHelper.prototype = {
    xpiPath getter: function() {
        return __LOCATION__.parent.parent.path;
    },
    frontDocument getter: function() {
        var tabBrowser = this._frontTabBrowser();
        if (tabBrowser) {
            var tab = tabBrowser.selectedBrowser;
            return tab.contentDocument;
        } else {
            return null;
        }
    },
    openUrl: function(url, newTab, selectTab) {
        var tabBrowser = this._frontTabBrowser();
        if (!tabBrowser) {
            return;
        }
        if (newTab) {
            var tab = tabBrowser.addTab(url);
            if (selectTab) tabBrowser.selectedTab = tab;
        } else {
            tabBrowser.selectedBrowser.contentDocument.location = url;
        }
    },

    setToolbarLaunchIcon: function(win, doc, name) {
        var button = win.document.getElementById('piclens-toolbarbutton2');
		var selectedDoc = win.getBrowser().selectedBrowser.contentDocument;
        if (button && doc === selectedDoc) {
            button.className = "cooliris-toolbarbutton-" + name;
        }
    },
    
    getUserAgentString: function(win) {
        return win.navigator.userAgent;
    },

    _frontTabBrowser: function() {
        var mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
            .getService(Components.interfaces.nsIWindowMediator);
		var win = mediator.getMostRecentWindow("navigator:browser");
        return win ? win.getBrowser() : null;
    },

    QueryInterface: function(iid) {
        if (!iid.equals(Components.interfaces.IPicLensJSHelper) &&
            !iid.equals(Components.interfaces.nsISupports))
            throw Components.results.NS_ERROR_NO_INTERFACE;
        return this;
    }
};

var PicLensJSHelperModule = {
    registerSelf: function(compMgr, fileSpec, location, type) {
        compMgr = compMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
        compMgr.registerFactoryLocation(this.classId, this.className, this.contractId,
            fileSpec, location, type);
    },
    getClassObject: function(compMgr, cid, iid) {
        if (!cid.equals(this.classId))
            throw Components.results.NS_ERROR_NO_INTERFACE;
        if (!iid.equals(Components.interfaces.nsIFactory))
            throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
        return this.factory;
    },
    canUnload: function(compMgr) {
        return true;
    },
    
    classId: Components.ID("a0ff7c31-77e1-4d6a-a6c6-c312ec2fbed4"),
    className: "PicLensJSHelper",
    contractId: "@cooliris.com/piclens/jshelper;1",
    factory: {
        createInstance: function(outer, iid) {
            if (outer != null)
                throw Components.results.NS_ERROR_NO_AGGREGATION;
            return (new PicLensJSHelper()).QueryInterface(iid);
        }
    }
};

function NSGetModule(compMgr, fileSpec) {
    return PicLensJSHelperModule;
}
