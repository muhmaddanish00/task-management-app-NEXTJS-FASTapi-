from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    lists = relationship("List", back_populates="board", cascade="all, delete")


class List(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    board_id = Column(Integer, ForeignKey("boards.id"))

    board = relationship("Board", back_populates="lists")
    tasks = relationship("Task", back_populates="list", cascade="all, delete")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    list_id = Column(Integer, ForeignKey("lists.id"))

    list = relationship("List", back_populates="tasks") 