// SOUNDMAP.jump = new SoundEffect(.02, [440, 880, 1100, 2400], [.1,.5,.6,.7,.1], 5, 2);
// SOUNDMAP.jump = new SoundEffect(.04, [440, 550, 660,770, 1100], [.1,.5,.6,.7,.1], 5, 10);
SOUNDMAP.jump = new SoundEffect(.03, [550, 660,770, 1100], [.3,.5,.6,.4,0], 4, 2);
SOUNDMAP.jump = new SoundEffect(.02, [220, 440,660, 880], [.3,.5,.6,.4,0], 4, 1, 'sine');
SOUNDMAP.jump2 = new SoundEffect(.02, [450, 500,660, 1100], [.2,.5,.4,.7,0], 3, 10);
// SOUNDMAP.jump = new SoundEffect(.04, [330, 500, 550,660, 770, 1100], [.1,.5,.6,.6,.6,.001 ], 6, 10);
SOUNDMAP.land = new SoundEffect(.01, 
  [220, 440, 220, 440, 220, 220,],
  [.5, .8, .5, .5, .4, .2,],
3);
SOUNDMAP.land = new SoundEffect(.01, 
  [220, 440, 220, 220],
  [.5, .8, .5, 0],
4);
// SOUNDMAP.dash = new SoundEffect(.04, [440, 2400, 1200, 1800], [.1,.5,.6,.7,.1], 5, 10);
// SOUNDMAP.dash = new SoundEffect(.04, [440, 2400, 2000, 1800], [.1,.5,.6,.7,.1], 5, 3);
// SOUNDMAP.dash = new SoundEffect(.02, [660, 770, 880, 990, 990], [.1,.5,.6,.7,0], 5, 2, 'sine');
SOUNDMAP.woof = new SoundEffect(.04, [880, 1200, 660, 440], [.7,.5,.6,.3,.1], 5, 10);
SOUNDMAP.dash = new SoundEffect(.03, [660, 1000, 660, 440], [.7,.5,.6,.3,.1], 5, 10);
SOUNDMAP.dash.volume = 0.2;
SOUNDMAP.pickup = new SoundEffect(.1, [440, 880, 880], [.5,.5,0], 3, 1);
// SOUNDMAP.dash = new SoundEffect(.02, [2200,1500,2100,2000,1000,1900,], [.3,.35,.4,.45,.5,.6,.7], 5, 2);
// SOUNDMAP.playerDeath = new SoundEffect(.05, [1200,550,440,220,330,220,110], [.5],8,10, 'square');
// SOUNDMAP.playerDeath = new SoundEffect(.2, [880,110], [.5],2,20, 'square');
SOUNDMAP.playerDeath = new SoundEffect(.03,
  [1200,880,0,440,110,440,110,0,220,110,100,102,105,110,120,121],
  [.5, .5, 0, .5, .5, .5, .5, 0, .5],5,10, 'square');

SOUNDMAP.playerDeath = new SoundEffect(.04,
  [220,440,0,440,110,440,110,0,220,110,100,102,105,110,120,121],
  [.25, 0, 0, .25, .25, .5, .5, 0, .5],5,1, 'sawtooth');


  SOUNDMAP.playerTalk =  new SoundList([
    new SoundTag('onPress.wav', 1,1),
    new SoundTag('onPress.wav', 1.25,1),
    new SoundTag('onPress.wav', 1.33,1),
    new SoundTag('onPress.wav', 1.17,1),
    new SoundTag('onPress.wav', .91,1),
  ])