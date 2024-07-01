import requests
from bs4 import BeautifulSoup
import asyncio
import httpx
import json
async def fetch_url(url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.head(url)
        print(response)
        return {'url':url,'status':response.status_code }
async def analyzesitemap(sitemap_url):

    print('sitemap-job is started --------------------------')
    
    sitemap_res=requests.get(sitemap_url)
    print('sitemp request geted')
    sitemap_soup=BeautifulSoup(sitemap_res.text,'xml')
    print('buetifull soap finished')
    sitemap_urls=[loc.string for loc in sitemap_soup.find_all('loc')]
    
    res={}
    res['success_urls']=[]
    res['failed_urls']=[]
    
    tasks = [fetch_url(url) for url in sitemap_urls]
    responses = await asyncio.gather(*tasks)

    print('sitemap-job is started --------------------------')
    return json.dumps(responses)