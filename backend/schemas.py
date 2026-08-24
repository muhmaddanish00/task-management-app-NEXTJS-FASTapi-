from pydantic import BaseModel  # type: ignore[reportUnknownVariableType]
from typing import List as PyList, Optional


# ----- Task Schemas -----

class TaskCreate(BaseModel): # type: ignore
    title: str
    description: Optional[str] = None
    list_id: int

class TaskResponse(BaseModel): # type: ignore
    id: int
    title: str
    description: Optional[str]
    list_id: int

    class Config:
        from_attributes = True


# ----- List Schemas -----

class ListCreate(BaseModel): # type: ignore
    title: str
    board_id: int

class ListResponse(BaseModel): # type: ignore
    id: int
    title: str
    board_id: int
    tasks: PyList[TaskResponse] = []

    class Config:
        from_attributes = True


# ----- Board Schemas -----

class BoardCreate(BaseModel): # type: ignore
    title: str

class BoardResponse(BaseModel): # type: ignore
    id: int
    title: str
    lists: PyList[ListResponse] = []

    class Config:
        from_attributes = True