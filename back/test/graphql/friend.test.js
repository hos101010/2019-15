const { req, graphqlPath } = require('./setSuperTest');

describe('friend resolvers test', () => {
  it(`get friends' nicknames using given user's id by joining friends/users tables`, async (done) => {
    const res = await req
      .post(graphqlPath)
      .send({
        query: `{
            friends(pFriendId:4){
                nickname
            }
        }`,
      })
      .expect(200);
    const friendsExpected = [
      { nickname: '이지영' },
      { nickname: '이창권' },
      { nickname: '손진아' },
    ];
    expect(res.body.data.friends).toStrictEqual(
      expect.arrayContaining(friendsExpected),
    );
    done();
  });
});