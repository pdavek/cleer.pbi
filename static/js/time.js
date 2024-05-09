function updateClock() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var day = now.getDate();
  var monthIndex = now.getMonth();
  var year = now.getFullYear();
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be converted to 12

  document.getElementById('clock').innerHTML =
      day + getOrdinalSuffix(day) + ' ' + months[monthIndex] + ', ' + year + ' ' +
      hours + ':' + padZero(minutes) + ':' + padZero(seconds) + ' ' + ampm;

  setTimeout(updateClock, 1000); // Update every second
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
  }
}

function padZero(num) {
  return (num < 10 ? '0' : '') + num;
}

updateClock(); // Initial call to start the clock