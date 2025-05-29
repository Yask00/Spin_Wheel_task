let sections = [
    {
        id: 0,
        value: 10,
        degreePosition: 0,
        picked: false,
    },
    {
        id: 1,
        value: 25,
        degreePosition: 340,
        picked: false,
    },
    {
        id: 2,
        value: 15,
        degreePosition: 320,
        picked: false,
    },
    {
        id: 3,
        value: 30,
        degreePosition: 300,
        picked: false,
    },
    {
        id: 4,
        value: 20,
        degreePosition: 280,
        picked: false,
    },
    {
        id: 5,
        value: 50,
        degreePosition: 260,
        picked: false,
    },
    {
        id: 6,
        value: 10,
        degreePosition: 240,
        picked: false,
    },
    {
        id: 7,
        value: 25,
        degreePosition: 220,
        picked: false,
    },
    {
        id: 8,
        value: 15,
        degreePosition: 200,
        picked: false,
    },
    {
        id: 9,
        value: 30,
        degreePosition: 180,
        picked: false,
    },
    {
        id: 10,
        value: 20,
        degreePosition: 160,
        picked: false,
    },
    {
        id: 11,
        value: 100,
        degreePosition: 140,
        picked: false,
    },
    {
        id: 12,
        value: 10,
        degreePosition: 120,
        picked: false,
    },
    {
        id: 13,
        value: 25,
        degreePosition: 100,
        picked: false,
    },
    {
        id: 14,
        value: 15,
        degreePosition: 80,
        picked: false,
    },
    {
        id: 15,
        value: 30,
        degreePosition: 60,
        picked: false,
    },
    {
        id: 16,
        value: 20,
        degreePosition: 40,
        picked: false,
    },
    {
        id: 17,
        value: "Free spins",
        degreePosition: 20,
        picked: false,
    },
]

// 10 x 3 <------ this will happend 3 times
// 15 x 3 <------ this will happend 2 times
// 20 x 3
// 25 x 3
// 30 x 3
// 50 x 1
// 100 x 1
// fs x 1 <----- this will trigger spins

const wheel = document.querySelector('.spinner__sections');

const spin = async (section, delay) => {
    const totalRotationDegrees = (360 * 5 + section.degreePosition);

    // if (!delay) {
        wheel.style.removeProperty('transform');
        wheel.style.removeProperty('transition');
    // }

    return new Promise((resolve) => {
        const onTransitionEnd = () => {
            wheel.removeEventListener('transitionend', onTransitionEnd);
            resolve(section.value);
        };

        wheel.addEventListener('transitionend', onTransitionEnd);

        // Set the rotation after a short delay to ensure the transition is applied
        setTimeout(() => {
            // if(delay) {
            //     wheel.style.removeProperty('transform');
            //     wheel.style.removeProperty('transition');
            // }
            rotationByDegrees(totalRotationDegrees);
        }, delay ? delay : 50); // Adjust the delay as needed
    });
    // setTimeout(() => {
    //     rotationByDegrees(totalRotationDegrees);
    // }, 0);
}

const randomNumbersInRange = (countOfNumbers, range) => {
    const numbers = [];
    while (numbers.length < countOfNumbers) {
        const randomNumber = Math.floor(Math.random() * range);
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    return numbers;
}

const rotationByDegrees = (degree) => {
    wheel.style.transform = `rotate(${degree}deg)`; 
    wheel.style.transition = 'transform 5s cubic-bezier(0,0,0,1.15)'; // TODO: 0.2s in params and 5
}

const areNumbersRepeating = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].value === arr[i + 1].value) {
            return false;
        }
    }

    return true;
};

const shuffleListOfNumbers = (array) => {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

const nextTenNumbers = () => { 
    sections = sections.map(section => ({ ...section, picked: false })); // Reset picked state

    const tenValueSections = sections.filter(section => section.value === 10);
    const fifteenValueSections = sections.filter(section => section.value === 15).splice(0, 2);
    const randomSections = sections.filter(section => section.value !== 10 && section.value !== 15);
    const fiveRandomSections = shuffleListOfNumbers(randomSections).slice(0, 5);

    let nextTenNumbersToStopAt = [...tenValueSections, ...fifteenValueSections, ...fiveRandomSections];

    do {
        nextTenNumbersToStopAt = shuffleListOfNumbers(nextTenNumbersToStopAt);
    } while (!areNumbersRepeating(nextTenNumbersToStopAt));

    return nextTenNumbersToStopAt;
}

const handleFreeSpins = async () => {
    const freeSpinsSectionIds = randomNumbersInRange(3, sections.length - 1);
        let freeSpinsTotalWinnings = 0;

    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
    const freeSpinWinningOne = await spin(sections[freeSpinsSectionIds[0]]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const freeSpinWinningTwo = await spin(sections[freeSpinsSectionIds[1]]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const freeSpinWinningThree = await spin(sections[freeSpinsSectionIds[2]]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    freeSpinsTotalWinnings =
          freeSpinWinningOne + freeSpinWinningTwo + freeSpinWinningThree;

    togglePopup(popup, freeSpinsTotalWinnings);
};

// const btn = document.querySelector(".spinner__btn");

// const toggleSpinBtn = () => {
//     btn.toggleAttribute("disabled")
// }

const togglePopup = (popup, win) => {
    if (win) {
        popup.querySelector('.popup__text').textContent = `You won ${win}!`;
    }
    popup.classList.toggle('popup--hidden');
}

const popup = document.querySelector('.popup');
let currentTenNumbers = nextTenNumbers();

popup.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup__close')) {
        togglePopup(popup);
    }
});

const spinBtn = document.querySelector(".spinner__btn");
spinBtn.addEventListener('click', async () => {
    spinBtn.classList.toggle('spinner__btn--disabled');
    currentTenNumbers = currentTenNumbers.filter((section) => !section.picked);
        
    if (currentTenNumbers.length === 0) {
        currentTenNumbers = nextTenNumbers();
    }

    currentTenNumbers[0].picked = true;
    console.log(currentTenNumbers);
    // spin(currentTenNumbers[0]);
    if (currentTenNumbers[0].value === "Free spins") {
        await spin(currentTenNumbers[0]);
        await handleFreeSpins();
    } else {
        const winning = await spin(currentTenNumbers[0]);
        togglePopup(popup, winning);
    }
        spinBtn.classList.toggle('spinner__btn--disabled');
});

// TODO: 
// handle number rotation bug
// cleanup and optimization
// addiotional testing