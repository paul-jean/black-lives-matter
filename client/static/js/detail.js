$(document).ready(function() {
  const CURRENT_CITY = 'Vancouver';
  let div = $( 'main.container div.victim_detail' )[0];
  const name = div.innerText;
  console.log('name = ');
  console.log(name);
  const endpoint = '/api/detail/' + encodeURIComponent(name);
  const exhibit_endpoint = '/api/exhibit/' + encodeURIComponent(CURRENT_CITY);

  $.get(endpoint, function( victim ) {
    console.log('ajax request to /detail = ')
    console.log(victim)
    $('<p>', {
      text: `Born: ${victim.birth_date}`, 
      id: 'birth'
    }).appendTo(div);
    $('<p>', {
      text: `Died: ${victim.death_date}`, 
      id: 'death'
    }).appendTo(div);
    let time_since_death_div = $('<p>', {
      text: 0,
      id: 'counter_since_death',
      class: 'time_since_death'
    }).appendTo(div)[0];
    let time_dead_since_exhibit_div = $('<p>', {
      text: 0,
      id: 'counter_dead_since_exhibit',
      class: 'time_dead_since_exhibit'
    }).appendTo(div)[0];
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
    
      return {years: years, months: months, days: days, hours: hours, minutes: minutes, seconds: seconds, ms: ms};
    }

    $.get(exhibit_endpoint, function(exhibit) {
      const exhibit_start_seconds = Date.parse(exhibit.start_date);
      const updateCounters = () => {
        const now_seconds = Date.now();
        const time_since_death_dict = time_diff_dict(now_seconds, death_seconds);
        const time_since_death_str =  `${time_since_death_dict['years']} years, ${time_since_death_dict['months']} months, ${time_since_death_dict['days']} days, ${time_since_death_dict['hours']} hours, ${time_since_death_dict['minutes']} minutes, ${time_since_death_dict['seconds']} seconds, ${time_since_death_dict['ms']} ms`;
        time_since_death_div.innerText = `Dead for: ${time_since_death_str}`;

        const time_dead_since_exhibit_dict = time_diff_dict(now_seconds, exhibit_start_seconds);
        const time_dead_since_exhibit_str =  `${time_dead_since_exhibit_dict['years']} years, ${time_dead_since_exhibit_dict['months']} months, ${time_dead_since_exhibit_dict['days']} days, ${time_dead_since_exhibit_dict['hours']} hours, ${time_dead_since_exhibit_dict['minutes']} minutes, ${time_dead_since_exhibit_dict['seconds']} seconds, ${time_dead_since_exhibit_dict['ms']} ms`;
        time_dead_since_exhibit_div.innerText = `Dead since exhibit: ${time_dead_since_exhibit_str}`;

        setTimeout(updateCounters, 1);
      };
      updateCounters();
    })

  });

});
