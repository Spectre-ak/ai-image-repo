import numpy as np
import os
import tensorflow as tf
from PIL import Image
from object_detection.utils import label_map_util
import cv2
import uuid
from operator import getitem
import json
import threading
import time
import shutil

PATH_TO_FROZEN_GRAPH = 'frozen_inference_graph.pb'
PATH_TO_LABELS = 'object_detection/data/mscoco_label_map.pbtxt'
NUM_CLASSES = 100

label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
category_index = label_map_util.create_category_index(categories)
 
detection_graph = tf.Graph()
with detection_graph.as_default():
  od_graph_def = tf.compat.v1.GraphDef()
  with tf.compat.v2.io.gfile.GFile(PATH_TO_FROZEN_GRAPH, 'rb') as fid:
    serialized_graph = fid.read()
    od_graph_def.ParseFromString(serialized_graph)
    tf.import_graph_def(od_graph_def, name='')

detection_graph.as_default()
sess=tf.compat.v1.Session(graph=detection_graph)
# print(category_index)
# print(categories)
# cat = []
# for f in categories:
#     cat.append(f['name'])
# print(cat)

def run(image_path, id, flagForStore, image_frame_process=None, image_frame_process_flag = False):

    if image_frame_process_flag:
        image_np = np.array(image_frame_process)
    else:
        img = cv2.imread(image_path)
        image_np = np.array(img)
    
    print(image_np.shape)
    image_np_expanded = np.expand_dims(image_np, axis=0)
    print(image_np_expanded.shape)
    # Actual detection.
    image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
    boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
    scores = detection_graph.get_tensor_by_name('detection_scores:0')
    classes = detection_graph.get_tensor_by_name('detection_classes:0')
    num_detections = detection_graph.get_tensor_by_name('num_detections:0')
    # Visualization of the results of a detection.
    (boxes, scores, classes, num_detections) = sess.run(
        [boxes, scores, classes, num_detections],
        feed_dict={image_tensor: image_np_expanded})
    # print(classes)
    # print(scores)
    detected_objs = []
    for index in range(0,len(scores[0])):
        if scores[0][index]==0:
            break
        detected_objs.append(category_index[classes[0][index]]['name'])
    # print(set(detected_objs))
    detected_objs=list(set(detected_objs))
    print(detected_objs)
    if flagForStore:
        os.remove(image_path)
    return detected_objs
    

def run_video(process_details):
    
    target_objs = []
    if process_details['type'] == "img":
        target_objs = run(process_details['image_path'],process_details['temp_dir_id'], False)
    else:
        target_objs = json.loads(process_details['search_text'])
    
    print("targetting objects are ")
    print(target_objs)

    count = 0
    count_Seconod = 0
    
    similar_frames_res = {}
    
    cap=cv2.VideoCapture(process_details['video_path'])
    fps = cap.get(cv2.CAP_PROP_FPS)
    print(fps)
    
    while cap.isOpened():
        ret, frame = cap.read()
        print(count)
        print(count_Seconod)
        count_Seconod+=1
        if ret:
            found_objs_in_frame = run('', '', False, image_frame_process=frame, image_frame_process_flag = True)
            similar_objs_found_in_frame = []

            for target_obj in target_objs:
                if target_obj in found_objs_in_frame:
                    similar_objs_found_in_frame.append(target_obj)

            score=len(similar_objs_found_in_frame)
            print('similar objs found00')
            print(similar_objs_found_in_frame)

            if score > 0:
                frame_id = str(uuid.uuid4())
                frame_path = 'static/'+process_details['temp_dir_id']+'/'+frame_id+'.jpg'
                frame_obj = {
                    "frame_path":frame_path, 
                    "similar_objs":similar_objs_found_in_frame,
                    "score":score
                    }
                similar_frames_res[frame_id] = frame_obj
                cv2.imwrite(frame_path, frame)

            count += int(fps) # i.e. at 30 fps, this advances one second
            cap.set(1, count)
        else:
            cap.release()
            break
    
    print(similar_frames_res)

    similar_frames_res = { k: v for k, v in sorted(similar_frames_res.items(), key=lambda item: getitem(item[1], 'score'), reverse=True) }
    
    print(similar_frames_res)

    print("converting dic to list")
    reorder_protected_json = []
    for k,v in similar_frames_res.items():
        print(k)
        print(v)
        reorder_protected_json.append({k:v})
    print(reorder_protected_json)
    print("intiating os remove dir thread")
    thread_remove_dir = thread(temp_dir_id=process_details['temp_dir_id'])
    thread_remove_dir.start()
    shutil.make_archive("static/"+process_details['temp_dir_id'], 'zip', "static/"+process_details['temp_dir_id'])
    return reorder_protected_json

   

class thread(threading.Thread):
    def __init__(self, temp_dir_id,):
        threading.Thread.__init__(self)
        self.temp_dir_id = temp_dir_id
    def run(self):
        time.sleep(2700)
        os.remove("static/"+self.temp_dir_id+".zip")
        shutil.rmtree("static/"+self.temp_dir_id)


