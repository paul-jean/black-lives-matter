$(document).ready(function () {
  let ul = $('main.container div.victims_list')[0];
  $.get("/victims", function (data) {
    data.victims.forEach(v => {
      // birth page link:
      var li_birth = $('<li/>');
      $('<a>', {
        text: `${v.name} (birth)`,
        href: '/detail/birth/' + v.name
      }).appendTo(li_birth);
      li_birth.appendTo(ul);

      // death page link:
      var li_death = $('<li/>');
      $('<a>', {
        text: `${v.name} (death)`,
        href: '/detail/death/' + v.name
      }).appendTo(li_death);
      li_death.appendTo(ul);
    });
  });
});
