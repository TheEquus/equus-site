// Scroll back to top button
window.onload = function() {
  var scrollUp = document.getElementById('backtotop')
  scrollUp.onclick = function() {
    window.scroll({
      top: 0
    })
  }
}
window.onscroll = function () {
  detectScroll = window.scrollY
  var scrollUp = document.getElementById('backtotop')
  if (detectScroll > 500) {
    scrollUp.style.visibility = "visible"
    scrollUp.style.opacity = 1
  } else {
    scrollUp.style.visibility = "hidden"
    scrollUp.style.opacity = 0
  }
}
