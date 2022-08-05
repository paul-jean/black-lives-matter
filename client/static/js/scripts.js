$(document).ready(function() {
  let victims = [];
  $.get( "/get_victims", function( vs ) {
    vs.forEach(v => {
      victims.push(v.name)
    });
    $( ".div.main" ).html( victims );
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
