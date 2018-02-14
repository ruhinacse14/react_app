var Sandbox;
window.app = (function() {
    var c = false,
        b = {},
        a = {};
    return {
        register: function(e, d) {
            b[e] = {
                creator: d,
                instance: null,
                callbacks: []
            };
            this.log('Registration: "' + e + '" was registered with the application core')
        },
        start: function(f) {
            var e = b[f].creator,
                d = new Sandbox(this, f);
            b[f].instance = new e(d);
            b[f].instance.init();
            this.log('Start: "' + f + '" was started')
        },
        stop: function(f) {
            var g = b[f];
            if (g.instance) {
                var e = 0;
                while (e < g.callbacks.length) {
                    var d = g.callbacks[e];
                    a[d.listenerName][d.callbackIndex] = null;
                    e++
                }
                g.callbacks = [];
                g.instance.destroy();
                g.instance = null
            }
            this.log('Stop: "' + f + '" was stopped')
        },
        startAll: function() {
            for (var d in b) {
                if (b.hasOwnProperty(d)) {
                    this.start(d)
                }
            }
        },
        stopAll: function() {
            for (var d in b) {
                if (b.hasOwnProperty(d)) {
                    this.stop(d)
                }
            }
        },
        addListener: function(e, d, g) {
            var f;
            if (a.hasOwnProperty(e)) {
                a[e].push(g);
                f = a[e].length - 1
            } else {
                a[e] = [g];
                f = 0
            }
            b[d].callbacks.push({
                listenerName: e,
                callbackIndex: f
            });
            this.log('Listener added by "' + d + '": "' + e + '"')
        },
        triggerListener: function(e, f) {
            if (a.hasOwnProperty(e)) {
                for (var d = 0; d < a[e].length; d++) {
                    if (a[e][d]) {
                        a[e][d](f)
                    }
                }
            }
            this.log('Listener triggered: "' + e + '"')
        },
        log: function(d) {
            if (c && typeof(console) !== "undefined") {
                console.log(d)
            }
        }
    }
})();
Sandbox = function(b, a) {
    return {
        notify: function(c, d) {
            b.triggerListener(c, d);
            return this
        },
        listen: function(c, d) {
            b.addListener(c, a, d);
            return this
        },
        log: function(c) {
            b.log(c);
            return this
        }
    }
};
window.onload = function() {
    if (window.onloadQueue) {
        for (var a = 0; a < window.onloadQueue.length; a++) {
            var b = window[window.onloadQueue[a]];
            if (typeof b === "function") {
                b()
            }
        }
    }
};
(function(a) {
    app.register("module.modal", function() {
        var e, c, d = function(f) {
                var g = f.innerHTML;
                e = document.createElement("div");
                e.innerHTML = g;
                c = e.getElementsByClassName("modal")[0];
                e.getElementsByClassName("close")[0].onclick = function() {
                    b()
                };
                document.body.appendChild(e);
                setTimeout(function() {
                    c.style.opacity = 1
                }, 500)
            },
            b = function() {
                c.style.opacity = 0;
                setTimeout(function() {
                    e.remove()
                }, 500)
            };
        return {
            init: function() {
                var f = document.getElementById("modalContainer");
                if (!f) {
                    return false
                }
                d(f)
            }
        }
    })
})(window.jQuery);
(function(a) {
    app.register("module.authDialog", function(o) {
        var m, c, k = false,
            f = true,
            g = function() {
                m.parent().addClass("open");
                m.hide().fadeIn(200, function() {
                    j()
                });
                a(document).bind("click.authDialog", function(q) {
                    d()
                }).bind("keyup.authDialog", function(q) {
                    if (q.keyCode === 27) {
                        d()
                    }
                });
                m.bind("click.authDialog", function(q) {
                    q.stopPropagation()
                });
                k = true;
                if (f) {
                    if (facebook_login !== undefined) {
                        facebook_login.setup()
                    }
                    if (mobile_connect_login !== undefined) {
                        mobile_connect_login.setup()
                    }
                    f = false
                }
            },
            d = function() {
                m.fadeOut(100, function() {
                    m.parent().removeClass("open");
                    n()
                });
                a(document).unbind(".authDialog");
                k = false
            },
            j = function() {
                m.find("input").eq(0)[0].focus()
            },
            n = function() {
                m.find("input[type!=checkbox]").val("");
                m.find("input:checked").attr("checked", false)
            },
            p = function() {
                if (!k) {
                    g()
                } else {
                    d()
                }
            },
            i = function(q) {
                q.parent().addClass("focused")
            },
            b = function(q) {
                q.parent().removeClass("focused")
            },
            h = function() {
                c.on("click.authDialog", function(q) {
                    q.preventDefault();
                    q.stopPropagation();
                    p()
                });
                m.delegate(".text-field input", "focus.authDialog", function(q) {
                    q.preventDefault();
                    i(a(this))
                }).delegate(".text-field input", "blur.authDialog", function(q) {
                    q.preventDefault();
                    b(a(this))
                })
            },
            e = function() {
                c.off("click.authDialog");
                a(window).off("resize.authDialog");
                m.unbind(".authDialog")
            },
            l = function() {
                var q = a("body");
                if (q.hasClass("ie8") || q.hasClass("ie9")) {
                    a("#email").val("E-mail");
                    a("#passwd").val("Password")
                }
            };
        return {
            init: function() {
                m = a("#signinDropdown");
                c = m.prev();
                h();
                l()
            },
            destroy: function() {
                e()
            }
        }
    })
})(window.jQuery);
(function(a) {
    app.register("module.map", function(d) {
        var h, f, m, s, c = "#56a84d",
            g = "#91df88",
            n, j = function(x) {
                var w = x.attr("data-location-id");
                if (x.data("highlighted")) {
                    r();
                    i();
                    d.notify("region unhighlighted", {
                        locationID: w
                    })
                } else {
                    k(x);
                    q(window.locationData[w]);
                    d.notify("region highlighted", {
                        locationID: w
                    })
                }
            },
            k = function(w) {
                s = w.attr("fill", g).data("highlighted", true)
            },
            r = function() {
                s.attr("fill", c).data("highlighted", false);
                s = null
            },
            q = function(w) {
                clearTimeout(n);
                n = setTimeout(function() {
                    f.stop().html(w.name).css({
                        display: "block",
                        top: w.coords.top,
                        right: w.coords.right,
                        opacity: 0,
                        marginTop: 5
                    }).animate({
                        opacity: 1,
                        marginTop: 0
                    }, 300)
                }, 200)
            },
            i = function() {
                clearTimeout(n);
                f.hide()
            },
            u = function(w) {
                m.stop().css({
                    display: "block",
                    opacity: 0,
                    top: w.coords.top + 50,
                    right: w.coords.right
                }).animate({
                    opacity: 1
                }, 300)
            },
            p = function() {
                m.hide()
            },
            v = function() {
                h.delegate("path.region", "mouseenter mouseleave", function(w) {
                    j(a(this))
                }).delegate("path.region, area", "click", function(x) {
                    x.preventDefault();
                    var w = a(this).attr("data-location-id");
                    d.notify("map region clicked", {
                        locationID: w
                    })
                }).delegate("area", "mouseenter mouseleave", function(x) {
                    var w = a(this).attr("data-location-id");
                    if (x.type === "mouseenter") {
                        d.notify("region highlighted", {
                            locationID: w
                        });
                        q(window.locationData[w])
                    } else {
                        d.notify("region unhighlighted", {
                            locationID: w
                        });
                        i()
                    }
                })
            },
            o = function() {
                h.unbind("mouseenter mouseleave click")
            },
            t = function(w) {
                q(window.locationData[w.locationID]);
                k(a("#map_region_" + w.locationID))
            },
            e = function() {
                i();
                r()
            },
            l = function(x) {
                var w = window.locationData[x.locationID];
                q(w);
                u(w)
            },
            b = function() {
                i();
                p()
            };
        return {
            init: function() {
                h = a("#map_container");
                f = a("#map_helper");
                m = a("#map_marker");
                v();
                d.listen("region link highlighted", t).listen("region link unhighlighted", e).listen("city link highlighted", l).listen("city link unhighlighted", b)
            },
            destroy: function() {
                o()
            }
        }
    })
})(window.jQuery);
(function(a) {
    app.register("module.locationList", function(i) {
        var k, j, f = function(m, l) {
                if (l.type === "mouseenter") {
                    i.notify("city link highlighted", {
                        locationID: m.attr("data-location-id")
                    })
                } else {
                    i.notify("city link unhighlighted")
                }
            },
            h = function(m, l) {
                if (l.type === "mouseenter") {
                    i.notify("region link highlighted", {
                        locationID: m.attr("data-location-id")
                    })
                } else {
                    i.notify("region link unhighlighted")
                }
            },
            d = function() {
                k.delegate("a", "mouseenter mouseleave", function(l) {
                    if (a(this).hasClass("city")) {
                        f(a(this), l)
                    } else {
                        h(a(this), l)
                    }
                })
            },
            b = function() {
                k.unbind("mouseenter mouseleave")
            },
            c = function(m) {
                var l = k.find("#region_" + m.locationID);
                j = l.addClass("active")
            },
            e = function() {
                if (j) {
                    j.removeClass("active");
                    j = null
                }
            },
            g = function(n) {
                var m = k.find("#region_" + n.locationID),
                    l = m.attr("href");
                window.location.href = l
            };
        return {
            init: function() {
                k = a("#locations");
                d();
                i.listen("region highlighted", c).listen("region unhighlighted", e).listen("map region clicked", g)
            },
            destroy: function() {
                b()
            }
        }
    })
})(window.jQuery);
(function(a) {
    var b = window.app || {};
    b.register("module.utils", function(d) {
        var f, g = function(j, l, h, o, k, n) {
                var i = new Date(),
                    m;
                i.setTime(i.getTime());
                if (h) {
                    h = h * 1000 * 60 * 60 * 24
                }
                m = new Date(i.getTime() + (h));
                document.cookie = j + "=" + escape(l) + ((h) ? ";expires=" + m.toGMTString() : "") + ((o) ? ";path=" + o : "") + ((k) ? ";domain=" + k : "") + ((n) ? ";secure" : "")
            },
            e = function(j) {
                var k = document.cookie.indexOf(j + "="),
                    h = k + j.length + 1,
                    i;
                if (!k && j !== document.cookie.substring(0, j.length)) {
                    return null
                }
                if (k === -1) {
                    return null
                }
                i = document.cookie.indexOf(";", h);
                if (i === -1) {
                    i = document.cookie.length
                }
                return unescape(document.cookie.substring(h, i))
            },
            c = function(h, j, i) {
                if (e(h)) {
                    document.cookie = h + "=" + ((j) ? ";path=" + j : "") + ((i) ? ";domain=" + i : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT"
                }
            };
        return {
            init: function() {
                window.setCookie = g
            },
            destroy: function() {}
        }
    })
})(window.jQuery);
(function(d) {
    var a = function() {},
        c = false,
        b = false;
    a.prototype = {
        setup: function() {
            var e, f = "facebook-jssdk";
            if (document.getElementById(f)) {
                return
            }
            e = document.createElement("script");
            e.id = f;
            e.async = true;
            e.src = "//connect.facebook.net/en_US/sdk.js";
            document.head.appendChild(e);
            window.fbAsyncInit = function() {
                var g = (window.facebook && window.facebook.appID) ? window.facebook.appID : 0;
                c = true;
                FB.init({
                    appId: g,
                    xfbml: true,
                    version: window.facebook.version
                });
                if (b) {
                    facebook_login.login();
                    b = false
                }
            };
            d(function() {
                d("#btnFbLogin").on("click", function() {
                    if (c) {
                        facebook_login.login()
                    } else {
                        b = true
                    }
                });
                d(".btnDeauthorize").on("click", function(h) {
                    h.preventDefault();
                    var g = d(this).parents("form");
                    switch (g.find(".provider_type").val()) {
                        case "facebook":
                            facebook_login.deauth(g);
                            break;
                        default:
                            break
                    }
                })
            })
        },
        login: function() {
            var e = d("#fb_status"),
                f = e.html();
            e.html(window.facebook.loginText);
            if (FB.getAuthResponse()) {
                facebook_login.process()
            } else {
                FB.login(function(g) {
                    if (g.authResponse) {
                        facebook_login.process()
                    } else {
                        e.html(f)
                    }
                }, {
                    scope: "publish_stream, email"
                })
            }
        },
        process: function() {
            var h = FB.getAuthResponse();
            var f = h.accessToken;
            var e = h.userID;
            var g = "token=" + f + "&provider=facebook&provider_id=" + e;
            d.ajax({
                url: window.facebook.originUrl,
                type: "POST",
                data: g,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(j, k, i) {
                    j = d.parseJSON(j);
                    if (j.status === "ok") {
                        window.location = window.facebook.endUrl
                    } else {
                        window.location.href = "?" + j.status
                    }
                }
            })
        },
        deauth: function(e) {
            FB.api("/me/permissions", "delete", function() {
                e.submit()
            })
        }
    };
    window.facebook_login = new a()
})(((typeof jQuery != "undefined") ? jQuery : null));
(function(b) {
    var a = function() {};
    a.prototype = {
        setup: function() {
            if (!b("#btnMobileConnect").length) {
                return false
            }
            if (document.getElementById("mobile-connect-js-0")) {
                return false
            }
            if (mobileConnectJs === undefined) {
                return false
            }
            b.each(mobileConnectJs, function(c, d) {
                var e = document.createElement("script");
                e.id = "mobile-connect-js-" + c;
                e.async = true;
                e.src = b.trim(d);
                document.head.appendChild(e)
            })
        },
        login: function() {
            selectOperator("", function() {});
            var h = "basic",
                j = null,
                g = null,
                d = (window.mobile_connect && window.mobile_connect.redirectUri) ? window.mobile_connect.redirectUri : "",
                k = null,
                c = null,
                e = (window.mobile_connect && window.mobile_connect.appID) ? window.mobile_connect.appID : "",
                i = (window.mobile_connect && window.mobile_connect.appSec) ? window.mobile_connect.appSec : "",
                f = (window.mobile_connect && window.mobile_connect.appUri) ? window.mobile_connect.appUri : "";
            getDiscoveryActive(f, e, i, h, k, c, g, j, d, mobile_connect_login.process)
        },
        process: function(d, c) {
            if (c == 200) {
                b("#status").val("Discovery complete");
                if (d && !!d.getResponse()) {
                    if (d.getResponse().getApiFunction("operatorid", "authorization")) {
                        runAuthorization(d)
                    }
                }
            }
        },
        homeHttpFix: function() {
            if (!b("#btnMobileConnect").length) {
                return false
            }
            if (b("#signinDropdown").length && window.location.protocol == "http:") {
                b("#btnMobileConnect").on("click", function() {
                    var d = window.location.search,
                        e = "&mc=1";
                    if (d == "") {
                        e = "?mc=1"
                    }
                    window.location.href = httpsUrl + d + e
                })
            } else {
                b("#btnMobileConnect").on("click", function() {
                    mobile_connect_login.login()
                });
                if (window.location.search.indexOf("mc=1") > -1) {
                    b("#signinHandle").trigger("click");
                    var c = setInterval(function() {
                        if (b('script[id^="mobile-connect-js-"]').length == 3) {
                            clearInterval(c);
                            mobile_connect_login.login()
                        }
                    }, 500)
                }
            }
        }
    };
    window.mobile_connect_login = new a();
    b(document).ready(function() {
        window.mobile_connect_login.homeHttpFix()
    })
})(((typeof jQuery != "undefined") ? jQuery : null));