fetch("data/dem_rays.json")
  .then(r => r.json())
  .then(data => drawHorizon(data));

function drawHorizon(data) {
  const rays = data.rays;
  const H0 = data.observer.ground_height + data.observer.eye_height;
  const step = data.sampling.distance_step;

  const angles = [];

  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    let maxAngle = -Infinity;

    for (let j = 1; j < ray.length; j++) {
      const d = j * step;
      const h = ray[j];
      const angle = Math.atan((h - H0) / d);
      if (angle > maxAngle) maxAngle = angle;
    }

    angles.push(maxAngle);
  }

  renderSVG(angles);
}

function renderSVG(angles) {
  const svg = document.getElementById("horizon");
  const width = svg.clientWidth;
  const height = svg.clientHeight;

  const min = Math.min(...angles);
  const max = Math.max(...angles);

  let d = "";

  angles.forEach((a, i) => {
    const x = (i / (angles.length - 1)) * width;
    const y = height - ((a - min) / (max - min)) * height;

    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);

  svg.appendChild(path);
}
