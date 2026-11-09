// Builds the birth/death link list from the embedded data (formerly GET /victims).
(function () {
  const ul = document.querySelector('main.container div.victims_list ul');

  const addLink = (name, mode) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = `${name} (${mode})`;
    a.href = `detail.html?mode=${mode}&name=${encodeURIComponent(name)}`;
    li.appendChild(a);
    ul.appendChild(li);
  };

  window.VICTIMS.forEach(v => {
    addLink(v.name, 'birth');
    addLink(v.name, 'death');
  });
})();
