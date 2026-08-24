from sqlalchemy import Column, Integer, String, ForeignKey  # type: ignore[reportMissingImports]
from sqlalchemy.orm import relationship  # type: ignore[reportMissingImports]
from database import Base  # type: ignore[reportUnknownVariableType]

class Board(Base): # type: ignore
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True) # type: ignore
    title = Column(String, nullable=False) # type: ignore

    lists = relationship("List", back_populates="board", cascade="all, delete") # type: ignore


class List(Base): # type: ignore
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True) # type: ignore
    title = Column(String, nullable=False) # type: ignore
    board_id = Column(Integer, ForeignKey("boards.id")) # type: ignore

    board = relationship("Board", back_populates="lists") # type: ignore
    tasks = relationship("Task", back_populates="list", cascade="all, delete") # type: ignore


class Task(Base): # type: ignore
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True) # type: ignore
    title = Column(String, nullable=False) # type: ignore
    description = Column(String, nullable=True) # type: ignore
    list_id = Column(Integer, ForeignKey("lists.id")) # type: ignore

    list = relationship("List", back_populates="tasks")  # type: ignore