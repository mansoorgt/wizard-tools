echo backed server is starting ....
source venv/bin/activate 
uvicorn main:app --reload 

# rq worker sitemap_analyze_task_queue
echo backed server started
