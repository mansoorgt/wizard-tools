from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from analyze_sitemap.app import router
from routers import image_size_reducer

origins = [

    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",

]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router=router)
app.include_router(router=image_size_reducer.router)
# redis_conn = Redis(host="127.0.0.1", port=6379,)
