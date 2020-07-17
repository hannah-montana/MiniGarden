import paramiko, os, sys
import time
import logging

_hostname = sys.argv[1]
_username = 'pi'
_password = 'miage2is'
_command = 'python minigarden/pi_getTemperature.py'

ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh_client.connect(hostname=_hostname, username=_username,password=_password, port=22)
    #proceed capture photo
    stdin,stdout,stderr=ssh_client.exec_command(_command)

    output = stdout.readlines()
    for item in output:
        print(item)

    ssh_client.close()

except ValueError:
    print(-1)
