from flask import Flask, render_template, Response, redirect
import cv2 as cv
import json
from hume import HumeBatchClient
from mss import mss
import shutil
from hume.models.config import FaceConfig
import numpy as np
from PIL import Image
from pathlib import Path
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
import requests

camera = cv.VideoCapture(0)
client = HumeBatchClient("C4wQmxEcxYZ3ew3BfRGMfVValjAPmiuwsz6DMDpWnGkxVulK")
face_config = FaceConfig()
sct = mss()
top_5 = {}

cloudinary.config( 
  cloud_name = "dplhvaujy", 
  api_key = "917728995244212", 
  api_secret = "dxLR69w3Wooxg13PFS9rJJlVkiQ" 
)

app = Flask(__name__)

@app.route('/')
def index():
    emotions = top_5
    return render_template('index.html', top_5=top_5)

def gen_frames():
    top_5 = {}
    boolean = True  
    while boolean:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv.imencode('.jpg', frame)            
            frame = buffer.tobytes()

            emotion = getEmotion()

            with open("predictions.json", "r") as read_file:
                data = json.load(read_file)

            data = data[0]['results']['predictions'][0]['models']['face']['grouped_predictions'][0]['predictions'][0]['emotions']
            data = sorted(data, key=lambda x : x['score'], reverse=True)
            print(data)
            
            i = 0
            while (i < 5):
                top_5[data[i]['name']] = data[i]['score']
                i += 1

            print(top_5)

            top_5_emotions = []
            for i in top_5:
                top_5_emotions.append(i)
            
            print(top_5_emotions)

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
        boolean = False
    

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def get_saving_frames_durations(cap, saving_fps):
    """A function that returns the list of durations where to save the frames"""
    s = []
    # get the clip duration by dividing number of frames by the number of frames per second
    clip_duration = cap.get(cv.CAP_PROP_FRAME_COUNT) / cap.get(cv.CAP_PROP_FPS)
    # use np.arange() to make floating-point steps
    for i in np.arange(0, clip_duration, 1 / saving_fps):
        s.append(i)
    return s

if __name__ == '__main__':
    app.run(debug=True)

def getFrame():
    ret, sect_img = camera.read()
    return sect_img

def getEmotion():
    config = FaceConfig()
    frame = getFrame()
    frame = Image.fromarray(frame, 'RGB')
    frame.save("image.jpg")

    result = cloudinary.uploader.upload("image.jpg")
    image_url = [result['url']]

    job = client.submit_job(image_url, [config])
    details = job.await_complete()
    job.download_predictions("predictions.json")