import React from "react";
import { useEffect, useState, Fragment } from "react";
import Axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import QuestionBox from "./QuestionBox";

var year = new Date();
year = year.getFullYear();

function AttemptQuiz(props) {
  const [state, setState] = useState("live");
  const isLoggedIn = props.loggedIn;
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [response, setResponse] = useState(0);
  const [allQues, setQues] = useState([]);
  const [a, setA] = useState([]);
  const params = useParams();
  var s = 0;

  const submitHandler = async () => {
    if (response === a.length) {
      setState("done");

      await Axios.post(
        "http://localhost:3001/updateUserQuizzesCompleted/" + params.id,
        {
          quizId: params.id2,
          marksScored: score,
        }
      );
    }
  };

  const computedAnswer = (answer, correct) => {
    console.log(answer, correct);
    if (answer === correct) {
      s++;
      setScore(score + 1);
    }
    setResponse(response + 1);
  };
  useEffect(() => {
    Axios.get("http://localhost:3001/getAllQuizzes").then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i]._id === params.id2) {
          setQues(response.data[i]);
          setA(response.data[i].allQuestions);
          break;
        }
      }

      //WE ARE GETTING ALL OF OUR QUIZZES IN response
    });
  }, []);
  const q = Object.values(allQues);
  if (true) {
    return (
      <div>
        <header>
          <h1 onMouseDown={() => navigate("/homepage/")}>Quizzler</h1>
        </header>

        <div className="AttemptPage">
          <div className="AttemptQuizTitle">
            <h1>{allQues.title}</h1>
          </div>
          <h4>
            <div>
              {state === "live" && (
                <div>
                  {a.map((q) => (
                    <div className="QuestionContainer">
                      <QuestionBox
                        question={q.Question}
                        option1={q.option1}
                        option2={q.option2}
                        option3={q.option3}
                        option4={q.option4}
                        selected={(answer) => computedAnswer(answer, q.Answer)}
                      />
                    </div>
                  ))}
                  <div className="AttemptSubmit">
                    <button className="SubmitButton" onClick={submitHandler}>
                      {" "}
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {response === a.length && state === "done" ? (
                <h1>
                  <div className="QuestionContainer">
                    <div className="AttemptQuizTitle">
                  Your score is - {score} / {a.length}
                  
                  </div>
                  <div className="AttemptQuizTitle">
                  <button 
                    onClick={()=>{
                      navigate("/homepage/" + params.id)
                    }}
                    >Go To Home</button>
                  </div>
                  
                  </div>
                </h1>
              ) : null}
            </div>
          </h4>
        </div>
        <footer className="AttemptFooter">
          <p> Copyright© {year} </p>{" "}
        </footer>
      </div>
    );
  }
  // navigate("/login");   NAVIGATE IS NOT WORKING!??
}

export default AttemptQuiz;
