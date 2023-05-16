/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name = _csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Sports Scheduler Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {
      console.log("Started an Express application at port 3000");
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up as admin", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstname: "Test",
      lastname: "User 1",
      email: "user.1@test.com",
      password: "12345678",
      role: "admin",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Sign up as player", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstname: "Test",
      lastname: "User 2",
      email: "user.2@test.com",
      password: "12345678",
      role: "player",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/admin");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/admin");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a sport", async () => {
    const agent = request.agent(server);
    await login(agent, "user.1@test.com", "12345678");
    const res = await agent.get("/createsport");
    const csrfToken = extractCsrfToken(res);
    const response1 = await agent.post("/createsport").send({
      sport: "cricket",
      _csrf: csrfToken,
    });
    expect(response1.statusCode).toBe(200);
    const response2 = await agent.post("/createsport").send({
      sport: "Tennis",
      _csrf: csrfToken,
    });
    expect(response2.statusCode).toBe(200);
  });

  test("create a session", async () => {
    const agent = request.agent(server);
    await login(agent, "user.1@test.com", "12345678");
    let res = await agent.get("/createsession/1");
    let csrfToken = extractCsrfToken(res);
    let today = new Date("2023-10-24");

    console.log("Date: ", today);
    const createsesion = await agent.post("/createsession").send({
      sportname: 1,
      dateTime: today,
      address: "test",
      playername: "test,test",
      noPlayer: 4,
      sessioncreated: true,
      // eslint-disable-next-line quote-props
      _csrf: csrfToken,
    });
    console.log(createsesion.text);
    const groupedsessionResponse = await agent
      .get("/session")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedsessionResponse.text);
    console.log(parsedGroupedResponse);
    const sessions = parsedGroupedResponse.allSessions.length;

    expect(sessions).toBe(1);
  });

  // test("delete a sport", async () => {
  //   const agent = request.agent(server);
  //   await login(agent, "user.1@test.com", "12345678");
  //   const res = await agent.get('/sportsession/1');
  //   let res1 = await agent.get('/admin').set("Accept", "application/json");
  //   const csrfToken = extractCsrfToken(res);
  //   console.log('allSports: ',res1);
  //   const groupedResponse = JSON.parse(res1.text);
  //   const sportId = groupedResponse.allSports[0].id;
  //   const response = await agent.delete(`/sportsession`).send({
  //     sport: 'cricket',
  //     id : 1,
  //     _csrf : csrfToken
  //   });
  //    res1 = await agent.get('/admin').set("Accept", "application/json");
  //   console.log('allSports: ',res1.text);
  //   console.log('response: \n',response);
  //   expect(response.statusCode).toBe(200);
  // });

  //   test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //     // FILL IN YOUR CODE HERE
  //     const agent = request.agent(server);
  //     // eslint-disable-next-line no-undef
  //     await login(agent, "user.1@test.com", "12345678");
  //     let res = await agent.get("/todos");
  //     let csrfToken = extractCsrfToken(res);
  //     await agent.post("/todos").send({
  //         title: "Go to market",
  //         dueDate: new Date().toISOString(),
  //         completed: false,
  //         "_csrf" : csrfToken,
  //       });

  //       const groupedTodosResponse = await agent
  //       .get("/todos")
  //       .set("Accept", "application/json");
  //       const parsedResponse = JSON.parse(groupedTodosResponse.text);
  //       const todoID = parsedResponse.allTodos[0].id;

  //       const deleteTodoResponse = await agent.delete(`/todos/${todoID}`).send({
  //         "_csrf" : csrfToken,
  //       });
  //       const parsedDeleteResponse = JSON.parse(deleteTodoResponse.text);

  //       expect(parsedDeleteResponse).toBe(true);
  //   });

  //   test("To verify usera cannot update or delete userb's todo list",async () =>{
  //     const userA = request.agent(server);
  //     await login(userA, "user.1@test.com", "12345678");
  //     let res = await userA.get("/todos");
  //     let csrfToken = extractCsrfToken(res);
  //     await userA.post("/todos").send({
  //       title: "first user todo",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //       _csrf: csrfToken,
  //     });
  //     await userA.post("/todos").send({
  //       title: "first user todo2",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //       _csrf: csrfToken,
  //     });

  //     let groupedTodosResponse = await userA
  //       .get("/todos")
  //       .set("Accept", "application/json");
  //     let parsedGroupedResponseuserA = JSON.parse(groupedTodosResponse.text);
  //     let dueTodayCount = parsedGroupedResponseuserA.dueToday.length;
  //     const firstUserLatestTodo = parsedGroupedResponseuserA.dueToday[dueTodayCount - 1];
  //     const updateResponse = await userA.put(`/todos/${firstUserLatestTodo.id}`).send({
  //       _csrf : csrfToken,
  //       completed: false});
  //      await userA.delete(`/todos/${firstUserLatestTodo.id}`).send({
  //         _csrf : csrfToken,
  //         completed: false});
  //      groupedTodosResponse = await userA
  //         .get("/todos")
  //         .set("Accept", "application/json");
  //         parsedGroupedResponseuserA = JSON.parse(groupedTodosResponse.text);
  //     dueTodayCount = parsedGroupedResponseuserA.dueToday.length;
  //     const parsedupdateResponseuserA = JSON.parse(updateResponse.text);
  //     //const parseddeleteResponseuserA = JSON.parse(deleteResponse.text);
  //     const userB = request.agent(server);
  //     await login(userB, "user.2@test.com", "12345678");

  //     res = await userB.get("/todos");
  //     csrfToken = extractCsrfToken(res);
  //       await userB.post("/todos").send({
  //         title: "userB todo",
  //         dueDate: new Date().toISOString(),
  //         completed: false,
  //         _csrf: csrfToken,
  //       });
  //       await userB.post("/todos").send({
  //         title: "userB todo2",
  //         dueDate: new Date().toISOString(),
  //         completed: false,
  //         _csrf: csrfToken,
  //       });
  //       const groupedTodosResponseuserB = await userB
  //       .get("/todos")
  //       .set("Accept", "application/json");
  //     const parsedGroupedResponseuserB = JSON.parse(groupedTodosResponseuserB.text);
  //     const dueTodayCountuserB = parsedGroupedResponseuserB.dueToday.length;
  //     const UserBLatestTodo = parsedGroupedResponseuserB.dueToday[dueTodayCountuserB - 1];
  //     expect(dueTodayCount).toBe(3);
  //     expect(dueTodayCountuserB).toBe(2);
  //     expect(parsedupdateResponseuserA.completed).toBe(true);
  //     expect(UserBLatestTodo.completed).toBe(false);

  //   });
});
