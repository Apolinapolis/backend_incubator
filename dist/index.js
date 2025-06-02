"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
const db = {
    courses: [
        { id: 1, title: 'Roman' },
        { id: 2, title: 'Sergey' },
        { id: 3, title: 'Yurok' },
        { id: 4, title: 'Dimon' }
    ]
};
app.get('/brothers', (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
app.get('/brothers/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
});
app.post('/brothers', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});
app.put('/brothers/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.delete('/brothers/:id', (req, res) => {
    if (!db.courses.find(c => c.id === +req.params.id)) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.listen(port, () => {
    console.log(`backend was started on port ${port}`);
});
