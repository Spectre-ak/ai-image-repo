import os
from flask import Flask, app, json,render_template, request, jsonify
from flask.helpers import send_file
import run_model_memory
import uuid
import db_util
import json as jsonLoader
from flask_cors import CORS, cross_origin

application = Flask(__name__, static_url_path='', static_folder='static')
cors = CORS(application, resources={r"/api/*": {"origins": "*"}})


@application.route("/")
def helloworld():
    return application.send_static_file("index.html")

@application.route("/aa")
def renderHome():
    return render_template("index.html")

chk_idle=0
@application.route("/chk_idle")
def helloworqld():
    global chk_idle
    chk_idle+=1
    return {"chk_idle":chk_idle}

@application.route("/run")
def runModelRest():
    run_model_memory.run()
    return "running"

@application.route("/chk/<dir>")
@cross_origin()
def chk_temp_dir(dir):
    print(dir)
    if os.path.isdir("static/"+dir):
        return {"status":True}
    else:
        return {"status":False}

@application.route("/repo_home_data", methods = ['GET', 'POST'])
@cross_origin()
def data():
    fetched_data = db_util.get_saved_imgs()
    print(fetched_data)
    return {"data":fetched_data}

@application.route('/upload', methods = ['GET', 'POST'])
@cross_origin()
def upload_file():
    if request.method == 'POST':
        uploaded_files = request.files.getlist("file")
        print(uploaded_files)
        print(uploaded_files[0])
        stored_details = []
        for f in uploaded_files:
            print(f)
            id=str(uuid.uuid4())
            name="static/"+id+".jpg"
            print(name)
            f.save((name))
            try:
                tags=run_model_memory.run(name,id,False, save_image_with_objects_drawn=True)
                # obj = {"img":"http://localhost:5000/static/"+id+"-processed.jpg", "tags":tags}
                obj = {"img":"http://aiimgrepov5-env.eba-vk4ybdys.us-east-1.elasticbeanstalk.com/static/"+id+"-processed.jpg", "tags":tags}
                
                stored_details.append(obj)
            except Exception as e:
                print(e)
                return jsonify({"error":True})

        return {"error":False, "obj":stored_details}


@application.route('/upload_and_store', methods = ['GET', 'POST'])
@cross_origin()
def upload_s3():
    if request.method == 'POST':
        uploaded_files = request.files.getlist("file")
        print(uploaded_files)
        print(uploaded_files[0])
        stored_details = []
        for f in uploaded_files:
            print(f)
            id=str(uuid.uuid4())
            name=id+".jpg"
            print(name)
            f.save((name))
            try:
                tags=run_model_memory.run(name,id,False)
                obj = db_util.save_image_details(name,tags)
                stored_details.append(obj)        
            except Exception as e:
                print(e)
                return jsonify({"error":True})

        return {"error":False, "obj":stored_details}


@application.route('/search_video', methods = ['GET', 'POST'])
@cross_origin()
def search_video():
    print(request.method)
    if request.method == 'POST':
        try:
            print("how u doing")
            print(request.files)
            print(request)
            print(request.form.get("type"))

            f_vid = request.files['Videofile']
            print("after red vid save")

            
            
            print("after ret img save")

            temp_dir_id=str(uuid.uuid4())
            os.mkdir("static/"+temp_dir_id)
            
            video_name = str(uuid.uuid4())+f_vid.filename

            f_vid.save("static/"+temp_dir_id+"/"+video_name)
            print("after searc vid save")

            search_image_name = "file_temp_to_be_replaced"   
            if request.form.get("type") == "img":
                f_search_image = request.files['Imagefile']
                search_image_name = str(uuid.uuid4())+f_search_image.filename
                f_search_image.save("static/"+temp_dir_id+"/"+search_image_name)
                print(f_search_image)
            
            print("after searc img save")

            print(f_vid)
            
            response_payload = {
                "error":False, 
                "temp_dir_id":temp_dir_id,
                "video_path":"static/"+temp_dir_id+"/"+video_name,
                "image_path":"static/"+temp_dir_id+"/"+search_image_name,
                "type":request.form.get("type"), 
                "search_text":request.form.get("search_text")
            }
            print(response_payload)
            return response_payload
        except Exception as e:
            print(e)
            return {"error":True}


@application.route('/start_processing_video', methods = ['GET', 'POST'])
@cross_origin()
def start_processing_video():
    if request.method == 'POST':
        try:
            print(request.form.get("json"))
            print(jsonLoader.loads(request.form.get("json")))
            process_details = jsonLoader.loads(request.form.get("json"))

            similar_frames_res = run_model_memory.run_video(process_details)
            
            response_payload = {
                "error":False, 
                "data":similar_frames_res
            }
            print(response_payload)
            return response_payload
        except Exception as e:
            print(e)
            return {"error":True}


@application.route('/search_image', methods = ['GET', 'POST'])
@cross_origin()
def search_image():
    if request.method == 'POST':
        try:
            f_search_image = request.files.getlist("file")[0]
            f_name = str(uuid.uuid4())+'.jpg'
            f_search_image.save(f_name)
            objs_found=run_model_memory.run(f_name,id,True)
            res = db_util.get_saved_images_based_on_req_objs(objs_found)

            response_payload = {
                "error":False,  
                "obj":res            
            }
            print(response_payload)
            return response_payload
        except Exception as e:
            print(e)
            return {"error":True}


@application.route('/upload_and_store_status',  methods = ['GET', 'POST'])
@cross_origin()
def upload_and_store_status():
    return {'status':db_util.check_s3_status()}
    #return {'status':True}


if __name__ == "__main__":
    application.run(port=5000, debug=False)

