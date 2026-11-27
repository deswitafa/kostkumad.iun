function tk(t){
  var s=ctx.createBufferSource(),
      h=ctx.createBiquadFilter(),
      g=ctx.createGain();

  s.buffer=nb;
  h.type='highpass';
  h.frequency.value=7000;
  g.gain.setValueAtTime(.12,t);
  g.gain.exponentialRampToValueAtTime(.0001,t+.04);
  s.connect(h);
  h.connect(g);
  g.connect(master);
  s.start(t);
}