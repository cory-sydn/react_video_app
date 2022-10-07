function FormatSeconds(s) {
  var m = Math.floor(s / 60);
  if (m < 60 ) {
    m = (m >= 10) ? m : "0" + m;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return m + ":" + s;
  } else if (m / 60 < 23) {
    //hours
    var h = Math.floor(m / 60);
    h = (h >= 10) ? h : "0" + h;
    var min = m - h * 60 
    min = (min >= 10) ? min : "0" + min;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return h + ":" + min + ":" + s;
  } else {
    // days
    const h = Math.floor(m / 60);
    var d = Math.floor(h / 24);
    d = (d >= 10) ? d : "0" + d;
    const remainM = m - d * 24 *60;
    var hour = Math.floor(remainM / 60);
    hour = (hour >= 10) ? hour : "0" + hour;
    var minute = remainM - hour * 60 
    minute = (minute >= 10) ? minute : "0" + minute;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return d + ":" + hour + ":" + minute + ":" + s;
  }
}
export default FormatSeconds