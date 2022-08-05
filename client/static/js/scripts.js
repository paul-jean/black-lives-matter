$(document).ready(function() {
  let victims = [];
  let ul = $( 'main.container div.victims_list' )[0];
  $.get( "/victims", function( vs ) {
    vs.victims.forEach(v => {
      victims.push(v.name);
      const id = v.id;
      const li = document.createElement('li');
      li.innerHTML = $('<a>', {
        text: v.name, 
        href: '/victim_detail/' + id
      });
      ul.appendChild( li.innerHTML );
    });
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
