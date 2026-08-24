from pydantic import BaseModel
from typing import List as PyList, Optional


# ----- Task Schemas -----

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    list_id: int

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    list_id: int

    class Config:
        from_attributes = True


# ----- List Schemas -----

class ListCreate(BaseModel):
    title: str
    board_id: int

class ListResponse(BaseModel):
    id: int
    title: str
    board_id: int
    tasks: PyList[TaskResponse] = []

    class Config:
        from_attributes = True


# ----- Board Schemas -----

class BoardCreate(BaseModel):
    title: str

class BoardResponse(BaseModel):
    id: int
    title: str
    lists: PyList[ListResponse] = []

    class Config:
        from_attributes = True