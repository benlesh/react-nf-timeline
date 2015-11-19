import rangeFn from './range';

export default function linearScale(domain, range) {
  const [dl, dr] = domain;
  const [rl, rr] = range;

  const dd = dr - dl;
  const rd = rr - rl;

  const ratio = rd / dd;

  let scale = function linearScale(domainValue) {
    return rl + (rd * ((domainValue - dl) / dd));
  };

  scale.invert = function linearInvert(rangeValue) {
    return dl + (((rangeValue - rl) / rd) * dd);
  };

  scale.domain = domain;

  scale.range = range;

  scale.ticks = function linearTicks(count, project, thisArg) {
    thisArg = thisArg || this;
    let args = getTickRangeArgs(count, domain);
    args.push(project, thisArg);
    return rangeFn.apply(thisArg, args);
  };

  return scale;
}

function getTickRangeArgs(count, domain) {
  if (count === null) count = 10;
  const [dl, dr] = domain;
  let high;
  let low;
  if (dl < dr) {
    low = dl;
    high = dr;
  } else {
    low = dr;
    high = dl;
  }

  const span = high - low;
  let step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10));
  const err = count / span * step;

  if (err <= 0.15) {
    step *= 10;
  } else if (err <= 0.35) {
    step *= 5;
  } else if (err <= 0.75) {
    step *= 2;
  }
  const start = Math.ceil(low / step) * step;
  const stop = Math.floor(high / step) * step + step * 0.5;
  return [start, stop, step];
}
