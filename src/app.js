const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateIdUUID, validateIfIdExist);

//middlewares
function validateIfIdExist(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex == -1) {
    return response.status(400).json({ error: "Repository not found." });
  }

  return next();
}

function validateIdUUID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }
  next();
}

const repositories = [];

const getRepositoryIndexById = (id) =>
  repositories.findIndex((repository) => repository.id == id);

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = getRepositoryIndexById(id);

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = newRepository;

  response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndexById(id);

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndexById(id);

  repositories[repositoryIndex].likes += 1;

  response.json(repositories[repositoryIndex]);
});

module.exports = app;
