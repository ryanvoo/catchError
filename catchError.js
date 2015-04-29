function catchError(msg, url, line, col, err) {
    var e, o = stack = [], r, f;
    if (err !== void 0) {
        e = /MSIE 9/.test(navigator.userAgent) ? {
            msg: err.name,
            desc: "URL: " + url,
            trace: "Message: " + err.message
        } : {
            msg: err.message,
            desc: "URL: " + url,
            trace: "Stacktrace: " + (err.stack || err.stacktrace || "")
        };
    } else {
        if (line === "") return !0;
        for (r = col || window.event && window.event.errorCharacter, f = arguments.callee.caller; f, f = f.caller, f && stack.push(f););
        e = {
            msg: msg,
            desc: "URL: " + url + "\n" + (!!r && "Column:" + r) + " Line:" + line + "\nStacktrace: " + stack.join("\n")
        };
    }
    tryReportError(e, null, null);
}

var _errorCount = 0;

function tryReportError(n, t, i) {
    var r = {
        Message: n.msg ? n.msg : "n/a",
        Description: n.desc ? n.desc : "n/a",
        Trace: n.trace ? n.trace : "n/a"
    };
    if (r.Message == "n/a" && r.Description == "n/a") return;
    t != null && (r.XhrStatus = t.status);
    i != null && (r.Verb = i.type, r.Url = i.url);
    console.debug(JSON.stringify(r, null, 4));
}

window.onerror = function (msg, url, line, col, err) {
    return catchError(msg, url, line, col, err);
};

(function(n) {
    n.fn.oldReady = n.fn.ready;
    n.fn.ready = function(t) {
        return n.fn.oldReady(function() {
            try {
                t && t.apply(n, arguments)
            } catch (i) {
                catchError(i.message, window.reportUrl, null, null, i)
            }
        })
    }
})(jQuery);

$(document).ajaxError(function(n, t, i, r) {
    switch (t.status) {
        case "0":
            return;
        case "401":
            window.location.href = t.getResponseHeader("authenticate-url");
            return;
        default:
            tryReportError(r, '', t, i)
    }
});



function someWhereErrorTest(){
    console.log('testing error catching');
    throw new Error('eeeee');
};
someWhereErrorTest();
