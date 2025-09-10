const express = require('express');

/*
  Routerの役割
    これはルートのまとまりを作るための機能である
    1つの大きなapp.jsに対して、機能ごとの小さな「ルート管理クラス」を作れる
    これにより、ファイルを分けて管理しやすくなる

　例) Routerを使う場合(ルートファイルを分けることで管理しやすい)
    app.js ---> routes/devices.js
           ---> routes/users.js
      Routerを使わない場合(app.jsにすべてルートを設定しないといけないためメンテナンスがしづらくなる)
    app.js
       - app.get('/api/devices');
       - app.get('/api/users);
 */
const router = express.Router();
const Device = require('../models/Device');

// GET /api/tasks
router.get('/', async(req, res) => {
    //Deviceデータベースをfind()ですべてのデータを取得
    const devices = await Device.find();

    //devicesをjson形式に変換してリクエスト先に返す
    res.json(devices);
});

// POST /api/tasks
router.post('/', async(req, res) => {
    const data = req.body;

    // nameが既存なら更新、なければ新規作成
    const existing = await Device.findOne({name: data.name});

    if(existing){
        //上書き保存(編集)
        await Device.updateOne({name: data.name}, data);
    }else{
        await Device.create(data);
    }

    res.status(200).json({message: '保存完了'});
});

module.exports = router;