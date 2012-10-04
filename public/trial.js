(function() {
  var SHOW, TARGET, TRIALS, animals, delay, display, findThem, found, guessStatus, guessing, hideTargets, id, initialPos, interval, missed, move, moving, nextTrial, select, show, stop, target, trial, trialCount, trials, youreDone,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SHOW = 3;

  TARGET = 2;

  TRIALS = 3;

  animals = ['#cat', '#dog', '#fish'];

  moving = null;

  show = [];

  target = [];

  missed = 0;

  found = 0;

  trials = [];

  trialCount = 0;

  id = '';

  guessing = false;

  select = function() {
    var i, pick, _ref, _ref2, _results;
    show = [];
    target = [];
    for (i = 0, _ref = SHOW - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      pick = animals[Math.floor(Math.random() * animals.length)];
      while (__indexOf.call(show, pick) >= 0) {
        pick = animals[Math.floor(Math.random() * animals.length)];
      }
      show.push(pick);
    }
    target = [];
    _results = [];
    for (i = 0, _ref2 = TARGET - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
      pick = show[Math.floor(Math.random() * animals.length)];
      while (__indexOf.call(target, pick) >= 0) {
        pick = show[Math.floor(Math.random() * animals.length)];
      }
      _results.push(target.push(pick));
    }
    return _results;
  };

  display = function() {
    var animal, color, _i, _len;
    for (_i = 0, _len = show.length; _i < _len; _i++) {
      animal = show[_i];
      $(animal).show();
      if (__indexOf.call(target, animal) >= 0) {
        $(animal).addClass('target');
      } else {
        $(animal).removeClass('target');
      }
    }
    color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    color[2] = '3';
    $('.target').css('backgroundColor', color);
    return console.log($(animal));
  };

  initialPos = function() {
    var animal, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = show.length; _i < _len; _i++) {
      animal = show[_i];
      $(animal).css('left', Math.random() * 700);
      _results.push($(animal).css('top', Math.random() * 450));
    }
    return _results;
  };

  move = function() {
    var animal, x, y, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = show.length; _i < _len; _i++) {
      animal = show[_i];
      x = Math.random() * 700;
      y = Math.random() * 450;
      _results.push($(animal).animate({
        top: y,
        left: x
      }, 600));
    }
    return _results;
  };

  hideTargets = function() {
    return $('.target').css('backgroundColor', 'transparent');
  };

  stop = function() {
    clearInterval(moving);
    return $('.animal').stop();
  };

  findThem = function() {
    $('.animal').css('opacity', '0.0');
    guessing = true;
    missed = 0;
    found = 0;
    $('#msg').show();
    return $('#msg').html("Click on where you think the 2 target animals are. (Trial " + (trialCount + 1) + " of " + TRIALS + ")");
  };

  guessStatus = function() {
    $('#msg').show();
    $('#msg').html("" + (missed + found) + " / " + TARGET + " guesses entered.");
    if (missed + found === TARGET) return nextTrial();
  };

  $(document).click(function(ev) {
    if (!guessing) return;
    ev.stopPropagation();
    missed++;
    return guessStatus();
  });

  youreDone = function() {
    var fnd, msd, t, _i, _j, _len, _len2;
    fnd = 0;
    for (_i = 0, _len = trials.length; _i < _len; _i++) {
      t = trials[_i];
      fnd += t.found;
    }
    msd = 0;
    for (_j = 0, _len2 = trials.length; _j < _len2; _j++) {
      t = trials[_j];
      msd += t.missed;
    }
    $('#msg').show();
    $('#msg').html("Thank you for participating.  Total found: " + fnd + ";  total missed: " + msd);
    return $('.sub').hide();
  };

  interval = function(ms, func) {
    return setInterval(func, ms);
  };

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  trial = function() {
    $('#msg').hide();
    $('.sub').hide();
    guessing = false;
    if ((id != null) && id.length > 0) {
      select();
      display();
      initialPos();
      $('.animal').css('opacity', '1.0');
      delay(3000, function() {
        return moving = interval(650, move);
      });
      delay(3000, hideTargets);
      delay(9600, stop);
      return delay(10000, findThem);
    } else {
      return alert('Invalid subject id. Please refresh the page and try again.');
    }
  };

  nextTrial = function() {
    guessing = false;
    trials[trialCount] = {
      found: found,
      missed: missed
    };
    $('#msg').show();
    $('#msg').html("Press submit to continue.");
    $('.sub').show();
    if (trialCount > 0) {
      $.post('/data', {
        id: id,
        found: found,
        missed: missed
      });
    }
    trialCount++;
    if (trialCount >= TRIALS) return youreDone();
  };

  $(function() {
    var str;
    $('.sub').click(function() {
      return trial();
    });
    $('.animal').click(function(ev) {
      if (!guessing) return;
      ev.stopPropagation();
      if (!$(this).hasClass('target')) {
        missed++;
      } else {
        found++;
      }
      return guessStatus();
    });
    str = 'Instructions: When you click submit at the bottom of the screen, several animals will appear in random positions. &nbsp;&nbsp;';
    str += 'Some of the animals will have a colored background.  Those are your target animals.&nbsp;&nbsp;';
    str += 'Watch the target animals location closely.&nbsp;&nbsp;After 10 seconds of movement, the animals will disappear ';
    str += 'and you will be asked to click on the screen on each of the places where you last saw the target animals.  &nbsp;&nbsp;';
    str += 'Enter your subject ID, then click the submit button at bottom of screen to start.  The first trial is a test, just to get the hang of it.';
    $('#msg').html(str);
    return id = prompt('Enter your subject id:');
  });

}).call(this);
