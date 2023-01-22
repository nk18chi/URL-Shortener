describe("top.cy.ts", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.intercept(
      {
        method: "POST",
        url: "/shorten-url*", // that have a URL that matches '/users/*'
      },
      { shortUrl: "http://localhost:4000/ca8ry" }
    ).as("shortenUrl");
  });
  it("should display a headline/input box/button", () => {
    cy.get("h1").contains("URL Shortener");
  });
  it("should generate a short url", () => {
    cy.get("input#url").type("https://dev.to/nk18chi/built-a-url-shortener-using-react-and-nodeexpress-m86-temp-slug-6631774");
    cy.get("button").click();
    cy.contains("http://localhost:4000/ca8ry");
  });
});
