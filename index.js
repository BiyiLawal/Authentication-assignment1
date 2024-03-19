const http = require("http");
const {findUser} = require("./db.function");


// Function to extract authentication username and password from the header
function getAuthenticationCredentials(req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
        const username = credentials[0];
        const password = credentials[1];
        return {username, password}
    };
    return null;
};

function getBodyFromStream(req) {
    return new Promise((resolve, reject) => {
        const data = [];
        req.on("data", (chunk) => {
            data.push(chunk);
        });
        req.on("end", () => {
            const body = Buffer.concat(data).toString();
            if (body) {
                resolve(JSON.parse(body));
                return;
            }
            resolve({});
        });
        req.on("error", (err) => {
            reject(err);
        });
    });
};


function authenticate (req, res, next) {
    const credentials = getAuthenticationCredentials(req);
    if (!credentials) {
        res.statusCode = 401;
        res.end();
        return;
    }
    const {username, password} = credentials;
    const user = findUser(username, password);
    if (!user) {
        res.statusCode = 401;
        res.end();
        return;
    }
    next(req, res);
}



// Endpoint handler functions
function getBooks(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ books: [] }));
}
  
function createBook(req, res) {
    res.statusCode = 201;
    res.end("Book created successfully");
}
  
function updateBook(req, res) {
    res.end("Book updated successfully");
}

function editBook(req, res) {
    res.end("Book edited successfully");
}
  
function deleteBook(req, res) {
    res.end("Book deleted successfully");
}


  
function getAuthors(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ authors: [] }));
}
  
function createAuthor(req, res) {
    res.statusCode = 201;
    res.end("Author created successfully");
}
  
function updateAuthor(req, res) {
    res.end("Author updated successfully");
}

function editAuthor(req, res) {
    res.end("Author edited successfully");
}
  
function deleteAuthor(req, res) {
    res.end("Author deleted successfully");
}
  
const server = http.createServer(async (req, res) => {
    try {
      // Free up the body to carry payload for other method types
      const body = await getBodyFromStream(req);
      req.body = body;
  
      // Add endpoints for books [GET, POST, PUT, DELETE]
      if (req.url === "/books") {
        authenticate(req, res, getBooks);
        return;
      } else if (req.url.startsWith("/books/")) {
        if (req.method === "POST") {
          authenticate(req, res, createBook);
        } else if (req.method === "PUT") {
          authenticate(req, res, updateBook);
        } else if (req.method === "PATCH") {
            authenticate(req, res, editBook)
        } else if (req.method === "DELETE") {
          authenticate(req, res, deleteBook);
        }
        return;
      }
  
      // Add endpoints for authors [GET, POST, PUT, DELETE]
      if (req.url === "/authors") {
        authenticate(req, res, getAuthors);
        return;
      } else if (req.url.startsWith("/authors/")) {
        if (req.method === "POST") {
          authenticate(req, res, createAuthor);
        } else if (req.method === "PUT") {
          authenticate(req, res, updateAuthor);
        } else if (req.method === "PATCH") {
            authenticate(req, res, editAuthor)
        }else if (req.method === "DELETE") {
          authenticate(req, res, deleteAuthor);
        }
        return;
      }
    } catch (error) {
      res.statusCode = 500;
      res.end(error.message);
    }
});
  
  server.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
