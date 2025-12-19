from pydantic import BaseModel
from typing import List, Optional

class ModuleBase(BaseModel):
    title: str
    video_url: str

class Module(ModuleBase):
    id: int
    assigned_role_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    employee_code: str
    phone_number: Optional[str] = None

class User(UserBase):
    id: int
    role_id: int
    is_active: bool

    class Config:
        from_attributes = True

class ModuleCreate(ModuleBase):
    assigned_role_id: int

class UserProgress(BaseModel):
    user_id: int
    module_id: int
    status: str
    
    class Config:
        from_attributes = True

class UserWithProgress(User):
    progress: List[UserProgress] = []

class UserCreate(BaseModel):
    employee_code: str
    role_id: int
    phone_number: Optional[str] = None

class UserUpdate(BaseModel):
    phone_number: Optional[str] = None

class UserRegister(BaseModel):
    employee_code: str
    password: str

class UserLogin(BaseModel):
    employee_code: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
