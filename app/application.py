from flask import Flask, json,render_template, request, jsonify
from flask.helpers import send_file
import run_model_memory
import uuid
import db_util

application = Flask(__name__)

@application.route("/")
def helloworld():
    print(str(uuid.uuid4()))
    return render_template("uploadImage.html")

@application.route("/ru")
def helloworqld():
    return "Hello World!"

@application.route("/run")
def runModelRest():
    run_model_memory.run()
    return "running"

@application.route("/image/<name>")
def data(name):
    print(name)
    return send_file(name,mimetype='image/gif')

@application.route('/upload', methods = ['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        id=str(uuid.uuid4())
        name=id+".jpg"
        print(name)
        f.save((name))
        try:
            result=run_model_memory.run(name,id,True)
            return jsonify(result)
        except Exception as e:
            print(e)
            return jsonify([])

@application.route('/upload_and_store', methods = ['GET', 'POST'])
def upload_s3():
    if request.method == 'POST':
        f = request.files['file']
        id=str(uuid.uuid4())
        name=id+".jpg"
        print(name)
        f.save((name))
        try:
            tags=run_model_memory.run(name,id,False)
            db_util.save_image_details(name,tags)
            return jsonify({"error":False})
        except Exception as e:
            print(e)
            return jsonify({"error":True})



if __name__ == "__main__":
    application.run(port=5000, debug=True)

