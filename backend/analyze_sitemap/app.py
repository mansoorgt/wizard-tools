
from analyze_sitemap.jobs import analyzesitemap 
from rq.job import Job
from rq import Queue
from redis import Redis
from fastapi import APIRouter ,Request
import json

from pydantic import BaseModel

router = APIRouter()
redis_conn = Redis(host="127.0.0.1", port=6379)
task_queue = Queue("sitemap_analyze_task_queue", connection=redis_conn)

class analyzeSitemapPost(BaseModel):
    url:str

@router.post('/analyze-sitemap-xml/')
async def analyzesitemapApi(data:analyzeSitemapPost):

    job_instance = task_queue.enqueue(analyzesitemap,data.url)
    return{
        "job_id":job_instance.id
    }
    
@router.get('/get-job/')
async def getjob(job_id:str=""):
    _job= Job.fetch(job_id,connection=redis_conn)
    res={}
    if _job.is_finished:
        
        res['result']=json.loads(_job.return_value())
    res['status']=_job.get_status()
    
    return res

