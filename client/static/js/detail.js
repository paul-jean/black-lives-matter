$(document).ready(function () {
  const CURRENT_CITY = 'Vancouver';
  let div = $('main.container div.victim_detail')[0];
  let clock_div = $('main.container div.clock')[0];
  const name = div.innerText;
  const birth_or_death = clock_div['data-birth-or-death'];
  const is_birth = birth_or_death === "birth" ? true : false;
  const endpoint = '/api/detail/' + encodeURIComponent(name);
  const exhibit_endpoint = '/api/exhibit/' + encodeURIComponent(CURRENT_CITY);

  // https://stackoverflow.com/questions/26311489/obtain-difference-between-two-dates-in-years-months-days-in-javascript/26311490#26311490
  function time_dict(t) {
    var m = moment(t);
    var years = m.diff(d2, 'years');
    m.add(-years, 'years');
    var months = m.diff(d2, 'months');
    m.add(-months, 'months');
    var days = m.diff(d2, 'days');
    m.add(-days, 'days');
    var hours = m.diff(d2, 'hours');
    m.add(-hours, 'hours');
    var minutes = m.diff(d2, 'minutes');
    m.add(-minutes, 'minutes');
    var seconds = m.diff(d2, 'seconds');

    return { years: years, months: months, days: days, hours: hours, minutes: minutes, seconds: seconds };
  }

  $.get(endpoint, function (victim) {
    const death_seconds = Date.parse(victim.death_date);
    const birth_seconds = Date.parse(victim.birth_date);

    $.get(exhibit_endpoint, function (exhibit) {
      const exhibit_start_seconds = Date.parse(exhibit.start_date);
      const clock_row_div = $('div.row.clock');

      const updateCounters = () => {
        const now_seconds = Date.now();
        // birth: counting up from birth to death
        // death: counting down from death to birth
        let clock_time = 0;
        const exhibit_seconds = now_seconds - exhibit_start_seconds;
        if (is_birth) {
          // birth: add seconds since exhibit start
          clock_time = birth_seconds + exhibit_seconds;
        } else {
          // death: subtract seconds since exhibit start
          clock_time = death_seconds - exhibit_seconds;
        }
        let clock_date = new Date(clock_time);

        let clock_time_dict = {
          'year': clock_date.getFullYear(),
          'month': clock_date.getMonth(),
          'day': clock_date.getDay(),
          'hour': clock_date.getHours(),
          'minute': clock_date.getMinutes(),
          'seconds': clock_date.getSeconds(),
        };
        Object.keys(clock_time_dict).map(function (k) {
          const clock_div = clock_row_div.find(`.${k}`)[0];
          clock_div.innerText = clock_time_dict[k];
        });

        setTimeout(updateCounters, 1);
      };
      updateCounters();
    })

  });

});
