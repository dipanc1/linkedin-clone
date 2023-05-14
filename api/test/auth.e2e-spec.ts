import { HttpStatus } from "@nestjs/common";
import { User } from "../src/auth/models/user.class";
import * as jwt from "jsonwebtoken";
import * as request from "supertest";

describe("AuthController (e2e)", () => {
  const authUrl = `http://localhost:3000/api/auth`;

  const mockUser: User = {
    firstName: "firstName",
    lastName: "lastName",
    email: "email@emai.com",
    password: "password"
  };

  describe("/auth/register (POST)", () => {
    it("it should register a user and return the new user object", () => {
      return request(authUrl)
        .post("/register")
        .set("Accept", "application/json")
        .send(mockUser)
        .expect((response: request.Response) => {
          const { firstName, lastName, password, email, imagePath, role, id } =
            response.body;

          expect(typeof id).toBe("number"),
            expect(firstName).toBe(mockUser.firstName),
            expect(lastName).toBe(mockUser.lastName),
            expect(email).toBe(mockUser.email),
            expect(password).toBeUndefined(),
            expect(imagePath).toBeNull(),
            expect(role).toEqual("user");
        })
        .expect(HttpStatus.CREATED);
    });

    it("it should not register a user the passes email already exists", () => {
      return request(authUrl)
        .post("/register")
        .set("Accept", "application/json")
        .send(mockUser)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("it should not log in nor return a JWT for an unregistered user", () => {
      return request(authUrl)
        .post("/login")
        .set("Accept", "application/json")
        .send({ email: "email@email.com", password: "password" })
        .expect((response: request.Response) => {
          const { token }: { token: string } = response.body;

          expect(token).toBeUndefined();
        })
        .expect(HttpStatus.FORBIDDEN);
    });

    it("it should log in and return a JWT for a registered user", () => {
      return request(authUrl)
        .post("/login")
        .set("Accept", "application/json")
        .send(mockUser)
        .expect((response: request.Response) => {
          const { token }: { token: string } = response.body;

          expect(jwt.verify(token, "jwtsecret")).toBeTruthy();
        })
        .expect(HttpStatus.OK);
    });
  });
});
