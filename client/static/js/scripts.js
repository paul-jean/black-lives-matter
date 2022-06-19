$(document).ready(function() {
    $('div.main').text("0");
    let counter = $('div.main');
    const updateCount = () => {
        const count = parseInt(counter.innerText);
        const target = 100;
        const increment = 1;
    
        if (count < target) {
          counter.innerText = count + increment;
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
  });
