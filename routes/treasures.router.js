import express from 'express';
import myTrea from '../schemas/treasures.schemas.js';
import Joi from "joi";

const router = express.Router(); // 라우터 생성

const filteringTrea = Joi.object({
    goods: Joi.string().min(1).max(200).required(),
    image: Joi.string().required()
  });

// 애장품 등록 api
router.post('/treasures', async(req, res, next) => {
    try {
    const validation = await filteringTrea.validateAsync(req.body); // 데이터 검증
        
    const {goods, image} = validation;
    
    if (!goods) {
        return res.status(400).json({errorMessage: '애장품이 없습니다.'});
    }
    const treaMaxNumber = await myTrea.findOne().sort('-number').exec();    // 해당하는 마지막 number 조회
    const number = treaMaxNumber ? treaMaxNumber.number + 1 : 1;
    const treasures = new myTrea({goods, number, image});
    await treasures.save();     // DB에 저장
    
    return res.status(201).json({treasures: treasures});    // 애장품 등록 성공시 treasures 라는 곳에 treasures의 값 할당
    }   catch(error){           // 에러 발생시 이쪽으로 넘어옴
        console.error(error);
        if(error.name === 'ValidationError') {
            return res.status(400).json({errorMessage : error.message});
        }
        return res.status(500).json({errorMessage : '서버에서 발생했습니다.'});
    }
});

// 애장품 목록 등록 조회 api
router.get('/treasures', async(req, res, next) => {
    const trealist = await myTrea.find().sort('-number').exec();    // 애장품 목록 등록 조회
    return res.status(200).json({trealist});
})

// 애장품 순서 변경, 날짜, 해제, 내용변경 api
router.patch('/treasures/:treaId', async(req, res, next) => {
    const {treaId} = req.params;
    const {number, registration, goods,state, image} = req.body;

    const currentTrea = await myTrea.findById(treaId).exec();   // 애장품 정보 가져오기
    if (!currentTrea) {
        return res.status(404).json({errorMessage: '애장품이 없습니다.'});  // 애장품 정보가 없을 경우의 에러 메시지 출력
    }
    if (number) {
        const checkTrea = await myTrea.findOne({number}).exec();
        if (checkTrea) {
            checkTrea.number = currentTrea.number;  // 사용자의 값 변경
            await checkTrea.save();
        }
        currentTrea.number = number;    // 이거 역시 req.body에서 받아온 값으로 변경
    }
    if (registration !== undefined) {
        currentTrea.registration = registration ? new Date() : null;    // Date 라는 값은 비어 있어도 자동으로 생성(현재시간으로 설정)됨
    }
    if (goods) {
        currentTrea.goods = goods;  // currentTrea의 상품명은 전달받은 상품명으로 바꾼다.
    }
    if (state === true) {
        currentTrea.state = state ? true : sale;    // Boolean은 비어있으면 값이 없기 때문에 값을 설정해줘야함
    }
    if (image) {
        currentTrea.image = image;
    }
    await currentTrea.save();

    return res.status(200).json({});
});

router.delete('/treasures/:treaId', async(req, res, next) => {
    const {treaId} = req.params;
    
    const treasures = await myTrea.findById(treaId).exec();
    if (!treasures) {
        return res.status(404).json({errorMessage : '없는 상품 입니다.'});
    }

    await myTrea.deleteOne({_id: treaId});  // 삭제

    return res.status(200).json({});        // 완료
});

export default router;          // 라우터 수출