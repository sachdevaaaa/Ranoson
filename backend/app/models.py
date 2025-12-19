from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Enum, JSON
from sqlalchemy.orm import relationship
import enum
from .database import Base

class AssessmentType(str, enum.Enum):
    STANDARD = "standard"
    HOTSPOT = "hotspot"
    SEQUENCE = "sequence"

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    department = Column(String)
    
    users = relationship("User", back_populates="role")
    modules = relationship("Module", back_populates="assigned_role")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_code = Column(String, unique=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    phone_number = Column(String)
    hashed_password = Column(String, nullable=True)
    is_registered = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    role = relationship("Role", back_populates="users")
    progress = relationship("UserProgress", back_populates="user")

class Module(Base):
    __tablename__ = "modules"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    video_url = Column(String)
    assigned_role_id = Column(Integer, ForeignKey("roles.id"))
    
    assigned_role = relationship("Role", back_populates="modules")
    assessments = relationship("Assessment", back_populates="module")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"))
    type = Column(String) # Storing Enum as string in DB for simplicity or Use Enum(AssessmentType)
    
    module = relationship("Module", back_populates="assessments")
    questions = relationship("AssessmentQuestion", back_populates="assessment")

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    data = Column(JSON) # Stores hotspot coords (x,y) or sequence
    
    assessment = relationship("Assessment", back_populates="questions")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    module_id = Column(Integer, ForeignKey("modules.id"))
    status = Column(String, default="Not Started") # "Not Started", "In Progress", "Completed"
    
    user = relationship("User", back_populates="progress")
    module = relationship("Module")

# Update User model to include progress relationship
User.progress = relationship("UserProgress", back_populates="user")
