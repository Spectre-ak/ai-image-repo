import numpy as np
import os
import tensorflow as tf
from PIL import Image
from object_detection.utils import label_map_util
import cv2

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

def run(image_path,id,flagForStore):
    img=cv2.imread(image_path)
    #img=img.resize((1280,720))
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
    # print((classes))
    # print(scores)
    detected_objs = []
    for index in range(0,len(scores[0])):
        if scores[0][index]==0:
            break
        detected_objs.append(category_index[classes[0][index]]['name'])
    print(set(detected_objs))
    detected_objs=list(set(detected_objs))
    print(detected_objs)
    if flagForStore:
        os.remove(image_path)
    return detected_objs
    