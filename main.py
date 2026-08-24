from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
import schemas

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Aapke Next.js frontend ka URL
    allow_credentials=True,
    allow_methods=["*"],  # Iska matlab hai GET, POST, PUT, DELETE sab allow hain
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Task Management API chal raha hai!"}


# ----- Board Routes -----

@app.post("/boards", response_model=schemas.BoardResponse)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    new_board = models.Board(title=board.title)
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board


@app.get("/boards", response_model=list[schemas.BoardResponse])
def get_boards(db: Session = Depends(get_db)):
    boards = db.query(models.Board).all()
    return boards


@app.get("/boards/{board_id}", response_model=schemas.BoardResponse)
def get_board(board_id: int, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board nahi mila")
    return board


@app.put("/boards/{board_id}", response_model=schemas.BoardResponse)
def update_board(board_id: int, board_data: schemas.BoardCreate, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board nahi mila")

    board.title = board_data.title
    db.commit()
    db.refresh(board)
    return board


@app.delete("/boards/{board_id}")
def delete_board(board_id: int, db: Session = Depends(get_db)):
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board nahi mila")

    db.delete(board)
    db.commit()
    return {"message": "Board delete ho gaya"}

# ----- List Routes -----

@app.post("/lists", response_model=schemas.ListResponse)
def create_list(list_data: schemas.ListCreate, db: Session = Depends(get_db)):
    new_list = models.List(title=list_data.title, board_id=list_data.board_id)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list


@app.get("/lists/{list_id}", response_model=schemas.ListResponse)
def get_list(list_id: int, db: Session = Depends(get_db)):
    list_item = db.query(models.List).filter(models.List.id == list_id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List nahi mili")
    return list_item


@app.put("/lists/{list_id}", response_model=schemas.ListResponse)
def update_list(list_id: int, list_data: schemas.ListCreate, db: Session = Depends(get_db)):
    list_item = db.query(models.List).filter(models.List.id == list_id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List nahi mili")

    list_item.title = list_data.title
    db.commit()
    db.refresh(list_item)
    return list_item


@app.delete("/lists/{list_id}")
def delete_list(list_id: int, db: Session = Depends(get_db)):
    list_item = db.query(models.List).filter(models.List.id == list_id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List nahi mili")

    db.delete(list_item)
    db.commit()
    return {"message": "List delete ho gayi"}


# ----- Task Routes -----

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(title=task.title, description=task.description, list_id=task.list_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_data: schemas.TaskCreate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task nahi mila")

    task.title = task_data.title
    task.description = task_data.description
    task.list_id = task_data.list_id
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task nahi mila")

    db.delete(task)
    db.commit()
    return {"message": "Task delete ho gaya"}

