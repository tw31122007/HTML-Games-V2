
// translation
title = document.getElementsByTagName('h1')[0].innerHTML;
title2 = document.getElementsByTagName('h2')[0].innerHTML;
title3 = document.getElementsByTagName('h2')[2].innerHTML;
button = document.getElementsByTagName('button')[0].innerHTML;
about = document.getElementById('about').innerHTML;
about2 = document.getElementById('about2').innerHTML;
trans = document.getElementsByTagName('button')[1].innerHTML;


var BLURBS = {
  'start': {
    header: 'Get Ready !',
    blurb: 'Select your difficulty and start the game.'
  },
  'p1-turn': {
    header: 'Your Turn',
    blurb: 'Click on the board to drop your chip.'
  },
  'p2-turn': {
    header: 'Computer\'s Turn',
    blurb: 'The computer is trying to find the best way to make you lose.'
  },
  'p1-win': {
    header: 'You Win !',
    blurb: 'You are a winner. Remember this moment. Carry it with you, forever.'
  },
  'p2-win': {
    header: 'You lose...',
    blurb: 'Try again when you\'re done wiping your tears of shame.'
  },
  'tie': {
    header: 'Tie',
    blurb: 'Everyone\'s a winner! Or loser. Depends on how you look at it.'
  }
};

var OUTLOOKS = {
  'win-imminent': 'Uh oh, computer is feeling saucy!',
  'loss-imminent': 'Computer is unsure. Now\'s your chance!'
};

par = getCookieFr();
if (par == "true") {
   BLURBS = {
     'start': {
       header: 'Commençons !',
       blurb: 'Selectionnez la difficulté puis commençer la partie.'
     },
     'p1-turn': {
       header: 'À vous !',
       blurb: 'Cliquez sur la grille pour lacher un jeton.'
     },
     'p2-turn': {
       header: 'Tour de l\'Ordinateur...',
       blurb: 'L\'ordinateur essaie de trouver la meilleure façon de vous faire perdre.'
     },
     'p1-win': {
       header: 'Vous avez gagné !',
       blurb: 'Vous êtes le gagnant. Vous garderez ce sentiment de victoire avec vous, pour toujours.'
     },
     'p2-win': {
       header: 'Vous avez perdu...',
       blurb: 'Réessayez lorsque vous aurez fini d\'essuiyer vos larmes de honte.'
     },
     'tie': {
       header: 'Égalité.',
       blurb: 'Tout le monde à gagné ! Ou a perdu... Cela dépends du point de vue.'
     }
   }; OUTLOOKS = {
     'win-imminent': 'Ah ? L\'ordinateur se sent confiant !',
     'loss-imminent': 'L\'Ordinateur doute... C\'est maintenant ou jamais !'
   };
   document.getElementsByTagName('h1')[0].innerHTML = "Puissance 4.";
   document.getElementsByTagName('h2')[0].innerHTML = "Difficulté :";
   document.getElementsByTagName('h2')[2].innerHTML = "À propos.";
   document.getElementsByTagName('button')[0].innerHTML = "Lancer";
   document.getElementById('about').innerHTML = "Design et traduction par ";
   document.getElementById('about2').innerHTML = "Gameplay par :";
   document.getElementsByTagName('button')[1].innerHTML = 'EN <img src=\"img/EnFlag.png\" class=\"flag\">';
   fr = true;
} else {
    fr = false;
}

setBlurb('start');
setOutlook('');

$('.translate')
  .on('click', function() {
    translate();
});

function getCookieFr() {
    var res = "";
    var name = "fr=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split('; ');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        if (c.substring(0,3) == name) {
           res = ca[i].substring(3,ca[i].length);
        }
    }
    return res;
}

function translate() {
  if (fr) {
   BLURBS = {
      'start': {
        header: 'Get Ready !',
        blurb: 'Select your difficulty and start the game.'
      },
      'p1-turn': {
        header: 'Your Turn',
        blurb: 'Click on the board to drop your chip.'
      },
      'p2-turn': {
        header: 'Computer\'s Turn',
        blurb: 'The computer is trying to find the best way to make you lose.'
      },
      'p1-win': {
        header: 'You Win !',
        blurb: 'You are a winner. Remember this moment. Carry it with you, forever.'
      },
      'p2-win': {
        header: 'You lose...',
        blurb: 'Try again when you\'re done wiping your tears of shame.'
      },
      'tie': {
        header: 'Tie',
        blurb: 'Everyone\'s a winner! Or loser. Depends on how you look at it.'
      }
    };
   OUTLOOKS = {
    'win-imminent': 'Uh oh, computer is feeling saucy!',
    'loss-imminent': 'Computer is unsure. Now\'s your chance!'
  };
    document.getElementsByTagName('h1')[0].innerHTML = title;
    document.getElementsByTagName('h2')[0].innerHTML = title2;
    document.getElementsByTagName('h2')[2].innerHTML = title3;
    document.getElementsByTagName('button')[0].innerHTML = button;
    document.getElementById('about').innerHTML = about;
    document.getElementById('about2').innerHTML = about2;
    document.getElementsByTagName('button')[1].innerHTML = trans;
  } else {
  BLURBS = {
     'start': {
       header: 'Commençons !',
       blurb: 'Selectionnez la difficulté puis commençer la partie.'
     },
     'p1-turn': {
       header: 'À vous !',
       blurb: 'Cliquez sur la grille pour lacher un jeton.'
     },
     'p2-turn': {
       header: 'Tour de l\'Ordinateur...',
       blurb: 'L\'ordinateur essaie de trouver la meilleure façon de vous faire perdre.'
     },
     'p1-win': {
       header: 'Vous avez gagné !',
       blurb: 'Vous êtes le gagnant. Vous garderez ce sentiment de victoire avec vous, pour toujours.'
     },
     'p2-win': {
       header: 'Vous avez perdu...',
       blurb: 'Réessayez lorsque vous aurez fini d\'essuiyer vos larmes de honte.'
     },
     'tie': {
       header: 'Égalité.',
       blurb: 'Tout le monde à gagné ! Ou a perdu... Cela dépends du point de vue.'
     }
   }; OUTLOOKS = {
     'win-imminent': 'Ah ? L\'ordinateur se sent confiant !',
     'loss-imminent': 'L\'Ordinateur doute... C\'est maintenant ou jamais !'
   };
    document.getElementsByTagName('h1')[0].innerHTML = "Puissance 4.";
    document.getElementsByTagName('h2')[0].innerHTML = "Difficulté :";
    document.getElementsByTagName('h2')[2].innerHTML = "À propos.";
    document.getElementsByTagName('button')[0].innerHTML = "Lancer";
    document.getElementById('about').innerHTML = "Design et traduction par ";
    document.getElementById('about2').innerHTML = "Gameplay par :";
    document.getElementsByTagName('button')[1].innerHTML = 'EN <img src=\"img/EnFlag.png\" class=\"flag\">';
}
  setBlurb(lastBlurb);
  setOutlook(lastOutlook);

  if (fr == false) {
    fr = true;
  } else {
    fr = false;
  }
  document.cookie = "fr="+fr;
}

// constants
const WEB_WORKER_URL = 'js/worker.js';

// global variables
var worker;
var currentGameState;

// document ready
$(function() {
  $('.start button').on('click', startGame);
  setBlurb('start');
  setOutlook();

  // create worker
  worker = new Worker(WEB_WORKER_URL);
  worker.addEventListener('message', function(e) {
    switch(e.data.messageType) {
      case 'reset-done':
        startHumanTurn();
        break;
      case 'human-move-done':
        endHumanTurn(e.data.coords, e.data.isWin, e.data.winningChips, e.data.isBoardFull);
        break;
      case 'progress':
        updateComputerTurn(e.data.col);
        break;
      case 'computer-move-done':
        endComputerTurn(e.data.coords, e.data.isWin, e.data.winningChips, e.data.isBoardFull,
          e.data.isWinImminent, e.data.isLossImminent);
        break;
    }
  }, false);
});

function setBlurb(key) {
  lastBlurb = key;
  $('.info h2').text(BLURBS[key].header);
  $('.info .blurb').text(BLURBS[key].blurb);
}

function setOutlook(key) {
  lastOutlook = key;
  var $outlook = $('.info .outlook');
  if(key) {
    $outlook
      .text(OUTLOOKS[key])
      .show();
  } else {
    $outlook.hide();
  }
}

function startGame() {
  $('.dif').addClass('freeze');
  $('.dif input').prop('disabled', true);
  $('.lit-cells, .chips').empty();

  worker.postMessage({
    messageType: 'reset',
  });
}

function startHumanTurn() {
  setBlurb('p1-turn');
  $('.click-columns div').addClass('hover');

  // if mouse is already over a column, show cursor chip there
  var col = $('.click-columns div:hover').index();
  if(col !== -1) {
    createCursorChip(1, col);
  }

  $('.click-columns')
    .on('mouseenter', function() {
      var col = $('.click-columns div:hover').index();
      createCursorChip(1, col);
    })
    .on('mouseleave', function() {
      destroyCursorChip();
    });

  $('.click-columns div')
    .on('mouseenter', function() {
      var col = $(this).index();
      moveCursorChip(col);
    })
    .on('click', function() {
      $('.click-columns, .click-columns div').off();

      var col = $(this).index();
      worker.postMessage({
        messageType: 'human-move',
        col: col
      });
    });
}

function endHumanTurn(coords, isWin, winningChips, isBoardFull) {
  $('.click-columns div').removeClass('hover');
  if(!coords) {
    // column was full, human goes again
    startHumanTurn();
  } else {
    dropCursorChip(coords.row, function() {
      if(isWin) {
        endGame('p1-win', winningChips);
      } else if(isBoardFull) {
        endGame('tie');
      } else {
        // pass turn to computer
        startComputerTurn();
      }
    });
  }
}

function startComputerTurn() {
  setBlurb('p2-turn');

  // computer's cursor chip starts far left and moves right as it thinks
  createCursorChip(2, 0);

  var maxDepth = parseInt($('input[name=dif-options]:checked').val(), 10) + 1;
  worker.postMessage({
    messageType: 'computer-move',
    maxDepth: maxDepth
  });
}

function updateComputerTurn(col) {
  moveCursorChip(col);
}

function endComputerTurn(coords, isWin, winningChips, isBoardFull, isWinImminent, isLossImminent) {
  moveCursorChip(coords.col, function() {
    dropCursorChip(coords.row, function() {
      if (isWin) {
        endGame('p2-win', winningChips);
      } else if (isBoardFull) {
        endGame('tie');
      } else {
        if(isWinImminent) {
          setOutlook('win-imminent');
        } else if (isLossImminent) {
          setOutlook('loss-imminent');
        } else {
          setOutlook();
        }

        // pass turn to human
        startHumanTurn();
      }
    });
  });
}

function endGame(blurbKey, winningChips) {
  $('.dif').removeClass('freeze');
  $('.dif input').prop('disabled', false);
  setBlurb(blurbKey);
  setOutlook();

  if(winningChips) {
    // not a tie, highlight the chips in the winning run
    for(var i = 0; i < winningChips.length; i++) {
      createLitCell(winningChips[i].col, winningChips[i].row);
    }
  }
}

function createLitCell(col, row) {
  $('<div>')
  .css({
    'left': indexToPixels(col),
    'bottom': indexToPixels(row)
  })
  .appendTo('.lit-cells');
}

function createCursorChip(player, col) {
  var playerClass = 'p' + player;
  $('<div>', { 'class': 'cursor ' + playerClass })
    .css('left', indexToPixels(col))
    .appendTo('.chips');

  // also highlight column
  $('.lit-columns div').eq(col).addClass('lit');
}

function destroyCursorChip() {
  $('.chips .cursor').remove();
  $('.lit-columns .lit').removeClass('lit');
}

function moveCursorChip(col, callback) {
  $('.chips .cursor').css('left', indexToPixels(col));
  $('.lit-columns .lit').removeClass('lit');
  $('.lit-columns div').eq(col).addClass('lit');

  // callback is only used when the computer is about to drop a chip
  // give it a slight delay for visual interest
  setTimeout(callback, 300);
}

function dropCursorChip(row, callback) {
  // speed of animation depends on how far the chip has to drop
  var ms = (7 - row) * 40;
  var duration = (ms / 1000) + 's';

  $('.chips .cursor')
    .removeClass('cursor')
    .css({
      'bottom': indexToPixels(row),
      'transition-duration': duration,
      'animation-delay': duration
    })
    .addClass('dropped');

  $('.lit-columns .lit').removeClass('lit');
  setTimeout(callback, ms);
}

function indexToPixels(index) {
  return (index * 61 + 1) + 'px';
}
