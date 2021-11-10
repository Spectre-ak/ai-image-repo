# AI Image Repository
 
How to use this site:

Basically there are 5 tabs, Available on left side and right side indicates the status (its working or not currently)

#### Repository Home

This tab displays all available images and their corresponding tags which are stored in the repository. You can also use the search bar to filter across the repository.

#### Video Search

Let's say you have a video(long one) and for some purpose you want to retrieve all images/frames from this video which resemble a property/object (maybe car).
You can use this video search component to do that task.
Just upload a video and select what objects you want in the extracted frames. You can also use an image for searching in the video.
After uploading the video, the backend will start extracting frames from your video and then passing them to the object detection model for processing.
Once processing is done you'll see the result in bottom, and also you'll be allowed to download the extracted frames as a zip file

#### Image Search

Using the Image search component, you can search for similar images in the repository just by using an image.

#### Classify Image

This might be interesting for you.
Using this component, you can see how a deep neural network(faster_rcnn_inception_v2_coco), works on images.
This component directly outputs the detected objects in an image. Upload a bunch of images and wait for the model to process it and once done you'll see detected objects with their respective labels drawn over them.

#### Add Images

This component is for contributing images to the repository. If you want you can upload images, they'll be classified/tagged by the model and stored in the repository.


![alt text](https://raw.githubusercontent.com/Spectre-ak/ai-image-repo/main/samples/Screenshot%202021-10-14%20022023.jpg)

![alt text](https://raw.githubusercontent.com/Spectre-ak/ai-image-repo/main/samples/Capture.JPG)
