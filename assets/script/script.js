const body = document.body
const modal = document.querySelector('.modal')
const dimmed = document.querySelector('.modal__dimmed')
const panels = document.querySelectorAll('.modal__panel')
const greetings = document.querySelectorAll('.greeting__row')
const todayElem = document.querySelector('.today')

const presets = document.querySelectorAll('.preset__item')
const timerMin = document.querySelector('.timer__input--min')
const timerSec = document.querySelector('.timer__input--sec')
const startButton = document.querySelector('.timer__button--activate')
const refreshButton = document.querySelector('.timer__button--refresh')

const closeModalHandle = () => {
  modal.classList.remove('active')
}

const openModalHandle = () => {
  modal.classList.add('active')
}

let currentPanel = 0
const modalNavHandle = (e) => {
  const { dir } = e.target.closest('button').dataset
  if (dir === 'left') goToPanel(currentPanel - 1)
  else if (dir === 'right') goToPanel(currentPanel + 1)
}

const prevData = {
  focusMin: 15,
  focusSec: 0,
  relaxMin: 5,
  relaxSec: 0,
}

const setMinutesValue = (value = null, operator = null) => {
  let minute = 0

  if (operator) {
    minute = Number($minutesElement.value)
    if (operator === 'plus') {
      minute += 1
    } else {
      minute -= 1
    }
  } else {
    if (isNaN(Number(value))) {
      minute = Number(prevData.minute)
    } else {
      minute = Number(value)
    }
  }

  if (minute > 90 || minute < 0) {
    minute = '00'
  } else if (minute < 10) {
    minute = `0${minute}`
  }

  timerMin.value = minute
  prevData.minute = Number(minute)

  return minute
}

const setSecondsValue = (value = null) => {
  let second = 0

  if (isNaN(Number(value))) {
    second = Number(prevData.second)
  } else {
    second = Number(value)
  }

  if (second >= 60) {
    setMinutesValue(null, 'plus')
    second = second - 60
  }

  if (second < 0) {
    second = '00'
  } else if (second < 10) {
    second = `0${second}`
  }

  timerSec.value = second
  prevData.second = Number(second)

  return second
}

const timer = {
  isRunning: false,
  isDoneFocus: false,
  totalSeconds: 0,

  focus: () => {

    isDoneFocus ? timer.status = 'relax' : timer.status = 'focus'

    timer.isRunning = true
    userAppearance(true)
    body.className = 'focus'
    startButton.dataset.status = 'pause'

    timer.interval = setInterval(() => {
      timer.totalSeconds -= 1;

      setMinutesValue(parseInt(timer.totalSeconds / 60), null)
      setSecondsValue(timer.totalSeconds % 60)

      if (timer.totalSeconds === 0) {
        clearInterval(timer.interval)
        timer.relax()
      }

    }, 1000);
  },

  reset: () => {
    if (timer.interval) {
      timer.pause()
    }

    timer.totalSeconds = 0
    
    startButton.dataset.status = 'start'

    $presetItems.forEach((elem, idx) => {
      if (elem.classList.contains('active')) {
        let preset = elem.dataset.preset

        setMinutesValue(preset, null)
        setSecondsValue(0)
      }
    })
    
    resetSound()
  },

  pause: () => {
    timer.isRunning = false
    userAppearance(false)

    clearInterval(timer.interval)
    delete timer.interval;

    pausedSound()

    if (timer.totalSeconds === 0) {
      timer.reset()
    }
  },
}

const userAppearance = (isBlock) => {
  timerMin.disabled = isBlock
  timerSec.disabled = isBlock
  presets.forEach(elem => elem.disabled = isBlock)
}

// Event Handler
const presetClickHandle = (e) => {
  if (!timer.isRunning) {
    timer.reset()

    setMinutesValue(e.target.dataset.preset, null)
    setSecondsValue(0)
  
    $presetItems.forEach((elem, idx) => {
      elem.classList.remove('active')
    })
    e.target.classList.add('active')
  }
}

function goToPanel (n) {
  panels.forEach(el => el.classList.remove('active'))
  currentPanel = (n + panels.length) % panels.length;
  panels[currentPanel].classList.add('active')
}

function getTime() {
  const today = new Date();
  const year = today.getFullYear()
  const month = today.getMonth()
  const date = today.getDate()
  const day = today.getDay()
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  const WEEK = ['일', '월', '화', '수', '목', '금', '토']

  todayElem.innerText = `
    ${year}년 ${month}월 ${date}일 (${WEEK[day]}) ${
    hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds} ٩( ᐛ )و`
}

// Event Handler
dimmed.addEventListener('click', closeModalHandle)

getTime();
setInterval(getTime, 1000);