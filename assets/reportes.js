/* reportes.js — hover del acumulado. Sin librerias, sin build.
   Mejora progresiva: si este archivo no corre, el grafico sigue completo. */
(function () {
  "use strict";
  var fmt = function (v) {
    return "$" + (v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  document.querySelectorAll(".chartbox").forEach(function (caja) {
    var svg = caja.querySelector("svg.chart");
    var tip = caja.querySelector(".tip");
    var guia = svg && svg.querySelector(".guia");
    var serieEl = caja.nextElementSibling;
    if (!svg || !tip || !serieEl || serieEl.className !== "serie-acum") return;

    var datos;
    try { datos = JSON.parse(serieEl.textContent); } catch (e) { return; }
    if (!datos || datos.length < 2) return;

    var vb = svg.viewBox.baseVal;
    var ml = parseFloat(svg.dataset.ml), w = parseFloat(svg.dataset.w), n = parseInt(svg.dataset.n, 10);
    var vbW = vb ? vb.width : svg.clientWidth;
    var vbH = vb ? vb.height : svg.clientHeight;

    function mostrar(ev) {
      var rect = svg.getBoundingClientRect();
      var cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
      var x = cx * (vbW / rect.width);
      var i = Math.round(((x - ml) / w) * n);
      i = Math.max(0, Math.min(datos.length - 1, i));
      var d = datos[i];
      var colchon = d.i - d.g;

      tip.innerHTML = '<div class="h">' + d.f + " · día " + (i + 1) + " de " + datos.length + "</div>" +
        '<div class="f"><span class="v">Ingresos</span><b class="v">' + fmt(d.i) + "</b></div>" +
        '<div class="f"><span class="r">Gastos</span><b class="r">' + fmt(d.g) + "</b></div>" +
        '<div class="f c"><span>Colchón</span><b class="' + (colchon >= 0 ? "v" : "r") + '">' + fmt(colchon) + "</b></div>";
      tip.hidden = false;

      var xv = ml + (w * i / n);
      var px = (xv / vbW) * rect.width;
      tip.style.left = Math.min(Math.max(0, px - tip.offsetWidth / 2), caja.clientWidth - tip.offsetWidth) + "px";

      if (guia) {
        guia.setAttribute("x1", xv);
        guia.setAttribute("x2", xv);
        guia.setAttribute("stroke-opacity", ".55");
      }
    }

    function ocultar() {
      tip.hidden = true;
      if (guia) guia.setAttribute("stroke-opacity", "0");
    }

    svg.addEventListener("mousemove", mostrar);
    svg.addEventListener("mouseleave", ocultar);
    svg.addEventListener("touchstart", mostrar, { passive: true });
    svg.addEventListener("touchmove", mostrar, { passive: true });
    svg.addEventListener("touchend", function () { setTimeout(ocultar, 2200); });
  });
})();
