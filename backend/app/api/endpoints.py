from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from ..auth import SECRET_KEY, ALGORITHM

router = APIRouter()

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
    
    access_token = create_access_token(data={"sub": user.employee_code})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- Admin: User Management ---

@router.post("/users", response_model=schemas.User)
def create_user_whitelist(user: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # TODO: Check if current_user is Admin
    existing = crud.get_user_by_code(db, user.employee_code)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    return crud.create_user(db, user)

@router.get("/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # TODO: Check if current_user is Admin
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

# --- Modules & Learning ---

@router.post("/modules", response_model=schemas.Module)
def create_module(module: schemas.ModuleCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # TODO: Check permissions
    return crud.create_module_with_steps(db, module, current_user.id)

@router.get("/modules", response_model=List[schemas.Module])
def read_modules(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_all_modules(db)

@router.get("/modules/{module_id}", response_model=schemas.Module)
def read_module(module_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    module = crud.get_module(db, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.post("/steps/{step_id}/submit", response_model=schemas.SubmissionResult)
def submit_step(step_id: int, submission: schemas.StepSubmission, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    step = db.query(models.ModuleStep).filter(models.ModuleStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    
    passed = crud.validate_step(step, submission.value)
    
    # Update progress
    crud.update_progress(db, current_user.id, step.module_id, step.order_index, passed)
    
    msg = "Correct!" if passed else "Incorrect. Please try again."
    if not passed and step.assignment and step.assignment.tolerance:
         msg += f" (Expected {step.assignment.correct_value} ± {step.assignment.tolerance})"

    return {"passed": passed, "message": msg, "correct_value": step.assignment.correct_value if step.assignment else None}

# --- Comments ---

@router.post("/comments", response_model=schemas.Comment)
def add_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_comment(db, comment, current_user.id)

@router.get("/modules/{module_id}/comments", response_model=List[schemas.Comment])
def read_comments(module_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_comments_for_module(db, module_id)

# --- Learning Resources ---

@router.get("/resources", response_model=List[schemas.LearningResource])
def read_resources(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_all_resources(db)

@router.post("/resources", response_model=schemas.LearningResource)
def create_resource(resource: schemas.LearningResourceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # TODO: Check admin permissions
    return crud.create_resource(db, resource)
