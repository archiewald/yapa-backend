import * as express from "express";

const app = express();

function loggerMiddleware(
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction
) {
  console.log(`${request.method} ${request.path}`);
  next();
}

app.use(loggerMiddleware);
app.use(express.json());

app.get("/", (_request, response) => {
  response.send("Hello world!");
});

app.post("/", (request, response) => {
  response.send(request.body);
});

app.listen(5000);
