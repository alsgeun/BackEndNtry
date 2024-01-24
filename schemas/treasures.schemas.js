import mongoose from "mongoose";

const myTrea = new mongoose.Schema({
    goods : {           // 애장품 지칭
        type : String,  // 애장품 이름의 타입
        required : true, // 이름은 당연히 있어야지
    },
    number : {         // 상품코드 느낌
        type: Number,   // 애장품 코드 같은 느낌으로
        required : true,    // false로 할까 했지만 옷,상품에 상품코드는 다 있으니까..
    },
    registration : {    
        type : Date,          // 등록 날짜
        required : false,   // 없으면 null, 있으면 date가 표시 될 거라 없어도 됨
    },
    state : {           // 애장품 판매여부
        type : Boolean,      // true면 판매, false면 재고있음
        required : true,    // 등록한 이상 판매 여부는 필수지
        default : true    
    },
});

export default mongoose.model("myTrea", myTrea);    // 스키마가 담긴 myTrea 모델 수출