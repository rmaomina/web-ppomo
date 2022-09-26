/** @format */

const $body = document.body
const $modal = document.querySelector('.modal')
const $dimmed = document.querySelector('.modal__dimmed')
const $panels = document.querySelectorAll('.modal__panel')
const $todayElem = document.querySelector('.today')

const $presets = document.querySelectorAll('.preset__item')
const $timerMin = document.querySelector('.timer__input--min')
const $timerSec = document.querySelector('.timer__input--sec')
const $startBtn = document.querySelector('.timer__button--activate')
const $resetBtn = document.querySelector('.timer__button--refresh')

const closeModalHandle = () => {
	$modal.classList.remove('active')
}

const openModalHandle = () => {
	$modal.classList.add('active')
}

let currentPanel = 0
const modalNavHandle = (e) => {
	const { dir } = e.target.closest('button').dataset
	if (dir === 'left') goToPanel(currentPanel - 1)
	else if (dir === 'right') goToPanel(currentPanel + 1)
}

const prevData = {
	minute: 30,
  second: 0,
	relaxMin: 5,
}

const setMinValue = (value = null, operator = null) => {
	let minute = 0
  let relax = 5

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

	if (minute > 90) minute = '90'
	else if (minute < 0) minute = '00'
	else if (minute < 10) minute = `0${minute}`

  if (minute > 34) relax = 10
	else relax = 5

	$timerMin.value = minute
	prevData.minute = Number(minute)
  prevData.relaxMin = relax

	return minute
}

const setSecValue = (value = null) => {
	let second = 0

	if (isNaN(Number(value))) {
		second = Number(prevData.second)
	} else {
		second = Number(value)
	}

	if (second >= 60) {
		setMinValue(null, 'plus')
		second = second - 60
	}

	if (second < 0) {
		second = '00'
	} else if (second < 10) {
		second = `0${second}`
	}

	$timerSec.value = second
	prevData.second = Number(second)

	return second
}

const timer = {
	isRunning: false,
	totalSeconds: 0,

	start: () => {
		userAppearance(true)
		timer.isRunning = true
		$body.className = 'focus'
		$startBtn.dataset.status = 'pause'

		timer.interval = setInterval(() => {
			timer.totalSeconds -= 1

			setMinValue(parseInt(timer.totalSeconds / 60), null)
			setSecValue(timer.totalSeconds % 60)

			if (timer.totalSeconds === prevData.relaxMin * 60) {
				$body.className = 'relax'
			}

			if (timer.totalSeconds === 0) clearInterval(timer.interval)
		}, 1000)
	},

	reset: () => {
		if (timer.interval) timer.pause()

		timer.totalSeconds = 0

		$startBtn.dataset.status = 'start'

		$presets.forEach((elem, idx) => {
			if (elem.classList.contains('active')) {
				let preset = elem.dataset.preset

				setMinValue(preset, null)
				setSecValue(0)
			}
		})
	},

	pause: () => {
		timer.isRunning = false
		userAppearance(false)

		clearInterval(timer.interval)
		delete timer.interval

		if (timer.totalSeconds === 0) timer.reset()
	},
}

const userAppearance = (isBlock) => {
	$timerMin.disabled = isBlock
	$timerSec.disabled = isBlock
	$presets.forEach((elem) => (elem.disabled = isBlock))
}

function goToPanel(n) {
	$panels.forEach((el) => el.classList.remove('active'))
	currentPanel = (n + $panels.length) % $panels.length
	$panels[currentPanel].classList.add('active')
}

function getTime() {
	const today = new Date()
	const year = today.getFullYear()
	const month = today.getMonth()
	const date = today.getDate()
	const day = today.getDay()
	const hours = today.getHours()
	const minutes = today.getMinutes()
	const seconds = today.getSeconds()
	const WEEK = ['일', '월', '화', '수', '목', '금', '토']

	$todayElem.innerText = `
    ${year}년 ${month}월 ${date}일 (${WEEK[day]}) ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds} ٩( ᐛ )و`
}

// Event Handler
const presetClickHandle = (e) => {
	e.preventDefault()
	if (timer.isRunning) return

	let pre = e.target.dataset.preset

	if (pre === '60') {
		prevData.minute = 50
		prevData.relaxMin = 10
	} else if (pre === '30') {
		prevData.minute = 25
		prevData.relaxMin = 5
	} else if (pre === '20') {
		prevData.minute = 15
		prevData.relaxMin = 5
	}

	setMinValue(e.target.dataset.preset, null)

	$presets.forEach((elem, idx) => elem.classList.remove('active'))
	e.target.classList.add('active')
}

const refreshClickHandle = () => {
	if (timer.isRunning) timer.reset()
	setMinValue(prevData.minute, null)
	setSecValue(0)
}

const startToggleHandle = () => {
	let status = $startBtn.dataset.status
  let totalSeconds = (prevData.minute * 60) + (prevData.second)
  if (status === 'start' && totalSeconds !== 0) {
    $startBtn.dataset.status = 'pause'
    timer.totalSeconds = totalSeconds
    timer.start()
  } else if (status === 'pause') {
    
    timer.pause()
  }
}

function startButtonToggle() {
  let status = $startBtn.dataset.status
  if (status === 'start') {
    $startBtn.dataset.status = 'pause'
    $startBtn.textContent = 'PAUSE'
  } else {
    $startBtn.dataset.status = 'start'
    $startBtn.textContent = 'START'
  }
}

// Event Handler
$dimmed.addEventListener('click', closeModalHandle)
$presets.forEach((el) => el.addEventListener('click', (e) => presetClickHandle(e)))
$resetBtn.addEventListener('click', refreshClickHandle)
$startBtn.addEventListener('click', startToggleHandle)
$timerMin.addEventListener('change', (e) => setMinValue(e.target.value, null))
$timerSec.addEventListener('change', (e) => setSecValue(e.target.value))

getTime()
setInterval(getTime, 1000)
