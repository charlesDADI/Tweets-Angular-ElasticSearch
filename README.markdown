
# Angular + Elasticsearch  workshop for building a tweets search engine

This is an angular app using the elasticsearch dependency to build factory based on elasticsearch queries

## Prerequisites

In order to run this example, you will need to have the following installed

To launch this app

1. Clone this repo locally

2. Install ElasticSearch:
	- an easy way: 
		`cd ~`
		`sudo apt-get update`
		`sudo apt-get install openjdk-7-jre-headless -y`
		`wget httsudops://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.1.1.deb`
		`sudo dpkg -i elasticsearch-1.1.1.deb`
		`sudo service elasticsearch start`

	- install head (user friendly interface),  
		`sudo /usr/share/elasticsearch/bin/plugin -install mobz/elasticsearch-head`

	- `http://localhost:9200/_plugin/head/`


3. Let's insert some tweets to your ES cluster
	`cd /data`
	`python getTweet.py` (Be sure ES is running!)

4. `bower install`

5. Start a local server 
	`python -m SimpleHTTPServer`
	
6. Visit 'localhost:8000/'

7. enjoy and tune your angular route/filter