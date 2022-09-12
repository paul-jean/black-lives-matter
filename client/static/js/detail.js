$(document).ready(function() {
  let div = $( 'main.container div.victim_detail' )[0];
  const name = div.innerText;
  console.log('name = ');
  console.log(name);
  const endpoint = '/api/detail/' + encodeURIComponent(name);

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
    let counter = $('<p>', {
      text: 0,
      id: 'counter',
      class: 'time_since_death'
    }).appendTo(div);
    const death_seconds = Date.parse(victim.death_date);

    // let counter = $("p.time_since_death")[0];
    const updateCount = () => {
      const now_seconds = Date.now();
      const time_since_death = now_seconds - death_seconds;
      counter.innerText = time_since_death;
      setTimeout(updateCount, 1);
    };

    updateCount();
  });

});
