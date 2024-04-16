// -_- Simon K

// Custom Cursor
let cursor = document.querySelector('.cursor');

//
function mouseMover() {
  document.body.onmousemove = function (e) {
    document.documentElement.style.setProperty(
      '--x',
      e.clientX + window.scrollX + 'px'
    );
    document.documentElement.style.setProperty(
      '--y',
      e.clientY + window.scrollY + 'px'
    );
    cursor.style.opacity = '1';
  };

  document.addEventListener('mousedown', function () {
    bounce();
  });

  function bounce() {
    cursor.style.transform = 'scale(2.5)';
    setTimeout(function () {
      cursor.style.transform = 'scale(1)';
    }, 200);
  }

  let hoverAble = document.querySelectorAll('.hoverAble');

  hoverAble.forEach((hoverAble) => {
    hoverAble.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(8)';
    });
    hoverAble.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
    });
  });
}

document.addEventListener('scroll', () => {
  cursor.style.opacity = '0';
});

mouseMover();

//Custom cursor end

//Active links line-through

let navlinks = document.querySelectorAll('.navlink');

navlinks.forEach((navlink) => {
  navlink.addEventListener(
    'click',
    () => {
      if (document.querySelector('.activeLink')) {
        document.querySelector('.activeLink').classList.remove('activeLink');
      }
      navlink.classList.add('activeLink');
    },
    false
  );
});
//Active links line-through end

if (document.querySelector('.apiSite')) {
  // Weather API
  let getLocationData = async (api, input) => {
    let apiKey = 'appid=e99cd3f101bbfc2a35e43d850f288eab';
    console.log(api + input + '&limit=5&' + apiKey);

    let response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=e99cd3f101bbfc2a35e43d850f288eab`
    );

    console.log(response.data);
    let lat = response.data[0].lat;
    let lon = response.data[0].lon;
    let cityWeahter = await getWeatherData(lat, lon, apiKey);
    return cityWeahter;
  };

  let getWeatherData = async (lat, lon, apiKey) => {
    let response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${apiKey}`
    );
    return response.data;
  };

  let weatherApi = 'http://api.openweathermap.org/geo/1.0/direct?';
  let weatherInput = document.querySelector('#searchCity');

  weatherInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      document.querySelector('.weatherInfo').innerHTML = '';
      if (isNaN(weatherInput.value)) {
        console.log('you may enter');
        let cityWeather = await getLocationData(weatherApi, weatherInput.value);
        renderWeather(cityWeather);
        weatherInput.value = '';
      } else {
        console.log('well its empty?');
      }
    }
  });

  let renderWeather = (cityWeather) => {
    document.querySelector('#weatherApi').removeAttribute('style');
    document.querySelector('.weatherInfo').innerHTML = '';

    console.log(cityWeather);
    let cityName = document.createElement('h3');
    cityName.innerText = cityWeather.name;

    let temperature = document.createElement('p');
    temperature.innerText =
      Math.round(cityWeather.main.temp - 273.15) + ' celsius';

    let temperatureFeel = document.createElement('p');
    temperatureFeel.innerText =
      'Feels like: ' +
      Math.round(cityWeather.main.feels_like - 273.15) +
      ' celsius';

    let weatherSky = document.createElement('p');
    weatherSky.innerText = cityWeather.weather[0].description;

    let weatherIcon = document.querySelector('.weatherIcon');
    if (!weatherIcon) {
      weatherIcon = document.createElement('div');
      weatherIcon.classList.add('weatherIcon');
      document.querySelector('#weatherApi').append(weatherIcon);
    }
    // weatherIcon.style.backgroundImage = 'url(images/png/Snow.PNG)';
    weatherIcon.style.backgroundImage = getWeatherIconURL(
      cityWeather.weather[0].main
    );

    document.querySelector('#weatherApi').style.background =
      'linear-gradient(315deg, rgba(63,150,252,1) 0%, rgba(33,42,164,1) 100%)';
    document.querySelector('#weatherApi').append(weatherIcon);
    document
      .querySelector('.weatherInfo')
      .append(cityName, weatherSky, temperature, temperatureFeel);
  };

  let getWeatherIconURL = (weather) => {
    console.log(weather);
    if (weather == 'Clouds') {
      return 'url(images/png/CloudSun.png)';
    } else if (weather == 'Clear') {
      return 'url(images/png/Sun.png)';
    } else if (weather == 'Broken clouds') {
      return 'url(images/png/CloudSun.png)';
    } else if (weather == 'Snow') {
      return 'url(images/png/Snow.png)';
    } else if (weather == 'Rain') {
      return 'url(images/png/Rain.png)';
    } else {
      return 'url(images/png/Lightning.png)';
    }
  };
  // Weather API END

  // QUIZ API

  let getQuizData = async () => {
    let response = await axios.get(
      'https://opentdb.com/api.php?amount=10&difficulty=hard'
    );
    return response.data.results;
  };

  let startQuiz = document.querySelector('.startQuiz');
  let score = 0;

  startQuiz.addEventListener('click', async () => {
    let counter = 0;
    //Add the quizDiv
    let quizArray = await getQuizData();
    let questionDiv = document.createElement('div');
    questionDiv.classList.add('questionDiv');
    console.log(quizArray);

    let nextQuestion = document.createElement('button');
    nextQuestion.innerText = 'Next Question';
    nextQuestion.classList.add('nextQuestion');
    nextQuestion.classList.add('hoverAble');
    nextQuestion.style.display = 'none';
    renderQuestion(quizArray, questionDiv, counter, nextQuestion);

    nextQuestion.addEventListener('click', () => {
      counter++;
      nextQuestion.style.display = 'none';

      renderQuestion(quizArray, questionDiv, counter, nextQuestion);
    });

    document.querySelector('#quizApi').append(questionDiv, nextQuestion);
  });

  let renderQuestion = (questions, questionDiv, counter, nextQuestion) => {
    if (counter < questions.length) {
      questionDiv.innerHTML = '';
      let questionNumber = document.createElement('h2');
      questionNumber.innerText = `#${counter + 1}`;
      let questionTopic = document.createElement('p');
      questionTopic.innerText = questions[counter].category;
      let question = document.createElement('p');
      question.innerText = questions[counter].question;

      let answers = questions[counter].incorrect_answers;
      answers.push(questions[counter].correct_answer);
      shuffle(answers);
      let options = document.createElement('div');
      options.classList.add('options');
      answers.forEach((answer) => {
        let option = document.createElement('input');
        option.type = 'radio';
        option.value = answer;
        option.name = 'answers';
        option.style.cursor = 'none';
        option.addEventListener('change', () => {
          if (option.value === questions[counter].correct_answer) {
            score++;
            option.parentElement.style.background = 'green';
            // Disable all radio buttons after a correct answer is selected
          } else {
            option.parentElement.style.background = 'red';
          }
          disableRadioButtons(options);
          nextQuestion.style.display = 'block';
        });
        let optionLabel = document.createElement('label');
        optionLabel.innerText = answer;
        optionLabel.for = answer;
        optionLabel.style.cursor = 'none';
        optionLabel.append(option);
        options.append(optionLabel);
      });
      console.log('Score:', score);
      questionDiv.append(questionNumber, questionTopic, question, options);
    } else {
      endQuiz(questionDiv, questions);
    }
  };

  function disableRadioButtons(options) {
    let radioButtons = options.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radioButton) => {
      radioButton.disabled = true;
    });
  }

  function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  let endQuiz = (questionDiv, questions) => {
    // remove the question div
    questionDiv.innerHTML = '';
    // add score div
    let scoreDiv = document.createElement('div');
    scoreDiv.classList.add('scoreDiv');

    let number = document.createElement('h2');
    number.innerText = score + ' / ' + questions.length;

    let result = document.createElement('p');
    result.innerText = 'Did you enjoy it?';
    // add resetBtn
    let resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset Quiz';
    resetBtn.classList.add('nextQuestion');

    resetBtn.addEventListener('click', () => {
      resetQuiz(questionDiv);
    });

    scoreDiv.append(number, result, resetBtn);
    questionDiv.append(scoreDiv);
  };

  let resetQuiz = (questionDiv) => {
    score = 0;
    questionDiv.remove();
  };
  // QUIZ API END

  // NASA API START
  let nasaBtn = document.querySelector('.nasaBtn');
  nasaBtn.addEventListener('click', () => {
    getNasaData(nasaBtn);
  });

  let getNasaData = async () => {
    let response = await axios.get(
      'https://api.nasa.gov/planetary/apod?api_key=LQvolbV5O7wOS8fHsEOGFat8ACvDqjswwdmsKHYy'
    );

    renderNasaImage(response.data, nasaBtn);
    console.log(response.data);
  };

  let renderNasaImage = (element, nasaBtn) => {
    document.getElementById('nasaApi').innerHTML = '';
    document.getElementById('nasaApi').style.background = `url(${element.url})`;
    document.getElementById('nasaApi').classList.add('hoverAble');
  };
  // NASA API END
}
