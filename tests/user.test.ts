import UsersService from "~/services/UsersService.server";
import { prisma } from "~/db.server";
import { beforeAll, expect } from "vitest";
import { URL_API } from "~/constants";

beforeAll(async () => {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.user.deleteMany();
});

describe("utilisateur", () => {
  it("UsersService.create", async () => {
    const data = {
      username: "demo4",
      email: "demo4@email.fr",
      firstname: "demo",
      password: "123",
    };
    const user = await UsersService.create(data);

    expect(user.username).toBe(data.username);
  });

  it("api/account SUCCESS", async () => {
    const data = {
      username: "demo1",
      email: "demo1@email.fr",
      firstname: "demo1",
      password: "123",
    };
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("firstname", data.firstname);
    formData.append("password", data.password);

    const response = await fetch(URL_API + "/account", {
      body: formData,
      method: "POST",
    });
    const { success, data: user } = await response.json();

    expect(success).toBe(true);
    expect(user.username).toBe(data.username);
  });

  it("api/account FAIL USERNAME", async () => {
    const data = {
      username: "demo1",
      email: "demo3@email.fr",
      firstname: "demo3",
      password: "123",
    };

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("firstname", data.firstname);
    formData.append("password", data.password);

    const response = await fetch(URL_API + "/account", {
      body: formData,
      method: "POST",
    });
    const { success } = await response.json();
    expect(success).toBe(false);
  });

  it("api/account FAIL EMAIL", async () => {
    const data = {
      username: "demo2",
      email: "demo1@email.fr",
      firstname: "demo2",
      password: "123",
    };

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("firstname", data.firstname);
    formData.append("password", data.password);

    const response = await fetch(URL_API + "/account", {
      body: formData,
      method: "POST",
    });
    const { success } = await response.json();
    expect(success).toBe(false);
  });

  it("api/token SUCCESS", async () => {
    const data = {
      email: "demo1@email.fr",
      password: "123",
    };

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await fetch(URL_API + "/token", {
      body: formData,
      method: "POST",
    });
    const { success } = await response.json();
    expect(success).toBe(true);
  });

  it("api/token FAIL EMAIL", async () => {
    const data = {
      email: "no-exist@email.fr",
      password: "123",
    };

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await fetch(URL_API + "/token", {
      body: formData,
      method: "POST",
    });
    const { success } = await response.json();
    expect(success).toBe(false);
  });

  it("api/token FAIL PASSWORD", async () => {
    const data = {
      email: "demo1@email.fr",
      password: "345",
    };

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await fetch(URL_API + "/token", {
      body: formData,
      method: "POST",
    });
    const { success } = await response.json();
    expect(success).toBe(false);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
