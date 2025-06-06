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
];

// 10 x 3 <------ this will happend 3 times
// 15 x 3 <------ this will happend 2 times
// 20 x 3
// 25 x 3
// 30 x 3
// 50 x 1
// 100 x 1
// fs x 1 <----- this will trigger spins

const wheel = document.querySelector(".spinner__sections");
const popup = document.querySelector(".popup");
const spinBtn = document.querySelector(".spinner__btn");
const transitionSettings = "transform 5s cubic-bezier(0,0,0,1.15)"
const numberOfWheelFullCircles = 5;

// Helpers
const randomNumbersInRange = (countOfNumbers, range) => {
  const numbers = [];
  while (numbers.length < countOfNumbers) {
    const randomNumber = Math.floor(Math.random() * range);
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
};

const rotationByDegrees = (degrees) => {
  wheel.style.transform = `rotate(${degrees}deg)`;
  wheel.style.transition = transitionSettings;
};

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

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

// Main methods
const spin = async (section, delay) => {
  const totalRotationDegrees = 360 * numberOfWheelFullCircles + section.degreePosition;

  wheel.style.removeProperty("transform");
  wheel.style.removeProperty("transition");

  return new Promise((resolve) => {
    const onTransitionEnd = () => {
      wheel.removeEventListener("transitionend", onTransitionEnd);
      resolve(section.value);
    };

    wheel.addEventListener("transitionend", onTransitionEnd);

    // Set the rotation after a short delay to ensure the transition is applied
    setTimeout(
      () => {
        rotationByDegrees(totalRotationDegrees);
      },
      delay ? delay : 50
    );
  });
};

const nextTenNumbersGenerator = () => {
  sections = sections.map((section) => ({ ...section, picked: false })); // Reset picked state

  const tenValueSections = sections.filter((section) => section.value === 10);
  const fifteenValueSections = sections
    .filter((section) => section.value === 15)
    .splice(0, 2);
  const otherSections = sections.filter(
    (section) => section.value !== 10 && section.value !== 15
  );
  const fiveOtherSections = shuffleListOfNumbers(otherSections).slice(0, 5);

  let nextTenNumbersToStopAt = [
    ...tenValueSections,
    ...fifteenValueSections,
    ...fiveOtherSections,
  ];

  do {
    nextTenNumbersToStopAt = shuffleListOfNumbers(nextTenNumbersToStopAt);
  } while (!areNumbersRepeating(nextTenNumbersToStopAt));

  return nextTenNumbersToStopAt;
};

// Handlers
const freeSpinsHandler = async () => {
  const freeSpinsSectionIds = randomNumbersInRange(3, sections.length - 1);
  let freeSpinsTotalWinnings = 0;

  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  const freeSpinWinningOne = await spin(sections[freeSpinsSectionIds[0]]);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const freeSpinWinningTwo = await spin(sections[freeSpinsSectionIds[1]]);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const freeSpinWinningThree = await spin(sections[freeSpinsSectionIds[2]]);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  freeSpinsTotalWinnings =
    freeSpinWinningOne + freeSpinWinningTwo + freeSpinWinningThree;

  togglePopupHandler(popup, freeSpinsTotalWinnings);
};

const togglePopupHandler = (popup, win, isShown) => {
  if (win && !isShown) {
    popup.querySelector(".popup__text").textContent = `You won ${win}!`;
    popup.classList.remove("popup--hidden");
  } else {
    popup.classList.add("popup--hidden");
  }
};

const closePopupBtnHandler = (e) => {
  if (e.target.classList.contains("popup__close")) {
    togglePopupHandler(popup, null, true);
  }
};

const closeOnEscapeHandler = (e) => {
  if (e.key === "Escape") {
    togglePopupHandler(popup, null, true);
  }
};

// Events
popup.addEventListener("click", closePopupBtnHandler);
document.addEventListener("keydown", closeOnEscapeHandler);
let currentTenNumbers = nextTenNumbersGenerator();
spinBtn.addEventListener("click", async () => {
  spinBtn.classList.toggle("spinner__btn--disabled");
  currentTenNumbers = currentTenNumbers.filter((section) => !section.picked);

  if (currentTenNumbers.length === 0) {
    currentTenNumbers = nextTenNumbersGenerator();
  }

  currentTenNumbers[0].picked = true;
  console.log(currentTenNumbers);

  if (currentTenNumbers[0].value === "Free spins") {
    await spin(currentTenNumbers[0]);
    wheel.classList.toggle("spinner--fs");
    await freeSpinsHandler();
    wheel.classList.toggle("spinner--fs");
  } else {
    const winning = await spin(currentTenNumbers[0]);
    togglePopupHandler(popup, winning, false);
  }

  spinBtn.classList.toggle("spinner__btn--disabled");
});