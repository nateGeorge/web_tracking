try{
(function (window) {
  'use strict';
  var document = window.document,
    swfobject = window.swfobject;

    // necessary for flash to communicate with js...
    // please implement a better way
    var _global_lso;
    function _evercookie_flash_var(cookie) {
      _global_lso = cookie;

      // remove the flash object now
      var swf = document.getElementById("myswf");
      if (swf && swf.parentNode) {
        swf.parentNode.removeChild(swf);
      }
    }

    this.set = function (name, value) {
      self._evercookie(name, function () {}, value);
    };

    this.evercookie_lso = function (name, value) {
      var div = document.getElementById("swfcontainer"),
        flashvars = {},
        params = {},
        attributes = {};
      if (div===null || div === undefined || !div.length) {
        div = document.createElement("div");
        div.setAttribute("id", "swfcontainer");
        document.body.appendChild(div);
      }

      if (value !== undefined) {
        flashvars.everdata = name + "=" + value;
      }
      params.swliveconnect = "true";
      attributes.id        = "myswf";
      attributes.name      = "myswf";
      swfobject.embedSWF(_ec_baseurl + _ec_asseturi + "/evercookie.swf", "swfcontainer", "1", "1", "9.0.0", false, flashvars, params, attributes);
    };

    // wait for our swfobject to appear (swfobject.js to load)
    var waitForSwf = this.waitForSwf = function (i) {
      if (i === undefined) {
        i = 0;
      } else {
        i++;
      }

      // wait for ~2 seconds for swfobject to appear
      if (i < _ec_tests && typeof swfobject === "undefined") {
        setTimeout(function () {
          waitForSwf(i);
        }, 300);
      }
    };

    this._evercookie = function (name, cb, value, i, dont_reset) {
      if (self._evercookie === undefined) {
        self = this;
      }
      if (i === undefined) {
        i = 0;
      }
      // first run
      if (i === 0) {
        //self.evercookie_database_storage(name, value);
        //self.evercookie_indexdb_storage(name, value);
        //self.evercookie_png(name, value);
        //self.evercookie_etag(name, value);
        //self.evercookie_cache(name, value);
        self.evercookie_lso(name, value);
      }
    }

    this.evercookie_lso = function (name, value) {
      var div = document.getElementById("swfcontainer"),
        flashvars = {},
        params = {},
        attributes = {};
      if (div===null || div === undefined || !div.length) {
        div = document.createElement("div");
        div.setAttribute("id", "swfcontainer");
        document.body.appendChild(div);
      }

      if (value !== undefined) {
        flashvars.everdata = name + "=" + value;
      }
      params.swliveconnect = "true";
      attributes.id        = "myswf";
      attributes.name      = "myswf";
      swfobject.embedSWF(_ec_baseurl + _ec_asseturi + "/evercookie.swf", "swfcontainer", "1", "1", "9.0.0", false, flashvars, params, attributes);
    };
    window._evercookie_flash_var = _evercookie_flash_var;
  }(window));
}catch(ex){console.log(ex);}
