SHOW = 3
TARGET = 2
TRIALS = 3

animals = [ '#cat', '#dog', '#fish' ]

moving = null
show = []
target = []
missed = 0
found = 0
trials = []
trialCount = 0
id = ''
guessing = false

select = ->
  show = []
  target = []

  for i in [0..SHOW-1]
    pick = animals[Math.floor(Math.random() * animals.length)]
    while pick in show
      pick = animals[Math.floor(Math.random() * animals.length)]
    show.push pick

  target = []
  
  for i in [0..TARGET-1]
    pick = show[Math.floor(Math.random() * animals.length)]
    while pick in target
      pick = show[Math.floor(Math.random() * animals.length)]
    target.push pick


display = ->
  for animal in show
    $(animal).show()
    if animal in target
      $(animal).addClass 'target'
    else
      $(animal).removeClass 'target'
  color = '#'+Math.floor(Math.random()*16777215).toString(16)
  color[2] = '3'
  $('.target').css 'backgroundColor', color


  console.log $(animal)

initialPos = ->
  for animal in show
    $(animal).css 'left', Math.random() * 700 
    $(animal).css 'top', Math.random() * 450

move = ->
  for animal in show    
    x = Math.random() * 700
    y = Math.random() * 450
    $(animal).animate
      top: y
      left: x
    , 600

hideTargets = ->
  $('.target').css 'backgroundColor', 'transparent'

stop = ->
  clearInterval moving
  $('.animal').stop()

findThem = ->
  $('.animal').css 'opacity', '0.0'
  guessing = true
  missed = 0
  found = 0
  $('#msg').show()
  $('#msg').html "Click on where you think the 2 target animals are. (Trial #{trialCount+1} of #{TRIALS})"

guessStatus = ->
  $('#msg').show()
  $('#msg').html "#{missed+found} / #{TARGET} guesses entered."
  if missed+found is TARGET
    nextTrial()

$(document).click (ev) ->
  if not guessing then return
  ev.stopPropagation()
  missed++
  guessStatus()



youreDone = ->
  fnd = 0
  for t in trials
    fnd += t.found
  msd = 0
  for t in trials
    msd += t.missed
  $('#msg').show()
  $('#msg').html "Thank you for participating.  Total found: #{fnd};  total missed: #{msd}"
  $('.sub').hide()

interval = (ms, func) -> setInterval func, ms
delay = (ms, func) -> setTimeout func, ms


trial = ->
  $('#msg').hide()
  $('.sub').hide()
  guessing = false
  if id? and id.length > 0
    select()
    display()
    initialPos()
    $('.animal').css 'opacity', '1.0'   

    delay 3000, -> moving = interval 650, move
    delay 3000, hideTargets
    delay 9600, stop
    delay 10000, findThem
  else
    alert 'Invalid subject id. Please refresh the page and try again.'

nextTrial = ->
  guessing = false
  trials[trialCount] = { found, missed }
  $('#msg').show()
  $('#msg').html "Press submit to continue."
  $('.sub').show()
  if trialCount > 0
    $.post '/data', { id, found, missed }
  trialCount++
  if trialCount >= TRIALS
    youreDone()

$ ->
  $('.sub').click ->
    trial()

  $('.animal').click (ev) ->
    if not guessing then return
    ev.stopPropagation()    
    if not $(this).hasClass('target')
      missed++
    else
      found++
    guessStatus()

  str = 'Instructions: When you click submit at the bottom of the screen, several animals will appear in random positions. &nbsp;&nbsp;'
  str += 'Some of the animals will have a colored background.  Those are your target animals.&nbsp;&nbsp;'
  str += 'Watch the target animals location closely.&nbsp;&nbsp;After 10 seconds of movement, the animals will disappear '
  str += 'and you will be asked to click on the screen on each of the places where you last saw the target animals.  &nbsp;&nbsp;'

  str += 'Enter your subject ID, then click the submit button at bottom of screen to start.  The first trial is a test, just to get the hang of it.'
  $('#msg').html str
  id = prompt 'Enter your subject id:'

    

