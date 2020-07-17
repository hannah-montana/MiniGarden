#print({'firstName': 'Be Binh', 'lastName': 'Bong'})

import socketio
#import numpy as np

#MAX_USERS = 1

'''num_of_users = 0
token_compiled = 'false'
users_tokens = np.array([])
users_headers = np.array([])'''

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')
    #sio.emit('aaa', {'foo': 'bar'})

@sio.event
def disconnect():
    print('disconnect')

'''@sio.on('data')
def response(*args):
    print(args)
    global users_tokens
    users_tokens = np.append(users_tokens, args)'''



if __name__=="__main__":
    sio.connect('http://localhost:3010')
    sio.emit('aaa', {'foo': 'bar'})
    sio.wait()
    sio.disconnect()

