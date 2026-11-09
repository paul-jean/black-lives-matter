// Clock page (formerly the Flask /detail/<birth_or_death>/<name> route
// plus GET /api/detail/<name>). Reads ?mode=birth|death&name=... from the URL.
(function () {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') === 'death' ? 'death' : 'birth';
  const name = params.get('name') || '';
  const victim = window.VICTIMS.find(v => v.name === name);

  const nameDiv = document.querySelector('.victim_detail');
  const dateDiv = document.querySelector('.victim_date');
  const captionDiv = document.querySelector('.clock_caption');

  if (!victim) {
    nameDiv.textContent = 'Person not found';
    dateDiv.innerHTML = '<a class="link-light" href="index.html">Back to the list</a>';
    return;
  }

  // "1995-02-05" -> "February 05, 1995" (same format the server produced)
  const formatDate = iso => {
    const [y, m, d] = iso.split('-');
    return `${MONTHS[Number(m) - 1]} ${d}, ${y}`;
  };

  document.title = `${victim.name} · Black Lives Matter`;
  nameDiv.textContent = victim.name;
  if (mode === 'birth') {
    dateDiv.textContent = `Birth: ${formatDate(victim.birth_date)}`;
    captionDiv.textContent = 'Lifelong clock moving forward from birth toward death';
  } else {
    dateDiv.textContent = `Death: ${formatDate(victim.death_date)}`;
    captionDiv.textContent = 'Lifelong clock moving backward from death toward birth';
  }

  // ISO dates parse as UTC midnight. The death clock counts down from the
  // end of the day of death.
  const birthMs = Date.parse(victim.birth_date);
  const deathMs = Date.parse(victim.death_date) + DAY_MS;

  // The clock starts at birth (or death) when the page loads.
  const exhibitStartMs = Date.now();

  const cells = {};
  ['month', 'day', 'year', 'hour', 'minute', 'second'].forEach(k => {
    cells[k] = document.querySelector(`.row.clock .${k}`);
  });

  const update = () => {
    const elapsed = Date.now() - exhibitStartMs;
    const clock = new Date(mode === 'birth' ? birthMs + elapsed : deathMs - elapsed);
    const values = {
      month: MONTHS[clock.getUTCMonth()],
      day: clock.getUTCDate(),
      year: clock.getUTCFullYear(),
      hour: clock.getUTCHours(),
      minute: clock.getUTCMinutes(),
      second: clock.getUTCSeconds(),
    };
    for (const k in values) {
      const text = String(values[k]);
      if (cells[k].textContent !== text) cells[k].textContent = text;
    }
  };

  update();
  // Four updates a second keeps the seconds smooth without burning battery.
  setInterval(update, 250);
})();
