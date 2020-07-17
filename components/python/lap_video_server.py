import io
import socket
import struct
from PIL import Image
import matplotlib.pyplot as pl
from datetime import datetime

import paramiko, os, sys
import time

import random

# socket io
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnect')

sio.connect('http://localhost:3010')
# end socket io

#=== setting video stream on pi
dir_path = os.path.dirname(os.path.realpath(__file__)) + '/video/'

_hostname = sys.argv[1]
_username = 'pi'
_password = 'miage2is'

ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#=== END - setting video stream on pi

try:
    ssh_client.connect(hostname=_hostname, username=_username,password=_password, port=22)
    #proceed video streaming on pi
    stdin,stdout,stderr=ssh_client.exec_command('python minigarden/pi_video_client.py')

    # run video streaming on laptop
    server_socket = socket.socket()
    server_socket.bind(('192.168.43.10', 8080))  # ADD IP HERE
    server_socket.listen(0)

    # Accept a single connection and make a file-like object out of it
    connection = server_socket.accept()[0].makefile('rb')
    try:
        img = None
        while True:
            # Read the length of the image as a 32-bit unsigned int. If the
            # length is zero, quit the loop
            image_len = struct.unpack('<L', connection.read(struct.calcsize('<L')))[0]
            if not image_len:
                break
            # Construct a stream to hold the image data and read the image
            # data from the connection
            image_stream = io.BytesIO()
            image_stream.write(connection.read(image_len))
            # Rewind the stream, open it as an image with PIL and do some
            # processing on it
            image_stream.seek(0)
            #print(image_stream)

            image = Image.open(image_stream)
            filename = ''
            if img is None:
                img = pl.imshow(image)

            else:
                img.set_data(image)

            n = random.randint(1000, 100000)
            filename = _hostname + 'video' + str(n)
            image.save(dir_path + filename + '.jpg')
            print(filename)

            #pl.pause(0.01)
            #pl.draw()

            sio.emit(_hostname + 'video', filename)
            sio.sleep(0.01)
            #sio.wait()

            print('Image is %dx%d' % image.size)
            image.verify()
            print('Image is verified')
    finally:
        connection.close()
        server_socket.close()

    ssh_client.close()
    sio.disconnect()
except ValueError:
    print(ValueError)
    #print(-1)
