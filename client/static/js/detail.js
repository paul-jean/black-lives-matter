$(document).ready(function() {
  let div = $( 'main.container div.victim_detail' );
  $.get( "/detail", function( victim ) {
    $('<p>', {
      text: victim.name, 
    }).appendTo(div);
  });
  // let counter = $("div.main")[0];
  // const updateCount = () => {
  //     const count = parseInt(counter.innerText);
  //     const target = 100;
  //     const increment = 1;

  //     if (count < target) {
  //       counter.innerText = count + increment;
  //       setTimeout(updateCount, 1);
  //     } else {
  //       counter.innerText = target;
  //     }
  //   };
  // updateCount();
});
