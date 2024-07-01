from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from bs4 import BeautifulSoup

# Create your views here.


@api_view(['GET'])
def siteMapAnalayzer(request):
    
    sitemap_url=request.GET.get('sitemap-url')
    
    #getting urls from sitemap
    
    sitemap_res=requests.get(sitemap_url)
    sitemap_soup=BeautifulSoup(sitemap_res.text,'lxml')
    sitemap_urls=[loc.string for loc in sitemap_soup.find_all('loc')]
    
    res={}
    res['success_urls']=[]
    res['failed_urls']=[]
    for url in sitemap_urls:
        print(url)
        try:
            url_res=requests.head(url)
            if url_res.status_code == 200:
            
                res['success_urls'].append(url)
            else:
                res['failed_urls'].append(url)
        except Exception as e:
            print(e)
            res['failed_urls'].append(url)
    
    

    return Response({})