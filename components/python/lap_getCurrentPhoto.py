import paramiko, os, sys
import time
import logging

#define log file
_fileName = '/getCurrentPhoto.log'

dir_path = os.path.dirname(os.path.realpath(__file__)) + '/currentPhoto'
#print(dir_path)
logging.basicConfig(filename=dir_path+_fileName,level=logging.DEBUG)

_hostname = sys.argv[1]
_username = 'pi'
_password = 'miage2is'

ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    #ssh.connect(ip, username=user, key_filename=key_file)
    ssh_client.connect(hostname=_hostname, username=_username,password=_password, port=22)
    #proceed capture photo
    stdin,stdout,stderr=ssh_client.exec_command('python3 minigarden/pi_getCurrentPhoto.py')

    #waiting for capture photo
    time.sleep(5)

    #transfer photo to local
    file = 'foo.png'
    # error here, it cannot copy
    ftp_client=ssh_client.open_sftp()
    ftp_client.get('/home/pi/' + file, dir_path + '/' + file)
    ftp_client.close()

    #logging.info('finish')

    ssh_client.close()

    print(file)
except ValueError:
    print(-1)


#example: work fine
'''stdin,stdout,stderr=ssh_client.exec_command('python minigarden/test.py')
output = stdout.readlines()
for item in output:
    print(item)'''

