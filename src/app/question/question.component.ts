import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name: string="";
  public questionList : any = [];
  public currentQuestion:number = 0;
  public points:number = 0;
  counter = 60;
  correctAnswer:number = 0;
  inCorrectAnswer:number= 0;
  interval$:any;
  progress:string="0";
  isQuizCompleted : boolean = false;
  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

getAllQuestions() {
  this.questionService.getQuestionJson()
  .subscribe(res=>{
    this.questionList = res.questions;
  })
}

  nexQuestion() {
    this.currentQuestion++;
  }
  prviousQuestion() {
    this.currentQuestion--;
  }

// Correct and Wrong Question
  answer(currentQno:number,option:any){
    if(currentQno == this.questionList.length){  // Display the result after the quiz is finished
      this.isQuizCompleted = true;
      this.stopCounter();  
    }
    if(option.correct){
      this.points = this.points + 10
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      
    } else{
      this.points = this.points - 10;
        setTimeout(() => {
          this.inCorrectAnswer++;
          this.currentQuestion++;
          this.resetCounter();
          this.getProgressPercent();
        }, 1000);
    }
  }

// Timer
  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=60;
        this.points = this.points - 10;
      }
  });
  setTimeout(() => {
    this.interval$.unsubscribe()
  }, 600000);
}

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuix(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
    this.progress="0";
  }

  //Progress bar
  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

}
