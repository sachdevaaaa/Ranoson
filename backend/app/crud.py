from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_role(db: Session, role_name: str):
    return db.query(models.User).join(models.Role).filter(models.Role.name == role_name).first()

def get_modules_by_role(db: Session, role_id: int):
    return db.query(models.Module).filter(models.Module.assigned_role_id == role_id).all()

def create_module(db: Session, module: schemas.ModuleCreate):
    db_module = models.Module(**module.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

def get_all_users_with_progress(db: Session):
    return db.query(models.User).all()

def get_user_by_code(db: Session, employee_code: str):
    return db.query(models.User).filter(models.User.employee_code == employee_code).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Admin creating a user (whitelisting)
    db_user = models.User(
        employee_code=user.employee_code,
        role_id=user.role_id,
        phone_number=user.phone_number,
        is_registered=False # Not registered yet, needs to set password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def register_user(db: Session, db_user: models.User, password: str):
    from .auth import get_password_hash
    db_user.hashed_password = get_password_hash(password)
    db_user.is_registered = True
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user
