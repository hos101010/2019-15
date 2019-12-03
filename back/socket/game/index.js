const { RoomManager } = require('../Room');
const { personEnterSecretRoom, sendUserListToRoom, isExistRoom } = require('./game');
const getRandomInt = require('../../util/getRandomInt');
const exitRoom = require('./exitRoom');
const sendGameImage = require('./gameImage');
const enterRandom = require('./enterRandom');
const { sendMessage } = require('./message');

function setGameSocket(socket) {
  this.RoomManager = RoomManager;
  const roomInfo = {};
  const gameSocket = socket;

  socket.on('enterRandom', ({ nickname, roomType }) => {
    roomInfo.roomType = roomType;
    roomInfo.roomId = RoomManager.getEnableRoomId(roomType);
  });

  socket.on('makeSecret', ({ nickname, roomId }) => {
    personEnterSecretRoom(nickname, gameSocket, roomId, this.gameIo);
    roomInfo.roomId = roomId;
    roomInfo.roomType = '비밀방';
  });

  socket.on('startSecretGame', ({ roomId, roomType }) => {
    // 난입 시나리오 추가해야됨
    const room = RoomManager.room[roomType][roomId];
    if (room.players.length >= 2) {
      this.gameIo.to(roomId).emit('startSecretGame', { painter: room.players[0].socket.id });
    }
  });

  // socket.on('sendMessage', ({ socketId, roomType, roomId, inputValue }) => {
  //   let answer;
  //   try {
  //     answer = RoomManager.room[roomType][roomId].word;
  //   } catch {
  //     answer = null;
  //   }
  //   RoomManager.room[roomType][roomId].players.findIndex((user) => {
  //     if (user.socket.id === socketId) {
  //       if (inputValue === answer && !user.privileged) {
  //         user.privileged = true;
  //         this.gameIo.in(roomId).emit('getMessage', {
  //           content: `${user.nickname}님이 정답을 맞췄습니다! Hooray`,
  //           privileged: 'notice',
  //         });
  //       } else {
  //         this.gameIo.in(roomId).emit('getMessage', {
  //           content: `${user.nickname} : ${inputValue}`,
  //           privileged: user.privileged,
  //         });
  //       }
  //     }
  //   });
  // });

  socket.on('selectWord', ({ answer, roomType, roomId }) => {
    const room = RoomManager.room[roomType][roomId];
    room.word = answer;
    // 서버 타이머 트리거
    room.timer.start();
    // 클라들에게 뿌려주기
    const openIndex = getRandomInt(0, answer.length);
    this.gameIo.in(roomId).emit('startQuestion', {
      wordLength: answer.length,
      openLetter: answer[openIndex],
      openIndex,
    });
  });

  // 출제자가 캔버스에 그림을 그리는 경우.
  socket.on('drawing', ({ roomId }) => {
    // 출제자를 제외한 참가자들에게 캔버스 정보를 전송
    this.gameIo.to(roomId).emit('drawing');
  });

  socket.on('sendMessage', sendMessage.bind(this, gameSocket));
  socket.on('enterRandom', enterRandom.bind(this, gameSocket, roomInfo));
  socket.on('gameImage', sendGameImage.bind(this, gameSocket));
  socket.on('exitRoom', exitRoom.bind(this, gameSocket));
  socket.on('disconnect', () => {
    if (!roomInfo) return;
    if (!isExistRoom(roomInfo)) return;

    const { roomType, roomId } = roomInfo;
    const userList = RoomManager.room[roomType][roomId].players;
    const userIdx = userList.findIndex((user) => user.socket.id === gameSocket.id);
    if (userIdx >= 0) {
      userList.splice(userIdx, 1);
      sendUserListToRoom(userList, roomId, this.gameIo);
      gameSocket.leave();
    }
  });
}
module.exports = setGameSocket;
