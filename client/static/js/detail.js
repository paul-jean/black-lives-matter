$(document).ready(function() {
  const CURRENT_CITY = 'Vancouver';
  let div = $( 'main.container div.victim_detail' )[0];
  const name = div.innerText;
  console.log('name = ');
  console.log(name);
  const endpoint = '/api/detail/' + encodeURIComponent(name);
  const exhibit_endpoint = '/api/exhibit/' + encodeURIComponent(CURRENT_CITY);

  $.get(endpoint, function( victim ) {
    const death_seconds = Date.parse(victim.death_date);

    // https://stackoverflow.com/questions/26311489/obtain-difference-between-two-dates-in-years-months-days-in-javascript/26311490#26311490
    function time_diff_dict(d1, d2) {
      var m = moment(d1);
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
      m.add(-seconds, 'seconds');
      var ms = m.diff(d2, 'milliseconds');
    
      return {years: years, months: months, days: days, hours: hours, minutes: minutes, seconds: seconds, milliseconds: ms};
    }

    $.get(exhibit_endpoint, function(exhibit) {
      const exhibit_start_seconds = Date.parse(exhibit.start_date);
      const row_div = $('container.time_since_death');

      const updateCounters = () => {
        const now_seconds = Date.now();
        const time_since_death_dict = time_diff_dict(now_seconds, death_seconds);
        Object.keys(time_since_death_dict).map(function(k) {
          row_div.find(k).innerText = time_since_death_dict[k];
        });

        const time_dead_since_exhibit_dict = time_diff_dict(now_seconds, exhibit_start_seconds);
        Object(time_dead_since_exhibit_dict).map(function(k) {
          row_div.find(k).innerText = time_dead_since_exhibit_dict[k];
        });

        setTimeout(updateCounters, 1);
      };
      updateCounters();
    })

  });

});
