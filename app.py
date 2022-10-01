from flask import Flask, render_template, request, jsonify, session, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

with open("config.json", "r") as f:
    params = json.load(f)["params"]

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = params['DATABASE_URI']
app.config['SQLALCHEMY_BINDS'] = params['BINDS']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = params['TRACK_MODIFICATIONS']
app.secret_key = "NbZpL>/[LxeO.jDUZiwL^&%$"
db = SQLAlchemy(app)

class Posts(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    post_title = db.Column(db.String(100), nullable=False)
    post_content = db.Column(db.String(2000), nullable=False)
    post_date = db.Column(db.DateTime, default=datetime.utcnow)

class Messages(db.Model):
    __bind_key__ = "messages"
    message_id = db.Column(db.Integer, primary_key=True)
    message_from = db.Column(db.String(20), nullable=False)
    message_email = db.Column(db.String(30), nullable=False)
    message = db.Column(db.String(1500), nullable=False)
    message_date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"post_id is {self.message_id}"

@app.route("/")
def run():
    return render_template("index.html")

@app.route("/posts/")
def posts():
    posts = Posts.query.all()
    postsObj = []
    for post in posts:
        obj = {"post_id": post.post_id, "post_title": post.post_title, 
               "post_content": post.post_content, "post_date": post.post_date}
        postsObj.append(obj)
    response = {"status": 200, "posts": postsObj, "length": len(postsObj)}
    return jsonify(response)

@app.route("/posts/<int:sno>")
def post(sno):
    post = Posts.query.filter_by(post_id=sno).first()
    return render_template("post.html", post=post)

@app.route("/skills/")
def skills():
    return render_template("skills.html")

@app.route("/about/")
def about():
    return render_template("about.html")

@app.route("/contact/", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        user_message = Messages(message_from=name, message_email=email, message=message)
        db.session.add(user_message)
        db.session.commit()

        obj = {"name":name, "email":email, "message":message}
        return jsonify(obj)

    return render_template("contact.html")

@app.route("/admin/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if params["ADMIN_USERNAME"] == username and params["ADMIN_PASSWORD"] == password:
            session["username"] = username
            posts = Posts.query.all()
            return render_template("panel.html", posts=posts)
            
    return render_template("login.html")

@app.route("/admin/addpost/", methods=["POST"])
def addPost():
    if request.method == "POST" and "username" in session:
        title = request.form.get("title")
        content = request.form.get("content")
        
        post = Posts(post_title=title, post_content=content)
        db.session.add(post)
        db.session.commit()

        obj = {"sno":post.post_id, "title":title, "content":content}
        return jsonify(obj)
    return "Method not allowed"

@app.route("/admin/deletepost/<int:sno>")
def delete(sno):
    if "username" in session:
        post = Posts.query.filter_by(post_id=sno).first()
        db.session.delete(post)
        db.session.commit()
        return redirect("/admin/")

    return redirect("/admin/")

@app.route("/admin/editpost/<int:sno>", methods=["POST"])
def edit(sno):
    if request.method == "POST" and "username" in session:
        post = Posts.query.filter_by(post_id=sno).first()
        db.session.delete(post)
        db.session.commit()
        return jsonify({"title": post.post_title, "content": post.post_content})
    else:
        return redirect("/admin/")

if __name__ == "__main__":
    app.run(debug=True)