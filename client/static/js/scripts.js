$(document).ready(function() {
  let victims = [];
  $.get( "/victims", function( vs ) {
    vs.victims.forEach(v => {
      victims.push(v.name);
      const li = document.createElement('li');
      li.innerHTML = v.name;
      $( ".container.victims_list.ul" ).appendChild( li );
    });
    console.log(victims)
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
