const request = require("supertest");
const server = "http://localhost:4000";
const axios = require("axios");

const generateUser = () => {
  return axios
    .get("https://random-data-api.com/api/users/random_user")
    .then((response) => response.data);
};

const postRequestToApi = (route, body) => {
  return request(server).post(route).send(body);
};

describe("POST /auth/register", () => {
  describe("given a username, password and email on register", () => {
    it("should create test user", async () => {
      const response = await postRequestToApi("/auth/register", {
        username: "test",
        password: "testPass",
        email: "test@gmail.com",
      });
      expect(response.status).toBe(200);
    });
    it("should return with a status code 200", async () => {
      const { username, password, email } = await generateUser();
      const response = await postRequestToApi("/auth/register", {
        username: username,
        password: password,
        email: email,
      });
      expect(response.status).toBe(200);
    });
    it("should return with a status code 409 if username or email is taken", async () => {
      const bodyData = [
        { username: "test", password: "testPass", email: "test24@gmail.com" },
        { username: "test24", password: "testPass", email: "test@gmail.com" },
      ];
      for (const body of bodyData) {
        const response = await postRequestToApi("/auth/register", body);
        expect(response.status).toBe(409);
      }
    });
    it("should specify json in the content type header", async () => {
      const { username, password, email } = await generateUser();
      const response = await postRequestToApi("/auth/register", {
        username: username,
        password: password,
        email: email,
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    it("the response body should return token", async () => {
      const { username, password, email } = await generateUser();
      const response = await postRequestToApi("/auth/register", {
        username: username,
        password: password,
        email: email,
      });
      expect(response.body.token).toBeDefined();
    });
  });
  describe("when the username, password or email is missing on register", () => {
    it("should respond with status code 400", async () => {
      const bodyData = [
        { username: "username" },
        { password: "password" },
        { email: "email" },
        {},
      ];
      for (const body of bodyData) {
        const response = await postRequestToApi("/auth/register", body);
        expect(response.status).toBe(400);
      }
    });
  });
});

describe("POST /auth/login", () => {
  describe("given a username and password", () => {
    it("should expect status code 200 on success", async () => {
      const response = await postRequestToApi("/auth/login", {
        username: "test",
        password: "testPass",
      });
      expect(response.status).toBe(200);
    });
    it("should specify json in the content type header", async () => {
      const response = await postRequestToApi("/auth/login", {
        username: "test",
        password: "testPass",
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    it("should expect token in response body on success", async () => {
      const response = await postRequestToApi("/auth/login", {
        username: "test",
        password: "testPass",
      });
      expect(response.body.token).toBeDefined();
    });
    it("should expect status code 401 on bad credentials", async () => {
      const response = await postRequestToApi("/auth/login", {
        username: "test",
        password: "wrong",
      });
      expect(response.status).toBe(401);
    });
  });
  describe("when username or password is missing", () => {
    it("should return status code 400", async () => {
      const bodyData = [{ username: "joseph" }, { password: "password" }, {}];
      for (const body of bodyData) {
        const response = await postRequestToApi("/auth/login", body);
        expect(response.status).toBe(400);
      }
    });
  });
});
