let LessonTitle = document.querySelector(".lesson .title span");
let unitslist = document.createElement("ul");
let New_words = document.querySelector(".words");
let explanation = document.querySelector(".explain");
let sider = document.querySelector(".sider");
let sider_title = document.querySelector(".sider h2");
sider.appendChild(unitslist);
sider_title.onclick = function () {
  sider.classList.toggle("selected");
};

let selected_lesson;
function getLessonsInfo() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.status === 200 && request.readyState === 4) {
      let myRequest = JSON.parse(this.responseText);
      /* create list of units */
      for (let i = 0; i < myRequest.length; i++) {
        let arrow = document.createElement("i");
        arrow.classList.add("fa-solid", "fa-chevron-down", "arrow");
        let newli = document.createElement("li");
        newli.innerHTML = `الوحدة ${i + 1}`;
        newli.appendChild(arrow);
        newli.className = "unit";
        unitslist.appendChild(
          newli
        ); /* ul contains li each of them is a unit */
        document.addEventListener("click", (e) => {
          if (e.target == arrow) {
            let lessonsList = newli.querySelector(".lessons-list");
            lessonsList.classList.toggle("selected");

            if (arrow.classList.contains("fa-chevron-down")) {
              arrow.classList.remove("fa-chevron-down");
              arrow.classList.add("fa-chevron-up");
            } else {
              arrow.classList.add("fa-chevron-down");
              arrow.classList.remove("fa-chevron-up");
            }
          }
        });
      }
      /* create list of units */

      /* create units lessons */

      for (let i = 0; i < unitslist.childElementCount; i++) {
        /* loop on units */
        let lessonsList = document.createElement("ul");
        unitsLessonsCount = Object.keys(
          myRequest[i]
        ).length; /* lessons count in each unit  */
        lessonsList.className = "lessons-list";
        for (let j = 1; j <= unitsLessonsCount; j++) {
          /* loop on lessons  */
          let lesson = document.createElement("li");
          lesson.innerHTML = myRequest[i][`lesson-${j}`].title;
          lessonsList.appendChild(lesson);
          unitslist.children[i].appendChild(
            lessonsList
          ); /* ul contains li each of them is a lesson */
        }
      }
      /* create units lessons */

      let call_lessons = document.querySelectorAll(".lessons-list li");
      /*review  selected unit  lessons*/

      call_lessons[0].classList.add("selected");
      if (call_lessons[0].classList.contains("selected")) {
        LessonTitle.innerHTML = call_lessons[0].innerHTML;

        for (let i = 0; i < myRequest[0][`lesson-${1}`].Words.length; i++) {
          let words_spans = document.createElement("span");
          words_spans.innerHTML = myRequest[0][`lesson-${1}`].Words[i];
          New_words.appendChild(words_spans);
          explanation.innerHTML = myRequest[0][`lesson-${1}`].explain;
        }
      }

      let lessonsList = document.querySelectorAll(".lessons-list");
      Array.from(unitslist.children).forEach((e, index) => {
        let currentUnit = myRequest[index];
        let lengthOfCurrentUnit = Object.keys(currentUnit).length;

        for (let i = 0; i < lengthOfCurrentUnit; i++) {
          lessonsList[index].children[i].onclick = function () {
            /* add and remove selected class */
            lessonsList.forEach((e) => {
              for (let i = 0; i < e.childElementCount; i++) {
                e.children[i].classList.remove("selected");
              }
            });

            lessonsList[index].children[i].classList.add("selected");

            /* add and remove selected class */
            LessonTitle.innerHTML =
              lessonsList[index].children[i].innerHTML; /* set lesson title */

            /*  create and set lesson span  */

            if (New_words.childElementCount !== 0) {
              Array.from(New_words.children).forEach((e) => {
                New_words.removeChild(e);
              });
            }

            for (
              let j = 0;
              j < currentUnit[`lesson-${i + 1}`].Words.length;
              j++
            ) {
              //    console.log(currentUnit[`lesson-${i+1}`].Words.length)

              let words_spans = document.createElement("span");
              words_spans.innerHTML = currentUnit[`lesson-${i + 1}`].Words[j];
              New_words.appendChild(words_spans);
            }
            /* create and set  lesson span */

            explanation.innerHTML = currentUnit[`lesson-${i + 1}`].explain;
            /* set lesson explain */
            let allexcersises = explanation
              .querySelectorAll(" .exercise")
              .forEach((e) => {
                let answer = e.querySelector(" .exercise input");
                let correctAnswer = e.querySelector(" .exercise span");
                answer.onblur = function () {
                  if (
                    ignore_spaces(answer.value) ===
                    ignore_spaces(correctAnswer.textContent)
                  ) {
                    console.log("correct");
                    answer.setAttribute("readonly", "readonly");
                    answer.style = `color: white;
    background-color: #009688 !important;
    text-align: center;
    border-radius: 5px;`;
                  } else {
                    console.log(ignore_spaces(answer.value));
                    console.log(ignore_spaces(correctAnswer.textContent));
                    answer.value = "";
                  }
                };
              });
          };
        }
      });
    }
  };
  request.open("GET", "lessons.json");
  request.send();
}
getLessonsInfo();

function ignore_spaces(element) {
  let array = Array.from(element);
  let newarray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] != " ") {
      newarray.push(array[i].toLowerCase());
    }
  }
  return newarray.join("");
}
