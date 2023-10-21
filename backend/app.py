from flask import Flask,jsonify,request,render_template


##RUN WITH $ flask --app main run --debug

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
app.config["SECRET_KEY"] = "secret"


@app.route("/")
def hello():
    return render_template('index.html')


@app.route("/getThing")
def firstRoute():
    return jsonify("Hello thing!")    

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    
    
    
    