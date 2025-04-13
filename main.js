const clock = document.getElementById('clock');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');

let currentTime = new Date();
let draggingHand = null;
let lastMinute = null;


// Gerar os números dinamicamente
function createClockNumbers() {
    for (let i = 1; i <= 12; i++) {
        const number = document.createElement('div');
        number.classList.add('number');
        number.textContent = i;

        const angle = (i * 30) * (Math.PI / 180);
        const radius = 130;
        const centerX = 150;
        const centerY = 150;

        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        number.style.left = `${x}px`;
        number.style.top = `${y}px`;

        clock.appendChild(number);
    }
}

function updateClock() {
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();

    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;

    secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
}

createClockNumbers();
updateClock();
setInterval(() => {
    if (!draggingHand) {
        currentTime = new Date(currentTime.getTime() + 1000);
        updateClock();
    }
}, 1000);

function getAngle(x, y) {
    const rect = clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = angle + 90;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}

function handleDragStart(hand) {
    draggingHand = hand;
    if (hand === minuteHand) {
      lastMinute = currentTime.getMinutes();
    }
  }
  

function handleDragMove(e) {
    if (!draggingHand) {
        return;
    }

    const angle = getAngle(e.clientX, e.clientY);

    if (draggingHand === hourHand) {
        const hour = Math.floor(angle / 30) % 12;
        const minute = currentTime.getMinutes();
        currentTime.setHours(hour);
        currentTime.setMinutes(minute);
        currentTime.setSeconds(0);
    } else if (draggingHand === minuteHand) {
        const newMinute = Math.floor(angle / 6) % 60;
        const hour = currentTime.getHours();
      
        // Detecta rotação completa
        if (lastMinute !== null) {
          if (lastMinute > 50 && newMinute < 10) {
            // Avançou uma hora
            currentTime.setHours(hour + 1);
          } else if (lastMinute < 10 && newMinute > 50) {
            // Recuou uma hora
            currentTime.setHours(hour - 1);
          }
        }
      
        currentTime.setMinutes(newMinute);
        currentTime.setSeconds(0);
        lastMinute = newMinute;
      }
      

    updateClock();
}

function handleDragEnd() {
    draggingHand = null;
}

hourHand.addEventListener('mousedown', () => handleDragStart(hourHand));
minuteHand.addEventListener('mousedown', () => handleDragStart(minuteHand));
document.addEventListener('mousemove', handleDragMove);
document.addEventListener('mouseup', handleDragEnd);