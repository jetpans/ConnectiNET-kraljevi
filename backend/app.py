from flask import Flask,jsonify,request,render_template


##RUN WITH $ flask --app main run --debug

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
app.config["SECRET_KEY"] = "secret"


@app.route("/")
def hello():
    return render_template('index.html')


@app.route("/getThing")
def firstRoute():
    # return jsonify("Hello thing!")    
    return [
        {
            "title": "Ludi parti",
            "image": "https://images.unsplash.com/photo-1500754088824-ce0582cfe45f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTc5Mjc4OTM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
            "description": "Ovo je opis",
            "time": "1",
            "priority": "50"
        },
        {
            "title": "Fešta",
            "image": "https://images.unsplash.com/photo-1461696114087-397271a7aedc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTc5Mjg4NTY&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
            "description": "Bit ce dobra fešta",
            "time": "2",
            "priority": "1"
        },
        {
            "title": "Roštilj",
            "image": "https://images.unsplash.com/photo-1541832039-cab7e4310f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTc5Mjc4ODc&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
            "description": "Roštilj je zakon",
            "time": "3",
            "priority": "12"
        },
        {
            "title": "Zabava",
            "image": "https://images.unsplash.com/photo-1553949285-bdcb31ec5cba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTc5MzA3NDE&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
            "description": "Haha zabava malo duži opis da vidimo kako će se prikazati malo duži opis da vidimo kako će se prikazati malo duži opis da vidimo kako će se prikazati malo duži opis da vidimo kako će se prikazati malo duži opis da vidimo kako će se prikazati malo duži opis da vidimo kako će se prikazati malo duži opis da vidimo kako će se prikazati",
            "time": "4",
            "priority": "1231"
        },
        {
            "title": "Ludi parti pt. 2",
            "image": "https://images.unsplash.com/photo-1559291001-693fb9166cba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTc5MzA2NTA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
            "time": "5",
            "priority": "0"
        }
    ]

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
    
    
    
    