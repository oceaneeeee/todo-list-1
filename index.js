const fs = require("fs");
const express = require("express");
const app = express();
const eta = require("eta");
const bodyParser = require('body-parser');


let todos = []
let color1;

if (fs.existsSync("todos.json")) {
    todos = JSON.parse(fs.readFileSync("todos.json", "utf8"));

}
else {
    fs.writeFileSync("todos.json", JSON.stringify(todos), "utf8");
}

app.engine("eta", eta.renderFile);
eta.configure({ views: "./views", cache: true });
app.set("views", "./views");
app.set("view cache", true);
app.set("view engine", "eta");
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/todo-list", function (req, res) {
    res.render("list.eta", { todos, color1 });
    console.log("mau", color1)
});

app.post("/todo-save", function (req, res) {

    console.log(req.body)
    color1 = req.body.color;

    if (req.body.description) {
        let objet = {
            id: getNextId(todos),
            description: req.body.description,
            done: false
        };
        todos.push(objet);
    }

    for (let i = 0; i< todos.length; i++) {
        const todo = todos[i];
        if (req.body["done-" + todo.id]) {
            todo.done = true;
        }
        else todo.done = false;
    }


    if (req.body.deleteAllDone == 'on') {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].done == true) {
                todos.splice(i,1);
            }
        }
    }

    console.log("todos", todos);

    fs.writeFileSync("todos.json", JSON.stringify(todos), "utf8");

    res.redirect("/todo-list");

});

app.listen(8001, function () {
    console.log("listening on port 8001");
});

function getNextId(todos) {

    if (todos != NaN) {
        return todos.length;
    }
    else return 1;
}