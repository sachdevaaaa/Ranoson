from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

# Mock Auth dependency for now - we'll assume a specific role based on headers or default
# In a real app, this would decode JWT
def get_current_user_role(db: Session = Depends(get_db)):
    # MOCK: Returning the ID for "CNC Operator"
    # In reality, this comes from the user's token
    role = db.query(models.Role).filter(models.Role.name == "CNC Operator").first()
    if not role:
        raise HTTPException(status_code=400, detail="Role not found")
    return role.id

@router.get("/my-training", response_model=List[schemas.Module])
def read_my_training(role_id: int = Depends(get_current_user_role), db: Session = Depends(get_db)):
    modules = crud.get_modules_by_role(db, role_id=role_id)
    return modules

@router.post("/admin/content", response_model=schemas.Module)
def create_content(module: schemas.ModuleCreate, db: Session = Depends(get_db)):
    return crud.create_module(db, module=module)

@router.get("/admin/progress", response_model=List[schemas.UserWithProgress])
def read_user_progress(db: Session = Depends(get_db)):
    users = crud.get_all_users_with_progress(db)
    return users

# --- Auth & User Management ---

@router.post("/auth/register")
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    user = crud.get_user_by_code(db, employee_code=user_data.employee_code)
    if not user:
        raise HTTPException(status_code=400, detail="User not recognized (Ask Admin to whitelist)")
    if user.is_registered:
        raise HTTPException(status_code=400, detail="User already registered")
    
    crud.register_user(db, user, user_data.password)
    return {"message": "Registration successful"}

@router.post("/auth/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    from ..auth import verify_password, create_access_token
    user = crud.get_user_by_code(db, employee_code=user_data.employee_code)
    if not user or not user.hashed_password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # In real app, include role in token
    access_token = create_access_token(data={"sub": user.employee_code})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/admin/users", response_model=schemas.User)
def create_user_whitelist(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if exists
    existing = crud.get_user_by_code(db, user.employee_code)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    return crud.create_user(db, user)

@router.delete("/admin/users/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    crud.delete_user(db, user_id)
    return {"message": "User removed"}

# --- Profile Management ---

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from ..auth import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        employee_code: str = payload.get("sub")
        if employee_code is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_code(db, employee_code=employee_code)
    if user is None:
        raise credentials_exception
    return user

@router.put("/auth/me", response_model=schemas.User)
def update_profile(user_update: schemas.UserUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.phone_number:
        current_user.phone_number = user_update.phone_number
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/auth/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
