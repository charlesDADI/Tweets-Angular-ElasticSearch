# -*- coding: utf-8 -*-
"""
Created on Mon Dec  8 10:39:50 2014

@author: charles-abner DADI
"""


import simplejson
import json

import sys
import os
root = os.getcwd()  
path_out = root + '/tweet.json'
print path_out 


def put(path_out, tweets):
    #write   tweets to JSON file  
    jsondata = simplejson.dumps(tweets, indent=4, skipkeys=True, sort_keys=True)
    fd = open(path_out, 'w')
    fd.write(jsondata)
    fd.close()


def get(path_out):
    #read   tweets to JSON file  
    returndata = {}
    fd2 = open(path_out, 'r')
    text = fd2.read()
    fd2.close()
    returndata = simplejson.loads(text)
    return returndata


from datetime import datetime
from elasticsearch import Elasticsearch

#read tweets lists:
tweets = get(path_out)

# by default we connect to localhost:9200
es = Elasticsearch()

# ignore 400 cause by IndexAlreadyExistsException when creating an index
es.indices.create(index='my-tweets', ignore=400)


for i in range(2,len(tweets)-1):
    try:
        es.create(body=tweets[i],index='my-tweets',id = tweets[i]['id_str'],doc_type='tweet')
        print str(i) + ' inserted'
    except:
        print 'tweets already saved'
print ' ----------- end of process----------'
    

    
