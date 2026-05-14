(function () {
  "use strict";

  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  var siteKey = script && script.getAttribute("data-site");
  var endpoint = (script && script.getAttribute("data-endpoint")) || new URL("/api/collect", script ? script.src : window.location.href).toString();

  if (!siteKey || window.__privpulseLoaded) return;
  if (/bot|headless|phantom|prerender/i.test(navigator.userAgent)) return;
  if (navigator.doNotTrack === "1") return;

  window.__privpulseLoaded = true;

  function utm(name) {
    return new URLSearchParams(location.search).get(name) || null;
  }

  function send(type, payload) {
    var data = Object.assign(
      {
        type: type,
        siteKey: siteKey,
        siteId: siteKey,
        url: location.href,
        path: location.pathname + location.search,
        title: document.title,
        referrer: document.referrer || null,
        utmSource: utm("utm_source"),
        utmMedium: utm("utm_medium"),
        utmCampaign: utm("utm_campaign")
      },
      payload || {}
    );

    var body = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body,
      keepalive: true,
      mode: "cors"
    }).catch(function () {});
  }

  function trackPageview() {
    send("pageview");
  }

  function trackEvent(name, props) {
    if (!name) return;
    send("event", { eventName: String(name).slice(0, 80), props: props || null });
  }

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      while (target && target !== document.body) {
        var eventName = target.getAttribute && (target.getAttribute("data-pp") || target.getAttribute("data-analytics"));
        if (eventName) {
          trackEvent(eventName, {
            text: target.innerText ? target.innerText.slice(0, 80) : null,
            href: target.href || null
          });
          return;
        }
        target = target.parentElement;
      }
    },
    { passive: true }
  );

  var lastUrl = location.href;
  function onNavigation() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      trackPageview();
    }
  }

  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    onNavigation();
  };
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    onNavigation();
  };
  window.addEventListener("popstate", onNavigation);

  window.pp = function (action, name, props) {
    if (action === "event") trackEvent(name, props);
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(trackPageview, 0);
  } else {
    document.addEventListener("DOMContentLoaded", trackPageview);
  }
})();
