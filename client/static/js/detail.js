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
      text: victim.name, 
      id: 'name'
    }).appendTo(div);
    $('<p>', {
      text: victim.birth_date, 
      id: 'birth'
    }).appendTo(div);
    $('<p>', {
      text: victim.death_date, 
      id: 'death'
    }).appendTo(div);
    let time_since_birth_div = $('<p>', {
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

    $.get(exhibit_endpoint, function(exhibit) {
      const exhibit_start_seconds = Date.parse(exhibit.start_date);
      const updateCounters = () => {
        const now_seconds = Date.now();
        const time_since_death = now_seconds - death_seconds;
        const time_dead_since_exhibit = now_seconds - exhibit_start_seconds;
        time_since_birth_div.innerText = time_since_death;
        time_dead_since_exhibit_div.innerText = time_dead_since_exhibit;
        setTimeout(updateCounters, 1);
      };
      updateCounters();
    })

  });

});
