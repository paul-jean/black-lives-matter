$(document).ready(function () {
  const CURRENT_CITY = 'Vancouver';
  let div = $('main.container div.victim_detail')[0];
  let clock_div = $('main.container div.clock')[0];
  const name = div.innerText;
  const birth_or_death = clock_div.getAttribute('data-birth-or-death');
  const is_birth = birth_or_death === "birth" ? true : false;
  const endpoint = '/api/detail/' + encodeURIComponent(name);
  const exhibit_endpoint = '/api/exhibit/' + encodeURIComponent(CURRENT_CITY);

  $.get(endpoint, function (victim) {
    const death_seconds = Date.parse(victim.death_date);
    const birth_seconds = Date.parse(victim.birth_date);

    $.get(exhibit_endpoint, function (exhibit) {
      const exhibit_start_seconds = Date.parse(exhibit.start_date);
      const clock_row_div = $('div.row.clock')[0];

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
          'second': clock_date.getSeconds(),
        };
        Object.keys(clock_time_dict).map(function (k) {
          let clock_div = $(clock_row_div).find(`.${k}`)[0];
          clock_div.innerText = clock_time_dict[k];
        });

        setTimeout(updateCounters, 1);
      };
      updateCounters();
    })

  });

});
